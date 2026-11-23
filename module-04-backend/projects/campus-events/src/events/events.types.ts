export interface EventSession {
  id: number;
  title: string;
  description: string;
  speaker: string;
  startTime: string;
  endTime: string;
}

export interface CampusEvent {
  id: number;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  category: string;
  isPublished: boolean;
  organizer?: string;
  sessions: EventSession[];
}

export interface EventQueryFilter {
  category?: string;
  isPublished?: boolean;
  sortBy?: 'eventDate' | 'title' | 'category' | 'id';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const EVENT_REPOSITORY = Symbol('EVENT_REPOSITORY');

export interface IEventRepository {
  findAll(filter?: EventQueryFilter): CampusEvent[];
  findById(id: number): CampusEvent | undefined;
  findUpcoming(): CampusEvent[];
  create(event: Omit<CampusEvent, 'id'>): CampusEvent;
  update(
    id: number,
    updatedData: Partial<CampusEvent>,
  ): CampusEvent | undefined;
  delete(id: number): boolean;
}
