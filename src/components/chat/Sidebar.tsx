import React, { useState } from 'react';
import { Conversation } from '../../types';
import { AuraLogo } from '../common/AuraLogo';
import {
  Plus,
  Search,
  Pin,
  MoreVertical,
  Edit2,
  Trash2,
  Archive,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
  onOpenSecurity: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onBackToHome: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onOpenSearch,
  onOpenSettings,
  onOpenShortcuts,
  onOpenSecurity,
  onRenameConversation,
  onTogglePin,
  onToggleArchive,
  onDeleteConversation,
  isOpen,
  onToggleOpen,
  onBackToHome,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Group conversations chronologically
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  const activeConversations = conversations.filter((c) => !c.archived);
  const pinnedList = activeConversations.filter((c) => c.pinned);
  const unpinnedList = activeConversations.filter((c) => !c.pinned);

  const todayList = unpinnedList.filter((c) => now - c.updatedAt < oneDay);
  const yesterdayList = unpinnedList.filter(
    (c) => now - c.updatedAt >= oneDay && now - c.updatedAt < oneDay * 2
  );
  const previous7DaysList = unpinnedList.filter(
    (c) => now - c.updatedAt >= oneDay * 2 && now - c.updatedAt < oneDay * 7
  );
  const olderList = unpinnedList.filter((c) => now - c.updatedAt >= oneDay * 7);

  const startRename = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
    setMenuOpenId(null);
  };

  const submitRename = (id: string) => {
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const renderConvItem = (conv: Conversation) => {
    const isActive = conv.id === activeId;
    const isEditing = conv.id === editingId;

    return (
      <div
        key={conv.id}
        className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-150 cursor-pointer ${
          isActive
            ? 'bg-gradient-to-r from-indigo-500/15 to-cyan-500/10 text-white font-medium border border-indigo-500/30 shadow-sm'
            : 'text-[#9A9AA3] hover:text-[#F5F5F7] hover:bg-white/[0.04]'
        }`}
        onClick={() => {
          if (!isEditing) onSelectConversation(conv.id);
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
          {conv.pinned ? (
            <Pin className="w-3.5 h-3.5 text-cyan-400 shrink-0 rotate-45" />
          ) : (
            <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
          )}

          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              autoFocus
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => submitRename(conv.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitRename(conv.id);
                if (e.key === 'Escape') setEditingId(null);
              }}
              className="bg-[#070709] border border-cyan-500/60 rounded px-1.5 py-0.5 text-xs text-white outline-none w-full"
            />
          ) : (
            <span className="truncate text-xs font-normal">{conv.title}</span>
          )}
        </div>

        {/* Action button menu trigger */}
        {!isEditing && (
          <div className="relative shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpenId(menuOpenId === conv.id ? null : conv.id);
              }}
              className={`p-1 rounded-md hover:bg-white/10 text-[#9A9AA3] hover:text-white transition-opacity ${
                isActive || menuOpenId === conv.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {/* Context Dropdown Menu */}
            {menuOpenId === conv.id && (
              <div
                className="absolute right-0 top-full mt-1 w-36 rounded-xl bg-[#15151B] border border-white/10 shadow-xl py-1 z-30 text-xs text-[#F5F5F7] backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => startRename(conv)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Rename</span>
                </button>
                <button
                  onClick={() => {
                    onTogglePin(conv.id);
                    setMenuOpenId(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 transition-colors"
                >
                  <Pin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{conv.pinned ? 'Unpin' : 'Pin to top'}</span>
                </button>
                <button
                  onClick={() => {
                    onToggleArchive(conv.id);
                    setMenuOpenId(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 transition-colors"
                >
                  <Archive className="w-3.5 h-3.5 text-amber-400" />
                  <span>Archive</span>
                </button>
                <div className="my-1 border-t border-white/5" />
                <button
                  onClick={() => {
                    onDeleteConversation(conv.id);
                    setMenuOpenId(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggleOpen}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static top-0 bottom-0 left-0 z-40 flex flex-col w-[280px] bg-[#0E0E12] border-r border-white/5 transition-all duration-300 ease-in-out shrink-0 select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-[280px]'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <AuraLogo size="sm" showTagline={false} onClick={onBackToHome} />
          <div className="flex items-center gap-1">
            <button
              onClick={onBackToHome}
              title="Return to Landing Page"
              className="p-1.5 rounded-lg text-[#9A9AA3] hover:text-white hover:bg-white/5 text-xs transition-colors"
            >
              Home
            </button>
            <button
              onClick={onToggleOpen}
              className="md:hidden p-1.5 rounded-lg text-[#9A9AA3] hover:text-white hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Controls: New Chat & Search */}
        <div className="p-3 space-y-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-purple-500/15 hover:from-cyan-500/25 hover:via-indigo-500/25 hover:to-purple-500/25 border border-indigo-500/30 text-white text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>New Conversation</span>
            </div>
            <kbd className="text-[10px] font-mono text-[#9A9AA3] bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
              Ctrl+Shift+O
            </kbd>
          </button>

          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-[#9A9AA3] hover:text-[#F5F5F7] text-xs transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search chats...</span>
            </div>
            <kbd className="text-[10px] font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Conversation History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {/* Pinned Section */}
          {pinnedList.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-3 mb-1.5 text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                <Pin className="w-3 h-3 rotate-45" />
                <span>Pinned</span>
              </div>
              <div className="space-y-0.5">{pinnedList.map(renderConvItem)}</div>
            </div>
          )}

          {/* Today Section */}
          {todayList.length > 0 && (
            <div>
              <div className="px-3 mb-1.5 text-[11px] font-mono text-[#9A9AA3]/70 uppercase tracking-wider">
                Today
              </div>
              <div className="space-y-0.5">{todayList.map(renderConvItem)}</div>
            </div>
          )}

          {/* Yesterday Section */}
          {yesterdayList.length > 0 && (
            <div>
              <div className="px-3 mb-1.5 text-[11px] font-mono text-[#9A9AA3]/70 uppercase tracking-wider">
                Yesterday
              </div>
              <div className="space-y-0.5">{yesterdayList.map(renderConvItem)}</div>
            </div>
          )}

          {/* Previous 7 Days Section */}
          {previous7DaysList.length > 0 && (
            <div>
              <div className="px-3 mb-1.5 text-[11px] font-mono text-[#9A9AA3]/70 uppercase tracking-wider">
                Previous 7 Days
              </div>
              <div className="space-y-0.5">{previous7DaysList.map(renderConvItem)}</div>
            </div>
          )}

          {/* Older Section */}
          {olderList.length > 0 && (
            <div>
              <div className="px-3 mb-1.5 text-[11px] font-mono text-[#9A9AA3]/70 uppercase tracking-wider">
                Older
              </div>
              <div className="space-y-0.5">{olderList.map(renderConvItem)}</div>
            </div>
          )}

          {activeConversations.length === 0 && (
            <div className="p-6 text-center text-xs text-[#9A9AA3]">
              Your conversations will appear here.
            </div>
          )}
        </div>

        {/* Bottom User Profile & Settings Drawer */}
        <div className="p-3 border-t border-white/5 bg-[#0E0E12] space-y-1">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 text-[#9A9AA3] hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white">Researcher Alex</div>
                <div className="text-[10px] text-[#9A9AA3]">AURA Pro Tier</div>
              </div>
            </div>
            <Settings className="w-4 h-4 text-[#9A9AA3]" />
          </button>

          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-[#9A9AA3]">
            <button
              onClick={onOpenShortcuts}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Shortcuts</span>
            </button>
            <button
              onClick={onOpenSecurity}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Shield className="w-3 h-3 text-cyan-400" />
              <span>Security</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
