import { Module } from '@nestjs/common';
import { EventsController } from './events.controller.js';
import { InMemoryEventRepository } from './event.repository.js';
import { EventsService } from './events.service.js';
import { EVENT_REPOSITORY } from './events.types.js';

@Module({
  controllers: [EventsController],
  providers: [
    EventsService,
    {
      provide: EVENT_REPOSITORY,
      useClass: InMemoryEventRepository,
    },
  ],
})
export class EventsModule {}
