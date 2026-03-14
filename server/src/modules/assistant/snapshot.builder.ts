import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ONE_DAY, ONE_WEEK } from 'src/common/constants/time.constants';

@Injectable()
export class SnapshotBuilder {
  constructor(private readonly prisma: PrismaService) { }

  async build(userId: string): Promise<string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, firstName: true, lastName: true },
      });

      if (!user) {
        return JSON.stringify({ error: 'User not found' });
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [userEvents, publicEvents, tags] = await Promise.all([
        this.prisma.event.findMany({
          where: {
            dateTime: { gte: thirtyDaysAgo },
            OR: [
              { organizerId: userId },
              { participants: { some: { userId } } },
            ],
          },
          include: {
            organizer: { select: { id: true, firstName: true, lastName: true } },
            participants: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
            tags: { include: { tag: true }, orderBy: { position: 'asc' } },
          },
          orderBy: { dateTime: 'asc' },
          take: 30,
        }),

        this.prisma.event.findMany({
          where: {
            isPublic: true,
            dateTime: { gte: new Date() },
            organizerId: { not: userId },
            participants: { none: { userId } },
          },
          include: {
            tags: { include: { tag: true }, orderBy: { position: 'asc' } },
            _count: { select: { participants: true } },
          },
          orderBy: { dateTime: 'asc' },
          take: 20,
        }),

        this.prisma.tag.findMany({
          select: { name: true, colorHex: true },
          orderBy: { name: 'asc' },
        }),
      ]);

      const now = new Date();
      const fmt = new Intl.DateTimeFormat('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
      });
      const fmtDate = (d: Date) => new Intl.DateTimeFormat('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
      }).format(d);

      const dayOfWeek = now.getUTCDay();
      const monday = new Date(now);
      monday.setUTCDate(now.getUTCDate() - ((dayOfWeek + 6) % 7));
      const sunday = new Date(monday);
      sunday.setUTCDate(monday.getUTCDate() + 6);

      const lastMonday = new Date(monday.getTime() - ONE_WEEK);
      const lastSunday = new Date(monday.getTime() - ONE_DAY);

      const mondayStart = new Date(monday); mondayStart.setUTCHours(0, 0, 0, 0);
      const sundayEnd = new Date(sunday); sundayEnd.setUTCHours(23, 59, 59, 999);
      const lastMondayStart = new Date(lastMonday); lastMondayStart.setUTCHours(0, 0, 0, 0);
      const lastSundayEnd = new Date(lastSunday); lastSundayEnd.setUTCHours(23, 59, 59, 999);

      const getPeriod = (dt: Date): string => {
        if (dt >= lastMondayStart && dt <= lastSundayEnd) return 'last-week';
        if (dt >= mondayStart && dt <= sundayEnd) return 'this-week';
        if (dt > sundayEnd) return 'upcoming';
        return 'past';
      };

      const snapshot = {
        generatedAt: now.toISOString(),
        user: { id: user.id, name: `${user.firstName} ${user.lastName}` },
        currentDateTime: fmt.format(now),
        thisWeek: fmtDate(monday) + ' to ' + fmtDate(sunday),
        lastWeek: fmtDate(lastMonday) + ' to ' + fmtDate(lastSunday),
        thisWeekend: fmtDate(new Date(monday.getTime() + 5 * ONE_DAY)) + ' - ' + fmtDate(sunday),

        myEvents: userEvents.map((e) => {
          const isOrganizer = e.organizerId === userId;
          return {
            id: e.id,
            title: e.title,
            dateTime: fmt.format(new Date(e.dateTime)),
            period: getPeriod(new Date(e.dateTime)),
            location: e.location,
            isPublic: e.isPublic,
            isOrganizer,
            rsvp: isOrganizer ? 'organizer' : 'attending',
            tags: e.tags.map((et) => et.tag.name),
            attendeeCount: e.participants.length,
            ...(isOrganizer && {
              attendees: e.participants.map((p) => `${p.user.firstName} ${p.user.lastName}`),
            }),
          };
        }),

        publicEvents: publicEvents.map((e) => ({
          id: e.id,
          title: e.title,
          dateTime: fmt.format(new Date(e.dateTime)),
          period: getPeriod(new Date(e.dateTime)),
          location: e.location,
          tags: e.tags.map((et) => et.tag.name),
          attendeeCount: e._count.participants,
        })),

        availableTags: tags.map((t) => t.name),
      };

      return JSON.stringify(snapshot);
    } catch (err: any) {
      return JSON.stringify({ error: err.message });
    }
  }
}

