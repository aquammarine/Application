import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsRepository } from './events.repository';
import { UserRole } from './types/types';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  Event,
  EventListItem,
  EventWithDetails,
} from './interfaces/event.interface';

@Injectable()
export class EventsService {
  constructor(private readonly eventsRepository: EventsRepository) {}

  async create(dto: CreateEventDto, organizerId: string): Promise<Event> {
    return this.eventsRepository.create(dto, organizerId);
  }

  async update(
    eventId: string,
    userId: string,
    dto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.findById(eventId);
    if (userId !== event.organizerId) throw new ForbiddenException();

    return await this.eventsRepository.update(eventId, dto);
  }

  findMyEvents(userId: string, role?: UserRole): Promise<EventListItem[]> {
    if (role === 'participant') {
      return this.eventsRepository.findByParticipant(userId);
    } else if (role === 'organizer') {
      return this.eventsRepository.findByOrganizer(userId);
    } else {
      return this.eventsRepository.findByOrganizerOrParticipant(userId);
    }
  }

  async findById(id: string): Promise<EventWithDetails> {
    const event = await this.eventsRepository.findById(id);
    if (!event) throw new NotFoundException();

    return event;
  }

  findAllPublic(tagIds?: string[]): Promise<EventListItem[]> {
    return this.eventsRepository.findAllPublic(tagIds);
  }

  async join(eventId: string, userId: string): Promise<void> {
    const isParticipant = await this.eventsRepository.isParticipant(
      eventId,
      userId,
    );
    if (isParticipant) throw new BadRequestException();

    await this.eventsRepository.join(eventId, userId);
  }

  async leave(eventId: string, userId: string): Promise<void> {
    const isParticipant = await this.eventsRepository.isParticipant(
      eventId,
      userId,
    );
    if (!isParticipant) throw new BadRequestException();

    await this.eventsRepository.leave(eventId, userId);
  }

  async remove(id: string, organizerId: string): Promise<void> {
    const event = await this.findById(id);
    if (event.organizerId !== organizerId) throw new ForbiddenException();

    await this.eventsRepository.remove(id);
  }
}
