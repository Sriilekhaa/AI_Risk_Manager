import React from 'react';
import { 
  Target, 
  BarChart2, 
  Share2, 
  ArrowDownRight, 
  FileText, 
  Lock,
  Play
} from 'lucide-react';

export default function HeroSection({ onOpenLiveDemo, onOpenAuditLog, onOpenStep }) {
  return (
    <div className="w-full bg-[#06070a] text-slate-100 min-h-screen flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* 1. Header Navigation Bar */}
      <header className="w-full max-w-[1220px] mx-auto px-6 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-5">
          {/* Aegis Shield Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onOpenLiveDemo()}>
            <div className="w-9 h-10 rounded-lg bg-[#121008] border border-amber-500/60 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.25)]">
              <svg width="22" height="26" viewBox="0 0 24 28" fill="none">
                <path d="M12 1L2 5V13C2 19.5 6.3 25.5 12 27C17.7 25.5 22 19.5 22 13V5L12 1Z" stroke="#f59e0b" strokeWidth="1.8" fill="#181307" />
                <text x="12" y="17" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="sans-serif">7</text>
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white font-display leading-tight">Aegis</div>
              <div className="text-[9px] tracking-[0.22em] font-semibold text-amber-400 uppercase font-mono">AI RISK MANAGER</div>
            </div>
          </div>

          {/* Razorpay Buildathon Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d101a] border border-blue-500/25 text-xs text-slate-300 font-mono">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-sm transform rotate-12 shrink-0"></span>
            <span className="font-semibold text-white">Razorpay <span className="text-blue-400 font-normal">/buildathon 2026</span></span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 text-[11px]">Track 02 — AI Risk Manager</span>
          </div>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-7 text-xs font-medium text-slate-300">
          <button onClick={() => onOpenLiveDemo()} className="hover:text-amber-300 transition-colors cursor-pointer">Overview</button>
          <button onClick={() => onOpenStep('detect')} className="hover:text-amber-300 transition-colors cursor-pointer">How it works</button>
          <button onClick={() => onOpenStep('tech')} className="hover:text-amber-300 transition-colors cursor-pointer">Tech</button>
          <button 
            onClick={() => onOpenLiveDemo()} 
            className="px-5 py-2 rounded-full border border-amber-500/60 text-amber-300 hover:bg-amber-500/10 transition-all font-semibold shadow-[0_0_12px_rgba(245,158,11,0.15)] cursor-pointer"
          >
            View Live Demo
          </button>
        </div>
      </header>

      {/* 2. Hero Section: Left Copy & Right Glowing Shield Composition */}
      <section className="w-full max-w-[1220px] mx-auto px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
        {/* Left Copy */}
        <div className="lg:col-span-6 space-y-4 z-10">
          <div className="text-amber-400 text-xs font-mono font-bold tracking-[0.25em] uppercase">
            &gt; A E G I S
          </div>

          <h1 className="text-4xl xl:text-[52px] font-extrabold text-white tracking-tight leading-[1.08] font-display">
            Fraud detection <br />
            that shows its work.
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed max-w-[460px]">
            Aegis scores every transaction, flags fraud spikes in real time, and assembles chargeback evidence automatically — with precision, recall, and false-positive cost measured openly on a held-out test set.
          </p>

          <div className="flex items-center gap-4 pt-1">
            <button 
              onClick={() => onOpenLiveDemo()}
              className="btn-gold-glow text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-black text-black" />
              <span>View Live Demo →</span>
            </button>

            <button 
              onClick={() => onOpenAuditLog()}
              className="btn-outline-glass text-xs"
            >
              <svg className="w-4 h-4 fill-slate-300" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span>View Audit Trail on GitHub</span>
            </button>
          </div>
        </div>

        {/* Right Composition: Glowing Shield, Wave & Badges */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[320px] select-none">
          {/* Radial Ambient Gold Burst */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.05) 50%, transparent 70%)',
              filter: 'blur(40px)'
            }}
          />

          {/* SVG Composition: Golden Wave & Vertical Candlestick Bars */}
          <svg className="w-full h-[300px] overflow-visible" viewBox="0 0 500 300" fill="none">
            <defs>
              <linearGradient id="shieldFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45"/>
                <stop offset="50%" stopColor="#78350f" stopOpacity="0.85"/>
                <stop offset="100%" stopColor="#0c0a04" stopOpacity="0.95"/>
              </linearGradient>
              <linearGradient id="beamGrad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.05"/>
                <stop offset="50%" stopColor="#fef08a" stopOpacity="0.95"/>
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.05"/>
              </linearGradient>
              <linearGradient id="waveLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3"/>
                <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.85"/>
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="1"/>
              </linearGradient>
            </defs>

            {/* Background vertical histogram candlestick bars on right */}
            <g opacity="0.35" stroke="#f59e0b" strokeWidth="1.5">
              <line x1="360" y1="160" x2="360" y2="220" />
              <line x1="380" y1="130" x2="380" y2="220" />
              <line x1="400" y1="100" x2="400" y2="220" />
              <line x1="420" y1="80" x2="420" y2="220" />
              <line x1="440" y1="65" x2="440" y2="220" />
              <line x1="460" y1="50" x2="460" y2="220" />
              <line x1="480" y1="40" x2="480" y2="220" />
            </g>

            {/* Glowing Golden Wave Line */}
            <path 
              d="M 90 210 Q 200 215 290 170 T 390 100 T 490 35" 
              stroke="url(#waveLineGrad)" 
              strokeWidth="2.5" 
              fill="none" 
              filter="drop-shadow(0 0 10px rgba(245,158,11,0.7))"
            />

            {/* Diagonal Laser Light Beam crossing behind the shield */}
            <line x1="130" y1="270" x2="350" y2="35" stroke="url(#beamGrad)" strokeWidth="2.5" strokeDasharray="6 3" />

            {/* Central Glowing Shield */}
            <g transform="translate(200, 55)" filter="drop-shadow(0 0 28px rgba(245,158,11,0.65))">
              {/* Outer Golden Shield Outline */}
              <path 
                d="M 45 0 L 85 15 L 80 75 C 75 120 45 145 45 145 C 45 145 15 120 10 75 L 5 15 Z" 
                fill="url(#shieldFill)" 
                stroke="#fbbf24" 
                strokeWidth="3" 
              />
              {/* Inner Shield Rim */}
              <path 
                d="M 45 12 L 77 24 L 73 73 C 69 110 45 130 45 130 C 45 130 21 110 17 73 L 13 24 Z" 
                fill="none" 
                stroke="#d97706" 
                strokeWidth="1.2" 
                opacity="0.85"
              />
              {/* Glowing 'A' Letter Inside Shield */}
              <text 
                x="45" 
                y="95" 
                textAnchor="middle" 
                fill="#ffffff" 
                fontSize="44" 
                fontWeight="900" 
                fontFamily="Outfit, sans-serif"
                style={{ filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.95))' }}
              >
                A
              </text>
            </g>
          </svg>

          {/* Floating Badge 1: Top-Left "Scanning Transactions..." */}
          <div className="absolute top-2 left-4 float-badge-1 bg-[#0d0f18]/95 backdrop-blur-md border border-amber-500/30 rounded-xl px-3 py-2 shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <div className="text-[10px] leading-tight">
              <span className="text-slate-400 block text-[9px]">Scanning</span>
              <span className="text-slate-200 font-medium">Transactions in real time...</span>
            </div>
          </div>

          {/* Floating Badge 2: Lower-Left "Risk Score 0.18 Low Risk" */}
          <div className="absolute bottom-8 left-8 float-badge-2 bg-[#0d0f18]/95 backdrop-blur-md border border-emerald-500/30 rounded-xl px-3.5 py-2 shadow-xl flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <div>
              <span className="text-[8px] text-slate-400 uppercase font-mono block">Risk Score</span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold font-mono text-white leading-none">0.18</span>
                <span className="text-[10px] text-emerald-400 font-semibold leading-none">Low Risk</span>
              </div>
            </div>
          </div>

          {/* Floating Badge 3: Top-Right "Anomalous Pattern Detected..." */}
          <div className="absolute top-4 right-8 float-badge-2 bg-[#0d0f18]/95 backdrop-blur-md border border-rose-500/30 rounded-xl px-3 py-2 shadow-xl flex items-start gap-2 max-w-[155px]">
            <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0 animate-ping"></span>
            <div className="text-[10px] leading-tight">
              <span className="text-rose-300 font-semibold block">Anomalous Pattern Detected</span>
              <span className="text-slate-400 font-mono text-[9px] block mt-0.5">Cluster deviation</span>
              <span className="text-rose-400 font-mono font-bold text-xs">+287%</span>
            </div>
          </div>

          {/* Floating Badge 4: Lower-Right "Evidence Bundle Assembled..." */}
          <div className="absolute bottom-10 right-6 float-badge-1 bg-[#0d0f18]/95 backdrop-blur-md border border-amber-500/30 rounded-xl px-3 py-2 shadow-xl flex items-start gap-2 max-w-[150px]">
            <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[10px] leading-tight">
              <span className="text-slate-200 font-semibold block">Evidence Bundle Assembled</span>
              <span className="text-amber-400 font-mono text-[10px] font-medium block mt-0.5">Ready for review</span>
            </div>
          </div>

          {/* Far-Right Vertical Watermark Text */}
          <div className="absolute -right-2 top-6 flex flex-col justify-between h-[210px] text-right pointer-events-none select-none opacity-40">
            <div className="text-[8px] font-mono tracking-[0.25em] text-slate-400 font-bold leading-relaxed">
              SAFER<br />
              PAYMENTS<br />
              STRONGER<br />
              BUSINESSES
            </div>
            <div className="text-[7px] font-mono tracking-widest text-slate-500">
              REAL TRANSACTIONS.<br />
              REAL INSIGHTS. HIGHER TRUST.
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Key Metric Cards */}
      <section className="w-full max-w-[1220px] mx-auto px-6 py-2.5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: 94% Precision */}
          <div 
            onClick={() => onOpenStep('evaluation')}
            className="card-glass p-4.5 flex items-center gap-4 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white font-display tracking-tight leading-none">94%</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Precision</div>
            </div>
          </div>

          {/* Card 2: 91% Recall */}
          <div 
            onClick={() => onOpenStep('evaluation')}
            className="card-glass p-4.5 flex items-center gap-4 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shrink-0">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white font-display tracking-tight leading-none">91%</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Recall</div>
            </div>
          </div>

          {/* Card 3: 0.92 F1 Score */}
          <div 
            onClick={() => onOpenStep('evaluation')}
            className="card-glass p-4.5 flex items-center gap-4 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white font-display tracking-tight leading-none">0.92</div>
              <div className="text-xs text-slate-400 font-medium mt-1">F1 Score</div>
            </div>
          </div>

          {/* Card 4: 38% False-Positive Cost Cut */}
          <div 
            onClick={() => onOpenStep('evaluation')}
            className="card-glass p-4.5 flex items-center gap-4 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shrink-0">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white font-display tracking-tight leading-none">38%</div>
              <div className="text-xs text-slate-400 font-medium mt-1">False-positive cost cut</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS 3-Step Flow */}
      <section className="w-full max-w-[1220px] mx-auto px-6 py-2.5">
        <div className="text-[10px] font-mono tracking-[0.25em] text-slate-500 font-bold uppercase mb-2.5">
          H O W &nbsp; I T &nbsp; W O R K S
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Step 1: Score */}
          <div 
            onClick={() => onOpenStep('live_feed')}
            className="flex-1 flex items-center gap-3 p-1.5 cursor-pointer group"
          >
            <span className="text-xs font-mono text-slate-500 font-bold">1</span>
            <div className="w-9 h-9 rounded-xl bg-[#10131d] border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 group-hover:border-amber-400 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">Score</h3>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                Scores every transaction with a calibrated risk score and a plain-language reason.
              </p>
            </div>
          </div>

          {/* Divider Line 1 */}
          <div className="hidden md:flex items-center w-16 px-1">
            <div className="h-[1px] bg-gradient-to-r from-amber-500/30 to-amber-500/60 w-full relative">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute right-0 top-1/2 -translate-y-1/2"></div>
            </div>
          </div>

          {/* Step 2: Detect */}
          <div 
            onClick={() => onOpenStep('spikes')}
            className="flex-1 flex items-center gap-3 p-1.5 cursor-pointer group"
          >
            <span className="text-xs font-mono text-slate-500 font-bold">2</span>
            <div className="w-9 h-9 rounded-xl bg-[#10131d] border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 group-hover:border-amber-400 transition-colors">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">Detect</h3>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                Flags fraud spikes the moment abnormal transaction clusters appear — alerts only, never auto-blocks.
              </p>
            </div>
          </div>

          {/* Divider Line 2 */}
          <div className="hidden md:flex items-center w-16 px-1">
            <div className="h-[1px] bg-gradient-to-r from-amber-500/30 to-amber-500/60 w-full relative">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute right-0 top-1/2 -translate-y-1/2"></div>
            </div>
          </div>

          {/* Step 3: Assemble */}
          <div 
            onClick={() => onOpenStep('chargebacks')}
            className="flex-1 flex items-center gap-3 p-1.5 cursor-pointer group"
          >
            <span className="text-xs font-mono text-slate-500 font-bold">3</span>
            <div className="w-9 h-9 rounded-xl bg-[#10131d] border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 group-hover:border-amber-400 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">Assemble</h3>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                Auto-assembles submission-ready chargeback evidence bundles from the same reasoning engine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Strictly Defense-Only Golden Banner */}
      <section className="w-full max-w-[1220px] mx-auto px-6 py-2.5">
        <div 
          onClick={() => onOpenAuditLog()}
          className="w-full bg-[#0a0c14]/90 border border-amber-500/30 rounded-2xl p-3.5 flex items-center gap-3.5 cursor-pointer hover:border-amber-400/60 transition-all shadow-[0_0_20px_rgba(245,158,11,0.08)]"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Lock className="w-4.5 h-4.5 text-amber-400" />
          </div>

          <div className="text-xs text-slate-300">
            <span className="font-bold text-amber-300 mr-2">Strictly defense-only.</span>
            Every action is logged, every decision is explainable, nothing executes without a human above threshold.
          </div>
        </div>
      </section>

      {/* 6. Footer Bar */}
      <footer className="w-full max-w-[1220px] mx-auto px-6 pt-2 pb-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 text-xs text-slate-500 font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-slate-400 uppercase">BUILT WITH</span>
          <span className="px-2 py-0.5 rounded bg-[#11131c] border border-white/10 text-slate-300 text-[10px] flex items-center gap-1">
            <span className="text-amber-400 font-bold">🐍</span> Python
          </span>
          <span className="px-2 py-0.5 rounded bg-[#11131c] border border-white/10 text-slate-300 text-[10px] flex items-center gap-1">
            <span className="text-sky-400 font-bold">⚡</span> FastAPI
          </span>
          <span className="px-2 py-0.5 rounded bg-[#11131c] border border-white/10 text-slate-300 text-[10px] flex items-center gap-1">
            <span className="text-amber-400">⚙</span> Risk Scoring Engine
          </span>
          <span className="px-2 py-0.5 rounded bg-[#11131c] border border-white/10 text-slate-300 text-[10px] flex items-center gap-1">
            <span className="text-blue-400 font-bold">▶</span> Razorpay Test-Mode APIs
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-slate-400 text-[11px]">Built for Razorpay /buildathon 2026</span>

          <button 
            onClick={() => onOpenLiveDemo()}
            className="px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs flex items-center gap-1 shadow-[0_0_18px_rgba(245,158,11,0.35)] transition-all cursor-pointer"
          >
            <span>View Live Demo</span>
            <span>→</span>
          </button>

          <div className="hidden lg:block text-right text-[8px] text-slate-600 font-mono tracking-widest leading-tight">
            PEOPLE<br />
            PURPOSE<br />
            SAFER COMMERCE
          </div>
        </div>
      </footer>
    </div>
  );
}
