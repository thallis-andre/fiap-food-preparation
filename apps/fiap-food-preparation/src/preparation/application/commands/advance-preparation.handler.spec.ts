import { TransactionManager } from '@fiap-food/tactical-design/core';
import {
  FakeRepository,
  FakeTransactionManager,
} from '@fiap-food/test-factory/utils';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Preparation } from '../../domain/entities/preparation.aggregate';
import { PreparationStatusFactory } from '../../domain/values/preparation-status.value';
import { PreparationRepository } from '../abstractions/preparation.repository';
import { AdvancePreparationCommand } from './adavance-preparation.command';
import { AdvancePreparationHandler } from './advance-preparation.handler';

describe('AdvancePreparationHandler', () => {
  let app: INestApplication;
  let target: AdvancePreparationHandler;
  let repository: PreparationRepository;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        AdvancePreparationHandler,
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
    target = app.get(AdvancePreparationHandler);
    repository = app.get(PreparationRepository);
  });

  it('should throw NotFoundException if no preparation is found with the given id', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(null);
    jest.spyOn(repository, 'update');
    const command = new AdvancePreparationCommand('123');
    await expect(async () => target.execute(command)).rejects.toThrow(
      NotFoundException,
    );
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should throw if preparation is already completed', async () => {
    const preparation = new Preparation(
      randomUUID(),
      'Dummy',
      ['XFood'],
      PreparationStatusFactory.create('Completed'),
      new Date(),
      new Date(),
      new Date(),
    );
    jest.spyOn(repository, 'findById').mockResolvedValue(preparation);
    jest.spyOn(repository, 'update').mockResolvedValue();
    const command = new AdvancePreparationCommand('123');
    await expect(() => target.execute(command)).rejects.toThrow();
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should advance requested preparation to status started', async () => {
    const preparation = new Preparation(
      randomUUID(),
      'Dummy',
      ['XFood'],
      PreparationStatusFactory.create('Requested'),
      new Date(),
      null,
      null,
    );
    jest.spyOn(repository, 'findById').mockResolvedValue(preparation);
    jest.spyOn(repository, 'update').mockResolvedValue();
    const command = new AdvancePreparationCommand('123');
    await target.execute(command);
    expect(preparation.status).toBe('Started');
    expect(preparation.startedAt).toEqual(expect.any(Date));
    expect(repository.update).toHaveBeenCalled();
  });

  it('should advance requested preparation to status completed', async () => {
    const preparation = new Preparation(
      randomUUID(),
      'Dummy',
      ['XFood'],
      PreparationStatusFactory.create('Started'),
      new Date(),
      new Date(),
      null,
    );
    jest.spyOn(repository, 'findById').mockResolvedValue(preparation);
    jest.spyOn(repository, 'update').mockResolvedValue();
    const command = new AdvancePreparationCommand('123');
    await target.execute(command);
    expect(preparation.status).toBe('Completed');
    expect(preparation.completedAt).toEqual(expect.any(Date));
    expect(repository.update).toHaveBeenCalled();
  });
});
