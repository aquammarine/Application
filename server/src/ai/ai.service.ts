import { Inject, Injectable } from '@nestjs/common';
import {
  LLM_CLIENT,
  LlmCompletionOptions,
  type LlmClient,
} from 'src/infra/llm/llm-client.interface';
import { SnapshotBuilder } from './snapshot.builder';
import { buildAiMessages } from './ai.prompt';

@Injectable()
export class AiService {
  constructor(
    @Inject(LLM_CLIENT) private readonly llmClient: LlmClient,
    private readonly snapshotBuilder: SnapshotBuilder,
  ) {}

  async ask(question: string, userId: string, options?: LlmCompletionOptions) {
    const snapshot = await this.snapshotBuilder.build(userId);
    const messages = buildAiMessages(question, snapshot);
    return this.llmClient.complete(messages, options);
  }
}
