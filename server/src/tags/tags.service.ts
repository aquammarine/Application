import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TagsRepository } from './tags.repository';
import { TagDto } from './dto/tag.dto';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class TagsService {
  constructor(
    private readonly tagsRepository: TagsRepository,
    private readonly eventsService: EventsService,
  ) {}

  async findAll(): Promise<TagDto[]> {
    return this.tagsRepository.findAll();
  }

  // UNUSED BY NOW
  async create(name: string, colorHex?: string): Promise<TagDto> {
    const existing = await this.tagsRepository.findByName(name);

    if (existing) {
      throw new ConflictException('Tag already exists (case-insensitive)');
    }

    return this.tagsRepository.create(name, colorHex);
  }

  async updateEventTags(
    eventId: string,
    tagIds: string[],
    userId: string,
  ): Promise<void> {
    const event = await this.eventsService.findById(eventId);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== userId) {
      throw new ForbiddenException('Only the organizer can modify tags');
    }

    if (tagIds.length > 5) {
      throw new UnprocessableEntityException(
        'Maximum 5 tags allowed per event',
      );
    }

    if (tagIds.length > 0) {
      const existing = await this.tagsRepository.findByIds(tagIds);

      if (existing.length !== tagIds.length) {
        throw new UnprocessableEntityException(
          'One or more tag IDs are invalid',
        );
      }
    }

    await this.tagsRepository.updateEventTags(eventId, tagIds);
  }
}
