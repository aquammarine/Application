import { ApiProperty } from '@nestjs/swagger';
import { EventCountDto } from './event-count.dto';
import { EventOrganizerDto } from 'src/users/dto/event-organizer.dto';
import { EventTagDto } from './event-tag.dto';
import { EventParticipantDto } from 'src/users/dto/event-participant.dto';
import { Event } from '../entities/event.entity';

export class EventDetailDto extends Event {
  @ApiProperty({ type: EventCountDto }) _count!: EventCountDto;
  @ApiProperty({ type: EventOrganizerDto }) organizer!: EventOrganizerDto; // no email
  @ApiProperty({ type: EventTagDto, isArray: true }) tags!: EventTagDto[];
  @ApiProperty({ type: EventParticipantDto, isArray: true })
  participants!: EventParticipantDto[];
}
