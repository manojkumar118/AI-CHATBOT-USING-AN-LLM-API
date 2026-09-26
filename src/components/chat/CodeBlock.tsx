import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'code', code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy code:', e);
    }
  };

  const lines = code.trim().split('\n');
  const showLineNumbers = lines.length > 2;

  return (
    <div className="my-4 rounded-xl bg-[#070709] border border-white/10 overflow-hidden shadow-lg transition-all hover:border-white/20">
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#15151B]/80 border-b border-white/5 text-xs text-[#9A9AA3]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-white/80 lowercase">{language || 'code'}</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#F5F5F7] text-xs transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#9A9AA3]" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content with Line Numbers */}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed flex">
        {showLineNumbers && (
          <div className="select-none pr-4 text-right text-white/20 font-mono shrink-0 border-r border-white/5">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}
        <pre className={`${showLineNumbers ? 'pl-4' : ''} text-cyan-100 flex-1 overflow-x-auto whitespace-pre`}>
          <code>{code.trim()}</code>
        </pre>
      </div>
    </div>
  );
};
