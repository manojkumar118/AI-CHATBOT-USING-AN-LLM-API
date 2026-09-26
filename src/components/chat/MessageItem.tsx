import React, { useState } from 'react';
import { Message } from '../../types';
import { AuraLogo } from '../common/AuraLogo';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  Copy,
  Check,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  Share2,
  FileText,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface MessageItemProps {
  message: Message;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  onContinue?: () => void;
  onCopy?: (text: string) => void;
  onFeedback?: (id: string, feedback: 'like' | 'dislike') => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isStreaming = false,
  onRegenerate,
  onContinue,
  onCopy,
  onFeedback,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isThinking = message.status === 'streaming' && !message.content;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    if (onCopy) onCopy(message.content);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`py-5 px-4 sm:px-8 group transition-colors duration-200 ${
        isUser ? 'bg-transparent' : 'bg-white/[0.015]'
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0 pt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
              U
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#15151B] border border-cyan-500/30 flex items-center justify-center shadow-md">
              <AuraLogo size="icon" showText={false} animated={isStreaming} />
            </div>
          )}
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Metadata */}
          <div className="flex items-center justify-between text-xs text-[#9A9AA3]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#F5F5F7]">
                {isUser ? 'You' : 'AURA'}
              </span>
              {!isUser && message.model && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {message.model}
                </span>
              )}
              <span>•</span>
              <span className="text-[11px] text-[#9A9AA3]/60">{formattedTime}</span>
            </div>
          </div>

          {/* Attachments if any */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1 pb-2">
              {message.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-2 p-2 rounded-xl bg-[#0E0E12] border border-white/10 text-xs text-white max-w-xs overflow-hidden"
                >
                  {att.type === 'image' && att.data ? (
                    <img
                      src={att.data}
                      alt={att.name}
                      className="w-10 h-10 object-cover rounded-lg shrink-0 border border-white/10"
                    />
                  ) : (
                    <div className="p-2 rounded-lg bg-white/5 shrink-0">
                      <FileText className="w-4 h-4 text-cyan-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate font-medium">{att.name}</div>
                    <div className="text-[10px] text-[#9A9AA3]">
                      {(att.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Thinking State */}
          {isThinking && (
            <div className="py-2 flex items-center gap-3 text-xs text-cyan-400 font-mono">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>AURA is thinking</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
              </div>
            </div>
          )}

          {/* Message Content */}
          {isUser ? (
            <div className="rounded-2xl rounded-tl-sm bg-[#15151B] border border-white/10 p-4 text-[#F5F5F7] shadow-sm leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
              {message.content}
            </div>
          ) : (
            <div className="pt-0.5">
              <MarkdownRenderer content={message.content} isStreaming={isStreaming} />
            </div>
          )}

          {/* AI Message Action Toolbar */}
          {!isUser && !isStreaming && message.content && (
            <div className="flex items-center gap-1.5 pt-2 opacity-70 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                title="Copy message"
                className="p-1.5 rounded-lg text-[#9A9AA3] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  title="Regenerate response"
                  className="p-1.5 rounded-lg text-[#9A9AA3] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              )}

              {onFeedback && (
                <>
                  <button
                    onClick={() => onFeedback(message.id, 'like')}
                    title="Good response"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      message.feedback === 'like'
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-[#9A9AA3] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFeedback(message.id, 'dislike')}
                    title="Needs improvement"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      message.feedback === 'dislike'
                        ? 'text-rose-400 bg-rose-500/10'
                        : 'text-[#9A9AA3] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              {onContinue && (
                <button
                  onClick={onContinue}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-[#9A9AA3] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
