import { Transactional } from '@fiap-food/tactical-design/core';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PreparationRepository } from '../abstractions/preparation.repository';
import { AdvancePreparationCommand } from './adavance-preparation.command';

@CommandHandler(AdvancePreparationCommand)
export class AdvancePreparationHandler
  implements ICommandHandler<AdvancePreparationCommand, void>
{
  constructor(private readonly repository: PreparationRepository) {}

  @Transactional()
  async execute({ id }: AdvancePreparationCommand): Promise<void> {
    const preparation = await this.repository.findById(id);
    if (!preparation) {
      throw new NotFoundException();
    }
    preparation.advanceStatus();
    await preparation.commit();
    await this.repository.update(preparation);
  }
}
