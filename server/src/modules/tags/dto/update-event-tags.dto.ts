import { IsArray, IsUUID, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventTagsDto {
  @ApiProperty({ type: [String], description: 'Array of 0-5 tag UUIDs' })
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMaxSize(5)
  tagIds: string[];
}
