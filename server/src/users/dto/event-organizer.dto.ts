import { ApiProperty } from '@nestjs/swagger';

export class EventOrganizerDto {
  @ApiProperty() id!: string;
  @ApiProperty() firstName!: string;
  @ApiProperty() lastName!: string;
}
