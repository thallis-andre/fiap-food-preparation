import { Transactional } from '@fiap-food/tactical-design/core';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Preparation } from '../../domain/entities/preparation.aggregate';
import { PreparationStatusFactory } from '../../domain/values/preparation-status.value';
import { PreparationRepository } from '../abstractions/preparation.repository';
import {
  RequestPreparationCommand,
  RequestPreparationResult,
} from './request-preparation.command';

@CommandHandler(RequestPreparationCommand)
export class RequestPreparationHandler
  implements
    ICommandHandler<RequestPreparationCommand, RequestPreparationResult>
{
  constructor(private readonly repository: PreparationRepository) {}

  @Transactional()
  async execute({
    data,
  }: RequestPreparationCommand): Promise<RequestPreparationResult> {
    const { items, orderId } = data;
    const id = this.repository.generateId();
    const preparation = new Preparation(
      id,
      `Order:${orderId}`,
      items,
      PreparationStatusFactory.new(),
      null,
      null,
      null,
    );
    preparation.request();
    await this.repository.create(preparation);
    await preparation.commit();

    return new RequestPreparationResult(preparation.id);
  }
}
