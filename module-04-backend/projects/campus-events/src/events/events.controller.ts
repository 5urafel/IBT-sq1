import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateEventDto,
  QueryEventDto,
  UpdateEventDto,
} from './dto/event.dto.js';
import { EventsService } from './events.service.js';
import { ApiKeyGuard } from '../common/api-key.guard.js';
import { TimingInterceptor } from '../common/timing.interceptor.js';

@UseInterceptors(TimingInterceptor)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(@Query() query: QueryEventDto) {
    return this.eventsService.findAll(query);
  }

  @Get('upcoming')
  findUpcoming() {
    return this.eventsService.findUpcoming();
  }

  @Get('example')
  findPage(@Query('page', ParseIntPipe) page: number) {
    return {
      page,
      message: 'Page received successfully',
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @Get(':id/sessions')
  findSessions(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findSessions(id);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}
