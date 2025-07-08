import {
  AggregateMergeContext,
  TransactionManager,
} from '@fiap-food/tactical-design/core';
import { FakeTypeormRepository } from '@fiap-food/test-factory/utils';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PreparationRepository } from '../../../application/abstractions/preparation.repository';
import { TypeormPreparationSchemaFactory } from './preparation-schema.factory';
import { TypeormPreparationRepository } from './preparation.repository';
import { TypeormPreparationSchema } from './preparation.schema';

describe('TypeormPreparationRepository', () => {
  let app: INestApplication;
  let target: PreparationRepository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TransactionManager,
          useValue: Object.create(TransactionManager.prototype),
        },
        {
          provide: TypeormPreparationSchemaFactory,
          useValue: Object.create(TypeormPreparationSchemaFactory.prototype),
        },
        {
          provide: AggregateMergeContext,
          useValue: Object.create(AggregateMergeContext.prototype),
        },
        {
          provide: getRepositoryToken(TypeormPreparationSchema),
          useValue: FakeTypeormRepository,
        },
        {
          provide: PreparationRepository,
          useClass: TypeormPreparationRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    target = app.get(PreparationRepository);
  });

  it('should instantiate correctly', async () => {
    expect(target).toBeInstanceOf(TypeormPreparationRepository);
  });
});
