import { Repository } from '@fiap-food/tactical-design/core';
import { Preparation } from '../../domain/entities/preparation.aggregate';

export abstract class PreparationRepository implements Repository<Preparation> {
  abstract findById(id: string): Promise<Preparation>;
  abstract findAll(): Promise<Preparation[]>;
  abstract create(entity: Preparation): Promise<void>;
  abstract update(entity: Preparation): Promise<void>;

  abstract generateId(): string;
}
