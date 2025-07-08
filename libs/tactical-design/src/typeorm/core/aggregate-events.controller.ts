import {
  AggregateEvent,
  EventRepository,
} from '@fiap-food/tactical-design/core';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('events')
@ApiTags('Events')
export class AggregateEventsController {
  constructor(private readonly eventsRepository: EventRepository) {}

  @Get(':aggregateId')
  @ApiOkResponse({ type: [AggregateEvent] })
  async getByAggregateId(@Param('aggregateId') aggregateId) {
    return await this.eventsRepository.findByAggregateId(aggregateId);
  }
}
