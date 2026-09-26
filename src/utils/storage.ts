import { Conversation, UserSettings } from '../types';

const CONVERSATIONS_KEY = 'aura_ai_conversations_v1';
const SETTINGS_KEY = 'aura_ai_settings_v1';
const ACTIVE_CONV_KEY = 'aura_ai_active_conv_id';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  autoScroll: true,
  enterToSend: true,
  showTimestamps: true,
  responseStyle: 'detailed',
  temperature: 0.7,
  defaultModel: 'aura-standard',
  compactMode: false,
};

// Seed 5 realistic demo conversations as instructed in the brief
export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-quantum',
    title: 'Explain quantum computing',
    createdAt: Date.now() - 1000 * 60 * 30, // 30 mins ago (Today)
    updatedAt: Date.now() - 1000 * 60 * 25,
    pinned: true,
    model: 'aura-standard',
    messages: [
      {
        id: 'q-1',
        role: 'user',
        content: 'Explain quantum computing in simple terms.',
        timestamp: Date.now() - 1000 * 60 * 30,
        status: 'complete',
      },
      {
        id: 'q-2',
        role: 'assistant',
        content: `### Understanding Quantum Computing

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

> **Key takeaway:** While classical computers solve complex tasks sequentially, quantum systems evaluate exponentially large solution spaces in parallel.`,
        timestamp: Date.now() - 1000 * 60 * 25,
        status: 'complete',
        model: 'aura-standard',
      },
    ],
  },
  {
    id: 'conv-react-dashboard',
    title: 'Build a React dashboard',
    createdAt: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago (Today)
    updatedAt: Date.now() - 1000 * 60 * 60 * 3,
    pinned: true,
    model: 'aura-pro',
    messages: [
      {
        id: 'rd-1',
        role: 'user',
        content: 'Build a React dashboard component with modern typography and performance metrics.',
        timestamp: Date.now() - 1000 * 60 * 60 * 4,
        status: 'complete',
      },
      {
        id: 'rd-2',
        role: 'assistant',
        content: `### Modern React Analytics Dashboard Architecture

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

#### Architectural Highlights:
- **Zero unnecessary re-renders** with \`useMemo\` memoized metrics.
- **Accessible markup** and high-contrast color tokens.
- **Micro-interaction border glow** upon cursor hover.`,
        timestamp: Date.now() - 1000 * 60 * 60 * 3,
        status: 'complete',
        model: 'aura-pro',
      },
    ],
  },
  {
    id: 'conv-ml',
    title: 'Explain machine learning',
    createdAt: Date.now() - 1000 * 60 * 60 * 26, // Yesterday
    updatedAt: Date.now() - 1000 * 60 * 60 * 25,
    model: 'aura-standard',
    messages: [
      {
        id: 'ml-1',
        role: 'user',
        content: 'Explain machine learning and compare traditional programming vs modern deep learning.',
        timestamp: Date.now() - 1000 * 60 * 60 * 26,
        status: 'complete',
      },
      {
        id: 'ml-2',
        role: 'assistant',
        content: `### Foundations of Machine Learning

Machine Learning (ML) teaches computational systems to discover patterns in data rather than following static, hardcoded rule-sets.

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

Would you like to explore mathematical optimization (gradient descent), attention mechanisms, or fine-tuning techniques?`,
        timestamp: Date.now() - 1000 * 60 * 60 * 25,
        status: 'complete',
        model: 'aura-standard',
      },
    ],
  },
  {
    id: 'conv-interview',
    title: 'Help me prepare for an interview',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago (Previous 7 Days)
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    model: 'aura-pro',
    messages: [
      {
        id: 'int-1',
        role: 'user',
        content: 'Help me prepare for an AI staff engineer system design interview.',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
        status: 'complete',
      },
      {
        id: 'int-2',
        role: 'assistant',
        content: `### Executive Tech Interview Preparation Strategy

To stand out in high-caliber engineering and AI startup interviews, structure your responses around the **STAR-L (Situation, Task, Action, Result, Learnings)** framework.

#### 1. System Design Mental Model
- **Clarify & Scope:** Functional vs non-functional constraints (throughput, latency, consistency vs availability).
- **Back-of-the-Envelope Calculations:** Storage per year, read/write QPS, network bandwidth.
- **High-Level Blueprint:** API Gateway $\\rightarrow$ Stateless Microservices $\\rightarrow$ Distributed Cache (Redis) $\\rightarrow$ Partitioned DB.
- **Deep Dive & Bottlenecks:** Single point of failure (SPOF), replication lag, circuit breakers.

#### 2. Key Questions to Practice:
1. *Design a real-time streaming LLM serving platform supporting 100k concurrent WebSocket/SSE connections.*
2. *How do you mitigate KV cache memory pressure in long-context models? (e.g., PagedAttention, vLLM).*

Shall we conduct a mock technical walkthrough?`,
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
        status: 'complete',
        model: 'aura-pro',
      },
    ],
  },
  {
    id: 'conv-python-code',
    title: 'Analyze this Python code',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 days ago (Older)
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    model: 'aura-standard',
    messages: [
      {
        id: 'py-1',
        role: 'user',
        content: 'Analyze this Python code for thread safety and memory leaks:\n```python\ncache = {}\ndef get_data(key):\n    if key not in cache:\n        cache[key] = compute_expensive(key)\n    return cache[key]\n```',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10,
        status: 'complete',
      },
      {
        id: 'py-2',
        role: 'assistant',
        content: `### Diagnostic Audit: Thread Safety & Memory Leaks

Your snippet has two critical production concerns:

1. **Unbounded Memory Growth (Memory Leak)**:
   The global \`cache\` dictionary has no eviction policy (TTL, LRU, or MaxSize). Over time, keys will accumulate until the process exhausts available RAM (\`OOMKilled\`).

2. **Race Conditions in Multi-threaded Contexts**:
   In standard Python with multiple threads, between checking \`key not in cache\` and assigning \`cache[key]\`, context switches can cause redundant expensive computations or inconsistent dictionary states.

#### Recommended Refactoring (Thread-Safe LRU Cache):
\`\`\`python
from functools import lru_cache
import threading

# Solution A: Python's built-in thread-safe LRU decorator
@lru_cache(maxsize=1024)
def get_data(key: str):
    return compute_expensive(key)

# Solution B: Explicit Lock with TTL eviction
class SafeTTLCache:
    def __init__(self, maxsize: int = 1000):
        self._cache = {}
        self._lock = threading.Lock()
        self._maxsize = maxsize

    def get(self, key: str):
        with self._lock:
            if key in self._cache:
                return self._cache[key]
        
        # Compute outside lock to avoid blocking other keys
        value = compute_expensive(key)
        
        with self._lock:
            if len(self._cache) >= self._maxsize:
                # Evict oldest entry
                oldest = next(iter(self._cache))
                del self._cache[oldest]
            self._cache[key] = value
            return value
\`\`\`

Both options prevent memory explosion and ensure deterministic execution.`,
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10,
        status: 'complete',
        model: 'aura-standard',
      },
    ],
  },
];

export const getStoredConversations = (): Conversation[] => {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    if (!raw) {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
      return INITIAL_CONVERSATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CONVERSATIONS;
  } catch (e) {
    console.error('Error loading conversations from storage:', e);
    return INITIAL_CONVERSATIONS;
  }
};

export const saveStoredConversations = (conversations: Conversation[]): void => {
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (e) {
    console.error('Error saving conversations to storage:', e);
  }
};

export const getStoredSettings = (): UserSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to storage:', e);
  }
};

export const getStoredActiveConvId = (): string => {
  return localStorage.getItem(ACTIVE_CONV_KEY) || INITIAL_CONVERSATIONS[0].id;
};

export const saveStoredActiveConvId = (id: string): void => {
  localStorage.setItem(ACTIVE_CONV_KEY, id);
};
