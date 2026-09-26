import React, { useRef, useEffect, useState } from 'react';
import { Message } from '../../types';
import { MessageItem } from './MessageItem';
import { EmptyState } from './EmptyState';
import { ArrowDown } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  activeModel: string;
  onSelectPrompt: (promptText: string) => void;
  onRegenerate: () => void;
  onContinue: () => void;
  onCopyMessage: (text: string) => void;
  onFeedback: (id: string, feedback: 'like' | 'dislike') => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isStreaming,
  streamingContent,
  activeModel,
  onSelectPrompt,
  onRegenerate,
  onContinue,
  onCopyMessage,
  onFeedback,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const userScrolledUpRef = useRef(false);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    // If user is more than 120px away from bottom, mark as scrolled up
    const isUp = distanceFromBottom > 120;
    userScrolledUpRef.current = isUp;
    setShowScrollBottom(isUp);
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    bottomAnchorRef.current?.scrollIntoView({ behavior });
    userScrolledUpRef.current = false;
    setShowScrollBottom(false);
  };

  // Auto-scroll on new chunks or messages only if user hasn't explicitly scrolled up
  useEffect(() => {
    if (!userScrolledUpRef.current) {
      scrollToBottom('auto');
    }
  }, [messages, streamingContent, isStreaming]);

  if (messages.length === 0 && !isStreaming) {
    return <EmptyState onSelectPrompt={onSelectPrompt} />;
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto relative scroll-smooth divide-y divide-white/5"
    >
      {messages.map((msg, idx) => (
        <MessageItem
          key={msg.id || idx}
          message={msg}
          onRegenerate={idx === messages.length - 1 && msg.role === 'assistant' ? onRegenerate : undefined}
          onContinue={idx === messages.length - 1 && msg.role === 'assistant' ? onContinue : undefined}
          onCopy={onCopyMessage}
          onFeedback={onFeedback}
        />
      ))}

      {/* Streaming Assistant Placeholder */}
      {isStreaming && (
        <MessageItem
          message={{
            id: 'streaming-assistant',
            role: 'assistant',
            content: streamingContent,
            timestamp: Date.now(),
            status: 'streaming',
            model: activeModel,
          }}
          isStreaming={true}
        />
      )}

      {/* Bottom anchor for scrolling */}
      <div ref={bottomAnchorRef} className="h-6" />

      {/* "↓ New response" Floating Pill */}
      {showScrollBottom && (
        <div className="sticky bottom-4 left-0 right-0 flex justify-center pointer-events-none z-30">
          <button
            onClick={() => scrollToBottom('smooth')}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-[#15151B]/95 hover:bg-[#1E1E26] border border-cyan-500/30 text-white text-xs font-semibold shadow-xl shadow-black/40 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ArrowDown className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            <span>New response</span>
          </button>
        </div>
      )}
    </div>
  );
};
