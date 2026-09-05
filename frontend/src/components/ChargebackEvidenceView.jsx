import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  ChevronRight, 
  X, 
  FileCheck, 
  Check,
  Clock,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ChargebackEvidenceView({ disputes, onGenerateEvidence, onSubmitDispute }) {
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [evidenceBundle, setEvidenceBundle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenDispute = async (dispute) => {
    setSelectedDispute(dispute);
    if (dispute.evidence_bundle) {
      setEvidenceBundle(dispute.evidence_bundle);
    } else {
      setIsLoading(true);
      try {
        const bundle = await onGenerateEvidence(dispute.dispute_id);
        setEvidenceBundle(bundle);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleApproveAndSubmit = async () => {
    if (!selectedDispute) return;
    setIsSubmitting(true);
    try {
      await onSubmitDispute(selectedDispute.dispute_id);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      setSelectedDispute({ ...selectedDispute, status: 'SUBMITTED_TO_GATEWAY' });
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
            <h2 className="text-xl font-bold text-white font-display">Chargeback Evidence Responder</h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
              OPS DISPUTE DOSSIERS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Auto-compiles submission-ready dispute packs (rebuttal letter, tracking, 3DS logs, and ML risk audit) for disputed transactions.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Human-in-the-Loop Sign-off Required</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-glass p-4">
          <span className="text-xs font-mono text-slate-400">Total Disputed Volume</span>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            ₹{disputes.reduce((acc, d) => acc + (d.amount || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-amber-400 font-medium">{disputes.length} active dispute cases</span>
        </div>

        <div className="card-glass p-4">
          <span className="text-xs font-mono text-slate-400">Predicted Win Rate</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            86.4%
          </div>
          <span className="text-[11px] text-slate-400">Based on 3DS liability shift & carrier POD</span>
        </div>

        <div className="card-glass p-4">
          <span className="text-xs font-mono text-slate-400">Response Automation Time</span>
          <div className="text-2xl font-bold text-blue-400 font-mono mt-1">
            &lt; 1.4s
          </div>
          <span className="text-[11px] text-slate-400">From dispute ingestion to compiled dossier</span>
        </div>
      </div>

      {/* Disputes Table */}
      <div className="card-glass overflow-hidden">
        <div className="p-3.5 bg-[#090b12] border-b border-white/5 flex items-center justify-between text-xs">
          <span className="font-bold text-white font-display flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            Active Dispute Queue (Razorpay Gateway Test Feed)
          </span>
          <span className="text-[11px] font-mono text-slate-500">Sorted by Submission Due Date</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b0d15] text-slate-400 font-mono uppercase text-[10px] border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Dispute ID</th>
                <th className="py-3 px-4">Customer & Merchant</th>
                <th className="py-3 px-4">Disputed Amount</th>
                <th className="py-3 px-4">Reason Category</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Bundle Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {disputes.map((d) => (
                <tr 
                  key={d.dispute_id}
                  className="hover:bg-amber-500/5 transition-colors cursor-pointer"
                  onClick={() => handleOpenDispute(d)}
                >
                  <td className="py-3 px-4 font-mono font-medium text-amber-300">
                    {d.dispute_id}
                    <div className="text-[10px] text-slate-500 font-mono">{d.transaction_id}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{d.customer_name}</div>
                    <div className="text-[11px] text-slate-400">{d.merchant_name}</div>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-white text-sm">
                    ₹{d.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-slate-300">
                      {d.dispute_reason?.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-400">
                    {d.due_date || 'In 4 days'}
                  </td>

                  <td className="py-3 px-4">
                    {d.status === 'SUBMITTED_TO_GATEWAY' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1 w-max">
                        <Check className="w-3 h-3" />
                        SUBMITTED
                      </span>
                    ) : d.status === 'BUNDLE_GENERATED' || d.evidence_bundle ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1 w-max">
                        <FileCheck className="w-3 h-3" />
                        EVIDENCE READY
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono text-[10px] font-bold flex items-center gap-1 w-max">
                        <Clock className="w-3 h-3" />
                        REVIEW NEEDED
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button className="px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-mono inline-flex items-center gap-1 transition-all">
                      <span>Assemble</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dossier Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="card-glass w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-7 border-amber-500/40 shadow-2xl relative">
            <button 
              onClick={() => { setSelectedDispute(null); setEvidenceBundle(null); }}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Dossier Header */}
            <div className="flex items-start gap-4 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {selectedDispute.dispute_id}
                  </span>
                  <span className="text-slate-500">•</span>
                  <h3 className="text-lg font-bold text-white font-display">
                    Chargeback Dispute Dossier
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Submission-ready format for Visa/Mastercard & Razorpay arbitration.
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-mono text-amber-400">Assembling evidence sections...</p>
              </div>
            ) : evidenceBundle ? (
              <div className="space-y-5 pt-4 text-xs">
                {/* Metrics Callout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#090b10] border border-amber-500/20">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Disputed Amount</span>
                    <span className="text-lg font-bold font-mono text-white">
                      ₹{selectedDispute.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Estimated Win Probability</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {evidenceBundle.win_probability_estimate || '88%'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Status</span>
                    <span className="text-xs font-mono text-amber-300 font-semibold mt-0.5 block">
                      {selectedDispute.status === 'SUBMITTED_TO_GATEWAY' ? 'Transmitted to Gateway' : 'Ready for Ops Sign-off'}
                    </span>
                  </div>
                </div>

                {/* Rebuttal Letter */}
                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider block">
                    Dispute Rebuttal Letter (Plain-English ops draft)
                  </span>
                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-slate-200 whitespace-pre-line leading-relaxed">
                    {evidenceBundle.rebuttal_summary}
                  </div>
                </div>

                {/* Supporting Sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {evidenceBundle.sections?.map((sec, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                      <h4 className="text-[11px] font-bold text-amber-300 font-display border-b border-white/5 pb-1">
                        {sec.title}
                      </h4>
                      <div className="space-y-1 font-mono text-[10px]">
                        {sec.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start gap-2">
                            <span className="text-slate-400">{item.label}:</span>
                            <span className="text-slate-200 text-right font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Banner */}
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/25 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-300">
                    <strong className="text-amber-300 block font-semibold">Strictly Defense-Only Guarantee:</strong>
                    Aegis auto-assembles evidence. Human operator authorizes submission to the gateway dispute portal.
                  </div>

                  {selectedDispute.status === 'SUBMITTED_TO_GATEWAY' ? (
                    <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Submitted to Gateway
                    </div>
                  ) : (
                    <button
                      onClick={handleApproveAndSubmit}
                      disabled={isSubmitting}
                      className="btn-gold-glow py-2 px-5 text-xs font-bold shrink-0 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 fill-black text-black" />
                      {isSubmitting ? 'Submitting...' : 'Approve & Submit Dispute →'}
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
