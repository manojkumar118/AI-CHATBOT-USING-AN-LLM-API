import { Message, Attachment } from '../types';

export interface StreamChatParams {
  messages: Message[];
  model: string;
  attachments?: Attachment[];
  onChunk: (chunk: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
  signal?: AbortSignal;
}

export async function streamChatCompletion({
  messages,
  model,
  attachments = [],
  onChunk,
  onDone,
  onError,
  signal,
}: StreamChatParams): Promise<void> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          attachments: m.attachments,
        })),
        model,
        attachments,
      }),
      signal,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server returned ${response.status}: ${errText}`);
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported by response');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmed.slice(6));
            if (data.chunk) {
              onChunk(data.chunk);
            }
            if (data.done) {
              onDone();
              return;
            }
            if (data.error) {
              onError(data.error);
              return;
            }
          } catch (e) {
            // Ignore partial JSON parsing during line splits
          }
        }
      }
    }

    onDone();
  } catch (err: any) {
    if (signal?.aborted) {
      onDone();
      return;
    }
    console.error('Chat stream failed:', err);
    onError(err.message || 'Connection interrupted.');
  }
}
