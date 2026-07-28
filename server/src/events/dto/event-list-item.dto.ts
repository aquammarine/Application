import { ApiProperty } from '@nestjs/swagger';
import { EventCountDto } from './event-count.dto';
import { EventOrganizerDto } from 'src/users/dto/event-organizer.dto';
import { EventTagDto } from './event-tag.dto';
import { Event } from '../entities/event.entity';

export class EventListItemDto extends Event {
  @ApiProperty({ type: EventCountDto })
  _count!: EventCountDto;

  @ApiProperty({ type: EventOrganizerDto })
  organizer!: EventOrganizerDto;

  @ApiProperty({ type: EventTagDto, isArray: true })
  tags!: EventTagDto[];
}
