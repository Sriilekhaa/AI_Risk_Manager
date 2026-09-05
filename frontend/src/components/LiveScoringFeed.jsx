import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  RefreshCw, 
  Sliders, 
  ChevronRight, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Zap,
  MapPin,
  TrendingUp,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';

export default function LiveScoringFeed({ transactions, onScoreCustom, onRefresh }) {
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [isScoring, setIsScoring] = useState(false);

  // Custom Form
  const [customForm, setCustomForm] = useState({
    amount: 14500,
    merchant_category: 'Electronics',
    payment_method: 'UPI_GPAY',
    customer_name: 'Vikram Malhotra',
    customer_email: 'vikram.m@gmail.com',
    city: 'Mumbai',
    shipping_city: 'Mumbai',
    velocity_1h: 1,
    velocity_24h: 2,
    is_device_known: true,
    is_proxy_or_vpn: false,
    is_ip_mismatch: false,
    historical_dispute_count: 0
  });

  const filteredTxns = transactions.filter(t => {
    if (filterLevel !== 'ALL' && t.risk_level !== filterLevel) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = t.id?.toLowerCase().includes(q);
      const matchName = t.customer_name?.toLowerCase().includes(q);
      const matchMethod = t.payment_method?.toLowerCase().includes(q);
      return matchId || matchName || matchMethod;
    }
    return true;
  });

  const handleSimulateSubmit = async (e) => {
    e.preventDefault();
    setIsScoring(true);
    try {
      const result = await onScoreCustom(customForm);
      setSelectedTxn(result);
      setShowCustomModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScoring(false);
    }
  };

  const getRiskBadge = (level, score) => {
    if (level === 'HIGH') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[11px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
          HIGH {score !== undefined ? `(${score.toFixed(2)})` : ''}
        </span>
      );
    }
    if (level === 'MEDIUM') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          MED {score !== undefined ? `(${score.toFixed(2)})` : ''}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        LOW {score !== undefined ? `(${score.toFixed(2)})` : ''}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white font-display">Live Risk Telemetry & Scoring</h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              STREAM ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time calibrated probabilities (0–1) and plain-language factor explanations for BFSI transactions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCustomModal(true)}
            className="btn-gold-glow py-2 px-4 text-xs font-semibold"
          >
            <Sliders className="w-3.5 h-3.5 fill-black text-black" />
            <span>Test Custom Transaction</span>
          </button>

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
            title="Refresh stream"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#0b0d15] border border-white/5 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Filter:</span>
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                filterLevel === lvl
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ID, customer, method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-amber-500 outline-none w-56 font-mono"
            />
          </div>
          <span className="text-xs font-mono text-slate-500">
            <strong className="text-amber-300">{filteredTxns.length}</strong> events
          </span>
        </div>
      </div>

      {/* Clean Table */}
      <div className="card-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090b12] border-b border-white/5 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Transaction ID</th>
                <th className="py-3 px-4 font-semibold">Customer & Location</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Payment Instrument</th>
                <th className="py-3 px-4 font-semibold">Calibrated Risk</th>
                <th className="py-3 px-4 font-semibold">Plain-Language Reason</th>
                <th className="py-3 px-4 text-right font-semibold">Forensics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500 font-mono">
                    No transactions match current filters.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((txn) => (
                  <tr 
                    key={txn.id}
                    onClick={() => setSelectedTxn(txn)}
                    className="hover:bg-amber-500/5 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-amber-300">
                      {txn.id}
                      <div className="text-[10px] text-slate-500 font-mono">
                        {txn.timestamp ? new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{txn.customer_name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {txn.ip_city || txn.billing_city || 'India'}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white text-sm">
                      ₹{txn.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
                        {txn.payment_method?.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {getRiskBadge(txn.risk_level, txn.risk_score)}
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-slate-300 text-xs" title={txn.reasoning}>
                      {txn.reasoning || "Standard transaction baseline verified."}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono inline-flex items-center gap-1 transition-all">
                        <span>Inspect</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Forensics Drawer / Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="card-glass w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border-amber-500/30 shadow-2xl relative">
            <button 
              onClick={() => setSelectedTxn(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white font-display">Aegis Risk Forensics</h3>
                  <span className="font-mono text-xs text-amber-400">{selectedTxn.id}</span>
                </div>
                <p className="text-xs text-slate-400">Full audit inspection & contributing explainability factors</p>
              </div>
            </div>

            {/* Score & Risk Level Callout */}
            <div className="my-5 p-4 rounded-xl bg-[#090b10] border border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Calibrated Risk Probability</span>
                <div className="text-3xl font-extrabold text-white font-mono mt-0.5">
                  {selectedTxn.risk_score?.toFixed(3) || '0.120'}
                  <span className="text-xs font-sans text-slate-400 font-normal ml-2">/ 1.000</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Classification</span>
                <div className="mt-1">
                  {getRiskBadge(selectedTxn.risk_level, selectedTxn.risk_score)}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Order Value</span>
                <div className="text-xl font-bold font-mono text-white mt-0.5">
                  ₹{selectedTxn.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Plain-Language Explainability String */}
            <div className="space-y-2 mb-5">
              <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Plain-Language Reasoning (Decision Audit)
              </span>
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-200 leading-relaxed font-sans">
                {selectedTxn.reasoning}
              </div>
            </div>

            {/* Contributing Risk Factors Breakdown */}
            {selectedTxn.factor_contributions && selectedTxn.factor_contributions.length > 0 && (
              <div className="space-y-2 mb-5">
                <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                  Contributing Signals & Factor Weights
                </span>
                <div className="space-y-1.5">
                  {selectedTxn.factor_contributions.map((f, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono ${
                        f.type === 'ELEVATING'
                          ? 'bg-rose-500/5 border-rose-500/20 text-rose-300'
                          : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {f.type === 'ELEVATING' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                        {f.factor}
                      </span>
                      <span className="font-bold">
                        {f.impact > 0 ? `+${f.impact}` : f.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-black/40 border border-white/5 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Customer</span>
                <span className="font-semibold text-white">{selectedTxn.customer_name}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Customer Email</span>
                <span className="font-mono text-slate-300 truncate block">{selectedTxn.customer_email}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Payment Instrument</span>
                <span className="font-mono text-amber-300">{selectedTxn.payment_method}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">IP City vs Shipping</span>
                <span className="font-mono text-slate-300">
                  {selectedTxn.ip_city || 'Mumbai'} / {selectedTxn.shipping_city || 'Mumbai'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">1h Attempt Velocity</span>
                <span className="font-mono font-bold text-white">{selectedTxn.velocity_1h || 1} transactions</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Device Status</span>
                <span className="font-mono text-slate-300">
                  {selectedTxn.is_device_known ? 'Verified Trusted ID' : 'Unrecognized Device'}
                </span>
              </div>
            </div>

            {/* Defense-Only Advisory Notice */}
            <div className="mt-5 p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Strictly Defense-Only Advisory:</strong>
                {selectedTxn.advisory || "Standard approval recommended. No automatic blocks or account freezes are executed by Aegis."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Custom Transaction Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="card-glass w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 border-amber-500/40 shadow-2xl relative">
            <button 
              onClick={() => setShowCustomModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">Test Custom Transaction</h3>
                <p className="text-xs text-slate-400">Inject custom parameters to test the calibrated risk engine & explainability live.</p>
              </div>
            </div>

            <form onSubmit={handleSimulateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Amount (INR ₹)</label>
                  <input
                    type="number"
                    value={customForm.amount}
                    onChange={(e) => setCustomForm({...customForm, amount: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white font-mono focus:border-amber-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono block mb-1">Merchant Category</label>
                  <select
                    value={customForm.merchant_category}
                    onChange={(e) => setCustomForm({...customForm, merchant_category: e.target.value})}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white font-mono focus:border-amber-500 outline-none"
                  >
                    <option value="Electronics">Electronics (High Ticket)</option>
                    <option value="Digital Gaming">Digital Gaming (Micro Burst)</option>
                    <option value="Fashion">Fashion & Apparel</option>
                    <option value="Travel & Flights">Travel & Flights</option>
                    <option value="Quick Commerce">Quick Commerce</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Payment Method</label>
                  <select
                    value={customForm.payment_method}
                    onChange={(e) => setCustomForm({...customForm, payment_method: e.target.value})}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white font-mono focus:border-amber-500 outline-none"
                  >
                    <option value="UPI_GPAY">UPI — Google Pay</option>
                    <option value="UPI_PHONEPE">UPI — PhonePe</option>
                    <option value="RUPAY_CARD">RuPay Credit/Debit</option>
                    <option value="VISA_CARD">Visa International</option>
                    <option value="NETBANKING_HDFC">Netbanking HDFC</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-mono block mb-1">1-Hour Velocity Attempts</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={customForm.velocity_1h}
                    onChange={(e) => setCustomForm({...customForm, velocity_1h: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white font-mono focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={customForm.customer_name}
                    onChange={(e) => setCustomForm({...customForm, customer_name: e.target.value})}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white font-sans focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono block mb-1">Email Address</label>
                  <input
                    type="text"
                    value={customForm.customer_email}
                    onChange={(e) => setCustomForm({...customForm, customer_email: e.target.value})}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white font-mono focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                <span className="font-mono text-slate-400 text-[11px] uppercase block">Risk Signals & Anomalies</span>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={!customForm.is_device_known}
                      onChange={(e) => setCustomForm({...customForm, is_device_known: !e.target.checked})}
                      className="accent-amber-500"
                    />
                    <span>Unrecognized New Device</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={customForm.is_proxy_or_vpn}
                      onChange={(e) => setCustomForm({...customForm, is_proxy_or_vpn: e.target.checked})}
                      className="accent-amber-500"
                    />
                    <span>Proxy / VPN Detected</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={customForm.is_ip_mismatch}
                      onChange={(e) => setCustomForm({
                        ...customForm, 
                        is_ip_mismatch: e.target.checked,
                        shipping_city: e.target.checked ? 'Delhi NCR' : customForm.city
                      })}
                      className="accent-amber-500"
                    />
                    <span>IP vs Shipping Mismatch</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={customForm.historical_dispute_count > 0}
                      onChange={(e) => setCustomForm({...customForm, historical_dispute_count: e.target.checked ? 3 : 0})}
                      className="accent-amber-500"
                    />
                    <span>Repeat Disputer History</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isScoring}
                  className="btn-gold-glow py-2 px-6 text-xs font-bold cursor-pointer"
                >
                  {isScoring ? 'Scoring...' : 'Score with Aegis Engine →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
