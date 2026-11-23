import { Injectable } from '@nestjs/common';
import type {
  CampusEvent,
  EventQueryFilter,
  IEventRepository,
} from './events.types.js';
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

  findAll(filter?: EventQueryFilter): CampusEvent[] {
    let result = Array.from(this.events.values());

    if (filter) {
      if (filter.category) {
        const cat = filter.category.toLowerCase();
        result = result.filter(
          (event) => event.category?.toLowerCase() === cat,
        );
      }

      if (filter.isPublished !== undefined) {
        result = result.filter(
          (event) => event.isPublished === filter.isPublished,
        );
      }

      if (filter.sortBy) {
        const field = filter.sortBy;
        const orderMultiplier = filter.order === 'desc' ? -1 : 1;

        result = [...result].sort((a, b) => {
          const valA = a[field] ?? '';
          const valB = b[field] ?? '';
          if (valA < valB) return -1 * orderMultiplier;
          if (valA > valB) return 1 * orderMultiplier;
          return 0;
        });
      }

      if (filter.page && filter.limit) {
        const page = Math.max(1, filter.page);
        const limit = Math.max(1, filter.limit);
        const start = (page - 1) * limit;
        result = result.slice(start, start + limit);
      } else if (filter.limit) {
        const limit = Math.max(1, filter.limit);
        result = result.slice(0, limit);
      }
    }

    return result;
  }

  findById(id: number): CampusEvent | undefined {
    return this.events.get(id);
  }

  findUpcoming(): CampusEvent[] {
    const now = new Date();
    // Use start of current day for comparison
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    return Array.from(this.events.values())
      .filter((event) => {
        const eventDate = new Date(event.eventDate);
        return !isNaN(eventDate.getTime()) && eventDate >= startOfToday;
      })
      .sort(
        (a, b) =>
          new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
      );
  }

  create(eventData: Omit<CampusEvent, 'id'>): CampusEvent {
    this.currentId += 1;
    const newEvent: CampusEvent = {
      id: this.currentId,
      ...eventData,
      sessions: eventData.sessions ?? [],
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
