import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Tag } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(): Promise<Tag[]> {
    return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
  }

  async create(name: string, colorHex?: string): Promise<Tag> {
    const nameLower = name.trim().toLowerCase();

    const existing = await this.prisma.tag.findUnique({ where: { nameLower } });
    if (existing) {
      throw new ConflictException('Tag already exists (case-insensitive)');
    }

    return this.prisma.tag.create({
      data: { name: name.trim(), nameLower, colorHex },
    });
  }

  async updateEventTags(
    eventId: string,
    tagIds: string[],
    requestingUserId: string,
  ): Promise<void> {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    if (event.organizerId !== requestingUserId) {
      throw new ForbiddenException('Only the organizer can modify tags');
    }

    if (tagIds.length > 5) {
      throw new UnprocessableEntityException('Maximum 5 tags allowed per event');
    }

    if (tagIds.length > 0) {
      const existing = await this.prisma.tag.findMany({
        where: { id: { in: tagIds } },
      });
      if (existing.length !== tagIds.length) {
        throw new UnprocessableEntityException('One or more tag IDs are invalid');
      }
    }

    await this.prisma.$transaction([
      this.prisma.eventTag.deleteMany({ where: { eventId } }),
      this.prisma.eventTag.createMany({
        data: tagIds.map((tagId, i) => ({ eventId, tagId, position: i + 1 })),
        skipDuplicates: true,
      }),
    ]);
  }
}
