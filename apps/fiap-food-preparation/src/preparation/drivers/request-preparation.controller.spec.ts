import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { RequestPreparationCommand } from '../application/commands/request-preparation.command';
import { RequestPreparationInput } from '../application/dtos/request-preparation.input';
import { RequestPreparationController } from './request-preparation.controller';

describe('RequestPreparationController', () => {
  let target: RequestPreparationController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [RequestPreparationController],
    }).compile();

    target = app.get(RequestPreparationController);
    commandBus = app.get(CommandBus);
  });

  it('should execute request preparation command', async () => {
    jest
      .spyOn(commandBus, 'execute')
      .mockResolvedValue({ data: { id: '123' } });
    const input = new RequestPreparationInput();
    await target.execute(input);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new RequestPreparationCommand(input),
    );
  });

  it('should throw if commandBus throws', async () => {
    const err = new Error('Too Bad');
    jest.spyOn(commandBus, 'execute').mockRejectedValue(err);
    const input = new RequestPreparationInput();
    await expect(() => target.execute(input)).rejects.toThrow(err);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new RequestPreparationCommand(input),
    );
  });
});
