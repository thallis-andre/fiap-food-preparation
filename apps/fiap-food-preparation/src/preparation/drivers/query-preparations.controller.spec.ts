import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { QueryPreparationsInput } from '../application/dtos/query-preparations.input';
import { QueryPreparationsQuery } from '../application/queries/query-preparations.query';
import { QueryPreparationsController } from './query-preparations.controller';

describe('QueryPreparationsController', () => {
  let target: QueryPreparationsController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [QueryPreparationsController],
    }).compile();

    target = app.get(QueryPreparationsController);
    queryBus = app.get(QueryBus);
  });

  it('should return existing preparations', async () => {
    jest
      .spyOn(queryBus, 'execute')
      .mockResolvedValue({ data: [{ id: '123' }] });
    const input = new QueryPreparationsInput();
    input.orderId = '123';
    input.status = 'Completed';
    const result = await target.execute({
      orderId: '123',
      status: 'Completed',
    });
    expect(queryBus.execute).toHaveBeenCalledWith(
      new QueryPreparationsQuery(input),
    );
    expect(result).toBeDefined();
  });

  it('should throw if commandBus throws', async () => {
    const err = new Error('Too Bad');
    jest.spyOn(queryBus, 'execute').mockRejectedValue(err);

    await expect(() => target.execute({})).rejects.toThrow(err);
    expect(queryBus.execute).toHaveBeenCalledWith(
      new QueryPreparationsQuery({}),
    );
  });
});
