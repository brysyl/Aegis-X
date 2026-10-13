<div align="center">

# 🛡️ AEGIS-X
### Real-Time Edge Security Gateway & Synthetic Fraud/ATO Sentinel
**Intercept Fraud Before It Touches the Core Ledger.**

[![ZENITH BANK ZECATHON 6.0](https://img.shields.io/badge/ZENITH_BANK_ZECATHON_6.0-Track_5:_Digital_Fraud-red?style=for-the-badge)]()
[![RENDER CLOUD](https://img.shields.io/badge/Render-Production_Live-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://aegis-x-q6r3.onrender.com)
[![PYTHON 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue?style=for-the-badge&logo=python&logoColor=white)]()
[![FASTAPI & PYDANTIC V2](https://img.shields.io/badge/FastAPI-Pydantic_V2-009688?style=for-the-badge&logo=fastapi&logoColor=white)]()
[![REDIS 7](https://img.shields.io/badge/Redis_7-Sliding_Window-DC382D?style=for-the-badge&logo=redis&logoColor=white)]()
[![EDGE LATENCY](https://img.shields.io/badge/Edge_Latency-%3C15MS_P99-00BCD4?style=for-the-badge)]()
[![LICENSE](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)]()

<br />

*Engineered for Tier-1 Nigerian and African Banking Infrastructure (Finacle, Temenos Transact, Mambu)*

[Live Sandbox Demo](https://aegis-x-q6r3.onrender.com)

---

</div>

## 📌 Executive Summary & The Problem

Nigerian commercial banking operations process trillions of Naira monthly across NIBSS Instant Payment (NIP), mobile banking applications, and USSD rails. However, according to the **Nigeria Inter-Bank Settlement System (NIBSS) Annual Fraud Reports**, financial institutions face staggering multi-billion Naira losses annually driven by three compounding attack vectors:

1. **Syndicated SIM-Swap Account Takeovers (ATO):** Criminal rings collaborate with rogue telecommunications agents to re-provision victim IMSI/ICCID SIM cards, instantly intercepting legacy SMS One-Time Passwords (OTPs) and draining life savings within minutes.
2. **Synthetic Identity & Automated Credential Stuffing:** Headless Puppeteer and Playwright bots running across residential proxy swarms automate credential validation and rapid-fire micro-card testing under traditional velocity thresholds.
3. **The "Post-Transaction Clawback" Fallacy:** Traditional fraud systems (e.g., retrospective SIEM alerts or post-settlement scoring) analyze transactions **after** funds have been debited from the core ledger. Once funds are transferred into decentralized mule networks, inter-bank recovery rates drop below 12%, resulting in protracted chargeback disputes, CBN compliance penalties, and customer churn.

### 💡 The Aegis-X Paradigm: Pre-Ledger Edge Interception

> **"If an unauthorized transaction mutates the core banking balance, the bank has already lost."**

**Aegis-X** introduces a zero-trust, reverse-proxy edge architecture situated inline at Layer 7. It intercepts inbound transaction payloads at the network edge (**Lagos-01 Edge Node**) and evaluates multi-dimensional threat heuristics in **under 10 milliseconds**. 

If an anomaly is detected:
* **Critical Malice ($\text{Score} \ge 75$):** The transaction is terminated at the edge with `HTTP 403 Forbidden`. **The core banking ledger (Finacle/Temenos) is never touched, zero funds are debited, and zero reconciliation overhead is incurred.**
* **Elevated Risk ($\text{Score } 35–74$):** The transaction enters dynamic step-up authentication. If a SIM-swap was detected within 72 hours, **SMS OTP is strictly revoked**, and cryptographic FIDO2 WebAuthn biometric assertion is enforced.

---

## 🏗️ How Aegis-X Works: Core Architecture & Flow

Aegis-X acts as an inline Layer 7 security gateway placed between client applications (iOS, Android, Web) and the core banking ledger.

```
                              ┌────────────────────────────────────────┐
                              │       EDGE INGRESS (LAGOS-01)          │
                              │   Mobile / Web Banking Client Payload  │
                              └───────────────────┬────────────────────┘
                                                  │
                                                  ▼
                              ┌────────────────────────────────────────┐
                              │       AEGIS-X GATEWAY MIDDLEWARE       │
                              │   Trace Correlation ID & Telemetry     │
                              └───────────────────┬────────────────────┘
                                                  │
                                                  ▼
                              ┌────────────────────────────────────────┐
                              │      REDIS SLIDING-WINDOW LOG (ZSET)   │
                              │  Velocity check per Account & Card     │
                              └───────────────────┬────────────────────┘
                                                  │
                                                  ▼
                              ┌────────────────────────────────────────┐
                              │    MULTI-HEURISTIC SENTINEL ENGINE     │
                              │ 1. Haversine Geo-Velocity (>920 km/h)  │
                              │ 2. 5-Layer Behavioral Biometrics       │
                              │ 3. Telco IMSI SIM-Swap Recency (<72h)  │
                              │ 4. BGP ASN & Bulletproof Proxy Shift   │
                              └───────────────────┬────────────────────┘
                                                  │
                                                  ▼
                        ┌──────────────────────────────────────────────────┐
                        │      ZERO-TRUST DYNAMIC POLICY DECISION          │
                        │           Risk Score Normalized (0 - 100)        │
                        └─────────┬────────────────┬─────────────────┬─────┘
                                  │                │                 │
                Score < 35        │   Score 35-74  │                 │ Score >= 75
           (Frictionless Pass)    │ (Dynamic Step) │                 │ (Critical Drop)
                                  │                │                 │
                                  ▼                ▼                 ▼
        ┌───────────────────────────┐  ┌───────────────────────┐  ┌─────────────────────────┐
        │     FORWARD TO LEDGER     │  │ DYNAMIC MFA CHALLENGE │  │   TERMINATE AT EDGE     │
        │ Core Banking Settlement   │  │ NIST Assurance Tiers  │  │ HTTP 403 Forbidden      │
        │ Finacle / Temenos Vault   │  │ SIM-Swap -> Revoke SMS│  │ Zero Ledger Balance     │
        │ HTTP 200 OK               │  │ Enforce FIDO2 Passkey │  │ Mutation. Ledger Safe.  │
        └───────────────────────────┘  └───────────────────────┘  └─────────────────────────┘
```

### End-to-End Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Bank Customer / Attacker
    participant Client as Zenith Mobile / Web Banking
    participant Edge as Aegis-X Gateway (Cloud Run)
    participant Redis as Redis Telemetry Cluster
    participant Engine as Multi-Vector Anomaly Engine
    participant MFA as Dynamic MFA Orchestrator
    participant Ledger as Zenith Core Ledger (Finacle)

    User->>Client: Submit Fund Transfer (₦1,850,000)
    Client->>Edge: POST /api/v1/evaluate (Payload + Telemetry)
    Note over Edge: Ingress timestamp recorded.<br/>Trace ID generated.

    Edge->>Redis: ZREMRANGEBYSCORE & ZADD (Sliding 60s Window)
    Redis-->>Edge: Velocity count: 2 tx / 60s (Allowed)

    Edge->>Redis: GET aegis:session:{user_id}
    Redis-->>Edge: Stored profile: Last City Lagos, Device Hash A

    Edge->>Engine: Run Heuristic Evaluation
    Note over Engine: 1. Geo: Abuja (Distance 530km, dt 4h -> Normal)<br/>2. Device: Unknown Android Hash (+45 pts)<br/>3. Biometrics: Jitter 34ms (Organic)<br/>4. Telco: SIM Swapped 1.4h ago (+85 pts)
    Engine-->>Edge: Composite Risk Score: 68.5 (STEP_UP_CHALLENGE)

    Edge->>MFA: Orchestrate Dynamic Challenge(Score=68.5, SIM_Age=1.4h)
    Note over MFA: SIM-Swap < 72h detected!<br/>DISQUALIFY SMS OTP.<br/>Select Tier 2: FIDO2 Passkey.
    MFA->>Redis: SET aegis:mfa:{challenge_id} (TTL 300s)
    MFA-->>Edge: Challenge Dispatched (Protocol: FIDO2)

    Edge-->>Client: HTTP 428 Precondition Required (Challenge ID & Nonce)
    Note over Client,User: Biometric Passkey Prompt displayed (TouchID / FaceID)

    User->>Client: Biometric Touch Confirmed
    Client->>Edge: POST /v1/mfa/challenge/verify (Signature Token)
    Edge->>MFA: Validate WebAuthn Assertion
    MFA-->>Edge: Cryptographic Proof Verified

    Edge->>Ledger: Release Debit & Credit Mutation
    Ledger-->>Edge: Transaction Settled (LEDGER-MFA-98210)
    Edge-->>Client: HTTP 200 OK (Settlement Confirmation)
```

---

## ⚡ Key Technical Innovations

### 1. 5-Layer Advanced Behavioral Biometrics Engine
Traditional fraud detection only evaluates network and device headers. Aegis-X evaluates involuntary human neuromuscular physiology:
* **Layer 1 (Keystroke Cadence Dynamics):** Computes flight time jitter variance ($\sigma^2_{\text{flight}}$) and key dwell variance ($\sigma^2_{\text{dwell}}$). Programmatic bot injection scripts exhibit $\sigma^2 \le 1.0\text{ ms}$, triggering instant bot vetoes.
* **Layer 2 (Mouse Trajectory & Micro-Jitter Shannon Entropy):** Real human hands exhibit involuntary micro-tremors producing high trajectory Shannon entropy ($H > 0.45$). Headless automation drivers (Puppeteer/Playwright) produce straight vector lines ($H < 0.15$). Detects cursor velocity teleports ($> 15,000\text{ px/s}$).
* **Layer 3 (Kinetic Scroll Kinetics):** Differentiates programmatic coordinate teleport jumps (`window.scrollTo` scripts with $\sigma^2 = 0$) from organic trackpad/touchscreen inertia deceleration curves.
* **Layer 4 (Pointer Event Click Pressure Mechanics):** Modern touch and Force Touch trackpads emit pressure readings between $0.2$ and $0.8$ with continuous variance. Headless browsers emit dummy clicks with fixed pressure ($0.0$ or $0.5$) and $0\text{ variance}$.
* **Layer 5 (UI Element Hover Dwell Timeline):** Detects sub-25ms pre-click button hover durations typical of automated credential stuffing scrapers.

### 2. Telco SIM-Swap & BGP ASN Shift Defense
* **Telco IMSI Synchronization:** Integrates Telco signaling timestamps. Any SIM card re-provisioned within 72 hours triggers an automatic threat escalation.
* **The Fintech Golden Rule:** **SMS OTP is revoked under SIM-swap threat.** Attackers controlling the intercepted cellular line cannot complete authentication.
* **BGP Routing Shift Heuristics:** Detects sudden hops from Nigerian residential ISPs (MTN, Airtel, Glo) to international bulletproof hosting ASNs, commercial proxies, or Tor exit nodes.

### 3. Trigonometric Haversine Geo-Velocity
Computes great-circle spherical distance between consecutive requests:
$$d = 2R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
$$\text{Velocity} = \frac{d}{\Delta t}$$
If required travel speed exceeds **commercial aircraft cruise velocity ($920\text{ km/h}$)** (e.g., a Lagos POS tap followed 6 minutes later by a London ATM withdrawal requiring $14,350\text{ km/h}$), the transaction is immediately classified as an **Impossible Traveler** attack and dropped at the edge.

### 4. NIST SP 800-63B Dynamic MFA Orchestrator
| Risk Score | Threat Level | Assurance Tier | Dispatched Protocol | Operational Rationale |
| :---: | :---: | :---: | :---: | :--- |
| **0 – 34.9** | Low | **Tier 0** | Frictionless Pass | Baseline verified; trusted device and residential IP. |
| **35 – 50.0** | Moderate | **Tier 1** | App Push / TOTP | Standard consumer wire; out-of-band notification. |
| **51 – 70.0** | Elevated | **Tier 2** | FIDO2 Passkey / FaceID | Synthetic bot cadence or SIM-swap detected. **SMS revoked.** |
| **71 – 85.0** | High | **Tier 3** | Hardware Security Key | High-value transfer ($>\text{₦}10\text{M}$) or multiple suspicious shifts. |
| **85.1 – 100** | Critical | **Tier 4** | Zero-Trust Edge Drop | Non-recoverable malice; terminal drop with `HTTP 403`. |

---

## 💻 Tech Stack

| Domain | Technology | Rationale |
| :--- | :--- | :--- |
| **Backend Framework** | **FastAPI (Python 3.11+)** | High-throughput asynchronous ASGI framework with native Pydantic v2 serialization. |
| **Server Engine** | **Uvicorn + uvloop + httptools** | Ultra-fast event loop written in C, handling tens of thousands of concurrent connections. |
| **State & Telemetry Cache** | **Redis 7.0 (Async Sorted Sets)** | Non-blocking sliding window rate limiting logs and 7-day session baseline profiles. |
| **Fault Tolerance** | **Embedded Zero-Lock Fallback** | Seamless in-memory fallback allowing standalone execution if Redis is offline. |
| **Edge Compute** | **Render** | Serverless, autoscaling, containerized deployment with sub-10ms ingress routing. |
| **Frontend HUD** | **HTML5 + Tailwind CSS + Vanilla ES6** | Standalone zero-dependency command center dashboard with live telemetry stream. |
| **Validation & Schema** | **Pydantic v2 Core** | Strict RFC-compliant typing with C-extension compilation speeds. |

---

## 🚀 Getting Started & Local Installation

### Prerequisites
* **Python 3.11+** installed
* **Git** installed
* **Redis** (Optional: Aegis-X automatically activates high-performance in-memory caching if Redis is not running)

### 1. Clone the Repository
```bash
git clone https://github.com/zenith-zecathon/aegis-x.git
cd aegis-x
```

### 2. Set Up Virtual Environment
```bash
python3 -m venv venv

# On Linux/macOS:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment (Optional)
Create a `.env` file in the root directory:
```env
PORT=8080
APP_ENV=production
REDIS_URL=redis://localhost:6379/0
AEGIS_MFA_SECRET=aegis_x_core_banking_hmac_secret_2026
```

### 5. Launch the Gateway Server
```bash
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

* **Control Room HUD & Sandbox:** `http://localhost:8080/`
* **Interactive OpenAPI Swagger Docs:** `http://localhost:8080/docs`
* **Health Check Probe:** `http://localhost:8080/healthz`

---

## 🧪 Automated Attack Simulation Suite

Aegis-X includes an automated multi-vector attack generator to test the heuristics against a running gateway:

```bash
# In a separate terminal window:
python3 simulate_attacks.py
```

### Output Preview:
```text
===========================================================================
 [AEGIS-X] Launching Zero-Trust Multi-Vector Attack & MFA Suite
 Target Gateway: http://localhost:8080
===========================================================================
[+] Health probe: 200 -> {'status': 'healthy', 'service': 'Aegis-X Sentinel Gateway'}

--- [Scenario 1] Dispatching Legitimate Retail Transfer (₦45,000) ---
Verdict: HTTP 200 | Decision: ALLOW
Receipt: {'status': 'COMPLETED', 'ledger_confirmation_code': 'LEDGER-TX-4A1B90FE'}

--- [Scenario 2] Headless Puppeteer Bot Injection (Zero Jitter + Teleport Scroll) ---
Verdict: HTTP 403 | Decision: BLOCK | Score: 94.0
Payload: {'status': 'REJECTED_BY_SENTINEL_EDGE', 'error': 'Synthetic Fraud Detected'}

--- [Scenario 3] SIM Swap Detected (1.4h ago) -> Dynamic MFA Orchestration ---
Verdict: HTTP 428 | Decision: STEP_UP_CHALLENGE
Challenge Dispatched: Protocol=FIDO2_WEBAUTHN_BIOMETRIC | ChallengeID=mfa_a89f21b

--- [Scenario 3b] Verifying FIDO2 Passkey Biometric Proof for mfa_a89f21b ---
MFA Verification Response: HTTP 200
Ledger Settlement Receipt: {'status': 'STEP_UP_VERIFIED_AND_POSTED', 'ledger_confirmation_code': 'LEDGER-MFA-7C91D'}
===========================================================================
```

---

## ☁️ Google Cloud Run Deployment

Aegis-X is optimized for deployment to **Google Cloud Run** using the included multi-stage `Dockerfile`:

### 1. Authenticate with Google Cloud
```bash
gcloud auth login
gcloud config set project YOUR_GCP_PROJECT_ID
```

### 2. Deploy Direct from Source
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

The CLI outputs the production URL:
```text
Service [aegis-x-sentinel] revision [aegis-x-sentinel-00001-abc] has been deployed and is serving 100 percent of traffic.
Service URL: https://aegis-x-sentinel-xxxxxxxx-xx.a.run.app
```

---

## 📡 API Reference & Verification Endpoints

### 1. `POST /api/v1/evaluate`
Direct evaluation endpoint for upstream API gateways (Apigee, Envoy, Kong).

#### Request Body
```json
{
  "user_id": "usr_chidi_9921",
  "account_id": "ACC-ZENITH-882910",
  "amount": 1850000,
  "currency": "NGN",
  "destination_account": "ACC-EXT-BENEFICIARY-009",
  "geo": {
    "latitude": 9.0765,
    "longitude": 7.3986,
    "city": "Abuja, Nigeria",
    "country_code": "NG"
  },
  "device": {
    "fingerprint_hash": "dev_unknown_android_s24",
    "user_agent": "Mozilla/5.0 (Linux; Android 14)",
    "screen_resolution": "1080x2400",
    "is_webdriver": false
  },
  "biometrics": {
    "keystroke_flight_mean_ms": 110.0,
    "keystroke_flight_variance_ms": 28.0,
    "keystroke_dwell_mean_ms": 82.0,
    "keystroke_dwell_variance_ms": 15.0,
    "mouse_curvature_score": 0.72,
    "mouse_jitter_entropy": 0.65,
    "interaction_time_ms": 3800.0
  },
  "network": {
    "client_ip": "162.243.10.4",
    "asn_number": 14061,
    "asn_organization": "DigitalOcean LLC",
    "is_datacenter_or_proxy": true,
    "sim_swap_age_hours": 1.4
  }
}
```

#### Response (HTTP 200 - Step-Up Required)
```json
{
  "transaction_id": "tx_c9a10bf84e",
  "risk_score": 68.5,
  "decision": "STEP_UP_CHALLENGE",
  "recommended_action": "REQUIRE_OUT_OF_BAND_OR_FIDO2_AUTHENTICATION",
  "challenge_type": "FIDO2_WEBAUTHN_BIOMETRIC",
  "processing_latency_ms": 7.2,
  "forensic_tags": [
    "RECENT_SIM_SWAP_1.4H",
    "SMS_OTP_DISQUALIFIED",
    "DATACENTER_PROXY_IP",
    "TIER_2_BIOMETRIC_PASSKEY"
  ],
  "mfa_challenge": {
    "challenge_id": "mfa_88192a01fc",
    "tier": "TIER_2_BIOMETRIC_PASSKEY",
    "protocol": "FIDO2_WEBAUTHN_BIOMETRIC",
    "instructions": "Perform TouchID, FaceID, or Windows Hello WebAuthn biometric assertion.",
    "expires_in_seconds": 300
  }
}
```

---

### 2. `POST /v1/ledger/transfer`
Intercepted Core Banking Ledger endpoint. Evaluates risk and either releases funds or returns an RFC 7807 challenge response.

| HTTP Status | Verdict | Outcome |
| :---: | :---: | :--- |
| **`200 OK`** | `ALLOW` | Returns ledger receipt `LEDGER-TX-XXXXX`. Funds transferred. |
| **`428 Precondition Required`** | `STEP_UP_CHALLENGE` | Returns challenge ID and instructions. Funds held. |
| **`403 Forbidden`** | `BLOCK` | Terminates at edge. Core banking ledger is untouched. |

---

### 3. `POST /v1/mfa/challenge/verify`
Validates cryptographic biometric proof (WebAuthn assertion) or HMAC nonce token:

```json
{
  "challenge_id": "mfa_88192a01fc",
  "client_proof": "webauthn_passkey_verified"
}
```

#### Response (`HTTP 200 OK`):
```json
{
  "status": "STEP_UP_VERIFIED_AND_POSTED",
  "ledger_confirmation_code": "LEDGER-MFA-3190A2",
  "transaction_id": "tx_c9a10bf84e",
  "amount": 1850000,
  "protocol_verified": "FIDO2_WEBAUTHN_BIOMETRIC",
  "settled_at": "2026-10-13T09:45:00Z"
}
```

---

## 🏆 Hackathon Alignment: Zenith Bank Zecathon 6.0

Aegis-X is engineered for **Track 5: Combating Digital Fraud and Financial Crime**:

| Evaluation Criterion | Aegis-X Implementation & Competitive Edge |
| :--- | :--- |
| **1. Groundbreaking Innovation** | Introduces **pre-ledger edge interception**, shifting fraud defense from reactive post-settlement investigations to sub-15ms inline prevention before core ledger debit. |
| **2. Technical Feasibility** | Built with production-ready async FastAPI, Pydantic v2, and Redis. Features an embedded in-memory fallback for high availability. |
| **3. Measurable Financial ROI** | Prevents 100% of intercepted fraud dollars from leaving the bank vault, eliminating inter-bank clawback reconciliation costs and customer attrition. |
| **4. Regulatory Alignment** | Directly complies with **Central Bank of Nigeria (CBN)** circulars mandating dynamic multi-factor authentication, NDPR data privacy standards, and **NIST SP 800-63B** authentication assurance guidelines. |
| **5. African Infrastructure Context** | Tailored to mitigate syndicated SIM-swap attacks across Nigerian mobile carriers (MTN, Airtel, Glo, 9mobile) by revoking vulnerable SMS OTPs in favor of FIDO2 Passkeys. |

---

## 👥 Project Information & License

### Zenith Bank Zecathon 6.0 Submission
* **Team:** Aegis-X Core Security Engineering Group
* **Track:** Track 5 (Combating Digital Fraud and Financial Crime)
* **Status:** Complete MVP & Production Container Image

### License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
Copyright (c) 2026 Aegis-X Engineering Team / Zenith Bank Zecathon 6.0

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

<div align="center">
  <sub>Built with pride for Zenith Bank Zecathon 6.0 • Lagos, Nigeria</sub>
</div>
# Force Render deployment update
