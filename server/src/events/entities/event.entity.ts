import { ApiProperty } from '@nestjs/swagger';
import { Event as PrismaEvent } from '@prisma/client';

export class Event implements PrismaEvent {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    dateTime: Date;

    @ApiProperty()
    location: string;

    @ApiProperty()
    capacity: number;

    @ApiProperty()
    isPublic: boolean;

    @ApiProperty()
    organizerId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
