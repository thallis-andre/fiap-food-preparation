import { TransactionManager } from '@fiap-food/tactical-design/core';
import {
  FakeRepository,
  FakeTransactionManager,
} from '@fiap-food/test-factory/utils';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PreparationRepository } from '../abstractions/preparation.repository';
import { RequestPreparationCommand } from './request-preparation.command';
import { RequestPreparationHandler } from './request-preparation.handler';

describe('RequestPreparationHandler', () => {
  let app: INestApplication;
  let target: RequestPreparationHandler;
  let repository: PreparationRepository;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        RequestPreparationHandler,
        {
          provide: TransactionManager,
          useClass: FakeTransactionManager,
        },
        {
          provide: PreparationRepository,
          useClass: FakeRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    target = app.get(RequestPreparationHandler);
    repository = app.get(PreparationRepository);
  });

  it('should create a new Preparation', async () => {
    jest.spyOn(repository, 'create').mockResolvedValue();
    const command = new RequestPreparationCommand({
      items: [],
      orderId: randomUUID(),
    });
    await target.execute(command);
    expect(repository.create).toHaveBeenCalled();
  });
});
