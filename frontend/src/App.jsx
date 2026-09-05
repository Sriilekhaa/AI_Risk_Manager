import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import LiveScoringFeed from './components/LiveScoringFeed';
import SpikeDetectorView from './components/SpikeDetectorView';
import ChargebackEvidenceView from './components/ChargebackEvidenceView';
import EvaluationDashboard from './components/EvaluationDashboard';
import ComplianceAuditView from './components/ComplianceAuditView';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  FileText, 
  Target, 
  Lock, 
  ArrowLeft,
  X
} from 'lucide-react';

const API_BASE = 'http://localhost:8001';

export default function App() {
  const [activeView, setActiveView] = useState('landing'); // 'landing' or 'console'
  const [consoleTab, setConsoleTab] = useState('live_feed'); // 'live_feed', 'spikes', 'chargebacks', 'evaluation', 'compliance'

  const [transactions, setTransactions] = useState([]);
  const [spikes, setSpikes] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [evaluationData, setEvaluationData] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  // Fetch all initial data
  const fetchData = async () => {
    try {
      const [txnsRes, spikesRes, disputesRes, evalRes, compRes, auditRes] = await Promise.all([
        fetch(`${API_BASE}/api/transactions`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/api/spikes`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/api/chargebacks`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/api/evaluation`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/api/compliance`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/api/audit`).then(r => r.json()).catch(() => [])
      ]);

      if (txnsRes && txnsRes.length) setTransactions(txnsRes);
      if (spikesRes && spikesRes.length) setSpikes(spikesRes);
      if (disputesRes && disputesRes.length) setDisputes(disputesRes);
      if (evalRes) setEvaluationData(evalRes);
      if (compRes) setComplianceData(compRes);
      if (auditRes && auditRes.length) setAuditLogs(auditRes);
    } catch (err) {
      console.warn('Backend API fetching notice:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleScoreCustom = async (formData) => {
    const res = await fetch(`${API_BASE}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const scored = await res.json();
    setTransactions(prev => [scored, ...prev]);
    fetchData();
    return scored;
  };

  const handleAcknowledgeSpike = async (spikeId, notes) => {
    const res = await fetch(`${API_BASE}/api/spikes/${spikeId}/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });
    const updated = await res.json();
    setSpikes(prev => prev.map(s => s.id === spikeId ? updated : s));
    fetchData();
    return updated;
  };

  const handleGenerateEvidence = async (disputeId) => {
    const res = await fetch(`${API_BASE}/api/chargebacks/${disputeId}/generate-evidence`, {
      method: 'POST'
    });
    const bundle = await res.json();
    setDisputes(prev => prev.map(d => d.dispute_id === disputeId ? { ...d, evidence_bundle: bundle, status: 'BUNDLE_GENERATED' } : d));
    fetchData();
    return bundle;
  };

  const handleSubmitDispute = async (disputeId) => {
    const res = await fetch(`${API_BASE}/api/chargebacks/${disputeId}/submit`, {
      method: 'POST'
    });
    const updated = await res.json();
    setDisputes(prev => prev.map(d => d.dispute_id === disputeId ? updated : d));
    fetchData();
    return updated;
  };

  const handleUpdateCostParams = async (threshold, costFp, costFn) => {
    try {
      const res = await fetch(`${API_BASE}/api/evaluation?threshold=${threshold}&cost_fp=${costFp}&cost_fn=${costFn}`);
      const data = await res.json();
      setEvaluationData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openConsoleWithTab = (tab) => {
    setConsoleTab(tab);
    setActiveView('console');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-slate-100 selection:bg-amber-500 selection:text-black">
      {activeView === 'landing' ? (
        /* Pristine Pixel-Perfect Landing Page matching aegis.dev */
        <HeroSection 
          onOpenLiveDemo={() => openConsoleWithTab('live_feed')}
          onOpenAuditLog={() => openConsoleWithTab('compliance')}
          onOpenStep={(step) => {
            if (step === 'detect') openConsoleWithTab('spikes');
            else if (step === 'chargebacks') openConsoleWithTab('chargebacks');
            else if (step === 'evaluation') openConsoleWithTab('evaluation');
            else openConsoleWithTab('live_feed');
          }}
        />
      ) : (
        /* Aegis Live Operations Console */
        <div className="w-full min-h-screen bg-[#06070a] flex flex-col">
          {/* Clean, Non-Crammed Console Top Header Bar */}
          <header className="sticky top-0 z-50 bg-[#0c0e17]/95 backdrop-blur-md border-b border-white/5 px-6 py-3 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveView('landing')}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Overview</span>
              </button>

              <div className="h-4 w-[1px] bg-white/10"></div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-sm text-white font-display">Aegis Operations Console</span>
              </div>
            </div>

            {/* Clean Tab Switcher */}
            <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/5 text-xs font-mono">
              <button
                onClick={() => setConsoleTab('live_feed')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  consoleTab === 'live_feed'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Live Feed</span>
              </button>

              <button
                onClick={() => setConsoleTab('spikes')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  consoleTab === 'spikes'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Spike Alerts</span>
                {spikes.filter(s => s.status === 'ACTIVE_ALERT').length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </button>

              <button
                onClick={() => setConsoleTab('chargebacks')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  consoleTab === 'chargebacks'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Evidence Dossiers</span>
              </button>

              <button
                onClick={() => setConsoleTab('evaluation')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  consoleTab === 'evaluation'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Held-Out Eval</span>
              </button>

              <button
                onClick={() => setConsoleTab('compliance')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  consoleTab === 'compliance'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Defense Audit</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                FastAPI : 8001
              </span>

              <button
                onClick={() => setActiveView('landing')}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                title="Close console"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Console Main Content Container */}
          <main className="max-w-[1220px] w-full mx-auto px-6 py-8 flex-1">
            {consoleTab === 'live_feed' && (
              <LiveScoringFeed 
                transactions={transactions} 
                onScoreCustom={handleScoreCustom} 
                onRefresh={fetchData} 
              />
            )}

            {consoleTab === 'spikes' && (
              <SpikeDetectorView 
                spikes={spikes} 
                onAcknowledge={handleAcknowledgeSpike} 
              />
            )}

            {consoleTab === 'chargebacks' && (
              <ChargebackEvidenceView 
                disputes={disputes} 
                onGenerateEvidence={handleGenerateEvidence}
                onSubmitDispute={handleSubmitDispute}
              />
            )}

            {consoleTab === 'evaluation' && (
              <EvaluationDashboard 
                evaluationData={evaluationData}
                onUpdateCostParams={handleUpdateCostParams}
              />
            )}

            {consoleTab === 'compliance' && (
              <ComplianceAuditView 
                complianceData={complianceData}
                auditLogs={auditLogs}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}
