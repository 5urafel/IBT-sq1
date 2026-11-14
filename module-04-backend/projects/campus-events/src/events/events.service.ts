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

@Injectable()
export class EventsService {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: IEventRepository,
  ) {}

  findAll(): CampusEvent[] {
    return this.eventRepository.findAll();
  }

  findOne(id: number): CampusEvent {
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

    return this.eventRepository.create({
      title: createEventDto.title,
      description: createEventDto.description,
      location: createEventDto.location,
      date: createEventDto.date,
      organizer: createEventDto.organizer,
      sessions: normalizedSessions,
    });
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
      throw new NotFoundException(`Campus event with ID ${id} not found`);
    }
    return updated;
  }

  remove(id: number): { deleted: boolean; id: number } {
    const isDeleted = this.eventRepository.delete(id);
    if (!isDeleted) {
      throw new NotFoundException(`Campus event with ID ${id} not found`);
    }
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
