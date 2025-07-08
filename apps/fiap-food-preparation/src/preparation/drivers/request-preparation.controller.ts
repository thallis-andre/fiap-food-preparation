import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  RequestPreparationCommand,
  RequestPreparationResult,
} from '../application/commands/request-preparation.command';
import { RequestPreparationInput } from '../application/dtos/request-preparation.input';

@Controller({ version: '1', path: 'preparations' })
export class RequestPreparationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async execute(@Body() data: RequestPreparationInput) {
    const result = await this.commandBus.execute<
      RequestPreparationCommand,
      RequestPreparationResult
    >(new RequestPreparationCommand(data));

    return result;
  }
}
