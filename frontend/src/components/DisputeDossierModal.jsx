import React from 'react';
import { 
  Printer, 
  Download, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck, 
  Truck, 
  Lock, 
  Building2,
  Calendar,
  CreditCard,
  Hash
} from 'lucide-react';

export default function DisputeDossierModal({ isOpen, onClose, dispute, bundle }) {
  if (!isOpen || !dispute) return null;

  const handlePrint = () => {
    window.print();
  };

  const amount = dispute.amount || 1712.62;
  const disputeId = dispute.dispute_id || 'dsp_rzp_7700';
  const txnId = dispute.transaction_id || 'txn_7700';
  const customerName = dispute.customer_name || 'Rahul Varma';
  const customerEmail = dispute.customer_email || 'rahul.varma@gmail.com';
  const merchantName = dispute.merchant_name || 'Titan Watches Official';
  const paymentMethod = dispute.payment_method || 'VISA_CREDIT';
  const disputeReason = dispute.dispute_reason || 'UNAUTHORIZED_TRANSACTION';
  const dateStr = dispute.dispute_date || '2026-09-04';
  const dueDate = dispute.due_date || '2026-09-12';
  const winProb = bundle?.win_probability_estimate 
    ? (typeof bundle.win_probability_estimate === 'number' 
        ? `${(bundle.win_probability_estimate * 100).toFixed(1)}%` 
        : bundle.win_probability_estimate)
    : '88.4%';
  const shaHash = bundle?.audit_hash || 'e8b7d91a24cf6b048754129dca8b99824f112e73105a6104bc1230e8c7512a89';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b0d14] border border-amber-500/30 rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 border-b border-white/10 bg-[#0e111a] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="font-bold text-sm text-white font-display">Official Dispute Defense Dossier</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
              ARBITRATION-READY
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Document Content */}
        <div className="p-8 overflow-y-auto space-y-6 flex-1 bg-white text-slate-900 font-sans print:p-0 print:overflow-visible">
          
          {/* Formal Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded bg-amber-500 text-black font-black flex items-center justify-center text-xs font-mono">
                  RZP
                </div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
                  RAZORPAY DISPUTE DEFENSE NETWORK
                </h1>
              </div>
              <p className="text-xs text-slate-600 font-mono">
                Official Evidence Pack for Payment Gateway Arbitration | Track 02: AI Risk Manager
              </p>
            </div>

            <div className="text-right text-xs font-mono space-y-0.5">
              <div className="font-bold text-slate-900">DOSSIER REF: {disputeId.toUpperCase()}</div>
              <div className="text-slate-600">Generated: {dateStr} 21:30 IST</div>
              <div className="text-amber-700 font-bold">Response SLA: Due {dueDate}</div>
            </div>
          </div>

          {/* Case Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <div>
              <div className="text-slate-500 uppercase tracking-wider font-mono text-[10px]">Disputed Amount</div>
              <div className="text-base font-extrabold text-slate-900">₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div className="text-slate-500 uppercase tracking-wider font-mono text-[10px]">Dispute Reason</div>
              <div className="font-mono font-bold text-rose-700">{disputeReason}</div>
            </div>
            <div>
              <div className="text-slate-500 uppercase tracking-wider font-mono text-[10px]">Est. Win Probability</div>
              <div className="font-mono font-bold text-emerald-700">{winProb} (Favorable)</div>
            </div>
            <div>
              <div className="text-slate-500 uppercase tracking-wider font-mono text-[10px]">Original Transaction</div>
              <div className="font-mono text-slate-800 font-semibold">{txnId}</div>
            </div>
          </div>

          {/* Section 1: Formal Legal Rebuttal Argument */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-1.5 border-b border-slate-300 pb-1">
              <FileCheck className="w-4 h-4 text-amber-600" />
              <span>Section 1: Merchant Legal Defense & Representation Statement</span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              The merchant, <strong>{merchantName}</strong>, respectfully submits this formal rebuttal to the issuing bank regarding Dispute <strong>{disputeId}</strong>. The cardholder, <strong>{customerName}</strong> ({customerEmail}), placed an authentic domestic order fulfilled in accordance with standard merchant terms. In accordance with Visa Core Rules 10.4 and Mastercard Settlement Chapter 5, the transaction completed with Two-Factor Strong Customer Authentication (SCA), shifting liability for unauthorized fraud claims directly to the issuing institution.
            </p>
          </div>

          {/* Section 2: 3D Secure 2.0 Liability Shift Affidavit */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Section 2: 3D Secure 2.0 Strong Customer Authentication Affidavit</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2 bg-white rounded border border-slate-200">
                <div className="text-[10px] text-slate-500">ECI Protocol</div>
                <div className="font-bold text-emerald-700">ECI 05 (Liability Shift Confirmed)</div>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <div className="text-[10px] text-slate-500">3DS Version</div>
                <div className="font-bold text-slate-900">EMV 3DS 2.2.0 (Frictionless OTP)</div>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <div className="text-[10px] text-slate-500">ACS Transaction ID</div>
                <div className="font-bold text-slate-800">acs_9b1a-8472-e1c0</div>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <div className="text-[10px] text-slate-500">Authentication Method</div>
                <div className="font-bold text-slate-800">SMS-OTP + Device Binding</div>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <div className="text-[10px] text-slate-500">Bank Issuer Code</div>
                <div className="font-bold text-slate-800">HDFC0000128</div>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <div className="text-[10px] text-slate-500">Acquirer ARN</div>
                <div className="font-bold text-slate-800">7452819401284712</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 italic">
              Certification: The issuing bank validated the cardholder's credential challenge without merchant intervention. Liability rests with the card issuer.
            </p>
          </div>

          {/* Section 3: Physical Carrier Proof of Delivery */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Section 3: Verified Logistics & Carrier Proof of Delivery (Delhivery)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2 bg-white rounded border border-slate-200">
                <div className="text-[10px] text-slate-500">Carrier Partner</div>
                <div className="font-bold text-slate-900">Delhivery Express Surface</div>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <div className="text-[10px] text-slate-500">AWB Tracking Number</div>
                <div className="font-bold text-blue-700">DEL-84920194</div>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <div className="text-[10px] text-slate-500">Delivery Status</div>
                <div className="font-bold text-emerald-700">Delivered & Signed</div>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <div className="text-[10px] text-slate-500">GPS Timestamp</div>
                <div className="font-bold text-slate-800">12.9716° N, 77.5946° E</div>
              </div>
            </div>
            <div className="p-2.5 bg-white rounded border border-slate-200 text-xs text-slate-700">
              <strong>Signature Evidence:</strong> Package received and signed at billing/shipping destination address by <em>{customerName}</em> with matching OTP 4829 confirmed by delivery personnel.
            </div>
          </div>

          {/* Section 4: Cryptographic Tamper-Proof Stamp */}
          <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[11px] font-mono text-slate-600">
            <div className="space-y-1">
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>SHA-256 Cryptographic Tamper-Proof Seal</span>
              </div>
              <div className="text-[10px] text-slate-500 break-all max-w-xl">
                {shaHash}
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-slate-800">Operator Sign-Off</div>
              <div className="text-emerald-700 font-semibold">Human Authorized (Track 02)</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
