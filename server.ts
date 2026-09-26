import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '20mb' }));

// Initialize Gemini Client server-side
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health & Status endpoint
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    provider: process.env.GEMINI_API_KEY ? 'gemini' : 'demo',
    activeModel: 'gemini-3.8-flash',
    supportedModels: [
      { id: 'aura-standard', name: 'AURA Standard', desc: 'Fast, versatile intelligence for daily tasks', backend: 'gemini-3.8-flash' },
      { id: 'aura-pro', name: 'AURA Pro', desc: 'Deep reasoning, advanced coding & mathematics', backend: 'gemini-3.8-flash' },
      { id: 'aura-vision', name: 'AURA Vision', desc: 'Multimodal vision and visual understanding', backend: 'gemini-3.8-flash' },
    ],
  });
});

// Contextual intelligent responses for Demo Mode
function generateContextualDemoResponse(userPrompt: string, history: Array<{ role: string; content: string }>): string {
  const lower = userPrompt.toLowerCase();
  
  if (lower.includes('name') && (lower.includes('what is my') || lower.includes("what's my"))) {
    for (let i = history.length - 1; i >= 0; i--) {
      const prev = history[i];
      if (prev.role === 'user') {
        const match = prev.content.match(/(?:my name is|i am|call me)\s+([A-Za-z]+)/i);
        if (match && match[1]) {
          return `Based on our conversation history, your name is **${match[1]}**.\n\nAURA maintains persistent conversational context across our dialogue. How can I assist you further today?`;
        }
      }
    }
  }

  if (lower.includes('quantum computing') || lower.includes('quantum')) {
    return `### Understanding Quantum Computing

Think of a classical computer as a standard light switch that can be strictly **ON (1)** or **OFF (0)**. 

A quantum computer, by contrast, operates on **qubits** which harness the fundamental principles of quantum mechanics:

1. **Superposition**: Unlike binary bits, a qubit can exist in a linear combination of states $|0\\rangle$ and $|1\\rangle$ simultaneously, represented as:
   $$\\lvert \\psi \\rangle = \\alpha \\lvert 0 \\rangle + \\beta \\lvert 1 \\rangle$$
   where $|\\alpha|^2 + |\\beta|^2 = 1$.

2. **Entanglement**: Qubits can be linked such that the state of one instantaneously influences another, regardless of physical separation.

3. **Quantum Interference**: Quantum algorithms amplify constructive interference toward the correct solution while destructively canceling incorrect paths.

\`\`\`python
# Simple Qiskit quantum circuit demonstration
from qiskit import QuantumCircuit

# Initialize a 2-qubit circuit with 2 classical measurement registers
qc = QuantumCircuit(2, 2)

# Create a Bell State (entangled pair)
qc.h(0)         # Hadamard gate places qubit 0 in superposition
qc.cx(0, 1)     # CNOT gate entangles qubit 0 and 1
qc.measure([0, 1], [0, 1])

print(qc.draw())
\`\`\`

> **Key takeaway:** While classical computers solve complex tasks sequentially, quantum systems evaluate exponentially large solution spaces in parallel.`;
  }

  if (lower.includes('react') || lower.includes('dashboard') || lower.includes('code') || lower.includes('frontend')) {
    return `### Modern React Analytics Dashboard Architecture

Here is a clean, scalable component pattern using **React 19**, **Tailwind CSS**, and modern hooks:

\`\`\`tsx
import React, { useState, useMemo } from 'react';
import { Activity, TrendingUp, Users, Zap } from 'lucide-react';

interface Metric {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

export const MetricsGrid = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const metrics: Metric[] = useMemo(() => [
    { title: 'Total Inferences', value: '2.4M', change: '+18.4%', positive: true, icon: Zap },
    { title: 'Active Sessions', value: '48.2k', change: '+12.1%', positive: true, icon: Users },
    { title: 'Token Throughput', value: '984k/s', change: '+32.8%', positive: true, icon: TrendingUp },
    { title: 'Avg Latency', value: '142ms', change: '-8.5%', positive: true, icon: Activity },
  ], [timeRange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-[#0E0E12] rounded-2xl border border-white/10">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/40 transition-all">
            <div className="flex items-center justify-between text-[#9A9AA3] text-sm">
              <span>{metric.title}</span>
              <Icon className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{metric.value}</div>
            <div className={\`text-xs mt-1 \${metric.positive ? 'text-emerald-400' : 'text-rose-400'}\`}>
              {metric.change} vs previous period
            </div>
          </div>
        );
      })}
    </div>
  );
};
\`\`\`

#### Key Highlights:
- **Zero unnecessary re-renders** with \`useMemo\`
- **Accessible markup** and high-contrast color tokens
- **Subtle hover micro-interactions** that feel organic`;
  }

  if (lower.includes('machine learning') || lower.includes('ml') || lower.includes('ai')) {
    return `### Foundations of Machine Learning

Machine Learning (ML) teaches computational systems to discover patterns in data rather than following hardcoded rule-sets.

#### 1. The Core Paradigm Shift
- **Traditional Software:** Input Data + Explicit Rules $\\rightarrow$ Answers
- **Machine Learning:** Input Data + Desired Answers $\\rightarrow$ Learned Rules (Weights & Biases)

#### 2. Primary Methodologies
| Paradigm | Objective | Typical Algorithms |
| :--- | :--- | :--- |
| **Supervised Learning** | Mapping inputs $X$ to labeled ground truth $y$ | Transformers, XGBoost, ResNets |
| **Self-Supervised / Unsupervised** | Discovering latent structure without labels | Autoencoders, Masked LLMs, K-Means |
| **Reinforcement Learning (RLHF)** | Maximizing expected cumulative reward | PPO, DPO, Policy Gradients |

\`\`\`python
import torch
import torch.nn as nn

# Minimal Feedforward Neural Network module
class AuraPerceptron(nn.Module):
    def __init__(self, in_features: int, hidden_dim: int, out_classes: int):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(in_features, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.GELU(),
            nn.Dropout(p=0.1),
            nn.Linear(hidden_dim, out_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.network(x)
\`\`\`

Would you like to explore mathematical optimization (gradient descent), attention mechanisms, or fine-tuning techniques?`;
  }

  if (lower.includes('interview') || lower.includes('career') || lower.includes('prep')) {
    return `### Executive Tech Interview Preparation Strategy

To stand out in high-caliber engineering and AI startup interviews, structure your responses around the **STAR-L (Situation, Task, Action, Result, Learnings)** framework.

#### 1. System Design Mental Model
- **Clarify & Scope:** Functional vs non-functional constraints (throughput, latency, consistency vs availability).
- **Back-of-the-Envelope Calculations:** Storage per year, read/write QPS, network bandwidth.
- **High-Level Blueprint:** API Gateway $\\rightarrow$ Stateless Microservices $\\rightarrow$ Distributed Cache (Redis) $\\rightarrow$ Partitioned DB.
- **Deep Dive & Bottlenecks:** Single point of failure (SPOF), replication lag, circuit breakers.

#### 2. Behavioral & Leadership Signals
Focus on:
- **Ownership:** When something failed, how did you lead the root-cause analysis without deflection?
- **Technical Rigor:** Defending design trade-offs with empirical telemetry rather than dogma.
- **Velocity vs Quality:** Delivering iterative value under strict launch deadlines.

Would you like to conduct a simulated technical mock interview or review specific algorithms?`;
  }

  return `### Comprehensive Analysis

Thank you for your prompt: **"${userPrompt}"**

I have analyzed the request through AURA's multi-step reasoning framework:

1. **Context Alignment**: Evaluating intent, technical parameters, and conceptual clarity.
2. **Synthesis**: Generating structured insights with precision and high actionable density.
3. **Iterative Refinement**: Formatted with modular markdown, code snippets, and key takeaways.

\`\`\`json
{
  "engine": "AURA Intelligence Suite",
  "status": "synthesized",
  "latency_budget": "optimized",
  "capabilities": ["deep_reasoning", "code_generation", "multimodal_context"]
}
\`\`\`

Feel free to ask a follow-up question, request alternative implementations, or have me drill deeper into any specific aspect!`;
}

// Chat Streaming Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { messages = [], model = 'aura-standard', attachments = [] } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendChunk = (text: string) => {
    res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
  };

  const sendDone = () => {
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  };

  const sendError = (errMsg: string) => {
    res.write(`data: ${JSON.stringify({ error: errMsg })}\n\n`);
    res.end();
  };

  const lastUserMsg = messages[messages.length - 1];
  const userPrompt = lastUserMsg?.content || '';

  // If Gemini API is configured, use real LLM streaming via @google/genai
  if (aiClient && process.env.GEMINI_API_KEY) {
    try {
      // Map to appropriate Gemini model
      const targetModel = 'gemini-3.8-flash';

      // Build conversation parts
      const contents: any[] = [];

      // Format previous messages
      for (const msg of messages) {
        if (!msg.content && (!msg.attachments || msg.attachments.length === 0)) continue;

        const role = msg.role === 'user' ? 'user' : 'model';
        const parts: any[] = [];

        // If there are attachments for this message (like images)
        if (msg.attachments && Array.isArray(msg.attachments)) {
          for (const att of msg.attachments) {
            if (att.data && att.mimeType) {
              const base64Data = att.data.includes('base64,')
                ? att.data.split('base64,')[1]
                : att.data;

              parts.push({
                inlineData: {
                  mimeType: att.mimeType,
                  data: base64Data,
                },
              });
            }
          }
        }

        if (msg.content) {
          parts.push({ text: msg.content });
        }

        contents.push({ role, parts });
      }

      // If attachments were sent in the root request payload for the latest prompt
      if (attachments && attachments.length > 0 && contents.length > 0) {
        const lastContent = contents[contents.length - 1];
        for (const att of attachments) {
          if (att.data && att.mimeType) {
            const base64Data = att.data.includes('base64,')
              ? att.data.split('base64,')[1]
              : att.data;
            lastContent.parts.unshift({
              inlineData: {
                mimeType: att.mimeType,
                data: base64Data,
              },
            });
          }
        }
      }

      const streamResponse = await aiClient.models.generateContentStream({
        model: targetModel,
        contents,
        config: {
          systemInstruction:
            'You are AURA AI — a next-generation conversational intelligence platform designed with Apple-level minimalism, Linear-style polish, and deep technical rigor. Tagline: "Intelligence that moves with you." Provide insightful, articulate, accurately formatted markdown responses with syntax-highlighted code blocks, clear structure, and direct answers without unnecessary fluff.',
        },
      });

      for await (const chunk of streamResponse) {
        if (chunk.text) {
          sendChunk(chunk.text);
        }
      }

      sendDone();
      return;
    } catch (err: any) {
      console.error('Gemini API streaming error, falling back to contextual generator:', err?.message || err);
      // Fall through to contextual streaming response if API key encounters error or rate limit
    }
  }

  // Contextual Streaming Demo / Fallback Mode with realistic typing cadence
  const fullResponse = generateContextualDemoResponse(userPrompt, messages);
  const words = fullResponse.split(/(?<=\s|\\n)/);
  let index = 0;

  const interval = setInterval(() => {
    if (index < words.length) {
      // Send 1 to 3 words per burst for realistic natural cadence
      const burstSize = Math.floor(Math.random() * 2) + 1;
      const slice = words.slice(index, index + burstSize).join('');
      index += burstSize;
      sendChunk(slice);
    } else {
      clearInterval(interval);
      sendDone();
    }
  }, 28);

  req.on('close', () => {
    clearInterval(interval);
  });
});

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AURA AI] Server running at http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start AURA AI server:', err);
});
