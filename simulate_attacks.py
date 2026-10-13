"""
Aegis-X: Real-Time Edge Security Gateway
Script: simulate_attacks.py
Description: Attack scenario harness generating synthetic fraud, impossible traveler teleportation,
             advanced behavioral biometrics anomalies (zero-jitter mouse/scroll, emulated click pressure),
             and verifying the dynamic MFA orchestration verification flow.
"""

import asyncio
import json
import time
import httpx

GATEWAY_URL = "http://localhost:8080"


async def run_simulations():
    print("=" * 75)
    print(" [AEGIS-X] Launching Zero-Trust Multi-Vector Attack & MFA Suite")
    print(f" Target Gateway: {GATEWAY_URL}")
    print("=" * 75)

    async with httpx.AsyncClient(timeout=10.0) as client:
        # Check health
        try:
            health = await client.get(f"{GATEWAY_URL}/healthz")
            print(f"[+] Health probe: {health.status_code} -> {health.json()}")
        except Exception as e:
            print(f"[!] Warning: Gateway at {GATEWAY_URL} not reachable ({e}). Ensure Uvicorn is running.")
            return

        # Scenario 1: Legitimate User Payment with Organic Biometrics
        legit_tx = {
            "user_id": "usr_emma_5521",
            "account_id": "acc_primary_checking_us",
            "amount": 280.0,
            "currency": "USD",
            "destination_account": "acc_merchant_groceries",
            "geo": {"latitude": 40.7128, "longitude": -74.0060, "city": "New York", "country_code": "US"},
            "device": {
                "fingerprint_hash": "hash_macbook_known_00a1f",
                "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                "screen_resolution": "1920x1080",
                "is_webdriver": False
            },
            "biometrics": {
                "keystroke_flight_mean_ms": 135.0,
                "keystroke_flight_variance_ms": 32.0,
                "keystroke_dwell_mean_ms": 82.0,
                "keystroke_dwell_variance_ms": 16.0,
                "mouse_curvature_score": 0.76,
                "mouse_jitter_entropy": 0.72,
                "mouse_velocity_spikes": 0,
                "scroll_velocity_mean_px_s": 380.0,
                "scroll_velocity_variance": 145.0,
                "click_pressure_mean": 0.58,
                "click_pressure_variance": 0.08,
                "interaction_time_ms": 4200.0,
                "ui_element_focus_dwell_ms": {"amount_field": 1100.0, "submit_button_hover": 340.0}
            },
            "network": {
                "client_ip": "72.229.28.18",
                "asn_number": 7922,
                "asn_organization": "Comcast Cable Communications",
                "is_datacenter_or_proxy": False,
                "is_tor_exit_node": False
            }
        }
        print("\n--- [Scenario 1] Dispatching Legitimate Retail Transfer ---")
        res1 = await client.post(f"{GATEWAY_URL}/v1/ledger/transfer", json=legit_tx)
        print(f"Verdict: HTTP {res1.status_code} | Decision: {res1.headers.get('X-Aegis-Decision')}")
        print(f"Receipt: {res1.json()}")

        # Scenario 2: Advanced Behavioral Bot Attack (Zero-jitter mouse, instant scroll teleport, dummy click pressure)
        bot_tx = {
            "user_id": "usr_compromised_target",
            "account_id": "acc_savings_99",
            "amount": 9999.0,
            "destination_account": "acc_crypto_mixer",
            "geo": {"latitude": 51.5074, "longitude": -0.1278, "city": "London", "country_code": "GB"},
            "device": {
                "fingerprint_hash": "hash_puppeteer_agent_0x9",
                "user_agent": "Mozilla/5.0 HeadlessChrome/124.0.0.0",
                "screen_resolution": "800x600",
                "is_webdriver": True,
                "webgl_vendor": "Google SwiftShader"
            },
            "biometrics": {
                "keystroke_flight_mean_ms": 12.0,
                "keystroke_flight_variance_ms": 0.0,
                "keystroke_dwell_mean_ms": 15.0,
                "keystroke_dwell_variance_ms": 0.0,
                "mouse_curvature_score": 0.02,
                "mouse_jitter_entropy": 0.05,
                "mouse_velocity_spikes": 3,
                "scroll_velocity_mean_px_s": 0.0,
                "scroll_velocity_variance": 0.0,
                "is_instant_scroll_teleport": True,
                "click_pressure_mean": 0.0,
                "click_pressure_variance": 0.0,
                "interaction_time_ms": 180.0,
                "ui_element_focus_dwell_ms": {"submit_button_hover": 0.0}
            },
            "network": {
                "client_ip": "185.220.101.4",
                "asn_number": 9009,
                "asn_organization": "M247 Europe Proxy Infrastructure",
                "is_datacenter_or_proxy": True,
                "is_tor_exit_node": True
            }
        }
        print("\n--- [Scenario 2] Advanced Behavioral Biometric Bot Injection ---")
        res2 = await client.post(f"{GATEWAY_URL}/v1/ledger/transfer", json=bot_tx)
        print(f"Verdict: HTTP {res2.status_code} | Decision: {res2.headers.get('X-Aegis-Decision')} | Score: {res2.headers.get('X-Aegis-Risk-Score')}")
        print(f"Payload Response: {res2.json()}")

        # Scenario 3: SIM Swap + Datacenter ASN -> Dynamic MFA Triggering & Verification Flow
        sim_tx = {
            "user_id": "usr_vip_wealth_41",
            "account_id": "acc_private_banking_usd",
            "amount": 18500.0,
            "destination_account": "acc_offshore_wire_3",
            "geo": {"latitude": 37.7749, "longitude": -122.4194, "city": "San Francisco", "country_code": "US"},
            "device": {
                "fingerprint_hash": "hash_unregistered_samsung_s24",
                "user_agent": "Mozilla/5.0 (Linux; Android 14; SM-S928B)",
                "screen_resolution": "1440x3120",
                "is_webdriver": False
            },
            "biometrics": {
                "keystroke_flight_mean_ms": 105.0,
                "keystroke_flight_variance_ms": 20.0,
                "keystroke_dwell_mean_ms": 78.0,
                "keystroke_dwell_variance_ms": 14.0,
                "mouse_curvature_score": 0.65,
                "mouse_jitter_entropy": 0.60,
                "interaction_time_ms": 3600.0
            },
            "network": {
                "client_ip": "167.99.145.22",
                "asn_number": 14061,
                "asn_organization": "DigitalOcean LLC",
                "is_datacenter_or_proxy": True,
                "sim_swap_age_hours": 1.5
            }
        }
        print("\n--- [Scenario 3] SIM Swap Detected -> Dynamic MFA Orchestration ---")
        res3 = await client.post(f"{GATEWAY_URL}/v1/ledger/transfer", json=sim_tx)
        print(f"Verdict: HTTP {res3.status_code} | Decision: {res3.headers.get('X-Aegis-Decision')}")
        mfa_challenge = res3.json()
        print(f"Challenge Dispatched: Protocol={mfa_challenge.get('protocol')} | ChallengeID={mfa_challenge.get('challenge_id')}")

        if mfa_challenge.get("challenge_id"):
            challenge_id = mfa_challenge["challenge_id"]
            print(f"\n--- [Scenario 3b] Verifying FIDO2 Passkey Biometric Assertion for {challenge_id} ---")
            verify_payload = {
                "challenge_id": challenge_id,
                "client_proof": "webauthn_passkey_verified"
            }
            res_verify = await client.post(f"{GATEWAY_URL}/v1/mfa/challenge/verify", json=verify_payload)
            print(f"MFA Verification Response: HTTP {res_verify.status_code}")
            print(f"Ledger Settlement Receipt: {res_verify.json()}")

        # Final telemetry fetch
        stats = await client.get(f"{GATEWAY_URL}/v1/telemetry/stats")
        print("\n" + "=" * 75)
        print(f"[AEGIS-X] Telemetry & MFA Protocol Metrics: {stats.json()}")
        print("=" * 75)


if __name__ == "__main__":
    asyncio.run(run_simulations())
