"""
Aegis-X: Real-Time Edge Security Gateway
Module: detector.py
Description: Multi-vector synthetic fraud and Account Takeover (ATO) anomaly detection engine.
             Combines spherical geo-velocity calculations, device fingerprint entropy heuristics,
             advanced behavioral biometrics (keystroke dynamics, mouse curvature/jitter entropy,
             scroll kinetics, click pressure mechanics, UI element timeline), and Telco SIM/ASN telemetry.
"""

from __future__ import annotations

import math
import time
from typing import Any, Dict, List, Optional, Tuple
from pydantic import BaseModel, Field


class GeoCoordinates(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude in decimal degrees")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude in decimal degrees")
    city: Optional[str] = "Unknown"
    country_code: Optional[str] = "XX"


class DeviceFingerprint(BaseModel):
    fingerprint_hash: str = Field(..., description="Calculated client-side device hash")
    user_agent: str = Field(..., description="Browser or mobile client User-Agent")
    screen_resolution: str = Field(default="1920x1080")
    canvas_hash: Optional[str] = None
    webgl_vendor: Optional[str] = None
    hardware_concurrency: Optional[int] = 8
    is_webdriver: bool = Field(default=False, description="Flag indicating automated driver")


class BehavioralBiometrics(BaseModel):
    # Keystroke Dynamics
    keystroke_dwell_mean_ms: float = Field(default=85.0, description="Average keypress hold time")
    keystroke_dwell_variance_ms: float = Field(default=18.0, description="Variance in keypress hold time")
    keystroke_flight_mean_ms: float = Field(default=140.0, description="Average time between consecutive keystrokes")
    keystroke_flight_variance_ms: float = Field(default=35.0, description="Variance in typing rhythm jitter")

    # Mouse Movement Dynamics & Jitter Entropy
    mouse_curvature_score: float = Field(
        default=0.75, ge=0.0, le=1.0, description="Human curvature ratio (0.0 = robotic linear, 1.0 = organic curve)"
    )
    mouse_jitter_entropy: float = Field(
        default=0.68, ge=0.0, le=1.0, description="Shannon entropy of cursor micro-tremors (humans > 0.45, bots < 0.15)"
    )
    mouse_velocity_spikes: int = Field(
        default=0, ge=0, description="Count of impossible cursor teleports (> 15,000 px/s without intervening move events)"
    )

    # Scroll Kinetics & Inertia
    scroll_velocity_mean_px_s: float = Field(default=420.0, ge=0.0, description="Average scroll velocity in px/s")
    scroll_velocity_variance: float = Field(
        default=180.0, ge=0.0, description="Kinetic scrolling deceleration variance (humans > 60.0, bots 0.0)"
    )
    is_instant_scroll_teleport: bool = Field(
        default=False, description="Flag for programmatic instantaneous page coordinate jumps"
    )

    # Click & Pointer Mechanics
    click_pressure_mean: float = Field(
        default=0.55, ge=0.0, le=1.0, description="PointerEvent pressure (0.0 for emulated synthetic mouse, ~0.5 for physical pointer)"
    )
    click_pressure_variance: float = Field(
        default=0.08, ge=0.0, le=1.0, description="Variance in click pressure across taps/clicks (0.0 = bot dummy)"
    )

    # UI Element Focus & Hesitation Timeline
    interaction_time_ms: float = Field(default=3200.0, description="Total time spent on form before submission")
    ui_element_focus_dwell_ms: Dict[str, float] = Field(
        default_factory=lambda: {
            "amount_field": 1250.0,
            "destination_account_field": 1450.0,
            "submit_button_hover": 320.0,
        },
        description="Dwell time spent focusing or hovering specific form elements",
    )


class NetworkTelemetry(BaseModel):
    client_ip: str
    asn_number: int = Field(default=7922, description="Autonomous System Number")
    asn_organization: str = Field(default="Comcast Cable Communications, LLC")
    is_datacenter_or_proxy: bool = False
    is_tor_exit_node: bool = False
    sim_swap_age_hours: Optional[float] = Field(
        default=None, description="Hours elapsed since last Telco SIM swap/re-provisioning"
    )
    is_roaming: bool = False


class TransactionContext(BaseModel):
    transaction_id: str
    user_id: str
    account_id: str
    amount: float
    currency: str = "USD"
    destination_account: str
    timestamp: float = Field(default_factory=time.time)
    geo: GeoCoordinates
    device: DeviceFingerprint
    biometrics: BehavioralBiometrics
    network: NetworkTelemetry


class FactorEvaluation(BaseModel):
    factor_name: str
    score: float = Field(..., ge=0.0, le=100.0)
    weight: float
    is_critical_flag: bool = False
    details: Dict[str, Any]


class RiskDecision(BaseModel):
    transaction_id: str
    risk_score: float = Field(..., ge=0.0, le=100.0)
    decision: str  # ALLOW, STEP_UP_CHALLENGE, BLOCK
    recommended_action: str
    challenge_type: Optional[str] = None  # FIDO2_PASSKEY, OUT_OF_BAND_PUSH, HARDWARE_KEY, None
    processing_latency_ms: float
    factors: List[FactorEvaluation]
    forensic_tags: List[str]


class AnomalyDetector:
    """
    High-throughput anomaly detection engine executing zero-trust heuristic
    evaluations in parallel with deterministic mathematical verification.
    """

    CRUISE_SPEED_LIMIT_KMH = 920.0  # Commercial flight theoretical max velocity limit
    HIGH_RISK_SPEED_KMH = 350.0      # Bullet train / express commuter limit

    @staticmethod
    def haversine_distance_km(coord1: GeoCoordinates, coord2: GeoCoordinates) -> float:
        """
        Calculate the great-circle distance between two points on the Earth's surface
        using the Haversine trigonometric formula.
        """
        r_earth = 6371.0  # Earth's radius in kilometers

        lat1_rad = math.radians(coord1.latitude)
        lon1_rad = math.radians(coord1.longitude)
        lat2_rad = math.radians(coord2.latitude)
        lon2_rad = math.radians(coord2.longitude)

        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad

        a = math.sin(dlat / 2.0) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2.0) ** 2
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return r_earth * c

    def evaluate_geo_velocity(
        self, current_tx: TransactionContext, prior_session: Optional[Dict[str, Any]]
    ) -> FactorEvaluation:
        """
        Detects 'Impossible Traveler' teleportation attacks by computing speed
        required to travel from prior verified geolocation to current request.
        """
        if not prior_session or "last_geo" not in prior_session:
            return FactorEvaluation(
                factor_name="geo_velocity",
                score=10.0,
                weight=0.25,
                is_critical_flag=False,
                details={"status": "initial_baseline_established", "calculated_speed_kmh": 0.0},
            )

        prior_geo_dict = prior_session["last_geo"]
        prior_time = prior_session.get("last_timestamp", current_tx.timestamp - 3600.0)

        prior_geo = GeoCoordinates(
            latitude=prior_geo_dict["latitude"],
            longitude=prior_geo_dict["longitude"],
            city=prior_geo_dict.get("city", "Unknown"),
            country_code=prior_geo_dict.get("country_code", "XX"),
        )

        distance_km = self.haversine_distance_km(prior_geo, current_tx.geo)
        time_delta_sec = max(current_tx.timestamp - prior_time, 1.0)
        time_delta_hours = time_delta_sec / 3600.0

        calculated_speed_kmh = distance_km / time_delta_hours

        # Scoring heuristics
        critical = False
        if calculated_speed_kmh > self.CRUISE_SPEED_LIMIT_KMH and distance_km > 200.0:
            score = 100.0
            critical = True
            status = "IMPOSSIBLE_TRAVELER_SUPERSONIC_VELOCITY"
        elif calculated_speed_kmh > self.HIGH_RISK_SPEED_KMH and distance_km > 100.0:
            score = 75.0
            status = "ANOMALOUS_HIGH_TRANSIT_VELOCITY"
        elif distance_km > 1500.0 and time_delta_hours < 4.0:
            score = 65.0
            status = "CROSS_BORDER_RAPID_SHIFT"
        elif distance_km > 50.0:
            score = 25.0
            status = "NORMAL_REGIONAL_COMMUTE"
        else:
            score = 5.0
            status = "LOCAL_STATIONARY"

        return FactorEvaluation(
            factor_name="geo_velocity",
            score=score,
            weight=0.25,
            is_critical_flag=critical,
            details={
                "distance_km": round(distance_km, 2),
                "time_delta_seconds": round(time_delta_sec, 1),
                "calculated_speed_kmh": round(calculated_speed_kmh, 2),
                "prior_city": prior_geo.city,
                "current_city": current_tx.geo.city,
                "status": status,
            },
        )

    def evaluate_device_fingerprint(
        self, current_tx: TransactionContext, prior_session: Optional[Dict[str, Any]]
    ) -> FactorEvaluation:
        """
        Inspects device entropy, headless browser signatures, and canvas hash variance.
        """
        device = current_tx.device
        score = 0.0
        critical = False
        reasons = []

        # 1. Automated driver / headless flag check
        if device.is_webdriver:
            score += 85.0
            critical = True
            reasons.append("SELENIUM_OR_PLAYWRIGHT_WEBDRIVER_ACTIVE")

        # 2. Known bot User-Agent patterns
        ua_lower = device.user_agent.lower()
        if any(bot in ua_lower for bot in ["headless", "phantomjs", "puppeteer", "curl", "postman", "python-requests"]):
            score += 90.0
            critical = True
            reasons.append("SYNTHETIC_CLIENT_UA_DETECTED")

        # 3. WebGL / Canvas hardware spoofing check
        if device.webgl_vendor and any(m in device.webgl_vendor.lower() for m in ["llvmpipe", "swiftshader", "mesa"]):
            score += 45.0
            reasons.append("VIRTUALIZED_SOFTWARE_RENDERER")

        # 4. Device baseline consistency
        if prior_session and "known_device_hashes" in prior_session:
            known_hashes = prior_session["known_device_hashes"]
            if device.fingerprint_hash not in known_hashes:
                score += 35.0
                reasons.append("UNKNOWN_NEW_DEVICE_HARDWARE_FINGERPRINT")
            else:
                score = max(0.0, score - 10.0)
                reasons.append("TRUSTED_RECOGNIZED_DEVICE")

        score = min(100.0, max(5.0, score))

        return FactorEvaluation(
            factor_name="device_fingerprint",
            score=score,
            weight=0.25,
            is_critical_flag=critical,
            details={
                "fingerprint_hash_prefix": device.fingerprint_hash[:12] + "...",
                "is_webdriver": device.is_webdriver,
                "resolution": device.screen_resolution,
                "hardware_concurrency": device.hardware_concurrency,
                "diagnostics": reasons or ["NORMAL_CLIENT_ENTROPY"],
            },
        )

    def evaluate_behavioral_biometrics(self, current_tx: TransactionContext) -> FactorEvaluation:
        """
        Advanced Behavioral Biometrics Analysis:
        Inspects 5 distinct human-versus-bot biometric layers:
          1. Keystroke Cadence Dynamics (flight time jitter & dwell variance)
          2. Mouse Movement Trajectory & Micro-Jitter Shannon Entropy
          3. Kinetic Scroll Velocity & Deceleration Curves
          4. Pointer Event Click Pressure Mechanics
          5. UI Element Focus & Interaction Hesitation Timeline
        """
        bio = current_tx.biometrics
        score = 0.0
        critical = False
        flags: List[str] = []
        diagnostics: Dict[str, Any] = {}

        # --- LAYER 1: Keystroke Dynamics ---
        # Synthetic zero-variance keystroke detection (automated script injecting keys)
        if bio.keystroke_flight_variance_ms <= 1.0 or bio.keystroke_dwell_variance_ms <= 1.0:
            score += 40.0
            flags.append("SYNTHETIC_KEYSTROKE_CADENCE_ZERO_JITTER")
        elif bio.keystroke_flight_mean_ms < 30.0:
            score += 30.0
            flags.append("SUPERHUMAN_KEYSTROKE_VELOCITY")
        else:
            diagnostics["keystroke_cadence"] = "ORGANIC_HUMAN_RHYTHM"

        # --- LAYER 2: Mouse Trajectory & Jitter Entropy ---
        # Humans have physical muscular micro-tremors producing high trajectory entropy (> 0.45).
        # Programmatic script mouse movements (e.g. Page.mouse.move) exhibit straight lines or 0 micro-tremor.
        if bio.mouse_jitter_entropy < 0.15:
            score += 35.0
            flags.append("ROBOTIC_ZERO_ENTROPY_MOUSE_JITTER")
        elif bio.mouse_curvature_score < 0.15:
            score += 25.0
            flags.append("LINEAR_ROBOTIC_MOUSE_TRAJECTORY")
        
        # Cursor velocity teleports (> 15,000 px/s without move events)
        if bio.mouse_velocity_spikes > 0:
            score += min(30.0, bio.mouse_velocity_spikes * 15.0)
            flags.append(f"CURSOR_INSTANT_TELEPORT_SPIKES_{bio.mouse_velocity_spikes}")

        # --- LAYER 3: Scroll Kinetics & Inertia ---
        # Kinetic scrolling on trackpads/smartphones has inertia deceleration curves (variance > 60).
        # Programmatic scraper scripts (window.scrollTo) execute instant coordinate shifts with 0 variance.
        if bio.is_instant_scroll_teleport:
            score += 35.0
            flags.append("PROGRAMMATIC_PAGE_SCROLL_TELEPORT")
        elif bio.scroll_velocity_variance <= 5.0 and bio.scroll_velocity_mean_px_s > 0.0:
            score += 25.0
            flags.append("UNIFORM_ARTIFICIAL_SCROLL_VELOCITY")

        # --- LAYER 4: Pointer Click Pressure Mechanics ---
        # Physical human clicks/taps have natural pressure variations (0.2 to 0.8).
        # Emulated synthetic browser events in headless drivers typically pass constant pressure 0.0 or 0.5 with 0 variance.
        if bio.click_pressure_variance <= 0.005 and bio.click_pressure_mean in (0.0, 0.5):
            score += 30.0
            flags.append("EMULATED_SYNTHETIC_CLICK_PRESSURE_DUMMY")
        elif bio.click_pressure_mean > 0.15 and bio.click_pressure_variance > 0.02:
            score = max(0.0, score - 5.0)
            diagnostics["click_pressure"] = "PHYSICAL_POINTER_PRESSURE_VALIDATED"

        # --- LAYER 5: UI Element Focus & Hesitation Timeline ---
        # Real humans spend time hovering the submit button (> 120ms) and reviewing fields.
        # Headless bots fire immediate click events with 0ms hover dwell time.
        submit_hover = bio.ui_element_focus_dwell_ms.get("submit_button_hover", 320.0)
        if submit_hover < 25.0:
            score += 25.0
            flags.append("ZERO_HOVER_INSTANT_ELEMENT_DISPATCH")

        if bio.interaction_time_ms < 400.0:
            score += 45.0
            flags.append("SUB_SECOND_MICROSURGE_DISPATCH")
        elif bio.interaction_time_ms > 2000.0:
            score = max(0.0, score - 5.0)

        # Critical Veto Threshold: If 3 or more bot layers trigger, mark as critical
        if len(flags) >= 3 or ("SYNTHETIC_KEYSTROKE_CADENCE_ZERO_JITTER" in flags and "ROBOTIC_ZERO_ENTROPY_MOUSE_JITTER" in flags):
            critical = True
            score = max(score, 88.0)

        final_bio_score = min(100.0, max(5.0, score))

        return FactorEvaluation(
            factor_name="behavioral_biometrics",
            score=final_bio_score,
            weight=0.25,
            is_critical_flag=critical,
            details={
                "flight_variance_ms": bio.keystroke_flight_variance_ms,
                "dwell_variance_ms": bio.keystroke_dwell_variance_ms,
                "mouse_curvature": round(bio.mouse_curvature_score, 2),
                "mouse_jitter_entropy": round(bio.mouse_jitter_entropy, 2),
                "mouse_velocity_spikes": bio.mouse_velocity_spikes,
                "scroll_velocity_variance": round(bio.scroll_velocity_variance, 1),
                "click_pressure_variance": round(bio.click_pressure_variance, 4),
                "submit_hover_dwell_ms": submit_hover,
                "interaction_ms": bio.interaction_time_ms,
                "flags": flags or ["ORGANIC_HUMAN_BIOMETRICS_VERIFIED"],
                "diagnostics": diagnostics,
            },
        )

    def evaluate_network_and_sim(
        self, current_tx: TransactionContext, prior_session: Optional[Dict[str, Any]]
    ) -> FactorEvaluation:
        """
        Assesses SIM swap recency, ASN infrastructure shifts (Residential -> Datacenter/VPN/Tor),
        and cellular roaming flags.
        """
        net = current_tx.network
        score = 0.0
        critical = False
        observations = []

        # 1. Recent SIM Swap check (Major banking ATO vector)
        if net.sim_swap_age_hours is not None:
            if net.sim_swap_age_hours < 24.0:
                score += 85.0
                critical = True
                observations.append(f"RECENT_SIM_SWAP_CRITICAL_{net.sim_swap_age_hours:.1f}H_AGO")
            elif net.sim_swap_age_hours < 72.0:
                score += 55.0
                observations.append(f"ELEVATED_SIM_SWAP_RISK_{net.sim_swap_age_hours:.1f}H_AGO")

        # 2. Tor exit node / Bulletproof hosting
        if net.is_tor_exit_node:
            score += 95.0
            critical = True
            observations.append("ACTIVE_TOR_EXIT_NODE")

        # 3. Datacenter / Commercial Proxy IP
        if net.is_datacenter_or_proxy:
            score += 50.0
            observations.append("DATACENTER_PROXY_HOSTING_IP")

        # 4. Sudden ASN shift from baseline (e.g. Mobile Carrier -> VPS Hosting)
        if prior_session and "last_asn" in prior_session:
            last_asn = prior_session["last_asn"]
            if last_asn != net.asn_number:
                if net.is_datacenter_or_proxy:
                    score += 35.0
                    observations.append(f"ASN_SHIFT_RESIDENTIAL_TO_DATACENTER_{net.asn_number}")
                else:
                    score += 15.0
                    observations.append(f"NETWORK_ASN_ROUTING_CHANGE_{last_asn}_TO_{net.asn_number}")

        # 5. International cellular roaming
        if net.is_roaming:
            score += 20.0
            observations.append("CELLULAR_CARRIER_ROAMING_ACTIVE")

        score = min(100.0, max(5.0, score))

        return FactorEvaluation(
            factor_name="network_and_sim",
            score=score,
            weight=0.25,
            is_critical_flag=critical,
            details={
                "asn": net.asn_number,
                "asn_org": net.asn_organization,
                "is_datacenter": net.is_datacenter_or_proxy,
                "is_tor": net.is_tor_exit_node,
                "sim_swap_hours": net.sim_swap_age_hours,
                "is_roaming": net.is_roaming,
                "observations": observations or ["LEGITIMATE_RESIDENTIAL_TELEMETRY"],
            },
        )

    def evaluate_transaction(
        self,
        transaction: TransactionContext,
        prior_session: Optional[Dict[str, Any]] = None,
        rate_limit_violation: bool = False,
    ) -> RiskDecision:
        """
        Orchestrates multi-heuristic evaluation, derives composite risk score,
        and applies zero-trust policy decision gates.
        """
        start_time = time.perf_counter()

        # Run individual factor engines
        factor_geo = self.evaluate_geo_velocity(transaction, prior_session)
        factor_device = self.evaluate_device_fingerprint(transaction, prior_session)
        factor_bio = self.evaluate_behavioral_biometrics(transaction)
        factor_net = self.evaluate_network_and_sim(transaction, prior_session)

        factors = [factor_geo, factor_device, factor_bio, factor_net]

        # Calculate weighted composite score
        base_composite = sum(f.score * f.weight for f in factors)

        forensic_tags: List[str] = []
        any_critical = any(f.is_critical_flag for f in factors)

        if rate_limit_violation:
            base_composite = max(base_composite, 85.0)
            forensic_tags.append("SLIDING_WINDOW_VELOCITY_BREACH")

        for f in factors:
            if f.is_critical_flag:
                forensic_tags.append(f"CRITICAL_{f.factor_name.upper()}")
            for k, v in f.details.items():
                if k in ("status", "diagnostics", "flags", "observations") and isinstance(v, (list, str)):
                    if isinstance(v, list):
                        forensic_tags.extend(v[:2])
                    elif "IMPOSSIBLE" in v or "ANOMALOUS" in v:
                        forensic_tags.append(v)

        # High amount scalar (elevates sensitivity on larger fund movements)
        if transaction.amount > 10000.0:
            base_composite = min(100.0, base_composite * 1.15)
            forensic_tags.append("HIGH_VALUE_TRANSACTION_SENSITIVITY")

        # Critical veto logic: any critical flag pins score >= 80
        if any_critical:
            final_score = round(max(base_composite, 82.0), 1)
        else:
            final_score = round(min(100.0, max(0.0, base_composite)), 1)

        # Gateway Decision Thresholds
        if final_score >= 75.0 or (any_critical and final_score >= 70.0):
            decision = "BLOCK"
            recommended_action = "TERMINATE_TRANSACTION_AT_EDGE"
            challenge_type = None
        elif final_score >= 35.0:
            decision = "STEP_UP_CHALLENGE"
            recommended_action = "REQUIRE_OUT_OF_BAND_OR_FIDO2_AUTHENTICATION"
            # Note: Detailed dynamic protocol selection is handled by mfa_orchestrator
            if factor_net.details.get("sim_swap_hours") is not None and factor_net.details["sim_swap_hours"] < 72.0:
                challenge_type = "FIDO2_PASSKEY"  # SMS MFA is compromised under SIM-swap!
            else:
                challenge_type = "OUT_OF_BAND_PUSH"
        else:
            decision = "ALLOW"
            recommended_action = "FORWARD_TO_CORE_BANKING_LEDGER"
            challenge_type = None

        latency_ms = round((time.perf_counter() - start_time) * 1000.0, 2)

        return RiskDecision(
            transaction_id=transaction.transaction_id,
            risk_score=final_score,
            decision=decision,
            recommended_action=recommended_action,
            challenge_type=challenge_type,
            processing_latency_ms=latency_ms,
            factors=factors,
            forensic_tags=list(set(forensic_tags))[:8],
        )


# Global singleton detector
sentinel_detector = AnomalyDetector()
