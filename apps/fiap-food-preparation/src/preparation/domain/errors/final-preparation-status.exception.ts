import { DomainException } from '@fiap-food/tactical-design/core';

export class FinalPreparationStatus extends DomainException {
  constructor(id: string) {
    super(`Preparation with id ${id} is already at its final status`);
  }
}
