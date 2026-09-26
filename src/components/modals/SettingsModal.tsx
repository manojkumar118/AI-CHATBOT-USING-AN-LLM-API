import React, { useState } from 'react';
import { UserSettings } from '../../types';
import {
  X,
  Sliders,
  MessageSquare,
  Cpu,
  Shield,
  Moon,
  Sun,
  Laptop,
  Trash2,
  Check,
  Download,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onClearAllConversations: () => void;
  onExportAllConversations: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearAllConversations,
  onExportAllConversations,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'chat' | 'ai' | 'privacy'>('general');
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleChange = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[#0E0E12] border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Tabs Nav */}
        <div className="w-full md:w-48 bg-[#15151B]/60 border-b md:border-b-0 md:border-r border-white/5 p-3 space-y-1 shrink-0">
          <div className="px-3 py-2 text-xs font-bold text-white uppercase tracking-wider">
            Settings
          </div>
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'general'
                ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white border border-indigo-500/30'
                : 'text-[#9A9AA3] hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>General</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white border border-indigo-500/30'
                : 'text-[#9A9AA3] hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span>Chat UX</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white border border-indigo-500/30'
                : 'text-[#9A9AA3] hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>AI Parameters</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white border border-indigo-500/30'
                : 'text-[#9A9AA3] hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Privacy & Data</span>
          </button>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-base font-bold text-white capitalize">
              {activeTab} Preferences
            </h3>
            <div className="flex items-center gap-2">
              {savedNotice && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </span>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-[#9A9AA3] hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6 space-y-6 flex-1 text-sm">
            {activeTab === 'general' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-white mb-2">
                    Theme Appearance
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleChange('theme', 'dark')}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        localSettings.theme === 'dark'
                          ? 'border-cyan-500 bg-cyan-500/10 text-white'
                          : 'border-white/10 text-[#9A9AA3] hover:bg-white/5'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      <span>Dark</span>
                    </button>
                    <button
                      onClick={() => handleChange('theme', 'light')}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        localSettings.theme === 'light'
                          ? 'border-cyan-500 bg-cyan-500/10 text-white'
                          : 'border-white/10 text-[#9A9AA3] hover:bg-white/5'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      <span>Light</span>
                    </button>
                    <button
                      onClick={() => handleChange('theme', 'system')}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        localSettings.theme === 'system'
                          ? 'border-cyan-500 bg-cyan-500/10 text-white'
                          : 'border-white/10 text-[#9A9AA3] hover:bg-white/5'
                      }`}
                    >
                      <Laptop className="w-4 h-4" />
                      <span>System</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-white font-medium text-xs">Compact Sidebar Mode</div>
                    <div className="text-[11px] text-[#9A9AA3]">
                      Reduce padding for higher information density.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.compactMode}
                    onChange={(e) => handleChange('compactMode', e.target.checked)}
                    className="w-4 h-4 accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium text-xs">Enter Key to Send</div>
                    <div className="text-[11px] text-[#9A9AA3]">
                      Pressing Enter submits the prompt, Shift+Enter adds newline.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.enterToSend}
                    onChange={(e) => handleChange('enterToSend', e.target.checked)}
                    className="w-4 h-4 accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium text-xs">Auto-scroll to Latest Token</div>
                    <div className="text-[11px] text-[#9A9AA3]">
                      Smoothly scrolls viewport down as AI streams new tokens.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.autoScroll}
                    onChange={(e) => handleChange('autoScroll', e.target.checked)}
                    className="w-4 h-4 accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium text-xs">Show Message Timestamps</div>
                    <div className="text-[11px] text-[#9A9AA3]">
                      Display human-readable time headers next to each turn.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.showTimestamps}
                    onChange={(e) => handleChange('showTimestamps', e.target.checked)}
                    className="w-4 h-4 accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">
                    Response Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['concise', 'detailed', 'creative'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => handleChange('responseStyle', style)}
                        className={`capitalize p-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                          localSettings.responseStyle === style
                            ? 'border-indigo-500 bg-indigo-500/15 text-white'
                            : 'border-white/10 text-[#9A9AA3] hover:bg-white/5'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-white mb-2">
                    <span>Creativity & Temperature</span>
                    <span className="font-mono text-cyan-400">{localSettings.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={localSettings.temperature}
                    onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#9A9AA3] mt-1 font-mono">
                    <span>Precise (0.0)</span>
                    <span>Balanced (0.7)</span>
                    <span>Inventive (1.0)</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-semibold text-white mb-1">
                    Export Chat History
                  </div>
                  <p className="text-[11px] text-[#9A9AA3] mb-3">
                    Download all your conversations in structured JSON or Markdown format.
                  </p>
                  <button
                    onClick={onExportAllConversations}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download All Conversations (JSON)</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="text-xs font-semibold text-rose-400 mb-1">
                    Danger Zone
                  </div>
                  <p className="text-[11px] text-[#9A9AA3] mb-3">
                    Permanently delete all saved conversations from local browser storage.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete all conversations?')) {
                        onClearAllConversations();
                        onClose();
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold cursor-pointer transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete All Conversations</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-[#15151B]/40 border-t border-white/5 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white text-[#070709] font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
