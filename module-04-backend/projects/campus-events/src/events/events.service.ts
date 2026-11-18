import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateEventDto,
  EventSessionDto,
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

  findAll(): CampusEvent[] {
    this.logger.info('Fetching all campus events');
    return this.eventRepository.findAll();
  }

  findOne(id: number): CampusEvent {
    this.logger.debug({ eventId: id }, 'Looking up campus event');
    const event = this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Campus event with ID ${id} not found`);
    }
    return event;
  }

  create(createEventDto: CreateEventDto): CampusEvent {
    const normalizedSessions = this.normalizeSessions(
      createEventDto.sessions ?? [],
    );

    const createdEvent = this.eventRepository.create({
      title: createEventDto.title,
      description: createEventDto.description,
      location: createEventDto.location,
      date: createEventDto.date,
      organizer: createEventDto.organizer,
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
      ...updateEventDto,
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
