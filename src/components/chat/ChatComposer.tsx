import React, { useState, useRef, useEffect } from 'react';
import { Attachment } from '../../types';
import {
  Paperclip,
  ArrowUp,
  Square,
  Mic,
  MicOff,
  X,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Command,
} from 'lucide-react';

interface ChatComposerProps {
  onSendMessage: (text: string, attachments: Attachment[]) => void;
  isStreaming: boolean;
  onStopGeneration: () => void;
  activeModel: string;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  onSendMessage,
  isStreaming,
  onStopGeneration,
  activeModel,
}) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  }, [input]);

  // Setup Web Speech API for voice dictation
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setVoiceNotice('Microphone access paused or restricted.');
        setTimeout(() => setVoiceNotice(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setVoiceSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleVoice = () => {
    if (!voiceSupported || !recognitionRef.current) {
      setVoiceNotice('Voice recognition is not supported in this browser.');
      setTimeout(() => setVoiceNotice(null), 3000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setVoiceNotice('Listening... Speak your prompt naturally.');
      } catch (err) {
        console.error('Voice start error:', err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Validate max size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit.');
        return;
      }

      const reader = new FileReader();
      const isImg = file.type.startsWith('image/');

      reader.onload = () => {
        const newAttachment: Attachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: file.name,
          size: file.size,
          type: isImg ? 'image' : 'document',
          mimeType: file.type || 'text/plain',
          data: reader.result as string,
        };

        setAttachments((prev) => [...prev, newAttachment]);
      };

      if (isImg) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });

    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = () => {
    if (isStreaming) return;
    const trimmed = input.trim();
    if (!trimmed && attachments.length === 0) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    onSendMessage(trimmed, attachments);
    setInput('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-t from-[#070709] via-[#070709]/90 to-transparent shrink-0">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Voice Feedback Notification */}
        {voiceNotice && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 backdrop-blur-md">
            <div className="flex items-center gap-2">
              {isListening ? (
                <div className="flex items-center gap-1">
                  <span className="w-1 h-3 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="w-1 h-4 rounded-full bg-indigo-400 animate-pulse [animation-delay:0.15s]" />
                  <span className="w-1 h-2 rounded-full bg-purple-400 animate-pulse [animation-delay:0.3s]" />
                </div>
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{voiceNotice}</span>
            </div>
            {isListening && (
              <button
                onClick={toggleVoice}
                className="text-xs font-semibold text-white underline hover:no-underline"
              >
                Stop dictation
              </button>
            )}
          </div>
        )}

        {/* Attachment Chips Preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-1">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-[#15151B] border border-white/10 text-xs text-[#F5F5F7] shadow-sm"
              >
                {att.type === 'image' && att.data ? (
                  <img
                    src={att.data}
                    alt={att.name}
                    className="w-5 h-5 rounded object-cover shrink-0"
                  />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
                <span className="max-w-[140px] truncate">{att.name}</span>
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="p-1 rounded-full hover:bg-white/10 text-[#9A9AA3] hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Rounded Input Container with Subtle Gradient Focus */}
        <div className="relative rounded-2xl bg-[#0E0E12] border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-2xl transition-all duration-200">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening ? 'Listening to speech...' : 'Ask AURA anything... (Shift+Enter for new line)'
            }
            className="w-full bg-transparent px-4 pt-3.5 pb-12 text-sm sm:text-base text-white placeholder-[#9A9AA3]/60 focus:outline-none resize-none leading-relaxed min-h-[54px] max-h-[180px]"
          />

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.txt,.md,.json,.ts,.js,.py,.csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Bottom Bar: Action Buttons */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
            {/* Left Controls: Attachments & Voice */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach image, document or code file"
                className="p-2 rounded-xl text-[#9A9AA3] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={toggleVoice}
                title={isListening ? 'Stop voice input' : 'Voice input dictation'}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isListening
                    ? 'text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 animate-pulse'
                    : 'text-[#9A9AA3] hover:text-white hover:bg-white/5'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <span className="hidden sm:inline-block text-[11px] font-mono text-[#9A9AA3]/50 ml-1">
                {activeModel.replace('-', ' ')}
              </span>
            </div>

            {/* Right Controls: Send / Stop */}
            <div className="flex items-center gap-2">
              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStopGeneration}
                  title="Stop generating"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-semibold shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!input.trim() && attachments.length === 0}
                  className={`p-2 rounded-xl transition-all cursor-pointer shadow-md ${
                    input.trim() || attachments.length > 0
                      ? 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-indigo-600/30 hover:scale-105 active:scale-95'
                      : 'bg-white/5 text-[#9A9AA3]/40 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Micro Copy */}
        <div className="flex items-center justify-between px-2 text-[11px] text-[#9A9AA3]/60">
          <span>AURA AI can reason across text, code, and multimodal attachments.</span>
          <span className="hidden sm:inline-block font-mono">Gemini 3.8 Powered</span>
        </div>
      </div>
    </div>
  );
};
