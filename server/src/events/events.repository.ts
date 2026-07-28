import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';

const tagsInclude = {
  include: { tag: true },
  orderBy: { position: 'asc' },
} satisfies Prisma.Event$tagsArgs;

const myEventsInclude = {
  _count: {
    select: { participants: true },
  },
  organizer: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
  tags: tagsInclude,
} satisfies Prisma.EventInclude;

const findInclude = {
  _count: {
    select: { participants: true },
  },
  participants: {
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  },
  organizer: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
  tags: tagsInclude,
} satisfies Prisma.EventInclude;

@Injectable()
export class EventsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Omit<Prisma.EventCreateInput, 'organizer'>,
    organizerId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const { title, description, location, capacity, isPublic, dateTime } =
        data;

      const event = await tx.event.create({
        data: {
          title,
          description,
          location,
          capacity,
          isPublic,
          dateTime,
          organizerId,
        },
      });

      await this.join(event.id, organizerId, tx);

      return event;
    });
  }

  async findAllPublic(tagIds?: string[]) {
    return this.prisma.event.findMany({
      where: {
        isPublic: true,
        ...(tagIds?.length
          ? { tags: { some: { tagId: { in: tagIds } } } }
          : {}),
      },
      include: myEventsInclude,
      orderBy: { dateTime: 'asc' },
    });
  }

  async findById(id: string) {
    return await this.prisma.event.findUnique({
      where: { id },
      include: findInclude,
    });
  }

  async join(
    eventId: string,
    userId: string,
    client: Prisma.TransactionClient = this.prisma,
  ) {
    return await client.participant.create({
      data: {
        eventId,
        userId,
      },
    });
  }

  async leave(eventId: string, userId: string) {
    return this.prisma.participant.delete({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });
  }

  async update(id: string, data: Prisma.EventUpdateInput) {
    return this.prisma.event.update({
      where: { id },
      data,
      include: {
        tags: tagsInclude,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.event.delete({
      where: { id },
      include: {
        tags: tagsInclude,
      },
    });
  }

  async findByOrganizer(userId: string) {
    return this.prisma.event.findMany({
      where: { organizerId: userId },
      include: myEventsInclude,
      orderBy: { dateTime: 'asc' },
    });
  }

  async findByParticipant(userId: string) {
    return this.prisma.event.findMany({
      where: { participants: { some: { userId } } },
      include: myEventsInclude,
      orderBy: { dateTime: 'asc' },
    });
  }

  async findByOrganizerOrParticipant(userId: string) {
    return this.prisma.event.findMany({
      where: {
        OR: [{ participants: { some: { userId } } }, { organizerId: userId }],
      },
      include: myEventsInclude,
      orderBy: { dateTime: 'asc' },
    });
  }

  async isParticipant(eventId: string, userId: string): Promise<boolean> {
    const participant = await this.prisma.participant.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    return !!participant;
  }
}
