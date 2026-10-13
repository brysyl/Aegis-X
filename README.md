# Aegis-X: Real-Time Edge Security Gateway & Synthetic Fraud/ATO Sentinel

A production-grade, zero-trust edge gateway and Account Takeover (ATO) sentinel designed for high-throughput core banking environments. Aegis-X intercepts banking transaction payloads before they touch the financial ledger, evaluating multi-vector heuristics in under **10 milliseconds** and dynamically triggering FIDO2 step-up challenges or terminating malicious flows at the edge.

---

## ⚡ Core Capabilities

1. **Sub-10ms Edge Interception**: Fast, non-blocking zero-trust pipeline engineered with FastAPI, Uvicorn, and async Redis.
2. **Dynamic MFA Orchestrator (`mfa_orchestrator.py`)**:
   - Aligned with NIST SP 800-63B assurance levels (Tier 0 Frictionless, Tier 1 App Push, Tier 2 FIDO2 Passkey, Tier 3 Hardware Key).
   - **Telco SIM-Swap Defense**: Automatically revokes SMS OTP if SIM re-provisioning timestamp is $< 72\text{ hours}$ to prevent cellular interception, enforcing cryptographic FIDO2 WebAuthn biometric assertion.
   - Challenge verification endpoint (`POST /v1/mfa/challenge/verify`) releasing pending transfers to core banking ledgers upon cryptographic proof.
3. **Advanced 5-Layer Behavioral Biometrics (`detector.py`)**:
   - **Keystroke Cadence Dynamics**: Flight and dwell variance ($\sigma^2 \le 1.0\text{ ms}$ flags bot automation).
   - **Mouse Movement Trajectory & Micro-Jitter Shannon Entropy**: Involuntary physiological tremor variance ($H < 0.15$ flags robotic straight lines/scripts).
   - **Kinetic Scroll Kinetics**: Detects instantaneous programmatic coordinate jumps (`window.scrollTo` teleport flags) versus organic inertial deceleration curves.
   - **Pointer Event Click Pressure**: Evaluates PointerEvent `pressure` variance ($\sigma^2 \le 0.005$ with pressure $0.0/0.5$ catches synthetic Puppeteer dummy clicks).
   - **UI Element Focus & Hover Dwell**: Detects $0\text{ms}$ pre-click hover times on transaction dispatch buttons.
4. **Impossible Traveler Geo-Velocity**: Trigonometric Haversine speed calculations detecting supersonic cross-border teleportation ($> 920\text{ km/h}$).
5. **Sliding-Window Rate Limiting**: Redis sorted-set sliding logs defending against automated carding and credential stuffing surges.
6. **Embedded Cyberpunk Control Room**: High-contrast, real-time telemetry HUD displaying live transaction feeds, dynamic MFA distributions, and biometric radars.

---

## 📁 Repository Structure

```
├── main.py                  # FastAPI gateway entry point, middleware & ledger routes
├── detector.py              # 5-Layer Anomaly detection engine (Geo, Advanced Biometrics, Telco)
├── mfa_orchestrator.py      # Dynamic MFA policy orchestrator (NIST Tiers, SIM defense)
├── redis_client.py          # Async Redis manager with sliding-window & fallback
├── templates/
│   └── dashboard.html       # Cyberpunk/Fintech Sentinel Control Room HUD
├── simulate_attacks.py      # Automated multi-vector attack generator script
├── Dockerfile               # Multi-stage container optimized for Google Cloud Run
├── requirements.txt         # Production Python dependencies
└── README.md                # System architecture and deployment guide
```

---

## 🛡️ API Endpoints

### `POST /v1/gateway/evaluate`
Direct evaluation API for upstream API Gateways (Apigee, Kong, Envoy). Returns composite risk score, factor breakdown, and dynamic MFA challenge specifications.

### `POST /v1/ledger/transfer`
Simulated core banking ledger endpoint intercepted by Aegis-X:
- **ALLOW (200)**: Releases funds transfer immediately.
- **STEP_UP_CHALLENGE (428)**: Dispatches dynamic MFA challenge (`challenge_id`, `protocol`, `instructions`).
- **BLOCK (403)**: Terminates transaction at the edge before ledger balance debit.

### `POST /v1/mfa/challenge/verify`
Validates client cryptographic proof (FIDO2 Passkey biometric assertion or HMAC nonce) and releases the pending ledger transfer receipt.

### `GET /v1/telemetry/stats`
Returns live metrics, p99 latency, and breakdown of MFA protocols triggered (FIDO2 vs Push vs Hardware vs SMS).

---

## ☁️ Google Cloud Run Deployment

Deploy with a single command:

```bash
gcloud run deploy aegis-x-sentinel \
    --source . \
    --platform managed \
    --region europe-west2 \
    --allow-unauthenticated \
    --set-env-vars "APP_ENV=production,PORT=8080" \
    --memory 512Mi \
    --cpu 1
```
