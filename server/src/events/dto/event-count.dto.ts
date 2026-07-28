import { ApiProperty } from '@nestjs/swagger';

export class EventCountDto {
  @ApiProperty() participants!: number;
}
