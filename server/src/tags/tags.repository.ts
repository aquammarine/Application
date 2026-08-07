import { Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class TagsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // UNUSED BY NOW
  async create(name: string, colorHex?: string): Promise<Tag> {
    return this.prisma.tag.create({
      data: { name, colorHex },
    });
  }

  findAll(): Promise<Tag[]> {
    return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
  }

  // UNUSED BY NOW
  async findByName(name: string): Promise<Tag | null> {
    return this.prisma.tag.findUnique({ where: { name } });
  }

  async updateEventTags(eventId: string, tagIds: string[]): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.eventTag.deleteMany({ where: { eventId } }),
      this.prisma.eventTag.createMany({
        data: tagIds.map((tagId, i) => ({ eventId, tagId, position: i + 1 })),
        skipDuplicates: true,
      }),
    ]);
  }

  async findByIds(ids: string[]): Promise<Tag[]> {
    return this.prisma.tag.findMany({ where: { id: { in: ids } } });
  }
}
