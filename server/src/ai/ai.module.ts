import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AiRepository } from './ai.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AiService, AiRepository],
  controllers: [AiController],
})
export class AiModule {}
