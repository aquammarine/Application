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
    title: string;
    description: string;
    dateTime: string;
    location: string;
    capacity: number | null;
    isPublic: boolean;
    organizer?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    participants?: any[];
    _count?: {
        participants: number;
    };
}