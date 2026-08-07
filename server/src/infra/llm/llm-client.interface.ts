interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LlmCompletionOptions {
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
}

interface LlmClient {
  complete(
    messages: LlmMessage[],
    options?: LlmCompletionOptions,
  ): Promise<string>;
}

const LLM_CLIENT = Symbol('LLM_CLIENT');

export type { LlmMessage, LlmCompletionOptions, LlmClient };
export { LLM_CLIENT };
