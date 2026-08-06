import {
  addDays,
  endOfWeek,
  isWithinInterval,
  startOfWeek,
  subWeeks,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import {
  DiscoverableEvent,
  UserEvents,
  WeekBoundaries,
} from './interfaces/snapshot.interfaces';

function getWeekBoundaries(date: Date) {
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  const friday = addDays(monday, 5);
  const sunday = endOfWeek(date, { weekStartsOn: 1 });
  const lastMonday = subWeeks(monday, 1);
  const lastSunday = subWeeks(sunday, 1);

  return { monday, friday, sunday, lastMonday, lastSunday };
}

const formatDateAndTime = (d: Date) =>
  formatInTimeZone(d, 'UTC', 'EEEE, MMMM d, yyyy, h:mm a');

const formatDateOnly = (d: Date) =>
  formatInTimeZone(d, 'UTC', 'EEE, MMM d, yyyy');

function getPeriod(d: Date, boundaries: WeekBoundaries) {
  if (
    isWithinInterval(d, {
      start: boundaries.lastMonday,
      end: boundaries.lastSunday,
    })
  )
    return 'last-week';
  if (
    isWithinInterval(d, {
      start: boundaries.monday,
      end: boundaries.sunday,
    })
  )
    return 'this-week';
  if (d > boundaries.sunday) return 'upcoming';
  return 'past';
}

function toMyEvents(
  events: UserEvents[],
  userId: string,
  boundaries: WeekBoundaries,
) {
  return events.map((event) => {
    const isOrganizer = event.organizerId === userId;
    return {
      id: event.id,
      title: event.title,
      dateTime: formatDateAndTime(new Date(event.dateTime)),
      period: getPeriod(new Date(event.dateTime), boundaries),
      location: event.location,
      isPublic: event.isPublic,
      isOrganizer,
      tags: event.tags.map((eventTag) => eventTag.tag.name),
      participantCount: event.participants.length,
      ...(isOrganizer && {
        participants: event.participants.map(
          (participant) =>
            `${participant.user.firstName} ${participant.user.lastName}`,
        ),
      }),
    };
  });
}

function toPublicEvents(
  events: DiscoverableEvent[],
  boundaries: WeekBoundaries,
) {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    dateTime: formatDateAndTime(new Date(event.dateTime)),
    period: getPeriod(new Date(event.dateTime), boundaries),
    location: event.location,
    tags: event.tags.map((eventTag) => eventTag.tag.name),
    participantCount: event.participantCount,
  }));
}

export {
  getWeekBoundaries,
  formatDateAndTime,
  formatDateOnly,
  getPeriod,
  toPublicEvents,
  toMyEvents,
};
