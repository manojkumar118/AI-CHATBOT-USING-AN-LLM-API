export type Role = 'user' | 'assistant' | 'system';

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: 'image' | 'code' | 'pdf' | 'document';
  mimeType: string;
  data?: string; // base64 data url or text content
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  status?: 'sending' | 'streaming' | 'complete' | 'error';
  attachments?: Attachment[];
  model?: string;
  feedback?: 'like' | 'dislike';
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
  archived?: boolean;
  messages: Message[];
  model: string;
  folderId?: string;
}

export interface ModelOption {
  id: string;
  name: string;
  badge?: string;
  desc: string;
  multimodal: boolean;
  backend: string;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  autoScroll: boolean;
  enterToSend: boolean;
  showTimestamps: boolean;
  responseStyle: 'concise' | 'detailed' | 'creative';
  temperature: number;
  defaultModel: string;
  compactMode: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}
