import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class AskQuestionDto {
  @ApiProperty({
    example: "What events am I attending this week?",
    description: 'Natural language question about events (3-500 chars)',
  })
  @IsString()
  @MinLength(3, { message: 'Question is too short' })
  @MaxLength(500, { message: 'Question is too long (max 500 characters)' })
  question: string;
}
