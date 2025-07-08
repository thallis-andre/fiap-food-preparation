import {
  AggregateMergeContext,
  TransactionManager,
} from '@fiap-food/tactical-design/core';
import { TypeormRepository } from '@fiap-food/tactical-design/typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { PreparationRepository } from '../../../application/abstractions/preparation.repository';
import { Preparation } from '../../../domain/entities/preparation.aggregate';
import { TypeormPreparationSchemaFactory } from './preparation-schema.factory';
import { TypeormPreparationSchema } from './preparation.schema';

@Injectable()
export class TypeormPreparationRepository
  extends TypeormRepository<TypeormPreparationSchema, Preparation>
  implements PreparationRepository
{
  constructor(
    protected readonly mergeContext: AggregateMergeContext,
    protected readonly transactionManager: TransactionManager,
    @InjectRepository(TypeormPreparationSchema)
    protected readonly typeormRepository: Repository<TypeormPreparationSchema>,
    protected readonly entitySchemaFactory: TypeormPreparationSchemaFactory,
  ) {
    super(
      mergeContext,
      transactionManager,
      typeormRepository,
      entitySchemaFactory,
    );
  }

  generateId(): string {
    return randomUUID();
  }
}
