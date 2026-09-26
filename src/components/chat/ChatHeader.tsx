import React, { useState } from 'react';
import { ModelOption } from '../../types';
import {
  Menu,
  ChevronDown,
  Share2,
  Download,
  Moon,
  Sun,
  Edit2,
  Sparkles,
  ArrowLeft,
  Check,
  MoreVertical,
  Trash2,
  FileCode,
} from 'lucide-react';

interface ChatHeaderProps {
  title: string;
  onRename: (newTitle: string) => void;
  currentModel: string;
  onSelectModel: (modelId: string) => void;
  onToggleSidebar: () => void;
  onBackToHome: () => void;
  onShare: () => void;
  onExportMarkdown: () => void;
  onExportJson: () => void;
  onClearChat: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const MODELS: ModelOption[] = [
  {
    id: 'aura-standard',
    name: 'AURA Standard',
    badge: 'v3.8 Flash',
    desc: 'Fast, versatile intelligence for reasoning, drafting & exploration',
    multimodal: true,
    backend: 'gemini-3.8-flash',
  },
  {
    id: 'aura-pro',
    name: 'AURA Pro',
    badge: 'Deep Reasoning',
    desc: 'Flagship depth for advanced coding, algorithms & architecture',
    multimodal: true,
    backend: 'gemini-3.8-flash',
  },
  {
    id: 'aura-vision',
    name: 'AURA Vision',
    badge: 'Multimodal',
    desc: 'Specialized for image inspection, technical diagrams & OCR',
    multimodal: true,
    backend: 'gemini-3.8-flash',
  },
];

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  onRename,
  currentModel,
  onSelectModel,
  onToggleSidebar,
  onBackToHome,
  onShare,
  onExportMarkdown,
  onExportJson,
  onClearChat,
  theme,
  onToggleTheme,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const selectedModelObj = MODELS.find((m) => m.id === currentModel) || MODELS[0];

  const handleTitleSubmit = () => {
    if (tempTitle.trim()) {
      onRename(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="h-14 sm:h-16 px-4 border-b border-white/5 bg-[#0E0E12]/80 backdrop-blur-xl flex items-center justify-between z-20 shrink-0 select-none">
      {/* Left Area: Toggle + Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
          className="p-1.5 rounded-lg text-[#9A9AA3] hover:text-white hover:bg-white/5 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onBackToHome}
          title="Back to Landing Page"
          className="hidden sm:flex items-center gap-1.5 text-xs text-[#9A9AA3] hover:text-white px-2 py-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Editable Title */}
        <div className="min-w-0 flex items-center gap-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={tempTitle}
              autoFocus
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
              className="bg-[#070709] border border-cyan-500/60 rounded px-2 py-0.5 text-sm text-white font-semibold outline-none max-w-[200px] sm:max-w-xs"
            />
          ) : (
            <button
              onClick={() => {
                setTempTitle(title);
                setIsEditingTitle(true);
              }}
              title="Click to rename conversation"
              className="flex items-center gap-1.5 text-left text-sm font-semibold text-white hover:text-cyan-300 transition-colors truncate max-w-[180px] sm:max-w-xs group cursor-pointer"
            >
              <span className="truncate">{title}</span>
              <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-70 transition-opacity shrink-0" />
            </button>
          )}
        </div>
      </div>

      {/* Center: Model Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => {
            setIsModelDropdownOpen(!isModelDropdownOpen);
            setIsMoreMenuOpen(false);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{selectedModelObj.name}</span>
          <ChevronDown className="w-3 h-3 text-[#9A9AA3]" />
        </button>

        {isModelDropdownOpen && (
          <div
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 rounded-2xl bg-[#15151B] border border-white/10 shadow-2xl p-2 z-50 backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#9A9AA3]">
              Active Intelligence Engine
            </div>

            <div className="space-y-1">
              {MODELS.map((m) => {
                const isSelected = m.id === currentModel;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModel(m.id);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-500/40 text-white'
                        : 'hover:bg-white/5 text-[#9A9AA3] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{m.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {m.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#9A9AA3] leading-snug">{m.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls: Share, More, Theme */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onShare}
          title="Share conversation"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 text-[#9A9AA3] hover:text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>

        <button
          onClick={onToggleTheme}
          title="Toggle theme"
          className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 text-[#9A9AA3] hover:text-white transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
        </button>

        {/* More options menu */}
        <div className="relative">
          <button
            onClick={() => {
              setIsMoreMenuOpen(!isMoreMenuOpen);
              setIsModelDropdownOpen(false);
            }}
            title="More actions"
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 text-[#9A9AA3] hover:text-white transition-colors cursor-pointer"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {isMoreMenuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#15151B] border border-white/10 shadow-2xl py-1 z-50 backdrop-blur-xl text-xs text-[#F5F5F7]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  onExportMarkdown();
                  setIsMoreMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors text-left"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export as Markdown</span>
              </button>
              <button
                onClick={() => {
                  onExportJson();
                  setIsMoreMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors text-left"
              >
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export as JSON</span>
              </button>
              <div className="my-1 border-t border-white/5" />
              <button
                onClick={() => {
                  onClearChat();
                  setIsMoreMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-rose-500/10 text-rose-400 transition-colors text-left"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear conversation</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
