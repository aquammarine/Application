import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TagsRepository } from './tags.repository';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [TagsController],
  providers: [TagsService, TagsRepository],
  exports: [TagsService],
})
export class TagsModule {}
