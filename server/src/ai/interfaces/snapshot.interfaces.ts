import { Participant } from 'src/common/interfaces/user.interface';
import { getWeekBoundaries } from '../snapshot.utils';
import { EventTag } from 'src/common/interfaces/tag.interface';

type WeekBoundaries = ReturnType<typeof getWeekBoundaries>;

interface DiscoverableEvent {
  id: string;
  title: string;
  dateTime: Date;
  period?: string;
  location: string;
  tags: EventTag[];
  participantCount?: number;
}

interface UserEvents {
  id: string;
  title: string;
  dateTime: Date;
  period?: string;
  location: string;
  isPublic: boolean;
  organizerId: string;
  tags: EventTag[];
  participantCount?: number;
  participants: Participant[];
}

export type { WeekBoundaries, DiscoverableEvent, UserEvents };
