import { WithRoles } from '@fiap-food/setup';
import { Controller, Param, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AdvancePreparationCommand } from '../application/commands/adavance-preparation.command';
import { UUIDValidationPipe } from '../infra/pipes/uuid-validator.pipe';

@Controller({ version: '1', path: 'preparations' })
export class AdvancePreparationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id/advance')
  @WithRoles('ADMIN')
  async execute(@Param('id', new UUIDValidationPipe()) id: string) {
    await this.commandBus.execute(new AdvancePreparationCommand(id));
  }
}
