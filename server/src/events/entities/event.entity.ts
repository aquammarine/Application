import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Event {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  dateTime!: Date;

  @ApiProperty()
  location!: string;

  @ApiPropertyOptional({ nullable: true })
  capacity!: number | null;

  @ApiProperty()
  isPublic!: boolean;

  @ApiProperty()
  organizerId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
