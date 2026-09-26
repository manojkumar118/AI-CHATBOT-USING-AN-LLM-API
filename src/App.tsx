import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, Attachment, UserSettings, ToastMessage } from './types';
import {
  getStoredConversations,
  saveStoredConversations,
  getStoredSettings,
  saveStoredSettings,
  getStoredActiveConvId,
  saveStoredActiveConvId,
  INITIAL_CONVERSATIONS,
} from './utils/storage';
import { streamChatCompletion } from './services/chatService';

// Components
import { LandingPage } from './components/landing/LandingPage';
import { Sidebar } from './components/chat/Sidebar';
import { ChatHeader, MODELS } from './components/chat/ChatHeader';
import { MessageList } from './components/chat/MessageList';
import { ChatComposer } from './components/chat/ChatComposer';

// Modals & Feedback
import { SearchModal } from './components/modals/SearchModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ShortcutsModal } from './components/modals/ShortcutsModal';
import { SecurityModal } from './components/modals/SecurityModal';
import { DeleteConfirmModal } from './components/modals/DeleteConfirmModal';
import { Toast } from './components/common/Toast';

export default function App() {
  // Navigation View: 'landing' or 'app'
  const [view, setView] = useState<'landing' | 'app'>('landing');

  // Application Data State
  const [conversations, setConversations] = useState<Conversation[]>(getStoredConversations);
  const [activeConvId, setActiveConvId] = useState<string>(getStoredActiveConvId);
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings);

  // Streaming State
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [deleteModalConv, setDeleteModalConv] = useState<Conversation | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Active Conversation reference
  const activeConversation =
    conversations.find((c) => c.id === activeConvId) || conversations[0] || INITIAL_CONVERSATIONS[0];

  // Sync theme with HTML root element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [settings.theme]);

  // Persist conversation updates
  useEffect(() => {
    saveStoredConversations(conversations);
  }, [conversations]);

  // Persist settings updates
  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  // Persist active conversation id
  useEffect(() => {
    saveStoredActiveConvId(activeConvId);
  }, [activeConvId]);

  // Toast Helper
  const addToast = (title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K: Open Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Ctrl+Shift+O or Cmd+Shift+O: New Chat
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleNewChat();
      }
      // Esc: Close Modals
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSettingsOpen(false);
        setShortcutsOpen(false);
        setSecurityOpen(false);
        setDeleteModalConv(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Conversation Actions
  const handleNewChat = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      model: settings.defaultModel || 'aura-standard',
      messages: [],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newConv.id);
    setView('app');
    setSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    if (isStreaming) {
      handleStopGeneration();
    }
    setActiveConvId(id);
    setView('app');
    setSidebarOpen(false);
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: Date.now() } : c))
    );
    addToast('Conversation renamed', newTitle, 'info');
  };

  const handleTogglePin = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextPinned = !c.pinned;
          addToast(nextPinned ? 'Conversation pinned' : 'Conversation unpinned', c.title, 'info');
          return { ...c, pinned: nextPinned };
        }
        return c;
      })
    );
  };

  const handleToggleArchive = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextArchived = !c.archived;
          addToast(nextArchived ? 'Conversation archived' : 'Conversation unarchived', c.title, 'info');
          return { ...c, archived: nextArchived };
        }
        return c;
      })
    );
  };

  const handleDeleteConversation = (id: string) => {
    const target = conversations.find((c) => c.id === id);
    if (!target) return;
    setDeleteModalConv(target);
  };

  const confirmDeleteConversation = () => {
    if (!deleteModalConv) return;
    const remaining = conversations.filter((c) => c.id !== deleteModalConv.id);
    setConversations(remaining);
    addToast('Conversation deleted', deleteModalConv.title, 'warning');

    if (activeConvId === deleteModalConv.id) {
      if (remaining.length > 0) {
        setActiveConvId(remaining[0].id);
      } else {
        handleNewChat();
      }
    }
    setDeleteModalConv(null);
  };

  const handleSelectModel = (modelId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvId ? { ...c, model: modelId } : c))
    );
    const modelObj = MODELS.find((m) => m.id === modelId);
    addToast('Engine switched', modelObj?.name, 'info');
  };

  // Sending Messages & Streaming
  const handleSendMessage = async (text: string, attachments: Attachment[] = []) => {
    if (isStreaming) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      status: 'complete',
      attachments,
    };

    // Calculate updated conversation title if this is the first turn
    const isFirstMessage = activeConversation.messages.length === 0;
    const autoTitle = isFirstMessage
      ? text.slice(0, 36) + (text.length > 36 ? '...' : '')
      : activeConversation.title;

    // Update conversation with user message immediately
    const updatedMessages = [...activeConversation.messages, userMessage];

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              title: autoTitle,
              updatedAt: Date.now(),
              messages: updatedMessages,
            }
          : c
      )
    );

    // Prepare streaming
    setIsStreaming(true);
    setStreamingContent('');
    const controller = new AbortController();
    abortControllerRef.current = controller;

    let accumulated = '';

    await streamChatCompletion({
      messages: updatedMessages,
      model: activeConversation.model || 'aura-standard',
      attachments,
      signal: controller.signal,
      onChunk: (chunk: string) => {
        accumulated += chunk;
        setStreamingContent(accumulated);
      },
      onDone: () => {
        setIsStreaming(false);
        const finalContent = accumulated;

        if (finalContent) {
          const assistantMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            role: 'assistant',
            content: finalContent,
            timestamp: Date.now(),
            status: 'complete',
            model: activeConversation.model,
          };

          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConvId
                ? {
                    ...c,
                    updatedAt: Date.now(),
                    messages: [...c.messages, assistantMessage],
                  }
                : c
            )
          );
        }

        setStreamingContent('');
        abortControllerRef.current = null;
      },
      onError: (err: string) => {
        setIsStreaming(false);
        addToast('Generation error', err, 'error');

        // Add error message to conversation
        const errorMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: `*Error encountered during generation:* ${err}\n\nPlease check connection or try again shortly.`,
          timestamp: Date.now(),
          status: 'error',
          model: activeConversation.model,
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  updatedAt: Date.now(),
                  messages: [...c.messages, errorMessage],
                }
              : c
          )
        );

        setStreamingContent('');
        abortControllerRef.current = null;
      },
    });
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);

    if (streamingContent.trim()) {
      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: streamingContent + ' *(Stopped)*',
        timestamp: Date.now(),
        status: 'complete',
        model: activeConversation.model,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? {
                ...c,
                updatedAt: Date.now(),
                messages: [...c.messages, assistantMessage],
              }
            : c
        )
      );
    }

    setStreamingContent('');
    addToast('Generation halted', undefined, 'info');
  };

  const handleRegenerate = () => {
    if (isStreaming || activeConversation.messages.length === 0) return;
    // Find last user message
    const msgs = [...activeConversation.messages];
    const lastUserIdx = msgs.map((m) => m.role).lastIndexOf('user');
    if (lastUserIdx === -1) return;

    const lastUserMsg = msgs[lastUserIdx];
    // Trim messages up to that user turn
    const trimmed = msgs.slice(0, lastUserIdx);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              updatedAt: Date.now(),
              messages: trimmed,
            }
          : c
      )
    );

    // Re-send
    handleSendMessage(lastUserMsg.content, lastUserMsg.attachments || []);
  };

  const handleContinue = () => {
    handleSendMessage('Please continue from where you left off with full detail.');
  };

  const handleFeedback = (msgId: string, feedback: 'like' | 'dislike') => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === msgId ? { ...m, feedback } : m
              ),
            }
          : c
      )
    );
    addToast('Feedback recorded', 'Thank you for helping train our neural model.', 'success');
  };

  const handleShare = () => {
    const transcript = activeConversation.messages
      .map((m) => `${m.role === 'user' ? 'User' : 'AURA'}: ${m.content}`)
      .join('\n\n---\n\n');

    navigator.clipboard.writeText(transcript);
    addToast('Transcript copied', 'Full conversation transcript copied to clipboard.', 'success');
  };

  const handleExportMarkdown = () => {
    const mdContent = `# ${activeConversation.title}\n*Generated by AURA AI (${activeConversation.model}) on ${new Date().toLocaleString()}*\n\n` +
      activeConversation.messages
        .map((m) => `### ${m.role === 'user' ? 'You' : 'AURA'}\n\n${m.content}`)
        .join('\n\n---\n\n');

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeConversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Export complete', 'Markdown file downloaded.', 'success');
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(activeConversation, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeConversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Export complete', 'JSON file downloaded.', 'success');
  };

  const handleExportAllConversations = () => {
    const blob = new Blob([JSON.stringify(conversations, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura_ai_conversations_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Export complete', 'All conversations exported to JSON.', 'success');
  };

  const handleClearChat = () => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvId ? { ...c, messages: [] } : c))
    );
    addToast('Messages cleared', 'Active conversation reset.', 'info');
  };

  const handleClearAllConversations = () => {
    const freshConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      model: 'aura-standard',
      messages: [],
    };
    setConversations([freshConv]);
    setActiveConvId(freshConv.id);
    addToast('All conversations purged', undefined, 'warning');
  };

  const toggleTheme = () => {
    const next = settings.theme === 'dark' ? 'light' : 'dark';
    setSettings((prev) => ({ ...prev, theme: next }));
  };

  return (
    <div className="relative min-h-screen bg-[#070709] text-[#F5F5F7] font-sans overflow-hidden flex flex-col">
      {view === 'landing' ? (
        <LandingPage
          onStartChat={() => setView('app')}
          onOpenSecurity={() => setSecurityOpen(true)}
          theme={settings.theme === 'light' ? 'light' : 'dark'}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <div className="flex h-screen w-screen overflow-hidden bg-[#070709]">
          {/* Collapsible Sidebar */}
          <Sidebar
            conversations={conversations}
            activeId={activeConvId}
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
            onOpenSearch={() => setSearchOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenShortcuts={() => setShortcutsOpen(true)}
            onOpenSecurity={() => setSecurityOpen(true)}
            onRenameConversation={handleRenameConversation}
            onTogglePin={handleTogglePin}
            onToggleArchive={handleToggleArchive}
            onDeleteConversation={handleDeleteConversation}
            isOpen={sidebarOpen}
            onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
            onBackToHome={() => setView('landing')}
          />

          {/* Main Chat Workspace */}
          <main className="flex-1 flex flex-col h-full min-w-0 bg-[#070709] relative">
            {/* Top Workspace Bar */}
            <ChatHeader
              title={activeConversation.title}
              onRename={(newTitle) => handleRenameConversation(activeConvId, newTitle)}
              currentModel={activeConversation.model || 'aura-standard'}
              onSelectModel={handleSelectModel}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onBackToHome={() => setView('landing')}
              onShare={handleShare}
              onExportMarkdown={handleExportMarkdown}
              onExportJson={handleExportJson}
              onClearChat={handleClearChat}
              theme={settings.theme === 'light' ? 'light' : 'dark'}
              onToggleTheme={toggleTheme}
            />

            {/* Conversation Messages */}
            <MessageList
              messages={activeConversation.messages}
              isStreaming={isStreaming}
              streamingContent={streamingContent}
              activeModel={activeConversation.model || 'aura-standard'}
              onSelectPrompt={(prompt) => handleSendMessage(prompt)}
              onRegenerate={handleRegenerate}
              onContinue={handleContinue}
              onCopyMessage={(text) => addToast('Message copied to clipboard', undefined, 'success')}
              onFeedback={handleFeedback}
            />

            {/* Bottom Composer */}
            <ChatComposer
              onSendMessage={handleSendMessage}
              isStreaming={isStreaming}
              onStopGeneration={handleStopGeneration}
              activeModel={activeConversation.model || 'aura-standard'}
            />
          </main>
        </div>
      )}

      {/* Global Modals */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings(newSettings)}
        onClearAllConversations={handleClearAllConversations}
        onExportAllConversations={handleExportAllConversations}
      />

      <ShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      <SecurityModal
        isOpen={securityOpen}
        onClose={() => setSecurityOpen(false)}
      />

      <DeleteConfirmModal
        isOpen={!!deleteModalConv}
        onClose={() => setDeleteModalConv(null)}
        onConfirm={confirmDeleteConversation}
        title={deleteModalConv?.title || ''}
      />

      {/* Toast Notification Stack */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
