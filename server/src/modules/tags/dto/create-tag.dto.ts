import { IsString, IsNotEmpty, IsOptional, Matches, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ example: 'Tech' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name: string;

  @ApiPropertyOptional({ example: '#3B82F6' })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'colorHex must be a valid hex color (e.g. #3B82F6)' })
  colorHex?: string;
}
