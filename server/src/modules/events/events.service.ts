import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createEventDto: CreateEventDto, organizerId: string) {
    return this.prisma.$transaction(async (tx) => {
      const { title, description, location, capacity, isPublic, dateTime } = createEventDto;

      const event = await tx.event.create({
        data: {
          title,
          description,
          location,
          capacity: capacity ? Number(capacity) : null,
          isPublic: isPublic !== undefined ? isPublic : true,
          dateTime: new Date(dateTime),
          organizerId,
        },
      });

      await tx.participant.create({
        data: {
          eventId: event.id,
          userId: organizerId,
        },
      });

      return event;
    });
  }

  async findAllPublic(userId?: string, tagIds?: string[]) {
    const events = await this.prisma.event.findMany({
      where: {
        isPublic: true,
        ...(tagIds && tagIds.length > 0
          ? { tags: { some: { tagId: { in: tagIds } } } }
          : {}),
      },
      include: {
        _count: {
          select: { participants: true },
        },
        participants: userId ? {
          where: { userId },
        } : false,
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        tags: {
          include: { tag: true },
          orderBy: { position: 'asc' },
        },
      },
      orderBy: { dateTime: 'asc' },
    });

    return events.map((event) => ({
      ...event,
      participantCount: event._count.participants,
      isFull: event.capacity ? event._count.participants >= event.capacity : false,
      firstTagColor: event.tags[0]?.tag?.colorHex ?? null,
    }));
  }

  async findOne(id: string, userId?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
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
            email: true,
          },
        },
        tags: {
          include: { tag: true },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!event) return null;

    return {
      ...event,
      participantCount: event._count.participants,
      isFull: event.capacity ? event._count.participants >= event.capacity : false,
    };
  }

  async join(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { participants: true },
        },
        tags: {
          include: { tag: true },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!event) throw new Error('Event not found');
    if (event.capacity && event._count.participants >= event.capacity) {
      throw new Error('Event is full');
    }

    return this.prisma.participant.create({
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

  async update(id: string, updateEventDto: UpdateEventDto, organizerId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event || event.organizerId !== organizerId) {
      throw new ForbiddenException('Not authorized to update this event');
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        ...updateEventDto,
        dateTime: updateEventDto.dateTime ? new Date(updateEventDto.dateTime) : undefined,
      },
      include: {
        tags: {
          include: { tag: true },
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  async remove(id: string, organizerId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event || event.organizerId !== organizerId) {
      throw new ForbiddenException('Not authorized to delete this event');
    }

    return this.prisma.event.delete({
      where: { id },
      include: {
        tags: {
          include: { tag: true },
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  async findMyEvents(userId: string) {
    return this.prisma.event.findMany({
      where: {
        OR: [
          { organizerId: userId },
          {
            participants: {
              some: { userId },
            },
          },
        ],
      },
      include: {
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
        tags: {
          include: { tag: true },
          orderBy: { position: 'asc' },
        },
      },
      orderBy: { dateTime: 'asc' },
    });
  }
}
