import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

import { PrismaModule } from '../infra/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule { }
