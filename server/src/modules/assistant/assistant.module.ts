import { Module } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { SnapshotBuilder } from './snapshot.builder';
import { PrismaModule } from '../prisma/prisma.module';
import { AssistantController } from './assistant.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AssistantController],
  providers: [AssistantService, SnapshotBuilder],
  exports: [AssistantService],
})
export class AssistantModule { }
