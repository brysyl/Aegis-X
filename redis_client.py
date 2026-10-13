"""
Aegis-X: Real-Time Edge Security Gateway
Module: redis_client.py
Description: Asynchronous Redis connection manager handling zero-trust session states,
             sliding-window rate limiting counters, and telemetry pub/sub caching.
"""

from __future__ import annotations

import json
import logging
import os
import time
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger("aegis.redis")

# Attempt importing redis-py async client; graceful fallback if not present
try:
    import redis.asyncio as aioredis
    REDIS_AVAILABLE = True
except ImportError:
    aioredis = None  # type: ignore
    REDIS_AVAILABLE = False


class InMemoryFallbackRedis:
    """
    High-performance in-memory fallback mimicking Redis sorted sets and key-value
    operations for local standalone execution and non-Redis test environments.
    """

    def __init__(self) -> None:
        self._kv: Dict[str, Tuple[str, Optional[float]]] = {}
        self._zsets: Dict[str, List[Tuple[float, str]]] = {}
        self._telemetry_stream: List[Dict[str, Any]] = []
        self._max_stream_len = 100

    def _purge_expired(self) -> None:
        now = time.time()
        expired_keys = [k for k, (_, exp) in self._kv.items() if exp is not None and exp < now]
        for k in expired_keys:
            del self._kv[k]

    async def get(self, key: str) -> Optional[str]:
        self._purge_expired()
        entry = self._kv.get(key)
        if entry is None:
            return None
        val, exp = entry
        if exp is not None and exp < time.time():
            del self._kv[key]
            return None
        return val

    async def set(self, key: str, value: str, ex: Optional[int] = None) -> bool:
        exp = time.time() + ex if ex else None
        self._kv[key] = (value, exp)
        return True

    async def delete(self, key: str) -> int:
        removed = 0
        if key in self._kv:
            del self._kv[key]
            removed += 1
        if key in self._zsets:
            del self._zsets[key]
            removed += 1
        return removed

    async def zadd(self, name: str, mapping: Dict[str, float]) -> int:
        if name not in self._zsets:
            self._zsets[name] = []
        count = 0
        for member, score in mapping.items():
            # remove existing member if present
            self._zsets[name] = [item for item in self._zsets[name] if item[1] != member]
            self._zsets[name].append((score, member))
            count += 1
        self._zsets[name].sort(key=lambda x: x[0])
        return count

    async def zremrangebyscore(self, name: str, min_score: float, max_score: float) -> int:
        if name not in self._zsets:
            return 0
        initial_len = len(self._zsets[name])
        self._zsets[name] = [item for item in self._zsets[name] if not (min_score <= item[0] <= max_score)]
        return initial_len - len(self._zsets[name])

    async def zcard(self, name: str) -> int:
        return len(self._zsets.get(name, []))

    async def expire(self, name: str, time_sec: int) -> bool:
        return True

    async def publish_telemetry(self, event: Dict[str, Any]) -> None:
        self._telemetry_stream.append(event)
        if len(self._telemetry_stream) > self._max_stream_len:
            self._telemetry_stream.pop(0)

    async def get_recent_telemetry(self, limit: int = 50) -> List[Dict[str, Any]]:
        return list(reversed(self._telemetry_stream[-limit:]))


class RedisSentinelManager:
    """
    Enterprise-grade Redis connection and cache manager providing sliding-window
    rate limiting, behavioral session profiling, and telemetry buffering.
    """

    def __init__(self, redis_url: Optional[str] = None) -> None:
        self.redis_url = redis_url or os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self._client: Any = None
        self._fallback = InMemoryFallbackRedis()
        self._use_fallback = False

    async def initialize(self) -> None:
        """Establish asynchronous Redis connection pool with failover."""
        if not REDIS_AVAILABLE:
            logger.warning("[Aegis-X Redis] redis-py not found. Activating in-memory fallback manager.")
            self._use_fallback = True
            return

        try:
            self._client = aioredis.from_url(
                self.redis_url,
                encoding="utf-8",
                decode_responses=True,
                socket_timeout=1.5,
                socket_connect_timeout=2.0,
                max_connections=50,
            )
            # Ping to verify connectivity
            await self._client.ping()
            self._use_fallback = False
            logger.info("[Aegis-X Redis] Connected successfully to Redis cluster at %s", self.redis_url)
        except Exception as exc:
            logger.warning(
                "[Aegis-X Redis] Could not connect to %s (%s). Engaging zero-trust in-memory fallback.",
                self.redis_url,
                str(exc),
            )
            self._use_fallback = True

    async def close(self) -> None:
        """Gracefully release Redis resources."""
        if self._client and not self._use_fallback:
            try:
                await self._client.close()
                logger.info("[Aegis-X Redis] Connection pool closed cleanly.")
            except Exception as exc:
                logger.error("[Aegis-X Redis] Error closing connection: %s", exc)

    async def sliding_window_rate_check(
        self,
        identifier: str,
        window_seconds: int = 60,
        limit: int = 10,
    ) -> Tuple[bool, int, int]:
        """
        Sliding Window Log rate-limiter using sorted sets.
        Prevents card testing, brute-force ATO, and credential stuffing bursts.

        Returns:
            Tuple[is_allowed, current_count, remaining_budget]
        """
        now = time.time()
        window_start = now - window_seconds
        key = f"aegis:ratelimit:{identifier}:{window_seconds}"
        member = f"{now}:{os.urandom(4).hex()}"

        try:
            if self._use_fallback:
                await self._fallback.zremrangebyscore(key, 0, window_start)
                await self._fallback.zadd(key, {member: now})
                count = await self._fallback.zcard(key)
                await self._fallback.expire(key, window_seconds * 2)
            else:
                pipe = self._client.pipeline()
                pipe.zremrangebyscore(key, 0, window_start)
                pipe.zadd(key, {member: now})
                pipe.zcard(key)
                pipe.expire(key, window_seconds * 2)
                results = await pipe.execute()
                count = results[2]

            is_allowed = count <= limit
            remaining = max(0, limit - count)
            return is_allowed, count, remaining

        except Exception as exc:
            logger.error("[Aegis-X Redis] Sliding window check failed for %s: %s", identifier, exc)
            # Fail-open with warning or fallback
            return True, 1, limit - 1

    async def get_user_session_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve recent behavioral and telemetry session baseline for a user."""
        key = f"aegis:session:{user_id}"
        try:
            if self._use_fallback:
                data = await self._fallback.get(key)
            else:
                data = await self._client.get(key)

            if data:
                return json.loads(data)
            return None
        except Exception as exc:
            logger.error("[Aegis-X Redis] Failed to load session profile for %s: %s", user_id, exc)
            return None

    async def update_user_session_profile(
        self,
        user_id: str,
        profile_data: Dict[str, Any],
        ttl_seconds: int = 86400 * 7,  # 7-day retention
    ) -> None:
        """Persist updated device, geographic, and behavioral baseline in cache."""
        key = f"aegis:session:{user_id}"
        payload = json.dumps(profile_data)
        try:
            if self._use_fallback:
                await self._fallback.set(key, payload, ex=ttl_seconds)
            else:
                await self._client.set(key, payload, ex=ttl_seconds)
        except Exception as exc:
            logger.error("[Aegis-X Redis] Failed updating session profile for %s: %s", user_id, exc)

    async def push_telemetry_event(self, event: Dict[str, Any]) -> None:
        """Publish transaction telemetry to ring buffer and dashboard channel."""
        try:
            if self._use_fallback:
                await self._fallback.publish_telemetry(event)
            else:
                serialized = json.dumps(event)
                pipe = self._client.pipeline()
                pipe.lpush("aegis:telemetry:stream", serialized)
                pipe.ltrim("aegis:telemetry:stream", 0, 199)
                pipe.publish("aegis:telemetry:pubsub", serialized)
                # Increment telemetry counters
                pipe.incr("aegis:metrics:total_evaluated")
                if event.get("decision") == "BLOCK":
                    pipe.incr("aegis:metrics:blocked")
                elif event.get("decision") == "STEP_UP_CHALLENGE":
                    pipe.incr("aegis:metrics:step_up")
                await pipe.execute()
        except Exception as exc:
            logger.error("[Aegis-X Redis] Telemetry event push error: %s", exc)

    async def get_recent_telemetry_events(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Retrieve latest telemetry records for the Control Room dashboard."""
        try:
            if self._use_fallback:
                return await self._fallback.get_recent_telemetry(limit)
            items = await self._client.lrange("aegis:telemetry:stream", 0, limit - 1)
            return [json.loads(i) for i in items]
        except Exception as exc:
            logger.error("[Aegis-X Redis] Error retrieving telemetry events: %s", exc)
            return []


# Global singleton instance
redis_manager = RedisSentinelManager()
