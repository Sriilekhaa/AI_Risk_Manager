import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  CheckCircle2, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react';

const API_BASE = 'http://localhost:8001';

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    text: `Hello! I am **Aegis AI Risk Co-Pilot**, your operational fraud intelligence partner.

I'm directly connected to our calibrated ML risk engine, rolling anomaly radar, dispute evidence assembler, and SHA-256 audit ledger.

**How can I assist your fraud ops team right now?**`,
    citations: ['Aegis Telemetry v2.1', 'Razorpay Track 02 Defense-Only']
  }
];

export default function CopilotDrawer({ isOpen, onClose, selectedTxn = null, selectedDispute = null }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    'Why was this transaction flagged as high risk?',
    'Draft arbitration rebuttal for dispute citing 3DS liability shift',
    'Explain the false-positive cost curve and optimal threshold',
    'How does Aegis guarantee zero autonomous blocking?'
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedTxn) {
      setInput(`Why was transaction ${selectedTxn.id} flagged with ${selectedTxn.risk_score} risk score?`);
    } else if (selectedDispute) {
      setInput(`Draft arbitration rebuttal for dispute ${selectedDispute.dispute_id}`);
    }
  }, [selectedTxn, selectedDispute]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText = input) => {
    const textToSend = (queryText || '').trim();
    if (!textToSend || loading) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/copilot/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: textToSend,
          context: {
            selected_txn: selectedTxn?.id,
            selected_dispute: selectedDispute?.dispute_id
          }
        })
      });
      const data = await res.json();
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          text: data.response || 'No response available.',
          citations: data.citations || []
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `⚠️ Unable to connect to Aegis Co-Pilot API (${err.message}). Ensure backend is active on :8001.`,
          citations: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
  };

  if (!isOpen) return null;

  // Simple Markdown parser for clean bold and bullet points
  const renderFormattedText = (rawText) => {
    return (
      <div className="space-y-2 text-xs leading-relaxed text-slate-300">
        {rawText.split('\n\n').map((paragraph, pIdx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h4 key={pIdx} className="font-bold text-sm text-amber-300 font-display mt-2 mb-1">
                {paragraph.replace('### ', '')}
              </h4>
            );
          }
          if (paragraph.startsWith('• ') || paragraph.startsWith('* ') || paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') || paragraph.startsWith('4. ')) {
            return (
              <ul key={pIdx} className="space-y-1.5 pl-1">
                {paragraph.split('\n').map((line, lIdx) => {
                  const cleanLine = line.replace(/^([•*]|\d+\.)\s*/, '');
                  return (
                    <li key={lIdx} className="flex items-start gap-1.5 text-slate-300">
                      <span className="text-amber-400/80 font-bold">•</span>
                      <span dangerouslySetInnerHTML={{ 
                        __html: cleanLine
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                          .replace(/`(.*?)`/g, '<code class="bg-black/60 px-1 py-0.5 rounded text-amber-300 font-mono text-[10px] border border-white/10">$1</code>')
                      }} />
                    </li>
                  );
                })}
              </ul>
            );
          }
          return (
            <p key={pIdx} dangerouslySetInnerHTML={{
              __html: paragraph
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                .replace(/`(.*?)`/g, '<code class="bg-black/60 px-1 py-0.5 rounded text-amber-300 font-mono text-[10px] border border-white/10">$1</code>')
                .replace(/\*(.*?)\*/g, '<em class="text-slate-400">$1</em>')
            }} />
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-lg h-full bg-[#0b0d14] border-l border-amber-500/20 shadow-2xl flex flex-col justify-between">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/10 bg-[#0e111a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/30 to-amber-600/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white font-display">Aegis Risk Co-Pilot</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
                  AI ASSISTANT
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Forensic intelligence & dispute arguments</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Co-Pilot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2.5 bg-black/40 border-b border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-amber-500/15 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-500/40 text-[10px] font-mono transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>{s.length > 32 ? s.substring(0, 32) + '...' : s}</span>
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div 
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[90%] p-3.5 rounded-2xl ${
                  m.role === 'user' 
                    ? 'bg-amber-500/15 border border-amber-500/30 text-slate-100 rounded-tr-xs' 
                    : 'bg-[#121522] border border-white/10 text-slate-200 rounded-tl-xs shadow-lg'
                }`}
              >
                {m.role === 'user' ? (
                  <p className="text-xs leading-relaxed text-amber-100 font-medium">{m.text}</p>
                ) : (
                  renderFormattedText(m.text)
                )}

                {/* Citations Footer */}
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-white/5 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                    <span className="text-slate-500">Sources:</span>
                    {m.citations.map((c, cIdx) => (
                      <span key={cIdx} className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300/80 border border-white/5">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono p-3 bg-[#121522] border border-white/10 rounded-xl w-fit">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Aegis Co-Pilot reasoning...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#0e111a] border-t border-white/10">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about transactions, disputes, cost models..."
              className="flex-1 bg-black/50 border border-white/10 focus:border-amber-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all font-sans"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-black font-bold transition-all cursor-pointer shadow-md shadow-amber-500/20"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Strictly defense-only advice. No automated gateway punishment.</span>
            <span>Aegis Core v2.1</span>
          </div>
        </div>

      </div>
    </div>
  );
}
