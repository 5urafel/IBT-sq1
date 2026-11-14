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
  date: string;
  organizer: string;
  sessions: EventSession[];
}

export const EVENT_REPOSITORY = Symbol('EVENT_REPOSITORY');

export interface IEventRepository {
  findAll(): CampusEvent[];
  findById(id: number): CampusEvent | undefined;
  create(event: Omit<CampusEvent, 'id'>): CampusEvent;
  update(
    id: number,
    updatedData: Partial<CampusEvent>,
  ): CampusEvent | undefined;
  delete(id: number): boolean;
}
