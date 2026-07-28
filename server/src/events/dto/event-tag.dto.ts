import { ApiProperty } from '@nestjs/swagger';
import { TagDto } from 'src/tags/dto/tag.dto';

export class EventTagDto {
  @ApiProperty() position!: number;
  @ApiProperty({ type: TagDto }) tag!: TagDto;
}
