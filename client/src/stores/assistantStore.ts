import { create } from 'zustand';
import { assistantApi } from '../api/assistant';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  text: string;
  timestamp: Date;
}

interface AssistantState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  lastQuestion: string | null;   // for retry
  ask: (question: string) => Promise<void>;
  retry: () => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}

const useAssistantStore = create<AssistantState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  lastQuestion: null,

  ask: async (question: string) => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null, lastQuestion: question });

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: question,
      timestamp: new Date(),
    };
    set(s => ({ messages: [...s.messages, userMsg] }));

    try {
      const answer = await assistantApi.ask(question);
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: answer,
        timestamp: new Date(),
      };
      set(s => ({ messages: [...s.messages, assistantMsg], isLoading: false }));
    } catch (err: any) {
      const status = err?.response?.status;
      let errorMsg = 'Could not reach the assistant. Check your connection and try again.';
      if (status === 429) errorMsg = "You're sending questions too quickly. Please wait a moment.";
      if (status === 422) errorMsg = 'Question is too short or too long.';
      set({ error: errorMsg, isLoading: false });
    }
  },

  retry: async () => {
    const { lastQuestion } = get();
    if (lastQuestion) {
      set({ error: null });
      await get().ask(lastQuestion);
    }
  },

  clearMessages: () => set({ messages: [], error: null, lastQuestion: null }),
  clearError: () => set({ error: null }),
}));

export default useAssistantStore;
