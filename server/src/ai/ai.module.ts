import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AiRepository } from './ai.repository';
import { UsersModule } from 'src/users/users.module';
import { LLM_CLIENT } from 'src/infra/llm/llm-client.interface';
import { GroqClient } from 'src/infra/llm/groq.client';
import { SnapshotBuilder } from './snapshot.builder';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [UsersModule, TagsModule],
  providers: [
    AiService,
    AiRepository,
    SnapshotBuilder,
    { provide: LLM_CLIENT, useClass: GroqClient },
  ],
  controllers: [AiController],
})
export class AiModule {}
