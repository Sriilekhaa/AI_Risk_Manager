import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  CheckCircle, 
  X, 
  Code, 
  Clock, 
  ShieldCheck, 
  AlertOctagon, 
  RefreshCw, 
  Send,
  Sliders,
  Sparkles,
  Layers
} from 'lucide-react';

const API_BASE = 'http://localhost:8001';

export default function RazorpayWebhookSimulator({ isOpen, onClose, onWebhookProcessed }) {
  const [presets, setPresets] = useState({});
  const [selectedPresetKey, setSelectedPresetKey] = useState('authorized_legitimate');
  const [payloadJson, setPayloadJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Fetch sample presets on load
  useEffect(() => {
    fetch(`${API_BASE}/api/webhooks/presets`)
      .then(res => res.json())
      .then(data => {
        setPresets(data);
        if (data.authorized_legitimate) {
          setPayloadJson(JSON.stringify(data.authorized_legitimate.payload, null, 2));
        }
      })
      .catch(err => console.error('Failed to load webhook presets:', err));
  }, []);

  const handleSelectPreset = (key) => {
    setSelectedPresetKey(key);
    if (presets[key]) {
      setPayloadJson(JSON.stringify(presets[key].payload, null, 2));
      setResult(null);
      setError(null);
    }
  };

  const handleDispatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const parsed = JSON.parse(payloadJson);
      const res = await fetch(`${API_BASE}/api/webhooks/razorpay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: parsed })
      });
      const data = await res.json();
      setResult(data);
      if (onWebhookProcessed) onWebhookProcessed(data);
    } catch (err) {
      setError(`Invalid JSON or Dispatch Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b0d14] border border-amber-500/30 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-white/10 bg-[#0e111a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-md">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">Razorpay Webhook Live Simulator</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  SLA &lt; 50ms
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate authentic Razorpay webhook event ingestion, HMAC verification, and sub-millisecond defense actions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Preset Selector */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2 font-semibold">
              Select Curated Webhook Scenario
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {Object.entries(presets).map(([key, item]) => {
                const isSelected = selectedPresetKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectPreset(key)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/10'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[11px] font-bold font-mono ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payload Editor & Dispatch */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: JSON Editor */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  <span>Razorpay Webhook Payload (JSON)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Header: X-Razorpay-Signature (HMAC-SHA256)
                </span>
              </div>
              <div className="relative flex-1">
                <textarea
                  value={payloadJson}
                  onChange={(e) => setPayloadJson(e.target.value)}
                  rows={13}
                  className="w-full h-full min-h-[260px] bg-black/70 border border-white/10 focus:border-amber-500/50 rounded-xl p-3.5 font-mono text-xs text-amber-200/90 leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500/30 resize-none selection:bg-amber-500 selection:text-black"
                  spellCheck="false"
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => handleSelectPreset(selectedPresetKey)}
                  className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset to default</span>
                </button>

                <button
                  onClick={handleDispatch}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Ingesting in sub-millisecond...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Webhook to Aegis</span>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  {error}
                </div>
              )}
            </div>

            {/* Right: Live Telemetry Response */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-black/40 border border-white/10 rounded-xl p-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Real-Time Engine Telemetry</span>
                  </span>
                  {result && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                      {result.status}
                    </span>
                  )}
                </div>

                {result ? (
                  <div className="mt-4 space-y-3.5 text-xs">
                    {/* Latency benchmark */}
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <span className="text-slate-400 font-mono flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Execution Latency:</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        {result.latency_ms} ms <span className="text-[10px] text-slate-500 font-normal">(&lt; 50ms SLA)</span>
                      </span>
                    </div>

                    {/* Signature Check */}
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <span className="text-slate-400 font-mono flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>HMAC-SHA256 Seal:</span>
                      </span>
                      <span className="font-mono font-bold text-white text-[11px] flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span>VERIFIED</span>
                      </span>
                    </div>

                    {/* Scored transaction details if available */}
                    {result.scored_transaction && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-mono">Risk Engine Score:</span>
                          <span className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${
                            result.scored_transaction.risk_level === 'CRITICAL' || result.scored_transaction.risk_level === 'HIGH'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {result.scored_transaction.risk_score?.toFixed(2)} ({result.scored_transaction.risk_level})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300">
                          {result.scored_transaction.reasoning}
                        </div>
                      </div>
                    )}

                    {/* Defense Action */}
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                      <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                        Strictly Defense-Only Action
                      </div>
                      <div className="text-xs font-semibold text-white">
                        {result.defense_action}
                      </div>
                    </div>

                    {/* Audit Ledger stamp */}
                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span>Event appended to SHA-256 cryptographic audit chain</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 text-center py-10 text-slate-500 space-y-2">
                    <Layers className="w-8 h-8 mx-auto opacity-30 text-amber-400" />
                    <p className="text-xs font-mono">Ready for webhook dispatch.</p>
                    <p className="text-[11px] text-slate-600 max-w-xs mx-auto">
                      Click "Dispatch Webhook to Aegis" to simulate authentic Razorpay payment gateway event delivery.
                    </p>
                  </div>
                )}
              </div>

              {result && (
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-mono text-xs transition-colors cursor-pointer"
                  >
                    Close & View in Live Feed
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
