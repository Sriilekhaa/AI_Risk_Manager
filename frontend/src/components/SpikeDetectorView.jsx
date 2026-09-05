import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Check
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const velocityTimelineData = [
  { time: '18:00', baseline: 12, actual: 14, anomaly: null },
  { time: '18:15', baseline: 15, actual: 16, anomaly: null },
  { time: '18:30', baseline: 18, actual: 20, anomaly: null },
  { time: '18:45', baseline: 14, actual: 15, anomaly: null },
  { time: '19:00', baseline: 16, actual: 18, anomaly: null },
  { time: '19:15', baseline: 22, actual: 24, anomaly: null },
  { time: '19:30', baseline: 20, actual: 68, anomaly: 68 }, // Card testing burst
  { time: '19:45', baseline: 19, actual: 54, anomaly: 54 },
  { time: '20:00', baseline: 18, actual: 22, anomaly: null },
  { time: '20:15', baseline: 16, actual: 17, anomaly: null },
];

export default function SpikeDetectorView({ spikes, onAcknowledge }) {
  const [selectedSpike, setSelectedSpike] = useState(null);
  const [analystNote, setAnalystNote] = useState('Step-up 3DS challenge requested. Defense-only verified.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAcknowledgeSubmit = async () => {
    if (!selectedSpike) return;
    setIsSubmitting(true);
    try {
      await onAcknowledge(selectedSpike.id, analystNote);
      setSelectedSpike(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white font-display">Fraud-Spike Anomaly Detector</h2>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
              CLUSTER ANOMALY RADAR
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time velocity and spatial clustering over calibrated risk scores. Alerts only — strictly defense-only.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Alerts only — Never auto-blocks</span>
        </div>
      </div>

      {/* Real-Time Velocity Anomaly Graph */}
      <div className="card-glass p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Rolling 2-Hour Velocity & Anomaly Horizon
            </h3>
            <span className="text-[11px] text-slate-400">Monitoring transaction throughput against dynamic threshold (Z ≥ 2.2)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-slate-400 inline-block"></span>
              <span className="text-slate-400">Baseline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-amber-400 inline-block"></span>
              <span className="text-amber-300">Observed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
              <span className="text-rose-400 font-bold">Anomalous Spike</span>
            </div>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={velocityTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.7}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0d0f17', borderColor: '#f59e0b33', borderRadius: '8px', fontSize: '11px' }}
                labelStyle={{ color: '#fbbf24', fontFamily: 'monospace' }}
              />
              <Area type="monotone" dataKey="baseline" stroke="#64748b" strokeDasharray="3 3" fill="transparent" />
              <Area type="monotone" dataKey="actual" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
              <Area type="monotone" dataKey="anomaly" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorAnomaly)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Ranked Alerts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Ranked Spike Anomaly Alerts ({spikes.length})
          </h3>
          <span className="text-[11px] font-mono text-slate-500">Sorted by Anomaly Z-Score Deviation</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {spikes.map((spike) => (
            <div 
              key={spike.id}
              className={`card-glass p-4 border transition-all ${
                spike.status === 'ACTIVE_ALERT'
                  ? 'border-rose-500/30 bg-gradient-to-r from-rose-950/15 via-[#0d0f17] to-black hover:border-rose-400/60'
                  : 'border-emerald-500/20 bg-gradient-to-r from-emerald-950/10 via-[#0d0f17] to-black opacity-85'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">{spike.id}</span>
                    <span className="text-slate-500">•</span>
                    <h4 className="text-sm font-bold text-white font-display">{spike.title}</h4>

                    {spike.status === 'ACTIVE_ALERT' ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 text-[10px] font-mono font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                        ACTIVE ALERT
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        ACKNOWLEDGED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    {spike.trigger_signal}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400 pt-0.5">
                    <div>Category: <strong className="text-slate-300">{spike.category}</strong></div>
                    <div>Deviation: <strong className="text-rose-400">{spike.cluster_deviation}</strong></div>
                    <div>Z-Score: <strong className="text-amber-300">{spike.z_score}</strong></div>
                    <div>Affected: <strong className="text-white">{spike.affected_volume}</strong></div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-start sm:items-end gap-1.5">
                  {spike.status === 'ACTIVE_ALERT' ? (
                    <button
                      onClick={() => setSelectedSpike(spike)}
                      className="btn-gold-glow py-1.5 px-4 text-xs font-bold shadow-md cursor-pointer"
                    >
                      Acknowledge & Escalate →
                    </button>
                  ) : (
                    <div className="text-right font-mono text-[10px] text-emerald-400">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Signed off by Ops</span>
                      </div>
                    </div>
                  )}

                  <div className="text-[9px] text-slate-500 font-mono italic max-w-xs text-left sm:text-right">
                    {spike.defense_only_notice}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acknowledgment Modal */}
      {selectedSpike && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="card-glass w-full max-w-md p-6 border-amber-500/40 shadow-2xl relative">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Fraud Ops Verification</h3>
                <span className="text-[11px] font-mono text-amber-400">{selectedSpike.id}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-300 text-[11px] leading-relaxed">
                <strong className="text-amber-300 block mb-0.5">Defense-Only Policy:</strong>
                Aegis alerts operations. Acknowledging this alert prompts enhanced 3D Secure challenges or routes to manual review. Gateways will not auto-freeze or auto-block users.
              </div>

              <div>
                <label className="text-slate-400 font-mono block mb-1">Analyst Notes</label>
                <textarea
                  rows="3"
                  value={analystNote}
                  onChange={(e) => setAnalystNote(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white font-sans focus:border-amber-500 outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSpike(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAcknowledgeSubmit}
                  disabled={isSubmitting}
                  className="btn-gold-glow py-2 px-5 text-xs font-bold cursor-pointer"
                >
                  {isSubmitting ? 'Verifying...' : 'Sign Off & Log to Ledger →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
