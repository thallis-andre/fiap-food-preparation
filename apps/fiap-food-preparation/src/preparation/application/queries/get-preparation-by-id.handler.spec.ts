import { FakeTypeormRepository } from '@fiap-food/test-factory/utils';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { TypeormPreparationSchema } from '../../infra/persistance/typeorm/preparation.schema';
import { Preparation } from '../dtos/preparation.dto';
import { GetPreparationByIdHandler } from './get-preparation-by-id.handler';
import {
    GetPreparationByIdQuery,
    GetPreparationByIdResult,
} from './get-preparation-by-id.query';

describe('GetPreparationByIdHandler', () => {
  let app: INestApplication;
  let target: GetPreparationByIdHandler;
  let orm: FakeTypeormRepository<TypeormPreparationSchema>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        GetPreparationByIdHandler,
        {
          provide: getRepositoryToken(TypeormPreparationSchema),
          useClass: FakeTypeormRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    target = app.get(GetPreparationByIdHandler);
    orm = app.get(getRepositoryToken(TypeormPreparationSchema));
  });

  it('should throw NotFound if preparation does not exist', async () => {
    const query = new GetPreparationByIdQuery(randomUUID());
    jest.spyOn(orm, 'findOneBy').mockResolvedValue(null);
    await expect(() => target.execute(query)).rejects.toThrow(
      NotFoundException,
    );
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
    const query = new GetPreparationByIdQuery(schema._id);
    jest.spyOn(orm, 'findOneBy').mockResolvedValue(schema);
    const result = await target.execute(query);
    expect(result).toBeInstanceOf(GetPreparationByIdResult);
    expect(result.data).toBeInstanceOf(Preparation);
    expect(result.data.id).toBe(query.id);
  });
});
