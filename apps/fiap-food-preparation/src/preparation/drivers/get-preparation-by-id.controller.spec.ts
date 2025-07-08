import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { GetPreparationByIdQuery } from '../application/queries/get-preparation-by-id.query';
import { GetPreparationByIdController } from './get-preparation-by-id.controller';

describe('GetPreparationByIdController', () => {
  let target: GetPreparationByIdController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [GetPreparationByIdController],
    }).compile();

    target = app.get(GetPreparationByIdController);
    queryBus = app.get(QueryBus);
  });

  it('should return existing preparation', async () => {
    jest.spyOn(queryBus, 'execute').mockResolvedValue({ data: { id: '123' } });
    const id = randomUUID();
    const result = await target.execute(id);
    expect(result.id).toBe('123');
    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetPreparationByIdQuery(id),
    );
  });

  it('should throw if commandBus throws', async () => {
    const err = new Error('Too Bad');
    jest.spyOn(queryBus, 'execute').mockRejectedValue(err);

    await expect(() => target.execute('123')).rejects.toThrow(err);
    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetPreparationByIdQuery('123'),
    );
  });
});
