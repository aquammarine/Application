import { ApiProperty } from '@nestjs/swagger';
import { EventOrganizerDto } from 'src/users/dto/event-organizer.dto';

export class EventParticipantDto {
  @ApiProperty()
  joinedAt!: Date;

  @ApiProperty({ type: EventOrganizerDto })
  user!: EventOrganizerDto;
}
