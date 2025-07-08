import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetPreparationByIdQuery,
  GetPreparationByIdResult,
} from '../application/queries/get-preparation-by-id.query';
import { UUIDValidationPipe } from '../infra/pipes/uuid-validator.pipe';

@Controller({ version: '1', path: 'preparations' })
export class GetPreparationByIdController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  async execute(@Param('id', new UUIDValidationPipe()) id: string) {
    const result = await this.queryBus.execute<
      GetPreparationByIdQuery,
      GetPreparationByIdResult
    >(new GetPreparationByIdQuery(id));

    return result.data;
  }
}
