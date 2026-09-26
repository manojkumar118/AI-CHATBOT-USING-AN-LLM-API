import React, { useState, useEffect } from 'react';
import { Copy, Check, Terminal, Sparkles, CornerDownLeft, RefreshCw } from 'lucide-react';
import { AuraLogo } from '../common/AuraLogo';

export const HeroChatPreview: React.FC<{ onLaunchApp?: () => void }> = ({ onLaunchApp }) => {
  const fullAiText = `Think of a classical computer as a standard light switch that can be either **ON (1)** or **OFF (0)**.

A quantum computer uses **qubits** which can exist in a state called **superposition** — meaning it can effectively explore multiple possibilities simultaneously:

\`\`\`python
# Quantum Superposition Circuit
from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)
qc.h(0)        # Places qubit into superposition
qc.measure(0, 0)
\`\`\`

While a classical system tests labyrinth paths one by one, a quantum system evaluates all potential pathways concurrently.`;

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [copied, setCopied] = useState(false);
  const [iteration, setIteration] = useState(0);

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (index < fullAiText.length) {
        // Stream text with variable chunking
        const chunk = Math.min(3, fullAiText.length - index);
        setDisplayedText(fullAiText.slice(0, index + chunk));
        index += chunk;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [iteration]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(1, 1)\nqc.h(0)\nqc.measure(0, 0)`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReplay = () => {
    setIteration((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl bg-[#0E0E12]/90 border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-indigo-500/40">
      {/* Window Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#15151B]/60">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs font-mono text-[#9A9AA3]">AURA Workspace — Live Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReplay}
            title="Replay animation"
            className="p-1 rounded text-[#9A9AA3] hover:text-white hover:bg-white/5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20">
            gemini-3.8-flash
          </span>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="p-4 sm:p-6 space-y-5 text-sm">
        {/* User Prompt */}
        <div className="flex items-start gap-3 justify-end">
          <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#15151B] border border-white/10 px-4 py-2.5 text-[#F5F5F7] shadow-sm">
            Explain quantum computing in simple terms.
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-semibold text-white shrink-0 shadow-md">
            U
          </div>
        </div>

        {/* AI Response */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#15151B] border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-md">
            <AuraLogo size="icon" showText={false} animated={false} />
          </div>

          <div className="flex-1 space-y-3 min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#9A9AA3]">
              <span className="font-semibold text-[#F5F5F7]">AURA</span>
              <span>•</span>
              <span className="text-[11px]">Streaming response</span>
            </div>

            {/* Formatted Content */}
            <div className="text-[#F5F5F7] leading-relaxed space-y-3 whitespace-pre-wrap font-sans">
              {displayedText.split('```python')[0]}

              {displayedText.includes('```python') && (
                <div className="rounded-xl bg-[#070709] border border-white/10 overflow-hidden my-3">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#15151B]/80 border-b border-white/5 text-xs text-[#9A9AA3]">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>python</span>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white text-[11px] transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                    {displayedText.split('```python')[1]?.split('```')[0] || ''}
                  </pre>
                </div>
              )}

              {displayedText.split('```')[2] && (
                <p>{displayedText.split('```')[2]}</p>
              )}

              {isTyping && (
                <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-cursor-blink align-middle" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Mock Composer Bar */}
      <div className="p-3 sm:p-4 bg-[#15151B]/40 border-t border-white/5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[#9A9AA3]">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Interactive preview with real streaming token latency</span>
        </div>
        <button
          onClick={onLaunchApp}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
        >
          <span>Try AURA Live</span>
          <CornerDownLeft className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
