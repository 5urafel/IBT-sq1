import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateEventDto,
  EventSessionDto,
  QueryEventDto,
  UpdateEventDto,
} from './dto/event.dto.js';
import {
  EVENT_REPOSITORY,
  type CampusEvent,
  type EventSession,
  type IEventRepository,
} from './events.types.js';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class EventsService {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: IEventRepository,
    @InjectPinoLogger(EventsService.name)
    private readonly logger: PinoLogger,
  ) {}

  findAll(query?: QueryEventDto): CampusEvent[] {
    this.logger.info({ query }, 'Fetching campus events');
    return this.eventRepository.findAll(query);
  }

  findUpcoming(): CampusEvent[] {
    this.logger.info('Fetching upcoming campus events');
    return this.eventRepository.findUpcoming();
  }

  findOne(id: number): CampusEvent {
    this.logger.debug({ eventId: id }, 'Looking up campus event');
    const event = this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Campus event with ID ${id} not found`);
    }
    return event;
  }

  findSessions(id: number): EventSession[] {
    this.logger.debug({ eventId: id }, 'Looking up event sessions');
    const event = this.findOne(id);
    return event.sessions;
  }

  create(createEventDto: CreateEventDto): CampusEvent {
    const normalizedSessions = this.normalizeSessions(
      createEventDto.sessions ?? [],
    );

    const createdEvent = this.eventRepository.create({
      title: createEventDto.title,
      description: createEventDto.description,
      location: createEventDto.location,
      eventDate: createEventDto.eventDate,
      category: createEventDto.category,
      isPublished: createEventDto.isPublished,
      organizer: createEventDto.organizer ?? 'Campus Event Committee',
      sessions: normalizedSessions,
    });

    this.logger.info(
      {
        eventId: createdEvent.id,
        title: createdEvent.title,
        sessionCount: normalizedSessions.length,
      },
      'Campus event created',
    );
    return createdEvent;
  }

  update(id: number, updateEventDto: UpdateEventDto): CampusEvent {
    const existingEvent = this.findOne(id);

    const updatedSessions = updateEventDto.sessions
      ? this.normalizeSessions(updateEventDto.sessions)
      : existingEvent.sessions;

    const updated = this.eventRepository.update(id, {
      ...(updateEventDto.title !== undefined
        ? { title: updateEventDto.title }
        : {}),
      ...(updateEventDto.description !== undefined
        ? { description: updateEventDto.description }
        : {}),
      ...(updateEventDto.location !== undefined
        ? { location: updateEventDto.location }
        : {}),
      ...(updateEventDto.eventDate !== undefined
        ? { eventDate: updateEventDto.eventDate }
        : {}),
      ...(updateEventDto.category !== undefined
        ? { category: updateEventDto.category }
        : {}),
      ...(updateEventDto.isPublished !== undefined
        ? { isPublished: updateEventDto.isPublished }
        : {}),
      ...(updateEventDto.organizer !== undefined
        ? { organizer: updateEventDto.organizer }
        : {}),
      sessions: updatedSessions,
    });

    if (!updated) {
      this.logger.warn({ eventId: id }, 'Failed to update missing event');
      throw new NotFoundException(`Campus event with ID ${id} not found`);
    }
    this.logger.info({ eventId: id }, 'Campus event updated');
    return updated;
  }

  remove(id: number): { deleted: boolean; id: number } {
    const isDeleted = this.eventRepository.delete(id);
    if (!isDeleted) {
      this.logger.warn({ eventId: id }, 'Failed to delete missing event');
      throw new NotFoundException(`Campus event with ID ${id} not found`);
    }
    this.logger.info({ eventId: id }, 'Campus event deleted');
    return { deleted: true, id };
  }

  private normalizeSessions(sessions: EventSessionDto[]): EventSession[] {
    return sessions.map((session, index) => ({
      id: session.id ?? index + 1,
      title: session.title,
      description: session.description,
      speaker: session.speaker,
      startTime: session.startTime,
      endTime: session.endTime,
    }));
  }
}
