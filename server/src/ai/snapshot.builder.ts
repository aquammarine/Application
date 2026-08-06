import { Injectable } from '@nestjs/common';
import { subMonths } from 'date-fns';
import { AiRepository } from './ai.repository';
import { UsersService } from 'src/users/users.service';
import { TagsService } from 'src/tags/tags.service';
import {
  formatDateAndTime,
  formatDateOnly,
  getPeriod,
  getWeekBoundaries,
  toMyEvents,
  toPublicEvents,
} from './snapshot.utils';
import type { WeekBoundaries } from './interfaces/snapshot.interfaces';
import { Event } from 'src/events/entities/event.entity';

@Injectable()
export class SnapshotBuilder {
  constructor(
    private readonly aiRepository: AiRepository,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
  ) {}

  async build(userId: string): Promise<string> {
    try {
      const user = await this.usersService.findById(userId);

      const now = new Date();

      const threeMonthsAgo = subMonths(now, 3);

      const [userEvents, publicEvents, tags] = await Promise.all([
        this.aiRepository.findUserEvents(userId, threeMonthsAgo),
        this.aiRepository.findDiscoverableEvents(userId),
        this.tagsService.findAll(),
      ]);

      const boundaries = getWeekBoundaries(now);

      const snapshot = {
        generatedAt: now.toISOString(),
        user: { id: user.id, name: `${user.firstName} ${user.lastName}` },
        currentDateTime: formatDateAndTime(now),
        thisWeek: `${formatDateOnly(boundaries.monday)} to ${formatDateOnly(boundaries.sunday)}`,
        lastWeek: `${formatDateOnly(boundaries.lastMonday)} to ${formatDateOnly(boundaries.lastSunday)}`,
        thisWeekend: `${formatDateOnly(boundaries.friday)} to ${formatDateOnly(boundaries.sunday)}`,
        myEvents: toMyEvents(userEvents, userId, boundaries),
        publicEvents: toPublicEvents(publicEvents, boundaries),
        availableTags: tags.map((t) => t.name),
      };

      return JSON.stringify(snapshot);
    } catch (err: any) {
      return JSON.stringify({ error: err.message });
    }
  }
}
