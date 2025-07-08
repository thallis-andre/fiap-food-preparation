import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Preparation } from '../../../domain/entities/preparation.aggregate';
import {
    EPreparationStatus,
    PreparationStatusFactory,
} from '../../../domain/values/preparation-status.value';
import { TypeormPreparationSchemaFactory } from './preparation-schema.factory';
import { TypeormPreparationSchema } from './preparation.schema';

describe('TypeormPreparationSchemaFactory', () => {
  let app: INestApplication;
  let target: TypeormPreparationSchemaFactory;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [TypeormPreparationSchemaFactory],
    }).compile();

    app = moduleFixture.createNestApplication();
    target = app.get(TypeormPreparationSchemaFactory);
  });

  it('should transform a Preparation Entity into a Typeorm Schema', async () => {
    const preparation = new Preparation(
      randomUUID(),
      'order:123',
      ['X-Food'],
      PreparationStatusFactory.create(EPreparationStatus.Completed),
      new Date(),
      new Date(),
      new Date(),
    );

    const result = target.entityToSchema(preparation);
    expect(result).toBeInstanceOf(TypeormPreparationSchema);
    expect(result._id).toBe(preparation.id);
    expect(result.completedAt).toEqual(preparation.completedAt);
    expect(result.description).toBe(preparation.description);
    expect(result.items).toEqual(preparation.items);
    expect(result.requestedAt).toBe(preparation.requestedAt);
    expect(result.startedAt).toBe(preparation.startedAt);
    expect(result.status).toBe(preparation.status);
  });

  it('should transform a PreparationSchema into a PreparationEntity', async () => {
    const actual: TypeormPreparationSchema = {
      _id: randomUUID(),
      items: ['X-Food'],
      status: EPreparationStatus.Completed,
      completedAt: new Date(),
      createdAt: new Date(),
      requestedAt: new Date(),
      startedAt: new Date(),
      updatedAt: new Date(),
      description: 'dummy',
    };
    const result = target.schemaToEntity(actual);
    expect(result).toBeInstanceOf(Preparation);
    expect(result.id).toBe(actual._id);
    expect(result.completedAt).toEqual(actual.completedAt);
    expect(result.description).toBe(actual.description);
    expect(result.items).toEqual(actual.items);
    expect(result.requestedAt).toBe(actual.requestedAt);
    expect(result.startedAt).toBe(actual.startedAt);
    expect(result.status).toBe(actual.status);
  });
});
