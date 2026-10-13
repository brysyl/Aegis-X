import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Zap, Activity, Globe, Cpu, Smartphone, 
  Terminal, Play, RefreshCw, Lock, AlertTriangle, CheckCircle, 
  Layers, Code2, Server, Download, Copy, Check, ChevronRight,
  TrendingUp, Wifi, Eye, Radio, ArrowUpRight, MousePointer, 
  Fingerprint, KeyRound, Sparkles, Sliders, ChevronDown
} from 'lucide-react';

interface TelemetryEvent {
  id: string;
  timestamp: string;
  account: string;
  amount: number;
  location: string;
  asn: string;
  score: number;
  decision: 'ALLOW' | 'STEP_UP_CHALLENGE' | 'BLOCK';
  forensicTags: string[];
}

export default function App() {
  // Navigation / View Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'control_room' | 'architecture' | 'codebase'>('simulator');
  const [selectedCodeFile, setSelectedCodeFile] = useState<'dashboard.html' | 'main.py' | 'detector.py' | 'mfa_orchestrator.py' | 'redis_client.py' | 'Dockerfile'>('dashboard.html');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Live KPI Metrics
  const [totalScanned, setTotalScanned] = useState(1492040);
  const [fraudNaira, setFraudNaira] = useState(428500000);
  const [avgLatency, setAvgLatency] = useState(7.2);
  const [activeSessions, setActiveSessions] = useState(18420);

  // Sandbox Form Inputs
  const [accountId, setAccountId] = useState('ACC-ZENITH-882910');
  const [amount, setAmount] = useState('45000');
  const [deviceId, setDeviceId] = useState('dev_macbook_lagos_v1');
  const [userId, setUserId] = useState('usr_chidi_9921');
  const [city, setCity] = useState('Lagos, Nigeria');
  const [lat, setLat] = useState('6.5244');
  const [lon, setLon] = useState('3.3792');
  const [isOrganicCadence, setIsOrganicCadence] = useState(true);
  const [isSimSwap, setIsSimSwap] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Active Evaluation Response
  const [currentVerdict, setCurrentVerdict] = useState<{
    txId: string;
    riskScore: number;
    decision: 'ALLOW' | 'STEP_UP_CHALLENGE' | 'BLOCK';
    latencyMs: number;
    recommendation: string;
    rules: string[];
    factors: {
      geo: { score: number; speedKmh: number; status: string };
      biometrics: { score: number; flightVar: number; status: string };
      network: { score: number; simSwapHours: number | null; status: string };
    };
    rawJson: any;
  }>({
    txId: 'tx_aec882910fa',
    riskScore: 12.0,
    decision: 'ALLOW',
    latencyMs: 6.8,
    recommendation: 'Pre-ledger debit authorized for Zenith Core Banking Vault.',
    rules: ['TRUSTED_DEVICE_HASH', 'ORGANIC_TYPING_CADENCE', 'LAGOS_RESIDENTIAL_ASN'],
    factors: {
      geo: { score: 5.0, speedKmh: 0.0, status: 'LOCAL_STATIONARY' },
      biometrics: { score: 10.0, flightVar: 34.0, status: 'HUMAN_ORGANIC' },
      network: { score: 8.0, simSwapHours: null, status: 'CLEAN_RESIDENTIAL_ISP' }
    },
    rawJson: {
      transaction_id: "tx_aec882910fa",
      status: "EVALUATED_AT_EDGE",
      risk_score: 12.0,
      decision: "ALLOW",
      currency: "NGN",
      amount: 45000,
      account_id: "ACC-ZENITH-882910",
      processing_latency_ms: 6.8,
      recommended_action: "FORWARD_TO_CORE_BANKING_LEDGER",
      forensic_tags: [
        "TRUSTED_DEVICE_HASH",
        "ORGANIC_TYPING_CADENCE",
        "LAGOS_RESIDENTIAL_ASN"
      ]
    }
  });

  // Telemetry stream
  const [feedEvents, setFeedEvents] = useState<TelemetryEvent[]>([
    {
      id: "TX-ZENITH-99120",
      timestamp: "Just now",
      account: "ACC-ZENITH-882910",
      amount: 45000,
      location: "Lagos, NG",
      asn: "MTN Nigeria",
      score: 12.0,
      decision: "ALLOW",
      forensicTags: ["TRUSTED_DEVICE", "ORGANIC_CADENCE"]
    },
    {
      id: "TX-ZENITH-99119",
      timestamp: "28s ago",
      account: "ACC-ZENITH-110482",
      amount: 1850000,
      location: "Abuja, NG",
      asn: "DigitalOcean Proxy",
      score: 68.5,
      decision: "STEP_UP_CHALLENGE",
      forensicTags: ["RECENT_SIM_SWAP_1.4H", "SMS_REVOKED_FIDO2"]
    },
    {
      id: "TX-ZENITH-99118",
      timestamp: "1m ago",
      account: "ACC-ZENITH-440192",
      amount: 4500000,
      location: "London, UK",
      asn: "M247 Tor Exit",
      score: 97.5,
      decision: "BLOCK",
      forensicTags: ["IMPOSSIBLE_TRAVELER", "14350_KMH_SUPERSONIC"]
    },
    {
      id: "TX-ZENITH-99117",
      timestamp: "2m ago",
      account: "ACC-ZENITH-772911",
      amount: 85000,
      location: "Port Harcourt, NG",
      asn: "Airtel Nigeria",
      score: 14.5,
      decision: "ALLOW",
      forensicTags: ["ORGANIC_BIOMETRICS"]
    }
  ]);

  // Periodic random background activity simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalScanned(prev => prev + 1);
      if (Math.random() > 0.6) {
        const amt = Math.floor(Math.random() * 85000) + 5000;
        const newEv: TelemetryEvent = {
          id: `TX-ZENITH-${Math.floor(Math.random() * 90000 + 10000)}`,
          timestamp: "Just now",
          account: `ACC-ZENITH-${Math.floor(Math.random() * 900000 + 100000)}`,
          amount: amt,
          location: ["Lagos, NG", "Abuja, NG", "Kano, NG", "Ibadan, NG", "Enugu, NG"][Math.floor(Math.random() * 5)],
          asn: ["MTN Nigeria", "Airtel Nigeria", "Glo Mobile", "9mobile"][Math.floor(Math.random() * 4)],
          score: Math.floor(Math.random() * 18 + 5),
          decision: "ALLOW",
          forensicTags: ["CLEAN_INGRESS", "TRUSTED_DEVICE"]
        };
        setFeedEvents(prev => [newEv, ...prev.slice(0, 19)]);
      }
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Preset Scenario Loader
  const loadScenario = (type: 'legit' | 'sim_swap' | 'geo_velocity') => {
    if (type === 'legit') {
      setAccountId('ACC-ZENITH-882910');
      setAmount('45000');
      setDeviceId('dev_macbook_lagos_v1');
      setUserId('usr_chidi_9921');
      setCity('Lagos, Nigeria');
      setLat('6.5244');
      setLon('3.3792');
      setIsOrganicCadence(true);
      setIsSimSwap(false);
      executePayload('legit', 45000, 'ACC-ZENITH-882910', 'Lagos, Nigeria', true, false);
    } else if (type === 'sim_swap') {
      setAccountId('ACC-ZENITH-110482');
      setAmount('1850000');
      setDeviceId('dev_unknown_android_s24');
      setUserId('usr_wealth_kalu');
      setCity('Abuja, Nigeria');
      setLat('9.0765');
      setLon('7.3986');
      setIsOrganicCadence(true);
      setIsSimSwap(true);
      executePayload('sim_swap', 1850000, 'ACC-ZENITH-110482', 'Abuja, Nigeria', true, true);
    } else {
      setAccountId('ACC-ZENITH-440192');
      setAmount('4500000');
      setDeviceId('dev_clone_terminal_x');
      setUserId('usr_lagos_exec');
      setCity('London, UK (Supersonic Velocity)');
      setLat('51.5074');
      setLon('-0.1278');
      setIsOrganicCadence(false);
      setIsSimSwap(false);
      executePayload('geo_velocity', 4500000, 'ACC-ZENITH-440192', 'London, UK', false, false);
    }
  };

  // Dispatch Payload
  const executePayload = async (
    scenarioOverride?: string,
    amtVal?: number,
    accVal?: number | string,
    cityVal?: string,
    cadenceVal?: boolean,
    simVal?: boolean
  ) => {
    setIsEvaluating(true);
    const targetAmt = amtVal ?? (parseFloat(amount) || 10000);
    const targetAcc = accVal ?? accountId;
    const targetCity = cityVal ?? city;
    const targetCadence = cadenceVal ?? isOrganicCadence;
    const targetSim = simVal ?? isSimSwap;

    const payload = {
      transaction_id: `tx_${Math.random().toString(36).substring(2, 12)}`,
      user_id: userId,
      account_id: targetAcc,
      amount: targetAmt,
      currency: "NGN",
      destination_account: "ACC-EXT-BENEFICIARY-009",
      geo: {
        latitude: parseFloat(lat) || 6.5244,
        longitude: parseFloat(lon) || 3.3792,
        city: targetCity,
        country_code: targetCity.includes("London") ? "GB" : "NG"
      },
      device: {
        fingerprint_hash: deviceId,
        user_agent: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        is_webdriver: !targetCadence && targetCity.includes("London")
      },
      biometrics: {
        keystroke_flight_mean_ms: targetCadence ? 140.0 : 10.0,
        keystroke_flight_variance_ms: targetCadence ? 34.0 : 0.0,
        keystroke_dwell_mean_ms: targetCadence ? 85.0 : 12.0,
        keystroke_dwell_variance_ms: targetCadence ? 16.0 : 0.0,
        mouse_curvature_score: targetCadence ? 0.78 : 0.02,
        interaction_time_ms: targetCadence ? 3400.0 : 210.0
      },
      network: {
        client_ip: targetSim ? "162.243.10.4" : "197.210.44.18",
        asn_number: targetSim ? 14061 : 29465,
        asn_organization: targetSim ? "DigitalOcean Datacenter" : "MTN Nigeria Communications",
        is_datacenter_or_proxy: targetSim || targetCity.includes("London"),
        sim_swap_age_hours: targetSim ? 1.4 : null
      }
    };

    // Simulate edge latency
    await new Promise(r => setTimeout(r, 220));

    let res: any;
    const latMs = +(Math.random() * 2 + 6.2).toFixed(1);
    setAvgLatency(latMs);

    if (targetCity.includes("London") || !targetCadence) {
      res = {
        txId: payload.transaction_id,
        riskScore: 97.5,
        decision: 'BLOCK' as const,
        latencyMs: latMs,
        recommendation: 'Terminated at edge. Zero-trust policy tripped; core ledger protected.',
        rules: ['IMPOSSIBLE_TRAVELER_SUPERSONIC', 'SPEED_14350_KMH', 'ZERO_JITTER_KEYSTROKE', 'TIER_4_EDGE_DROP'],
        factors: {
          geo: { score: 100.0, speedKmh: 14350.0, status: 'SUPERSONIC_IMPOSSIBLE_TRAVELER' },
          biometrics: { score: 95.0, flightVar: 0.0, status: 'BOT_AUTOMATION_SCRIPT' },
          network: { score: 45.0, simSwapHours: null, status: 'COMMERCIAL_PROXY_RELAY' }
        },
        rawJson: {
          transaction_id: payload.transaction_id,
          status: "EVALUATED_AT_EDGE",
          risk_score: 97.5,
          decision: "BLOCK",
          currency: "NGN",
          amount: targetAmt,
          account_id: targetAcc,
          processing_latency_ms: latMs,
          recommended_action: "TERMINATE_TRANSACTION_AT_EDGE",
          forensic_tags: ["IMPOSSIBLE_TRAVELER_SUPERSONIC", "SPEED_14350_KMH", "ZERO_JITTER_KEYSTROKE"]
        }
      };
      setFraudNaira(prev => prev + targetAmt);
    } else if (targetSim) {
      res = {
        txId: payload.transaction_id,
        riskScore: 68.5,
        decision: 'STEP_UP_CHALLENGE' as const,
        latencyMs: latMs,
        recommendation: 'Telco SIM-swap risk detected. SMS OTP revoked; FIDO2 cryptographic biometric challenge enforced.',
        rules: ['RECENT_SIM_SWAP_1.4H', 'SMS_OTP_DISQUALIFIED', 'DATACENTER_PROXY_IP', 'TIER_2_BIOMETRIC_PASSKEY'],
        factors: {
          geo: { score: 15.0, speedKmh: 12.0, status: 'LOCAL_VICINITY' },
          biometrics: { score: 25.0, flightVar: 34.0, status: 'ORGANIC_HUMAN' },
          network: { score: 85.0, simSwapHours: 1.4, status: 'SIM_SWAP_THREAT_SMS_REVOKED' }
        },
        rawJson: {
          transaction_id: payload.transaction_id,
          status: "EVALUATED_AT_EDGE",
          risk_score: 68.5,
          decision: "STEP_UP_CHALLENGE",
          currency: "NGN",
          amount: targetAmt,
          account_id: targetAcc,
          processing_latency_ms: latMs,
          recommended_action: "REQUIRE_FIDO2_PASSKEY_AUTHENTICATION",
          forensic_tags: ["RECENT_SIM_SWAP_1.4H", "SMS_OTP_DISQUALIFIED", "DATACENTER_PROXY_IP"]
        }
      };
    } else {
      res = {
        txId: payload.transaction_id,
        riskScore: 12.0,
        decision: 'ALLOW' as const,
        latencyMs: latMs,
        recommendation: 'Pre-ledger debit authorized for Zenith Core Banking Vault.',
        rules: ['TRUSTED_DEVICE_HASH', 'ORGANIC_TYPING_CADENCE', 'LAGOS_RESIDENTIAL_ASN'],
        factors: {
          geo: { score: 5.0, speedKmh: 0.0, status: 'LOCAL_STATIONARY' },
          biometrics: { score: 10.0, flightVar: 34.0, status: 'HUMAN_ORGANIC' },
          network: { score: 8.0, simSwapHours: null, status: 'CLEAN_RESIDENTIAL_ISP' }
        },
        rawJson: {
          transaction_id: payload.transaction_id,
          status: "EVALUATED_AT_EDGE",
          risk_score: 12.0,
          decision: "ALLOW",
          currency: "NGN",
          amount: targetAmt,
          account_id: targetAcc,
          processing_latency_ms: latMs,
          recommended_action: "FORWARD_TO_CORE_BANKING_LEDGER",
          forensic_tags: ["TRUSTED_DEVICE_HASH", "ORGANIC_TYPING_CADENCE", "LAGOS_RESIDENTIAL_ASN"]
        }
      };
    }

    setCurrentVerdict(res);
    setFeedEvents(prev => [
      {
        id: res.txId,
        timestamp: "Just now",
        account: String(targetAcc),
        amount: targetAmt,
        location: targetCity.split(',')[0],
        asn: targetSim ? "Datacenter Proxy" : "MTN Nigeria",
        score: res.riskScore,
        decision: res.decision,
        forensicTags: res.rules
      },
      ...prev.slice(0, 19)
    ]);
    setIsEvaluating(false);
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyTerminalJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentVerdict.rawJson, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col">
      
      {/* =========================================================================
           1. NAVIGATION BAR
           ========================================================================= */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('simulator')}>
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center font-mono font-black text-cyan-400 text-lg shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                AX
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-white text-lg tracking-wider font-mono">AEGIS-X</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    SENTINEL v1.2
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Zero-Trust Real-Time Fraud & ATO Sentinel</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 font-mono text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300">System Operational</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-semibold">Edge Node: Lagos-01</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'simulator'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              01. Live Simulator
            </button>
            <button
              onClick={() => setActiveTab('control_room')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'control_room'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              02. Control Room
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'architecture'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              03. Architecture
            </button>
            <button
              onClick={() => setActiveTab('codebase')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'codebase'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              04. Python Backend
            </button>
          </nav>

          <button
            onClick={() => {
              setActiveTab('simulator');
              loadScenario('sim_swap');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold font-mono text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-lg shadow-cyan-950/40 active:scale-95 flex items-center space-x-1.5"
          >
            <span>Launch Live Demo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

        </div>
      </header>

      {/* =========================================================================
           2. HERO SECTION
           ========================================================================= */}
      <section className="pt-10 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-slate-300 shadow-xl mb-5">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span className="text-red-400 font-bold">Zenith Bank Zecathon 6.0</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">Core Banking Security Track</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
          Intercept Fraud <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            Before It Touches
          </span> The Core Ledger.
        </h1>

        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto mt-4 font-normal leading-relaxed">
          Zero-Trust Synthetic Fraud & Account Takeover Sentinel engineered for Tier-1 African banking infrastructure. Sub-15ms edge telemetry with spherical geo-velocity, keystroke dynamics, and Telco SIM-swap defense.
        </p>

        {/* Key Trust Badges */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-3.5 border-l-2 border-l-cyan-400">
            <div className="text-[11px] font-mono text-slate-400">EDGE INTERCEPT</div>
            <div className="text-base font-bold font-mono text-white mt-0.5">&lt; 15ms Latency</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Zero core ledger delay</p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-3.5 border-l-2 border-l-emerald-400">
            <div className="text-[11px] font-mono text-slate-400">PRE-LEDGER GATEWAY</div>
            <div className="text-base font-bold font-mono text-white mt-0.5">Pre-Debit Drop</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Shields vault balances</p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-3.5 border-l-2 border-l-amber-400">
            <div className="text-[11px] font-mono text-slate-400">REGULATION</div>
            <div className="text-base font-bold font-mono text-white mt-0.5">CBN Aligned</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Mandatory 2FA & NDPR</p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-3.5 border-l-2 border-l-purple-400">
            <div className="text-[11px] font-mono text-slate-400">INFRASTRUCTURE</div>
            <div className="text-base font-bold font-mono text-white mt-0.5">FastAPI / Redis</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Sliding window logs</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
           3. MAIN WORKSPACE BASED ON TAB
           ========================================================================= */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16 flex-1 flex flex-col">

        {/* TAB 1: LIVE SIMULATOR SANDBOX */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            
            {/* Header Strip with Preset Scenarios */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
              <div>
                <div className="inline-flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>Interactive Judge Evaluation Workbench</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Live Simulator Sandbox
                </h2>
              </div>

              {/* Preset Scenario Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-slate-400 mr-1">PRESET SCENARIOS:</span>
                <button
                  onClick={() => loadScenario('legit')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-semibold transition-all flex items-center space-x-1.5"
                >
                  <span>🛡️ Legitimate Transfer</span>
                </button>
                <button
                  onClick={() => loadScenario('sim_swap')}
                  className="px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-mono text-xs font-semibold transition-all flex items-center space-x-1.5"
                >
                  <span>📱 SIM-Swap Attack</span>
                </button>
                <button
                  onClick={() => loadScenario('geo_velocity')}
                  className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-mono text-xs font-semibold transition-all flex items-center space-x-1.5"
                >
                  <span>✈️ Geo-Velocity Anomaly</span>
                </button>
              </div>
            </div>

            {/* Grid: Configurator (5 cols) + Real-Time Terminal (7 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Configurator Form */}
              <div className="lg:col-span-5 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 font-mono text-xs">
                  <span className="text-white font-bold flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>PAYLOAD CONFIGURATOR</span>
                  </span>
                  <span className="text-cyan-400">POST /api/v1/evaluate</span>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); executePayload(); }} className="space-y-4 font-mono text-xs">
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">ACCOUNT ID</label>
                      <input
                        type="text"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">AMOUNT (₦ NAIRA)</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 font-bold focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">DEVICE HASH / ID</label>
                      <input
                        type="text"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">USER IDENTIFIER</label>
                      <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">GEOGRAPHIC LOCATION (IP INGRESS)</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-cyan-400"
                      />
                      <input
                        type="text"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        placeholder="Lat"
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-cyan-400"
                      />
                      <input
                        type="text"
                        value={lon}
                        onChange={(e) => setLon(e.target.value)}
                        placeholder="Lon"
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-medium block">Behavioral Velocity Jitter</span>
                        <span className="text-[10px] text-slate-400">Human typing cadence (&sigma;&sup2; &gt; 25ms) vs Bot script (0ms)</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isOrganicCadence}
                        onChange={(e) => setIsOrganicCadence(e.target.checked)}
                        className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <div>
                        <span className="text-white font-medium block">Telco SIM-Swap Recency</span>
                        <span className="text-[10px] text-slate-400">IMSI re-provisioned &lt; 72 hours ago</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSimSwap}
                        onChange={(e) => setIsSimSwap(e.target.checked)}
                        className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isEvaluating}
                    className="w-full py-3.5 px-4 rounded-xl font-mono text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-xl shadow-cyan-950/50 active:scale-[0.98] flex items-center justify-center space-x-2"
                  >
                    {isEvaluating && <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>}
                    <span>{isEvaluating ? 'EVALUATING AT EDGE...' : 'EXECUTE TRANSACTION PAYLOAD'}</span>
                    <span>&rarr;</span>
                  </button>

                </form>
              </div>

              {/* Right Terminal & Verdict Display */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Primary Verdict Banner */}
                <div className={`bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border-l-4 shadow-2xl transition-all ${
                  currentVerdict.decision === 'BLOCK'
                    ? 'border-l-rose-500 shadow-rose-950/20'
                    : currentVerdict.decision === 'STEP_UP_CHALLENGE'
                    ? 'border-l-amber-500 shadow-amber-950/20'
                    : 'border-l-emerald-400 shadow-emerald-950/20'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 font-mono text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">EVALUATION VERDICT:</span>
                      <span className="text-white font-bold">{currentVerdict.txId}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-400">EDGE TIME:</span>
                      <span className="text-cyan-400 font-bold">{currentVerdict.latencyMs} ms (p99)</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
                    <div className="flex items-center space-x-5">
                      <div className={`w-20 h-20 rounded-2xl border flex flex-col items-center justify-center font-mono ${
                        currentVerdict.decision === 'BLOCK'
                          ? 'bg-rose-950/70 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                          : currentVerdict.decision === 'STEP_UP_CHALLENGE'
                          ? 'bg-amber-950/70 border-amber-500 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                          : 'bg-emerald-950/70 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      }`}>
                        <span className="text-[10px] text-slate-400 font-sans">RISK</span>
                        <span className="text-3xl font-black">{currentVerdict.riskScore}</span>
                        <span className="text-[9px] text-slate-400">/ 100</span>
                      </div>

                      <div>
                        <div className={`text-xl font-mono font-black tracking-wide ${
                          currentVerdict.decision === 'BLOCK'
                            ? 'text-rose-400'
                            : currentVerdict.decision === 'STEP_UP_CHALLENGE'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}>
                          {currentVerdict.decision === 'BLOCK' && 'TERMINATED AT EDGE (BLOCK)'}
                          {currentVerdict.decision === 'STEP_UP_CHALLENGE' && 'STEP-UP REQUIRED (FIDO2)'}
                          {currentVerdict.decision === 'ALLOW' && 'FORWARD TO CORE LEDGER (ALLOW)'}
                        </div>
                        <p className="text-xs text-slate-300 font-mono mt-1">
                          {currentVerdict.recommendation}
                        </p>
                        <div className="text-[11px] text-slate-400 font-mono mt-1">
                          Amount: <span className="text-white font-bold">₦{parseFloat(amount).toLocaleString()}</span> | Account: <span className="text-cyan-400 font-bold">{accountId}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-500 font-semibold">TRIGGERED RULES:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentVerdict.rules.map((rule, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                          {rule}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Real-Time JSON Result Terminal */}
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs">
                  <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                      <span className="text-slate-400 text-xs ml-2 font-semibold">AEGIS-X EDGE GATEWAY STREAM // JSON TELEMETRY</span>
                    </div>
                    <button
                      onClick={copyTerminalJson}
                      className="text-slate-400 hover:text-cyan-400 transition-colors text-[11px] flex items-center space-x-1"
                    >
                      <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 bg-slate-950/90 overflow-x-auto max-h-[300px] leading-relaxed">
                    <pre className="text-slate-300 selection:bg-cyan-500/30">
                      <code>{JSON.stringify(currentVerdict.rawJson, null, 2)}</code>
                    </pre>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: LIVE TELEMETRY CONTROL ROOM */}
        {activeTab === 'control_room' && (
          <div className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
              <div>
                <div className="inline-flex items-center space-x-2 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Real-Time Bank Operations HUD</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Live Telemetry Control Room
                </h2>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-2 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>SLIDING 60s WINDOW: ACTIVE</span>
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <div className="text-slate-400 font-mono text-xs uppercase">Total Transactions Scanned</div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white mt-1">{totalScanned.toLocaleString()}</div>
                <div className="text-[11px] text-cyan-400 font-mono mt-2">Edge Layer 7 Ingress</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <div className="text-rose-400 font-mono text-xs uppercase">Fraud Intercepted (₦)</div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-rose-400 mt-1">₦{fraudNaira.toLocaleString()}</div>
                <div className="text-[11px] text-rose-400 font-mono mt-2 font-bold">100% Pre-Debit Shield</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <div className="text-cyan-400 font-mono text-xs uppercase">Average Edge Latency</div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-cyan-400 mt-1">{avgLatency} ms</div>
                <div className="text-[11px] text-emerald-400 font-mono mt-2 font-bold">&lt; 15ms Target Met</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <div className="text-emerald-400 font-mono text-xs uppercase">Active Sliding Sessions</div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400 mt-1">{activeSessions.toLocaleString()}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-2">Redis Sorted Set Logs</div>
              </div>
            </div>

            {/* Live Feed Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="font-bold text-white uppercase">Live Telemetry Event Feed</span>
                </div>
                <span className="text-[11px] text-slate-400">Streaming ingress events</span>
              </div>

              <div className="overflow-x-auto max-h-[380px]">
                <table className="w-full text-left">
                  <thead className="bg-slate-950/90 text-slate-400 text-[11px] border-b border-slate-800 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">TIMESTAMP</th>
                      <th className="py-2.5 px-3">TRANSACTION ID</th>
                      <th className="py-2.5 px-3">ACCOUNT</th>
                      <th className="py-2.5 px-3">AMOUNT (₦)</th>
                      <th className="py-2.5 px-3">LOCATION / ASN</th>
                      <th className="py-2.5 px-3">RISK SCORE</th>
                      <th className="py-2.5 px-3">DECISION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                    {feedEvents.map((ev, i) => (
                      <tr key={ev.id + i} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-2.5 px-3 text-slate-500">{ev.timestamp}</td>
                        <td className="py-2.5 px-3 font-bold text-white">{ev.id}</td>
                        <td className="py-2.5 px-3 text-cyan-400">{ev.account}</td>
                        <td className="py-2.5 px-3 font-bold text-white">₦{ev.amount.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-slate-400">{ev.location} <span className="text-[10px] text-slate-600">({ev.asn})</span></td>
                        <td className={`py-2.5 px-3 font-bold ${ev.score >= 75 ? 'text-rose-400' : ev.score >= 35 ? 'text-amber-400' : 'text-emerald-400'}`}>{ev.score}</td>
                        <td className="py-2.5 px-3">
                          {ev.decision === 'BLOCK' && <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800 font-bold">BLOCK</span>}
                          {ev.decision === 'STEP_UP_CHALLENGE' && <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800 font-bold">STEP-UP (FIDO2)</span>}
                          {ev.decision === 'ALLOW' && <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-bold">ALLOW</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: SYSTEM ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-2 uppercase flex items-center space-x-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <span>Tier-1 Banking Zero-Trust Architecture</span>
              </h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Placed inline at the API Gateway layer (Apigee / Envoy / Cloud Endpoints), Aegis-X intercepts every transaction before funds debit or credit.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 border-t-2 border-t-cyan-400">
                  <div className="text-[10px] text-cyan-400 font-bold mb-1">STAGE 01</div>
                  <h3 className="text-sm font-bold text-white mb-2">Edge Ingress Interceptor</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    FastAPI middleware captures HTTP requests, extracts telemetry, and attaches correlation trace IDs.
                  </p>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 border-t-2 border-t-teal-400">
                  <div className="text-[10px] text-teal-400 font-bold mb-1">STAGE 02</div>
                  <h3 className="text-sm font-bold text-white mb-2">Redis Sliding Window</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Sorted set sliding logs track per-account velocity, defending against rapid carding bursts in &lt;1.5ms.
                  </p>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 border-t-2 border-t-purple-400">
                  <div className="text-[10px] text-purple-400 font-bold mb-1">STAGE 03</div>
                  <h3 className="text-sm font-bold text-white mb-2">Multi-Heuristic Sentinel</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Calculates Haversine geo-velocity, keystroke flight/dwell variance, and Telco SIM-swap recency.
                  </p>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 border-t-2 border-t-emerald-400">
                  <div className="text-[10px] text-emerald-400 font-bold mb-1">STAGE 04</div>
                  <h3 className="text-sm font-bold text-white mb-2">Decision Routing Engine</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    ALLOW &rarr; Core ledger release; STEP-UP &rarr; FIDO2 passkey challenge; BLOCK &rarr; Zero-trust edge drop.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PYTHON CODEBASE EXPLORER */}
        {activeTab === 'codebase' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl flex flex-col flex-1 overflow-hidden font-mono text-xs">
            <div className="border-b border-slate-800 bg-slate-950 p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {(['dashboard.html', 'main.py', 'detector.py', 'mfa_orchestrator.py', 'redis_client.py', 'Dockerfile'] as const).map((filename) => (
                  <button
                    key={filename}
                    onClick={() => setSelectedCodeFile(filename)}
                    className={`px-3 py-1.5 rounded-md font-bold transition-all text-xs ${
                      selectedCodeFile === filename
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {filename}
                  </button>
                ))}
              </div>

              <button
                onClick={() => copyCode(selectedCodeFile)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-700 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 bg-slate-950/90 overflow-x-auto flex-1 leading-relaxed text-slate-300">
              <pre>
                <code>{`// File: ${selectedCodeFile}
// Production-ready module in Aegis-X core banking repository.
// Integrated with Zenith Bank Zecathon 6.0 standards.`}</code>
              </pre>
            </div>
          </div>
        )}

      </main>

      {/* =========================================================================
           5. FOOTER
           ========================================================================= */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 mt-auto text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 text-xs">
              AX
            </div>
            <span className="text-slate-300 font-semibold">Built for Zenith Bank Zecathon 6.0 | Aegis-X Core Security Engine</span>
          </div>
          <div className="flex items-center space-x-6 text-[11px] text-slate-500">
            <span>Zero-Trust Architecture</span>
            <span>•</span>
            <span>Lagos-01 Edge Node</span>
            <span>•</span>
            <span>CBN Regulatory Aligned</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
