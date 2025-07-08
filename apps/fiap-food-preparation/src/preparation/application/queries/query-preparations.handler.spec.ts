import { FakeTypeormRepository } from '@fiap-food/test-factory/utils';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { TypeormPreparationSchema } from '../../infra/persistance/typeorm/preparation.schema';
import { QueryPreparationsInput } from '../dtos/query-preparations.input';
import { QueryPreparationsHandler } from './query-preparations.handler';
import {
    QueryPreparationsQuery,
    QueryPreparationsResult,
} from './query-preparations.query';

describe('QueryPreparationsHandler', () => {
  let app: INestApplication;
  let target: QueryPreparationsHandler;
  let orm: FakeTypeormRepository<TypeormPreparationSchema>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        QueryPreparationsHandler,
        {
          provide: getRepositoryToken(TypeormPreparationSchema),
          useClass: FakeTypeormRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    target = app.get(QueryPreparationsHandler);
    orm = app.get(getRepositoryToken(TypeormPreparationSchema));
  });

  it('should emptyset if not found', async () => {
    const dto = new QueryPreparationsInput();
    dto.orderId = '123';
    dto.status = 'Created';
    const query = new QueryPreparationsQuery(dto);
    jest.spyOn(orm, 'find').mockResolvedValue(null);
    const result = await target.execute(query);
    expect(result).toBeInstanceOf(QueryPreparationsResult);
    expect(result.data).toBeInstanceOf(Array);
    expect(result.data.length).toBe(0);
  });

  it('should return existing preparation if found', async () => {
    const schema: TypeormPreparationSchema = {
      _id: randomUUID(),
      description: 'dummy',
      items: ['XFood'],
      completedAt: new Date(),
      requestedAt: new Date(),
      startedAt: new Date(),
      status: 'Completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const dto = new QueryPreparationsInput();
    dto.orderId = '123';
    dto.status = 'Completed';
    const query = new QueryPreparationsQuery(dto);
    jest.spyOn(orm, 'find').mockResolvedValue([schema]);
    const result = await target.execute(query);
    expect(result).toBeInstanceOf(QueryPreparationsResult);
    expect(result.data).toBeInstanceOf(Array);
  });
});
