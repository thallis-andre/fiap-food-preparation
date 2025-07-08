import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { AdvancePreparationCommand } from '../application/commands/adavance-preparation.command';
import { AdvancePreparationController } from './advance-preparation.controller';

describe('AdvancePreparationController', () => {
  let target: AdvancePreparationController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [AdvancePreparationController],
    }).compile();

    target = app.get(AdvancePreparationController);
    commandBus = app.get(CommandBus);
  });

  it('should execute request preparation command', async () => {
    jest.spyOn(commandBus, 'execute').mockResolvedValue(null);
    const id = '123';
    await target.execute(id);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new AdvancePreparationCommand(id),
    );
  });

  it('should throw if commandBus throws', async () => {
    const err = new Error('Too Bad');
    jest.spyOn(commandBus, 'execute').mockRejectedValue(err);
    const id = '123';
    await expect(() => target.execute(id)).rejects.toThrow(err);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new AdvancePreparationCommand(id),
    );
  });
});
