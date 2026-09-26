import React from 'react';
import { X, ShieldCheck, Lock, Key, Server, EyeOff, FileText } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-[#0E0E12] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#15151B]/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                AURA Security & Data Architecture
              </h3>
              <p className="text-xs text-[#9A9AA3]">
                Transparent principles behind API isolation and user privacy.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#9A9AA3] hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs sm:text-sm text-[#9A9AA3] leading-relaxed">
          {/* Item 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>1. Zero Client-Side Secret Exposure</span>
            </div>
            <p>
              Your LLM API credentials (such as <code className="font-mono text-cyan-300 bg-white/5 px-1 py-0.5 rounded">GEMINI_API_KEY</code>) are strictly processed server-side in node runtime environments. They are never sent to the browser, injected into Vite bundles, or exposed in client network inspection tools.
            </p>
          </div>

          {/* Item 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Server className="w-4 h-4 text-indigo-400" />
              <span>2. Full-Stack Proxy Architecture</span>
            </div>
            <p>
              Conversational prompts and streaming tokens pass through an Express-driven API gateway (<code className="font-mono text-indigo-300 bg-white/5 px-1 py-0.5 rounded">POST /api/chat</code>) that validates message schemas, limits payload sizes, and encapsulates downstream error handling before returning Server-Sent Events (SSE).
            </p>
          </div>

          {/* Item 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>3. Localized Conversation Storage</span>
            </div>
            <p>
              Conversation histories and user configuration preferences are stored in the client's browser local storage by default. You retain full control over this data, with instant options to export to JSON or permanently purge all records.
            </p>
          </div>

          {/* Item 4 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <EyeOff className="w-4 h-4 text-amber-400" />
              <span>4. Data Isolation & No Cross-Session Telemetry</span>
            </div>
            <p>
              AURA does not record telemetry on your prompt contents or share transcripts across user sessions. Models adhere to standard developer API data guidelines where API inputs are not used for public model retraining.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#9A9AA3]">
            <span className="font-semibold text-white">Audit Standard:</span> Compliant with modern web security practices, CSP guidelines, and TLS 1.3 transport encryption.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#15151B]/50 border-t border-white/5 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-[#070709] text-xs font-bold hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
