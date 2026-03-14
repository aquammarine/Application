import type { EventTag } from './tag';

export interface CreateEventDto {
    title: string;
    description: string;
    dateTime: string;
    location: string;
    capacity?: number;
    isPublic?: boolean;
}

export interface UpdateEventDto extends Partial<CreateEventDto> { }

export interface Event {
    id: string;
    organizerId: string;
    title: string;
    description: string;
    dateTime: string;
    location: string;
    capacity: number | null;
    isPublic: boolean;
    tags?: EventTag[];
    organizer?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    participants?: {
        user: {
            id: string;
            firstName: string;
            lastName: string;
        };
    }[];
    _count?: {
        participants: number;
    };
}

export interface EventFormFieldValues {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    capacity: string;
    isPublic: boolean;
}