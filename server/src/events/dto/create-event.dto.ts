import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
    @ApiProperty({ example: 'Tech Conference 2024' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'A conference about latest tech trends' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: '2024-12-01T10:00:00Z' })
    @IsDateString()
    @IsNotEmpty()
    dateTime: string;

    @ApiProperty({ example: 'San Francisco, CA' })
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiPropertyOptional({ example: 100 })
    @IsOptional()
    @IsInt()
    @Min(1)
    capacity?: number;

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;
}
