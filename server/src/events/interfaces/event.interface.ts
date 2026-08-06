import type { EventTag } from 'src/common/interfaces/tag.interface';
import type { PublicUser } from 'src/common/interfaces/user.interface';
import type { Participant } from 'src/common/interfaces/user.interface';

interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: Date;
  location: string;
  capacity: number | null;
  isPublic: boolean;
  organizerId: string;
}

interface EventWithDetails extends Event {
  _count: { participants: number };
  organizer: PublicUser;
  tags: EventTag[];
  participants: Participant[];
}

interface EventListItem {
  _count: { participants: number };
  organizer: PublicUser;
  tags: EventTag[];
}

export type { Event, EventWithDetails, EventListItem };
