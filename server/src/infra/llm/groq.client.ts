import OpenAi from 'openai';
import { Injectable } from '@nestjs/common';
import {
  LlmClient,
  LlmCompletionOptions,
  LlmMessage,
} from './llm-client.interface';
import { ONE_SECOND } from 'src/common/constants/time.constants';
import {
  LlmEmptyResponseError,
  LlmRateLimitError,
  LlmRequestError,
  LlmTimeoutError,
} from './llm.errors';

@Injectable()
export class GroqClient implements LlmClient {
  private readonly client = new OpenAi({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  async complete(
    messages: LlmMessage[],
    options: LlmCompletionOptions = {},
  ): Promise<string> {
    const {
      maxTokens = 300,
      temperature = 0.2,
      timeoutMs = ONE_SECOND * 15,
    } = options;

    try {
      const response = await this.client.chat.completions.create(
        {
          model: 'llama-3.1-8b-instant',
          messages,
          max_tokens: maxTokens,
          temperature,
        },
        {
          timeout: timeoutMs,
        },
      );

      const answer = response.choices?.[0]?.message?.content?.trim();
      if (!answer) throw new LlmEmptyResponseError();

      return answer;
    } catch (err: unknown) {
      if (err instanceof OpenAi.APIConnectionTimeoutError)
        throw new LlmTimeoutError();
      if (err instanceof OpenAi.APIError) {
        if (err.status === 429) throw new LlmRateLimitError();
        throw new LlmRequestError(Number(err.status), String(err.message));
      }
      throw err;
    }
  }
}
