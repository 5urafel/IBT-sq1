import { Injectable } from '@nestjs/common';
import type { CampusEvent, IEventRepository } from './events.types.js';
import { seedEvents } from './seed-events.js';

@Injectable()
export class InMemoryEventRepository implements IEventRepository {
  private readonly events = new Map<number, CampusEvent>();
  private currentId = 0;

  constructor() {
    for (const event of seedEvents) {
      this.events.set(event.id, {
        ...event,
        sessions: event.sessions.map((session) => ({ ...session })),
      });
      if (event.id > this.currentId) {
        this.currentId = event.id;
      }
    }
  }

  findAll(): CampusEvent[] {
    return Array.from(this.events.values());
  }

  findById(id: number): CampusEvent | undefined {
    return this.events.get(id);
  }

  create(eventData: Omit<CampusEvent, 'id'>): CampusEvent {
    this.currentId += 1;
    const newEvent: CampusEvent = {
      id: this.currentId,
      ...eventData,
    };
    this.events.set(newEvent.id, newEvent);
    return newEvent;
  }

  update(
    id: number,
    updatedData: Partial<CampusEvent>,
  ): CampusEvent | undefined {
    const existing = this.events.get(id);
    if (!existing) return undefined;

    const updatedEvent: CampusEvent = {
      ...existing,
      ...updatedData,
      id, // Ensure ID cannot be overwritten
    };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  delete(id: number): boolean {
    return this.events.delete(id);
  }
}
