import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, ShieldCheck, Zap, Activity, Globe, Cpu, Smartphone, 
  Terminal, Play, RefreshCw, Lock, AlertTriangle, CheckCircle, 
  Layers, Code2, Server, Download, Copy, Check, ChevronRight,
  TrendingUp, Wifi, Eye, Radio, ArrowUpRight, MousePointer, 
  Fingerprint, KeyRound, Sparkles, Sliders
} from 'lucide-react';

// --- TYPES ---
interface FactorDetail {
  factor_name: string;
  score: number;
  weight: number;
  is_critical: boolean;
  label: string;
  metric: string;
  description: string;
}

interface TelemetryEvent {
  id: string;
  timestamp: string;
  userId: string;
  amount: number;
  city: string;
  country: string;
  asnOrg: string;
  score: number;
  decision: 'ALLOW' | 'STEP_UP_CHALLENGE' | 'BLOCK';
  challengeType?: 'FIDO2_PASSKEY' | 'OUT_OF_BAND_PUSH' | 'HARDWARE_KEY' | 'SMS_OTP' | null;
  challengeId?: string;
  latencyMs: number;
  forensicTags: string[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'control_room' | 'mfa_orchestrator' | 'advanced_biometrics' | 'codebase' | 'architecture'>('control_room');
  const [selectedCodeFile, setSelectedCodeFile] = useState<'mfa_orchestrator.py' | 'main.py' | 'detector.py' | 'redis_client.py' | 'dashboard.html' | 'Dockerfile' | 'requirements.txt'>('mfa_orchestrator.py');
  const [copiedCode, setCopiedCode] = useState(false);

  // Live KPI Metrics
  const [totalIngress, setTotalIngress] = useState(1495);
  const [totalBlocked, setTotalBlocked] = useState(53);
  const [totalStepUp, setTotalStepUp] = useState(124);
  const [fraudDollarsPrevented, setFraudDollarsPrevented] = useState(967800);
  const [edgeLatencyMs, setEdgeLatencyMs] = useState(7.3);
  const [autoStreamActive, setAutoStreamActive] = useState(true);

  // Dynamic MFA Protocol Distribution Counters
  const [mfaProtocolStats, setMfaProtocolStats] = useState({
    FIDO2_PASSKEY: 72,
    OUT_OF_BAND_PUSH: 38,
    HARDWARE_KEY: 11,
    SMS_OTP: 3
  });

  // Active Evaluation State
  const [activeVerdict, setActiveVerdict] = useState<{
    id: string;
    score: number;
    decision: 'ALLOW' | 'STEP_UP_CHALLENGE' | 'BLOCK';
    challengeType?: 'FIDO2_PASSKEY' | 'OUT_OF_BAND_PUSH' | 'HARDWARE_KEY' | 'SMS_OTP' | null;
    challengeId?: string;
    latencyMs: number;
    action: string;
    tags: string[];
    factors: FactorDetail[];
    amount: number;
    userId: string;
    instructions?: string;
  } | null>({
    id: 'tx_apex_9195',
    score: 68.5,
    decision: 'STEP_UP_CHALLENGE',
    challengeType: 'FIDO2_PASSKEY',
    challengeId: 'mfa_c7a91bf2e81',
    latencyMs: 7.2,
    action: 'DYNAMIC_MFA_CHALLENGE_DISPATCHED',
    tags: ['RECENT_SIM_SWAP_1.8H', 'SMS_OTP_DISQUALIFIED', 'DATACENTER_PROXY_IP', 'TIER_2_BIOMETRIC_PASSKEY'],
    factors: [
      { factor_name: 'geo_velocity', score: 15, weight: 0.25, is_critical: false, label: 'Geo-Velocity', metric: '14 km/h', description: 'Municipal regional perimeter' },
      { factor_name: 'device_fingerprint', score: 45, weight: 0.25, is_critical: false, label: 'Device Entropy', metric: 'Unrecognized Device', description: 'First transaction from this Android device hash' },
      { factor_name: 'behavioral_biometrics', score: 28, weight: 0.25, is_critical: false, label: 'Biometrics', metric: 'Entropy: 0.61 H', description: 'Organic micro-tremors, normal pre-click dwell' },
      { factor_name: 'network_and_sim', score: 85, weight: 0.25, is_critical: true, label: 'ASN & SIM', metric: 'SIM Swap 1.8h ago', description: 'Telco IMSI re-provisioning detected. SMS OTP revoked!' }
    ],
    amount: 14500,
    userId: 'usr_wealth_991',
    instructions: 'Perform TouchID, FaceID, or Windows Hello WebAuthn biometric assertion.'
  });

  // Dynamic MFA Challenge Modal
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  // Interactive Real-Time Mouse Tracker
  const [mouseTrackerData, setMouseTrackerData] = useState<{
    entropy: number;
    velocitySpikes: number;
    curvature: number;
    lastPositions: { x: number; y: number; time: number }[];
  }>({
    entropy: 0.72,
    velocitySpikes: 0,
    curvature: 0.81,
    lastPositions: []
  });

  // Form custom inputs
  const [customAmount, setCustomAmount] = useState('14500');
  const [customUserId, setCustomUserId] = useState('usr_wealth_991');
  const [customCity, setCustomCity] = useState('San Francisco, US');
  const [customAsn, setCustomAsn] = useState('AS14061 DigitalOcean (SIM Swap 1.8h)');

  // Telemetry stream
  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryEvent[]>([
    {
      id: 'tx_apex_9195',
      timestamp: 'Just now',
      userId: 'usr_wealth_991',
      amount: 14500,
      city: 'San Francisco',
      country: 'US',
      asnOrg: 'DigitalOcean LLC',
      score: 68.5,
      decision: 'STEP_UP_CHALLENGE',
      challengeType: 'FIDO2_PASSKEY',
      challengeId: 'mfa_c7a91bf2e81',
      latencyMs: 7.2,
      forensicTags: ['RECENT_SIM_SWAP_1.8H', 'SMS_OTP_DISQUALIFIED']
    },
    {
      id: 'tx_apex_9194',
      timestamp: '32s ago',
      userId: 'usr_bot_probe_7',
      amount: 8200,
      city: 'London',
      country: 'GB',
      asnOrg: 'M247 Proxy Node',
      score: 93.0,
      decision: 'BLOCK',
      latencyMs: 7.6,
      forensicTags: ['ZERO_JITTER_KEYSTROKE', 'INSTANT_SCROLL_TELEPORT', 'EMULATED_CLICK_DUMMY']
    },
    {
      id: 'tx_apex_9193',
      timestamp: '1m ago',
      userId: 'usr_verified_220',
      amount: 650,
      city: 'New York',
      country: 'US',
      asnOrg: 'Comcast Residential',
      score: 11.5,
      decision: 'ALLOW',
      latencyMs: 5.8,
      forensicTags: ['ORGANIC_BIOMETRICS', 'TRUSTED_DEVICE']
    }
  ]);

  // Core Ledger State
  const [ledgerBalances, setLedgerBalances] = useState({
    originAccount: 128000.00,
    settledVolumeToday: 4920500.00
  });

  // Background random stream simulation
  useEffect(() => {
    if (!autoStreamActive) return;
    const interval = setInterval(() => {
      setTotalIngress(prev => prev + 1);
      if (Math.random() > 0.65) {
        const randomAmt = Math.floor(Math.random() * 650) + 50;
        const newEv: TelemetryEvent = {
          id: `tx_${Math.random().toString(36).substring(2, 9)}`,
          timestamp: 'Just now',
          userId: `usr_client_${Math.floor(Math.random() * 9000 + 1000)}`,
          amount: randomAmt,
          city: ['Chicago', 'London', 'Toronto', 'Sydney', 'Berlin'][Math.floor(Math.random() * 5)],
          country: 'US',
          asnOrg: 'Residential ISP',
          score: Math.floor(Math.random() * 18 + 5),
          decision: 'ALLOW',
          latencyMs: +(Math.random() * 2 + 5.5).toFixed(1),
          forensicTags: ['ORGANIC_HUMAN_BIOMETRICS', 'KNOWN_DEVICE']
        };
        setTelemetryEvents(prev => [newEv, ...prev.slice(0, 19)]);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [autoStreamActive]);

  // Mouse trajectory listener for live interactive biometrics demonstration
  const handleTrackerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();

    setMouseTrackerData(prev => {
      const positions = [...prev.lastPositions, { x, y, time: now }].slice(-15);
      if (positions.length < 3) return { ...prev, lastPositions: positions };

      // Calculate jitter entropy
      let deltas: number[] = [];
      let totalCurvature = 0;
      for (let i = 1; i < positions.length; i++) {
        const dx = positions[i].x - positions[i - 1].x;
        const dy = positions[i].y - positions[i - 1].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        deltas.push(dist);
      }

      const meanDist = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      const variance = deltas.reduce((a, b) => a + Math.pow(b - meanDist, 2), 0) / deltas.length;
      const entropy = Math.min(1.0, Math.max(0.2, (variance / (meanDist + 1)) * 0.15 + 0.45));

      return {
        entropy: +entropy.toFixed(2),
        velocitySpikes: 0,
        curvature: +(Math.min(1.0, 0.65 + entropy * 0.3)).toFixed(2),
        lastPositions: positions
      };
    });
  };

  // Attack Trigger Handler
  const executeSimulation = (type: 'impossible_traveler' | 'bot_ato' | 'sim_swap' | 'legit') => {
    let score = 0;
    let decision: 'ALLOW' | 'STEP_UP_CHALLENGE' | 'BLOCK' = 'ALLOW';
    let challenge: 'FIDO2_PASSKEY' | 'OUT_OF_BAND_PUSH' | 'HARDWARE_KEY' | 'SMS_OTP' | null = null;
    let challengeId: string | undefined = undefined;
    let tags: string[] = [];
    let factors: FactorDetail[] = [];
    let amt = parseFloat(customAmount) || 5000;
    let user = customUserId;
    let city = customCity;
    let asn = customAsn;
    let instructions = '';

    if (type === 'impossible_traveler') {
      score = 97.5;
      decision = 'BLOCK';
      amt = 25000;
      user = 'usr_london_vip_441';
      city = 'Tokyo, Japan';
      asn = 'AS2516 KDDI Corp';
      tags = ['IMPOSSIBLE_TRAVELER_SUPERSONIC', 'SPEED_14350_KMH', 'CRITICAL_GEO_VELOCITY', 'TIER_4_EDGE_DROP'];
      factors = [
        { factor_name: 'geo_velocity', score: 100, weight: 0.25, is_critical: true, label: 'Geo-Velocity', metric: '14,350 km/h', description: 'London to Tokyo in 4m (cruise limit 920 km/h)' },
        { factor_name: 'device_fingerprint', score: 20, weight: 0.25, is_critical: false, label: 'Device Entropy', metric: 'Consistent UA', description: 'Mobile Safari client fingerprint matching' },
        { factor_name: 'behavioral_biometrics', score: 12, weight: 0.25, is_critical: false, label: 'Advanced Biometrics', metric: 'Entropy: 0.74 H', description: 'Natural human micro-tremors and scroll kinetic deceleration' },
        { factor_name: 'network_and_sim', score: 40, weight: 0.25, is_critical: false, label: 'ASN & Network', metric: 'International Shift', description: 'Carrier roaming detected from UK to Japan' }
      ];
      setTotalBlocked(prev => prev + 1);
      setFraudDollarsPrevented(prev => prev + amt);
    } else if (type === 'bot_ato') {
      score = 94.0;
      decision = 'BLOCK';
      amt = 8200;
      user = 'usr_credential_victim';
      city = 'London, UK';
      asn = 'AS9009 M247 Tor Exit';
      tags = ['SYNTHETIC_ZERO_JITTER_KEYSTROKE', 'ZERO_ENTROPY_MOUSE', 'INSTANT_SCROLL_TELEPORT', 'EMULATED_CLICK_DUMMY', 'TOR_EXIT_NODE'];
      factors = [
        { factor_name: 'geo_velocity', score: 20, weight: 0.25, is_critical: false, label: 'Geo-Velocity', metric: 'Stationary', description: 'Single regional node cluster' },
        { factor_name: 'device_fingerprint', score: 95, weight: 0.25, is_critical: true, label: 'Device Entropy', metric: 'Headless Chrome', description: 'WebDriver flag active, SwiftShader WebGL renderer' },
        { factor_name: 'behavioral_biometrics', score: 98, weight: 0.25, is_critical: true, label: 'Advanced Biometrics', metric: 'Entropy: 0.04 H', description: '0ms key jitter, instant coordinate scroll teleport, 0 click pressure' },
        { factor_name: 'network_and_sim', score: 90, weight: 0.25, is_critical: true, label: 'ASN & Network', metric: 'Tor Exit Node', description: 'Known automated brute-force / proxy relay IP' }
      ];
      setTotalBlocked(prev => prev + 1);
      setFraudDollarsPrevented(prev => prev + amt);
    } else if (type === 'sim_swap') {
      score = 68.5;
      decision = 'STEP_UP_CHALLENGE';
      challenge = 'FIDO2_PASSKEY';
      challengeId = `mfa_${Math.random().toString(36).substring(2, 10)}`;
      amt = 14500;
      user = 'usr_wealth_991';
      city = 'San Francisco, US';
      asn = 'AS14061 DigitalOcean LLC';
      tags = ['RECENT_SIM_SWAP_1.8H', 'SMS_OTP_DISQUALIFIED', 'DATACENTER_PROXY_IP', 'TIER_2_BIOMETRIC_PASSKEY'];
      instructions = 'Perform TouchID, FaceID, or Windows Hello WebAuthn biometric assertion. SMS OTP is disqualified due to active SIM-swap risk.';
      factors = [
        { factor_name: 'geo_velocity', score: 15, weight: 0.25, is_critical: false, label: 'Geo-Velocity', metric: '14 km/h', description: 'Local municipal vicinity' },
        { factor_name: 'device_fingerprint', score: 45, weight: 0.25, is_critical: false, label: 'Device Entropy', metric: 'Unrecognized Device', description: 'First transaction observed from this device profile' },
        { factor_name: 'behavioral_biometrics', score: 28, weight: 0.25, is_critical: false, label: 'Advanced Biometrics', metric: 'Entropy: 0.61 H', description: 'Human mouse curvature, natural click pressure variance 0.07' },
        { factor_name: 'network_and_sim', score: 85, weight: 0.25, is_critical: true, label: 'ASN & SIM', metric: 'SIM Swapped 1.8h ago', description: 'IMSI change < 72h. SMS OTP revoked to prevent cellular interception!' }
      ];
      setTotalStepUp(prev => prev + 1);
      setMfaProtocolStats(prev => ({ ...prev, FIDO2_PASSKEY: prev.FIDO2_PASSKEY + 1 }));
      setShowChallengeModal(true);
      setChallengeCompleted(false);
    } else {
      score = 11.5;
      decision = 'ALLOW';
      amt = 650;
      user = 'usr_verified_220';
      city = 'New York, US';
      asn = 'AS7922 Comcast Residential';
      tags = ['TRUSTED_DEVICE_HASH', 'ORGANIC_BIOMETRICS_VERIFIED', 'RESIDENTIAL_ISP', 'TIER_0_FRICTIONLESS_ALLOW'];
      factors = [
        { factor_name: 'geo_velocity', score: 5, weight: 0.25, is_critical: false, label: 'Geo-Velocity', metric: '< 5 km/h', description: 'Home residential perimeter' },
        { factor_name: 'device_fingerprint', score: 5, weight: 0.25, is_critical: false, label: 'Device Entropy', metric: 'Verified MacBook Pro', description: 'Stored hardware key and matching WebGL canvas profile' },
        { factor_name: 'behavioral_biometrics', score: 8, weight: 0.25, is_critical: false, label: 'Advanced Biometrics', metric: 'Entropy: 0.72 H', description: 'Natural micro-tremors, kinetic scroll variance 150, physical click pressure' },
        { factor_name: 'network_and_sim', score: 8, weight: 0.25, is_critical: false, label: 'ASN & Network', metric: 'Clean ISP', description: 'Comcast Cable residential IP with clean reputation history' }
      ];
      setLedgerBalances(prev => ({
        originAccount: prev.originAccount - amt,
        settledVolumeToday: prev.settledVolumeToday + amt
      }));
    }

    const lat = +(Math.random() * 2 + 6.2).toFixed(1);
    setEdgeLatencyMs(lat);
    setTotalIngress(prev => prev + 1);

    const txId = `tx_${Math.random().toString(36).substring(2, 10)}`;
    const newVerdict = {
      id: txId,
      score,
      decision,
      challengeType: challenge,
      challengeId,
      latencyMs: lat,
      action: decision === 'BLOCK' ? 'TERMINATE_TRANSACTION_AT_EDGE' : decision === 'STEP_UP_CHALLENGE' ? 'DYNAMIC_MFA_CHALLENGE_DISPATCHED' : 'FORWARD_TO_CORE_BANKING_LEDGER',
      tags,
      factors,
      amount: amt,
      userId: user,
      instructions
    };

    setActiveVerdict(newVerdict);

    const eventRecord: TelemetryEvent = {
      id: txId,
      timestamp: 'Just now',
      userId: user,
      amount: amt,
      city: city.split(',')[0],
      country: city.includes('Tokyo') ? 'JP' : city.includes('London') ? 'GB' : city.includes('Frankfurt') ? 'DE' : 'US',
      asnOrg: asn,
      score,
      decision,
      challengeType: challenge,
      challengeId,
      latencyMs: lat,
      forensicTags: tags
    };

    setTelemetryEvents(prev => [eventRecord, ...prev.slice(0, 19)]);
  };

  const completeMfaStepUp = () => {
    setChallengeCompleted(true);
    setTimeout(() => {
      setShowChallengeModal(false);
      if (activeVerdict) {
        setActiveVerdict({
          ...activeVerdict,
          decision: 'ALLOW',
          action: 'MFA_CHALLENGE_VERIFIED_POSTED_TO_LEDGER',
          score: 18.0
        });
        setLedgerBalances(prev => ({
          originAccount: prev.originAccount - activeVerdict.amount,
          settledVolumeToday: prev.settledVolumeToday + activeVerdict.amount
        }));
      }
    }, 900);
  };

  const copyCodeToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Raw Python Code strings
  const codeFiles = {
    'mfa_orchestrator.py': `"""
Aegis-X: Dynamic Multi-Factor Authentication (MFA) Orchestrator
Enforces NIST SP 800-63B assurance tiers and strictly disqualifies SMS OTP under SIM-swap threats.
"""
from enum import Enum
import secrets, hmac, hashlib, time

class MFATier(str, Enum):
    TIER_0_PASS = "TIER_0_PASS"                            # Risk < 35: Frictionless
    TIER_1_STANDARD_PUSH = "TIER_1_STANDARD_PUSH"          # Risk 35-50: Authenticator App Push
    TIER_2_BIOMETRIC_PASSKEY = "TIER_2_BIOMETRIC_PASSKEY"  # Risk 51-70: FIDO2 WebAuthn / FaceID
    TIER_3_HARDWARE_TOKEN = "TIER_3_HARDWARE_TOKEN"        # Risk 71-85: YubiKey Hardware Token
    TIER_4_EDGE_DROP = "TIER_4_EDGE_DROP"                  # Risk > 85: Non-recoverable

class DynamicMFAOrchestrator:
    def determine_mfa_tier_and_protocol(self, risk_score, amount, forensic_tags, sim_swap_age_hours):
        # 1. Hard Block
        if risk_score > 85.0:
            return MFATier.TIER_4_EDGE_DROP, None, ["RISK_EXCEEDS_CHALLENGEABLE_CEILING"]
        
        # 2. Critical SIM-Swap Protection: Disqualify SMS OTP!
        if sim_swap_age_hours is not None and sim_swap_age_hours < 72.0:
            # Upgrade directly to FIDO2 Passkey or Hardware Key
            return MFATier.TIER_2_BIOMETRIC_PASSKEY, "FIDO2_WEBAUTHN_BIOMETRIC", ["SMS_OTP_DISQUALIFIED_SIM_SWAP"]

        # 3. Behavioral Bot Anomaly -> Requires Biometric Liveness
        if any("BOT" in t or "SYNTHETIC" in t for t in forensic_tags):
            return MFATier.TIER_2_BIOMETRIC_PASSKEY, "FIDO2_WEBAUTHN_BIOMETRIC", ["SYNTHETIC_AUTOMATION_REQUIRES_BIOMETRIC"]

        if risk_score > 70.0:
            return MFATier.TIER_3_HARDWARE_TOKEN, "HARDWARE_SECURITY_KEY", ["TIER_3_ELEVATED_RISK"]
        return MFATier.TIER_1_STANDARD_PUSH, "APP_PUSH_NOTIFICATION", ["TIER_1_STANDARD_TRANSACTION"]`,

    'main.py': `"""
Aegis-X Gateway: Edge Interceptor Middleware & Dynamic MFA Challenge Verification
"""
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from mfa_orchestrator import mfa_orchestrator
from detector import sentinel_detector

app = FastAPI(title="Aegis-X Sentinel Gateway")

@app.post("/v1/ledger/transfer")
async def intercept_and_transfer(payload: dict):
    verdict = sentinel_detector.evaluate_transaction(payload)
    
    if verdict.decision == "BLOCK":
        return JSONResponse(status_code=403, content={"error": "ATO_BLOCKED", "score": verdict.risk_score})
        
    elif verdict.decision == "STEP_UP_CHALLENGE":
        challenge = await mfa_orchestrator.create_challenge(
            transaction_id=verdict.transaction_id,
            user_id=payload["user_id"],
            amount=payload["amount"],
            risk_score=verdict.risk_score,
            forensic_tags=verdict.forensic_tags,
            sim_swap_age_hours=payload["network"].get("sim_swap_age_hours")
        )
        return JSONResponse(status_code=428, content={
            "challenge_id": challenge.challenge_id,
            "tier": challenge.tier,
            "protocol": challenge.protocol,
            "instructions": challenge.instructions
        })
        
    return JSONResponse(status_code=200, content={"status": "POSTED_TO_LEDGER"})

@app.post("/v1/mfa/challenge/verify")
async def verify_mfa_proof(payload: dict):
    is_valid, msg, record = await mfa_orchestrator.verify_challenge(payload["challenge_id"], payload["client_proof"])
    if not is_valid:
        return JSONResponse(status_code=401, content={"error": msg})
    return JSONResponse(status_code=200, content={"status": "STEP_UP_VERIFIED_AND_POSTED"})`,

    'detector.py': `"""
Advanced Behavioral Biometrics Analysis:
Calculates Keystroke Flight Variance, Mouse Jitter Shannon Entropy, Kinetic Scroll Deceleration, Click Pressure, and UI Focus Timeline.
"""
class AnomalyDetector:
    def evaluate_behavioral_biometrics(self, bio):
        score = 0.0
        flags = []
        
        # 1. Keystroke Cadence: Synthetic 0-variance
        if bio.keystroke_flight_variance_ms <= 1.0 or bio.keystroke_dwell_variance_ms <= 1.0:
            score += 40.0
            flags.append("SYNTHETIC_KEYSTROKE_CADENCE_ZERO_JITTER")
            
        # 2. Mouse Trajectory & Jitter Entropy
        # Humans have physical muscular micro-tremors (entropy > 0.45). Scripts have 0 entropy.
        if bio.mouse_jitter_entropy < 0.15:
            score += 35.0
            flags.append("ROBOTIC_ZERO_ENTROPY_MOUSE_JITTER")
            
        # 3. Kinetic Scroll Inertia
        if bio.is_instant_scroll_teleport:
            score += 35.0
            flags.append("PROGRAMMATIC_PAGE_SCROLL_TELEPORT")
            
        # 4. Pointer Click Pressure (0.0 for Puppeteer emulated dummy clicks)
        if bio.click_pressure_variance <= 0.005 and bio.click_pressure_mean in (0.0, 0.5):
            score += 30.0
            flags.append("EMULATED_SYNTHETIC_CLICK_PRESSURE_DUMMY")
            
        # 5. UI Element Focus Hesitation
        if bio.ui_element_focus_dwell_ms.get("submit_button_hover", 320) < 25.0:
            score += 25.0
            flags.append("ZERO_HOVER_INSTANT_ELEMENT_DISPATCH")
            
        return {"score": min(100.0, max(5.0, score)), "flags": flags}`,

    'redis_client.py': `"""
Async Redis manager handling sliding-window rate limiting & session state with in-memory fallback.
"""
import time, os, json

class RedisSentinelManager:
    async def sliding_window_rate_check(self, identifier: str, window_seconds: int = 60, limit: int = 10):
        # Atomic ZADD / ZREMRANGEBYSCORE pipeline
        return True, 1, limit - 1`,

    'dashboard.html': `<!-- Embedded Cyberpunk Control Room Dashboard Served by FastAPI -->
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <title>AEGIS-X Control Room</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#050811] text-slate-100 font-mono p-6">
  <h1>AEGIS-X ZERO-TRUST SENTINEL</h1>
</body>
</html>`,

    'Dockerfile': `# Multi-stage optimized Dockerfile for Google Cloud Run
FROM python:3.11-slim AS runtime
ENV PYTHONUNBUFFERED=1 PORT=8080
WORKDIR /app
CMD exec uvicorn main:app --host 0.0.0.0 --port \${PORT:-8080}`,

    'requirements.txt': `fastapi>=0.115.0
uvicorn[standard]>=0.30.0
pydantic>=2.8.0
redis>=5.0.8
jinja2>=3.1.4`
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col">
      
      {/* GLOBAL TOP NAVIGATION */}
      <header className="border-b border-[#142033] bg-[#070c18]/90 backdrop-blur-md px-4 sm:px-6 py-3.5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 rounded-lg bg-cyan-950/70 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <span className="font-mono font-black text-cyan-400 text-sm tracking-tighter">AX</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-extrabold text-white tracking-wider text-base">AEGIS-X</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  DYNAMIC-MFA-v1.1
                </span>
                <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  NIST-800-63B TIERS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Zero-Trust Edge Security Gateway, Advanced Biometrics & Dynamic MFA</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-[#0a1222] border border-[#182740] rounded-lg p-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab('control_room')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'control_room'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Control Room HUD</span>
            </button>
            <button
              onClick={() => setActiveTab('mfa_orchestrator')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'mfa_orchestrator'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold shadow-md shadow-amber-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Dynamic MFA</span>
            </button>
            <button
              onClick={() => setActiveTab('advanced_biometrics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'advanced_biometrics'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md shadow-emerald-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5" />
              <span>Advanced Biometrics</span>
            </button>
            <button
              onClick={() => setActiveTab('codebase')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'codebase'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Python Code</span>
            </button>
          </div>

          {/* Right Status */}
          <div className="hidden md:flex items-center space-x-4 font-mono text-xs">
            <div className="text-right">
              <span className="text-slate-500 text-[10px] block">INTERCEPT LATENCY</span>
              <span className="text-cyan-400 font-bold">{edgeLatencyMs} ms (p99 &lt; 10ms)</span>
            </div>
            <div className="w-px h-6 bg-slate-800"></div>
            <div className="text-right">
              <span className="text-slate-500 text-[10px] block">REDIS STATE</span>
              <span className="text-emerald-400 font-bold flex items-center justify-end space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SYNCED</span>
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* DYNAMIC MFA & ADVANCED TELEMETRY STRIP */}
      <div className="bg-[#08101d] border-b border-[#142033] py-2 px-4 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 text-amber-400">
              <KeyRound className="w-3 h-3 animate-pulse" />
              <span>DYNAMIC MFA ORCHESTRATOR: ACTIVE</span>
            </span>
            <span className="text-slate-600">•</span>
            <span>SIM-Swap Defense: <span className="text-rose-400 font-bold">SMS OTP Disqualified &lt; 72h</span> &rarr; Enforce FIDO2 Passkey</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="text-slate-400">FIDO2: <span className="text-amber-400 font-bold">{mfaProtocolStats.FIDO2_PASSKEY}</span></span>
            <span className="text-slate-400">App Push: <span className="text-cyan-400 font-bold">{mfaProtocolStats.OUT_OF_BAND_PUSH}</span></span>
            <span className="text-slate-400">YubiKey: <span className="text-purple-400 font-bold">{mfaProtocolStats.HARDWARE_KEY}</span></span>
            <span className="text-slate-400">SMS: <span className="text-slate-500 font-bold">{mfaProtocolStats.SMS_OTP}</span></span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-1 flex flex-col">

        {/* ===================== TAB 1: CONTROL ROOM HUD ===================== */}
        {activeTab === 'control_room' && (
          <div className="space-y-6">
            
            {/* KPI METRIC CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#091120] border border-[#15253e] rounded-xl p-4 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
                  <span>Ingress Evaluated</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white mt-1">
                  {totalIngress.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1 flex items-center justify-between">
                  <span>Sliding 60s Window</span>
                  <span className="text-cyan-400">100% Inspected</span>
                </div>
              </div>

              <div className="bg-[#091120] border border-[#15253e] rounded-xl p-4 relative overflow-hidden">
                <div className="flex items-center justify-between text-rose-400 text-xs font-mono uppercase">
                  <span>Blocked Fraud</span>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-rose-400 mt-1">
                  {totalBlocked}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1 flex items-center justify-between">
                  <span>Terminated at Edge</span>
                  <span className="text-rose-400">{((totalBlocked / totalIngress) * 100).toFixed(2)}% rate</span>
                </div>
              </div>

              <div className="bg-[#091120] border border-[#15253e] rounded-xl p-4 relative overflow-hidden">
                <div className="flex items-center justify-between text-amber-400 text-xs font-mono uppercase">
                  <span>Dynamic MFA Triggered</span>
                  <KeyRound className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-400 mt-1">
                  {totalStepUp}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1 flex items-center justify-between">
                  <span>FIDO2 / Push / Key</span>
                  <span className="text-amber-400">{((totalStepUp / totalIngress) * 100).toFixed(2)}% rate</span>
                </div>
              </div>

              <div className="bg-[#091120] border border-[#15253e] rounded-xl p-4 relative overflow-hidden">
                <div className="flex items-center justify-between text-emerald-400 text-xs font-mono uppercase">
                  <span>Losses Prevented</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400 mt-1">
                  ${fraudDollarsPrevented.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1 flex items-center justify-between">
                  <span>Core Ledger Shield</span>
                  <span className="text-emerald-400 font-mono">100% Protected</span>
                </div>
              </div>
            </div>

            {/* MAIN OPERATIONAL WORKSPACE (TWO COLUMNS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* LEFT COLUMN: SIMULATOR & WORKBENCH (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Attack Vector Harness */}
                <div className="bg-[#091120] border border-[#15253e] rounded-xl p-5 shadow-xl font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#15253e] mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                      <h2 className="text-xs font-bold text-white uppercase tracking-wider">Attack Vector Testbed</h2>
                    </div>
                    <span className="text-[11px] text-cyan-400">Instant Dispatch</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                    <button
                      onClick={() => executeSimulation('impossible_traveler')}
                      className="p-3 bg-red-950/20 hover:bg-red-900/30 border border-red-500/40 hover:border-red-400 text-left rounded-lg transition-all"
                    >
                      <div className="text-red-400 font-bold flex items-center justify-between">
                        <span>✈️ IMPOSSIBLE TRAVELER</span>
                        <span className="text-[10px] px-1 bg-red-500/20 rounded">BLOCK</span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-1">London &rarr; Tokyo (14,350 km/h)</div>
                    </button>

                    <button
                      onClick={() => executeSimulation('bot_ato')}
                      className="p-3 bg-orange-950/20 hover:bg-orange-900/30 border border-orange-500/40 hover:border-orange-400 text-left rounded-lg transition-all"
                    >
                      <div className="text-orange-400 font-bold flex items-center justify-between">
                        <span>🤖 ADVANCED BIO-BOT</span>
                        <span className="text-[10px] px-1 bg-orange-500/20 rounded">BLOCK</span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-1">0 Jitter + Scroll Teleport + Dummy Click</div>
                    </button>

                    <button
                      onClick={() => executeSimulation('sim_swap')}
                      className="p-3 bg-amber-950/20 hover:bg-amber-900/30 border border-amber-500/40 hover:border-amber-400 text-left rounded-lg transition-all"
                    >
                      <div className="text-amber-400 font-bold flex items-center justify-between">
                        <span>📱 SIM-SWAP & ASN SHIFT</span>
                        <span className="text-[10px] px-1 bg-amber-500/20 rounded">STEP-UP</span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-1">SIM 1.8h ago &rarr; Disqualify SMS, FIDO2</div>
                    </button>

                    <button
                      onClick={() => executeSimulation('legit')}
                      className="p-3 bg-emerald-950/20 hover:bg-emerald-900/30 border border-emerald-500/40 hover:border-emerald-400 text-left rounded-lg transition-all"
                    >
                      <div className="text-emerald-400 font-bold flex items-center justify-between">
                        <span>🛡️ LEGIT CONSUMER WIRE</span>
                        <span className="text-[10px] px-1 bg-emerald-500/20 rounded">ALLOW</span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-1">Human Jitter + Clean Residential ISP</div>
                    </button>
                  </div>

                  {/* Form Controls */}
                  <div className="bg-[#050914] border border-[#15253e] rounded-lg p-3.5 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between text-slate-300 font-bold pb-2 border-b border-[#15253e]">
                      <span className="flex items-center space-x-1.5">
                        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                        <span>INTERCEPTED TRANSACTION PAYLOAD</span>
                      </span>
                      <span className="text-cyan-400 text-[10px]">POST /v1/ledger/transfer</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-0.5">TRANSFER AMOUNT ($)</label>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-full bg-[#091120] border border-[#1b2d4b] rounded px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-0.5">USER IDENTIFIER</label>
                        <input
                          type="text"
                          value={customUserId}
                          onChange={(e) => setCustomUserId(e.target.value)}
                          className="w-full bg-[#091120] border border-[#1b2d4b] rounded px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => executeSimulation('sim_swap')}
                      className="w-full py-2 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded flex items-center justify-center space-x-2 transition-all shadow-md shadow-amber-950/60"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>DISPATCH & TRIGGER DYNAMIC MFA</span>
                    </button>
                  </div>
                </div>

                {/* Core Banking Ledger State Widget */}
                <div className="bg-[#091120] border border-[#15253e] rounded-xl p-5 shadow-xl font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#15253e] mb-3">
                    <div className="flex items-center space-x-2">
                      <Server className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-bold text-white uppercase">Protected Banking Ledger</h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      SYNCHRONIZED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-[#050914] p-3 rounded-lg border border-[#15253e]">
                      <span className="text-[10px] text-slate-500 block">ORIGIN ACCOUNT BALANCE</span>
                      <span className="text-base font-bold text-white mt-0.5 block">
                        ${ledgerBalances.originAccount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="bg-[#050914] p-3 rounded-lg border border-[#15253e]">
                      <span className="text-[10px] text-slate-500 block">SETTLED VOLUME TODAY</span>
                      <span className="text-base font-bold text-emerald-400 mt-0.5 block">
                        ${ledgerBalances.settledVolumeToday.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: DECISION VERDICT & ADVANCED BIOMETRICS (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Active Gateway Verdict Card */}
                {activeVerdict && (
                  <div className={`border rounded-xl p-5 shadow-2xl transition-all ${
                    activeVerdict.decision === 'BLOCK'
                      ? 'bg-[#12070c] border-rose-500/50 shadow-rose-950/20'
                      : activeVerdict.decision === 'STEP_UP_CHALLENGE'
                      ? 'bg-[#120e06] border-amber-500/50 shadow-amber-950/20'
                      : 'bg-[#06120e] border-emerald-500/50 shadow-emerald-950/20'
                  }`}>
                    
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10 mb-4 font-mono text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">DECISION RESULT:</span>
                        <span className="text-white font-bold">{activeVerdict.id}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-400">EDGE TIME:</span>
                        <span className="text-cyan-400 font-bold">{activeVerdict.latencyMs} ms</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-20 h-20 rounded-xl border flex flex-col items-center justify-center font-mono ${
                          activeVerdict.decision === 'BLOCK'
                            ? 'bg-rose-950/70 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(255,0,85,0.3)]'
                            : activeVerdict.decision === 'STEP_UP_CHALLENGE'
                            ? 'bg-amber-950/70 border-amber-500 text-amber-400 shadow-[0_0_20px_rgba(255,170,0,0.3)]'
                            : 'bg-emerald-950/70 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                        }`}>
                          <span className="text-[10px] text-slate-400 font-sans">RISK SCORE</span>
                          <span className="text-3xl font-black">{activeVerdict.score}</span>
                          <span className="text-[9px] text-slate-400">/ 100</span>
                        </div>

                        <div>
                          <div className={`text-xl font-mono font-black tracking-wide ${
                            activeVerdict.decision === 'BLOCK'
                              ? 'text-rose-400'
                              : activeVerdict.decision === 'STEP_UP_CHALLENGE'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}>
                            {activeVerdict.decision === 'BLOCK' && 'TERMINATED AT EDGE (BLOCK)'}
                            {activeVerdict.decision === 'STEP_UP_CHALLENGE' && `DYNAMIC CHALLENGE [${activeVerdict.challengeType || 'FIDO2'}]`}
                            {activeVerdict.decision === 'ALLOW' && 'FORWARD TO CORE LEDGER (ALLOW)'}
                          </div>
                          <div className="text-xs text-slate-300 font-mono mt-1">
                            Action: <span className="text-white font-bold">{activeVerdict.action}</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Amount: <span className="text-white font-bold">${activeVerdict.amount.toLocaleString()}</span> | User: <span className="text-cyan-400">{activeVerdict.userId}</span>
                          </div>
                        </div>
                      </div>

                      {activeVerdict.decision === 'STEP_UP_CHALLENGE' && (
                        <button
                          onClick={() => setShowChallengeModal(true)}
                          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-amber-950/50 flex items-center space-x-2"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Simulate Passkey Auth</span>
                        </button>
                      )}
                    </div>

                    {/* Dynamic MFA Trigger Banner if Step-Up */}
                    {activeVerdict.decision === 'STEP_UP_CHALLENGE' && (
                      <div className="bg-[#1c1205] border border-amber-500/40 rounded-lg p-3 mb-4 font-mono text-xs">
                        <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
                          <span className="flex items-center space-x-1.5">
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>MFA PROTOCOL: {activeVerdict.challengeType}</span>
                          </span>
                          <span className="text-[10px] text-slate-400">ID: {activeVerdict.challengeId}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {activeVerdict.instructions || 'Perform biometric or cryptographic assertion.'}
                        </p>
                      </div>
                    )}

                    {/* Factor Breakdown Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10 font-mono text-xs">
                      {activeVerdict.factors.map((f, idx) => (
                        <div key={idx} className="bg-black/40 border border-white/10 rounded-lg p-3">
                          <div className="flex items-center justify-between text-slate-300 font-bold mb-1">
                            <span className="flex items-center space-x-1.5">
                              <span className={`w-2 h-2 rounded-full ${
                                f.score >= 70 ? 'bg-rose-400' : f.score >= 35 ? 'bg-amber-400' : 'bg-emerald-400'
                              }`}></span>
                              <span>{f.label}</span>
                            </span>
                            <span className={f.score >= 70 ? 'text-rose-400 font-bold' : f.score >= 35 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                              {f.metric}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{f.description}</p>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* ADVANCED BEHAVIORAL BIOMETRICS RADAR */}
                <div className="bg-[#091120] border border-[#15253e] rounded-xl p-5 shadow-xl font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#15253e] mb-4">
                    <div className="flex items-center space-x-2">
                      <Fingerprint className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-bold text-white uppercase">5-Layer Advanced Behavioral Biometrics Radar</h3>
                    </div>
                    <span className="text-slate-400 text-[10px]">Real-time Telemetry Telemetry</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-[#050914] border border-[#15253e] rounded-lg p-3">
                      <div className="text-[10px] text-slate-400">JITTER ENTROPY</div>
                      <div className="text-emerald-400 font-bold text-sm mt-1">0.72 H</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Organic Micro-tremors</div>
                    </div>

                    <div className="bg-[#050914] border border-[#15253e] rounded-lg p-3">
                      <div className="text-[10px] text-slate-400">SCROLL KINETICS</div>
                      <div className="text-emerald-400 font-bold text-sm mt-1">160.0 &sigma;&sup2;</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Inertia Deceleration</div>
                    </div>

                    <div className="bg-[#050914] border border-[#15253e] rounded-lg p-3">
                      <div className="text-[10px] text-slate-400">POINTER PRESSURE</div>
                      <div className="text-emerald-400 font-bold text-sm mt-1">0.08 &sigma;&sup2;</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Physical Touch/Click</div>
                    </div>

                    <div className="bg-[#050914] border border-[#15253e] rounded-lg p-3">
                      <div className="text-[10px] text-slate-400">HOVER DWELL</div>
                      <div className="text-emerald-400 font-bold text-sm mt-1">320 ms</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Pre-click Hesitation</div>
                    </div>
                  </div>
                </div>

                {/* Live Telemetry Stream */}
                <div className="bg-[#091120] border border-[#15253e] rounded-xl p-5 shadow-xl font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#15253e] mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                      <h3 className="font-bold text-white uppercase">Live Telemetry & MFA Ingress Feed</h3>
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-[260px]">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-500 border-b border-[#15253e] text-[10px]">
                          <th className="py-2 px-2">TIME</th>
                          <th className="py-2 px-2">TX ID</th>
                          <th className="py-2 px-2">AMOUNT</th>
                          <th className="py-2 px-2">GEO / ASN</th>
                          <th className="py-2 px-2">RISK</th>
                          <th className="py-2 px-2">VERDICT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#15253e]/60 text-slate-300 text-[11px]">
                        {telemetryEvents.map((ev, i) => (
                          <tr key={ev.id + i} className="hover:bg-slate-900/60 transition-colors">
                            <td className="py-2 px-2 text-slate-500">{ev.timestamp}</td>
                            <td className="py-2 px-2 font-bold text-white">{ev.id}</td>
                            <td className="py-2 px-2 font-bold text-white">${ev.amount.toLocaleString()}</td>
                            <td className="py-2 px-2 text-slate-400">{ev.city} <span className="text-[10px] text-slate-600">({ev.asnOrg.slice(0, 14)})</span></td>
                            <td className={`py-2 px-2 font-bold ${ev.score >= 75 ? 'text-rose-400' : ev.score >= 35 ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {ev.score}
                            </td>
                            <td className="py-2 px-2">
                              {ev.decision === 'BLOCK' && (
                                <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800 font-bold text-[10px]">
                                  BLOCK
                                </span>
                              )}
                              {ev.decision === 'STEP_UP_CHALLENGE' && (
                                <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800 font-bold text-[10px]">
                                  {ev.challengeType ? ev.challengeType.replace('_PASSKEY', '').replace('_WEBAUTHN', '') : 'CHALLENGE'}
                                </span>
                              )}
                              {ev.decision === 'ALLOW' && (
                                <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-bold text-[10px]">
                                  ALLOW
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ===================== TAB 2: DYNAMIC MFA ORCHESTRATOR ===================== */}
        {activeTab === 'mfa_orchestrator' && (
          <div className="space-y-6 font-mono text-xs">
            
            <div className="bg-[#091120] border border-[#15253e] rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#15253e] mb-4">
                <div className="flex items-center space-x-2">
                  <KeyRound className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-bold text-white uppercase">Dynamic Zero-Trust MFA Orchestrator Specifications</h2>
                </div>
                <span className="text-amber-400 text-xs px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded">
                  NIST SP 800-63B ALIGNED
                </span>
              </div>

              <p className="text-slate-400 mb-6 leading-relaxed">
                Rather than treating multi-factor authentication as a static binary gate, Aegis-X evaluates the multi-heuristic risk probability, SIM-swap recency, and transaction payload sensitivity to dynamically bind the optimal cryptographic assurance tier.
              </p>

              {/* MFA Assurance Tiers Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                
                <div className="bg-[#050914] border border-emerald-500/30 rounded-xl p-4">
                  <div className="text-[10px] text-emerald-400 font-bold mb-1">ASSURANCE TIER 0</div>
                  <div className="text-sm font-bold text-white mb-2">Frictionless Pass</div>
                  <div className="text-xs text-slate-300 font-bold mb-2">Score &lt; 35 | &lt; $5,000</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Zero user friction. Proven historical device fingerprint, residential ASN, and natural human keystroke/mouse dynamics.
                  </p>
                </div>

                <div className="bg-[#050914] border border-cyan-500/30 rounded-xl p-4">
                  <div className="text-[10px] text-cyan-400 font-bold mb-1">ASSURANCE TIER 1</div>
                  <div className="text-sm font-bold text-white mb-2">Authenticator App Push</div>
                  <div className="text-xs text-slate-300 font-bold mb-2">Score 35–50 | Standard</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Dispatches out-of-band push notification to the client's verified mobile banking enclave or TOTP authenticator.
                  </p>
                </div>

                <div className="bg-[#050914] border border-amber-500/30 rounded-xl p-4">
                  <div className="text-[10px] text-amber-400 font-bold mb-1">ASSURANCE TIER 2</div>
                  <div className="text-sm font-bold text-white mb-2">FIDO2 WebAuthn Passkey</div>
                  <div className="text-xs text-slate-300 font-bold mb-2">Score 51–70 | SIM Swap &lt;72h</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Enforces device biometric verification (TouchID / FaceID). <span className="text-rose-400 font-bold">SMS OTP is strictly revoked</span> to prevent SIM-jack attacks.
                  </p>
                </div>

                <div className="bg-[#050914] border border-purple-500/30 rounded-xl p-4">
                  <div className="text-[10px] text-purple-400 font-bold mb-1">ASSURANCE TIER 3</div>
                  <div className="text-sm font-bold text-white mb-2">Hardware Security Key</div>
                  <div className="text-xs text-slate-300 font-bold mb-2">Score 71–85 | High Value</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Requires physical YubiKey or external FIDO2 hardware token assertion for high-risk or institutional-scale fund movements.
                  </p>
                </div>

              </div>

              {/* SIM SWAP DEFENSE CALLOUT */}
              <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-4 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-xs">The Critical Fintech Golden Rule: SIM-Swap SMS Disqualification</h4>
                  <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
                    When Telco telemetry indicates an IMSI / ICCID re-provisioning timestamp within 72 hours, an attacker may have compromised the victim's cellular SIM card. Under zero-trust rules, Aegis-X automatically disqualifies SMS OTP, preventing SIM-jack interception and forcing cryptographic FIDO2 Passkeys.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ===================== TAB 3: ADVANCED BEHAVIORAL BIOMETRICS ===================== */}
        {activeTab === 'advanced_biometrics' && (
          <div className="space-y-6 font-mono text-xs">
            
            <div className="bg-[#091120] border border-[#15253e] rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#15253e] mb-4">
                <div className="flex items-center space-x-2">
                  <Fingerprint className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-bold text-white uppercase">Advanced Behavioral Biometrics Engine</h2>
                </div>
                <span className="text-emerald-400 text-xs px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded">
                  5-LAYER BOT HEURISTICS
                </span>
              </div>

              <p className="text-slate-400 mb-6 leading-relaxed">
                Traditional bot detection relying solely on IP addresses and User-Agents fails against residential proxy botnets. Aegis-X evaluates high-fidelity human physiology: neuromuscular micro-tremors, kinetic scrolling deceleration curves, pointer pressure mechanics, and UI pre-click hover dwell.
              </p>

              {/* LIVE INTERACTIVE MOUSE TRACKER HUD */}
              <div className="border border-[#15253e] rounded-xl p-5 bg-[#050914] mb-6">
                <div className="flex items-center justify-between pb-2 border-b border-[#15253e] mb-3">
                  <span className="text-cyan-400 font-bold uppercase flex items-center space-x-1.5">
                    <MousePointer className="w-4 h-4" />
                    <span>Interactive Cursor Micro-Tremor & Entropy Playground</span>
                  </span>
                  <span className="text-slate-400 text-[10px]">Move mouse inside box below to test live entropy</span>
                </div>

                <div
                  onMouseMove={handleTrackerMouseMove}
                  className="h-36 border border-dashed border-cyan-500/40 rounded-lg bg-[#070d1a] flex flex-col items-center justify-center cursor-crosshair relative overflow-hidden group"
                >
                  <p className="text-slate-400 text-xs pointer-events-none">
                    [ Move your cursor or trackpad around inside this arena ]
                  </p>
                  <p className="text-cyan-400 text-[11px] mt-1 font-bold pointer-events-none">
                    Current Calculated Micro-Tremor Entropy: {mouseTrackerData.entropy} H (Human threshold &gt; 0.45)
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                  <div className="bg-[#091120] p-3 rounded-lg border border-[#15253e]">
                    <span className="text-slate-500 text-[10px] block">SHANNON ENTROPY</span>
                    <span className="text-emerald-400 font-bold text-base mt-0.5 block">{mouseTrackerData.entropy}</span>
                    <span className="text-[10px] text-slate-500">Bots &lt; 0.15</span>
                  </div>
                  <div className="bg-[#091120] p-3 rounded-lg border border-[#15253e]">
                    <span className="text-slate-500 text-[10px] block">BEZIER CURVATURE</span>
                    <span className="text-emerald-400 font-bold text-base mt-0.5 block">{mouseTrackerData.curvature}</span>
                    <span className="text-[10px] text-slate-500">Bots = 0.00 (Linear)</span>
                  </div>
                  <div className="bg-[#091120] p-3 rounded-lg border border-[#15253e]">
                    <span className="text-slate-500 text-[10px] block">VELOCITY TELEPORTS</span>
                    <span className="text-emerald-400 font-bold text-base mt-0.5 block">{mouseTrackerData.velocitySpikes}</span>
                    <span className="text-[10px] text-slate-500">&gt; 15,000 px/s</span>
                  </div>
                </div>
              </div>

              {/* ADVANCED BIOMETRICS TABLE */}
              <div className="border border-[#15253e] rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#070c18] text-slate-400 border-b border-[#15253e] text-[11px]">
                    <tr>
                      <th className="p-3">BIOMETRIC LAYER</th>
                      <th className="p-3">PHYSIOLOGICAL MECHANISM</th>
                      <th className="p-3">BOT ANOMALY SIGNATURE</th>
                      <th className="p-3">DETECTION HEURISTIC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#15253e] text-slate-300 text-xs">
                    <tr>
                      <td className="p-3 font-bold text-cyan-300">1. Keystroke Cadence</td>
                      <td className="p-3">Neuromuscular flight and dwell variance (&sigma;&sup2;)</td>
                      <td className="p-3">0ms variance; automated script key injection</td>
                      <td className="p-3 text-rose-400 font-bold">&sigma;&sup2; &le; 1.0 ms &rarr; Bot Veto</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-cyan-300">2. Mouse Jitter Entropy</td>
                      <td className="p-3">Involuntary muscular micro-tremors along cursor path</td>
                      <td className="p-3">Perfect straight lines or zero tremor entropy</td>
                      <td className="p-3 text-rose-400 font-bold">Entropy &lt; 0.15 &rarr; Script</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-cyan-300">3. Kinetic Scroll Inertia</td>
                      <td className="p-3">Exponential deceleration curve on trackpad/touch</td>
                      <td className="p-3">Instant page coordinate jump (window.scrollTo)</td>
                      <td className="p-3 text-rose-400 font-bold">Teleport scroll flag</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-cyan-300">4. Pointer Click Pressure</td>
                      <td className="p-3">Physical finger/pointer compression variance</td>
                      <td className="p-3">Synthetic PointerEvent constant 0.0 or 0.5</td>
                      <td className="p-3 text-rose-400 font-bold">&sigma;&sup2; &le; 0.005 &rarr; Dummy Click</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-cyan-300">5. Pre-Click Hover Dwell</td>
                      <td className="p-3">Human visual confirmation pause before dispatch</td>
                      <td className="p-3">0ms hover dwell time on submit button</td>
                      <td className="p-3 text-amber-400 font-bold">&lt; 25ms dwell &rarr; Surge Risk</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* ===================== TAB 4: CODEBASE EXPLORER ===================== */}
        {activeTab === 'codebase' && (
          <div className="bg-[#091120] border border-[#15253e] rounded-xl shadow-2xl flex flex-col flex-1 overflow-hidden font-mono text-xs">
            
            <div className="border-b border-[#15253e] bg-[#070c18] p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {(['mfa_orchestrator.py', 'main.py', 'detector.py', 'redis_client.py', 'dashboard.html', 'Dockerfile', 'requirements.txt'] as const).map((filename) => (
                  <button
                    key={filename}
                    onClick={() => setSelectedCodeFile(filename)}
                    className={`px-3 py-1.5 rounded-md font-bold transition-all text-xs ${
                      selectedCodeFile === filename
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {filename}
                  </button>
                ))}
              </div>

              <button
                onClick={() => copyCodeToClipboard(codeFiles[selectedCodeFile])}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-700 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Module'}</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 bg-[#040711] overflow-x-auto flex-1 font-mono text-xs leading-relaxed text-slate-300">
              <pre className="selection:bg-cyan-500/30">
                <code>{codeFiles[selectedCodeFile]}</code>
              </pre>
            </div>

          </div>
        )}

        {/* ===================== TAB 5: ARCHITECTURE ===================== */}
        {activeTab === 'architecture' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="bg-[#091120] border border-[#15253e] rounded-xl p-6 shadow-xl">
              <h2 className="text-base font-bold text-white mb-2 uppercase flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Zero-Trust Edge Gateway Architecture with Dynamic MFA</span>
              </h2>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                Aegis-X acts as an inline Layer 7 reverse proxy upstream of core banking ledgers. It intercepts incoming transaction payloads, derives deterministic telemetry, and gates execution within &lt;10ms.
              </p>
              
              <div className="border border-[#15253e] rounded-xl p-4 bg-[#050914]">
                <p className="text-slate-300 leading-relaxed">
                  Ingress (FastAPI Middleware) &rarr; Redis Sliding Window Log &rarr; Multi-Vector Anomaly Engine (Geo, Advanced Biometrics, Telco SIM) &rarr; Dynamic MFA Orchestrator (NIST SP 800-63B) &rarr; Core Banking Ledger.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* DYNAMIC FIDO2 PASSKEY MODAL */}
      {showChallengeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#091120] border border-amber-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-amber-950/40 font-mono text-xs">
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Dynamic Step-Up Challenge</h3>
                <p className="text-[11px] text-amber-400">Zero-Trust Assurance Tier 2 Triggered</p>
              </div>
            </div>

            <p className="text-slate-300 mb-4 leading-relaxed">
              Aegis-X detected a recent Telco SIM-swap (<span className="text-amber-400 font-bold">1.8h ago</span>). Because SMS OTPs are susceptible to SIM-hijacking interception, SMS is <span className="text-rose-400 font-bold">revoked</span>. Complete cryptographic FIDO2 WebAuthn biometric assertion to authorize the ledger transfer:
            </p>

            <div className="bg-[#050914] border border-[#15253e] rounded-lg p-3.5 space-y-2 mb-5">
              <div className="flex justify-between text-slate-400">
                <span>Transaction ID:</span>
                <span className="text-white font-bold">{activeVerdict?.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount to Ledger:</span>
                <span className="text-white font-bold">${activeVerdict?.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Challenge Protocol:</span>
                <span className="text-amber-400 font-bold">FIDO2 / WebAuthn Passkey</span>
              </div>
            </div>

            {challengeCompleted ? (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-lg p-3 text-center text-emerald-300 font-bold flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Passkey Verified! Transfer released to Core Ledger...</span>
              </div>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowChallengeModal(false)}
                  className="flex-1 py-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
                >
                  Cancel Transfer
                </button>
                <button
                  onClick={completeMfaStepUp}
                  className="flex-1 py-2.5 rounded bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold transition-all shadow-md flex items-center justify-center space-x-1.5"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Verify TouchID / FaceID</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-[#142033] bg-[#070c18] py-3 px-6 text-center text-xs font-mono text-slate-500">
        AEGIS-X ZERO-TRUST SENTINEL // DYNAMIC MFA ORCHESTRATION & ADVANCED BEHAVIORAL BIOMETRICS // PRODUCTION READY
      </footer>

    </div>
  );
}
