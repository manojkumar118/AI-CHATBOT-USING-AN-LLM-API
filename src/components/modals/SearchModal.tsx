import React, { useState, useEffect } from 'react';
import { Conversation } from '../../types';
import { Search, X, MessageSquare, ArrowRight, CornerDownLeft } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  conversations,
  onSelectConversation,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter conversations by title or message content
  const filtered = conversations.filter((c) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const titleMatch = c.title.toLowerCase().includes(q);
    const messageMatch = c.messages.some((m) => m.content.toLowerCase().includes(q));
    return titleMatch || messageMatch;
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      if (filtered[selectedIndex]) {
        onSelectConversation(filtered[selectedIndex].id);
        onClose();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/70 backdrop-blur-md transition-all"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-[#0E0E12] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[75vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-[#15151B]/50">
          <Search className="w-4 h-4 text-cyan-400 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            autoFocus
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search conversations, topics, code..."
            className="w-full bg-transparent text-sm text-white placeholder-[#9A9AA3] focus:outline-none"
          />
          <kbd className="text-[10px] font-mono text-[#9A9AA3] bg-white/5 px-2 py-0.5 rounded border border-white/10 shrink-0">
            Esc
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((conv, idx) => {
              const isSelected = idx === selectedIndex;
              const lastMsg = conv.messages[conv.messages.length - 1]?.content || '';
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/15 border border-indigo-500/30 text-white'
                      : 'hover:bg-white/5 text-[#9A9AA3]'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-white/5 text-cyan-400 shrink-0 mt-0.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {conv.title}
                      </div>
                      <div className="text-xs text-[#9A9AA3] truncate max-w-sm sm:max-w-md mt-0.5">
                        {lastMsg.slice(0, 100)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] font-mono text-[#9A9AA3]">
                      {new Date(conv.updatedAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-[#9A9AA3]">
              No conversations found matching "{query}"
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-[#15151B]/50 border-t border-white/5 flex items-center justify-between text-[11px] text-[#9A9AA3]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span>{filtered.length} results</span>
        </div>
      </div>
    </div>
  );
};
