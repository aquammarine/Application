import { PrismaService } from 'src/infra/database/prisma.service';

export class AiRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserEvents(userId: string, since: Date) {
    return this.prisma.event.findMany({
      where: {
        dateTime: { gte: since },
        OR: [{ organizerId: userId }, { participants: { some: { userId } } }],
      },
      include: {
        organizer: {
          select: { id: true, firstName: true, lastName: true },
        },
        participants: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        tags: { include: { tag: true }, orderBy: { position: 'asc' } },
      },
      orderBy: { dateTime: 'asc' },
      take: 30,
    });
  }

  async findDiscoverableEvents(userId: string) {
    return this.prisma.event.findMany({
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
    });
  }
}
