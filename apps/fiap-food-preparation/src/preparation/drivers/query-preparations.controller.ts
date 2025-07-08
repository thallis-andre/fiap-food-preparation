import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { QueryPreparationsInput } from '../application/dtos/query-preparations.input';
import {
  QueryPreparationsQuery,
  QueryPreparationsResult,
} from '../application/queries/query-preparations.query';

@Controller({ version: '1', path: 'preparations' })
export class QueryPreparationsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async execute(@Query() query: QueryPreparationsInput) {
    const result = await this.queryBus.execute<
      QueryPreparationsQuery,
      QueryPreparationsResult
    >(new QueryPreparationsQuery(query));

    return result;
  }
}
