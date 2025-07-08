import { StatusTransitionException } from '../errors/status-transition.exception';
import {
  EPreparationStatus,
  PreparationStatusFactory,
  PreparationStatusValues,
} from './preparation-status.value';

describe('PreparationStatus', () => {
  describe('PreparationStatusFactory.draft', () => {
    it('should instantiate PreparationStatus for the Requested state', () => {
      const target = PreparationStatusFactory.new();
      expect(target.value).toBe(EPreparationStatus.Requested);
    });
  });

  describe('PreparationStatusFactory.create', () => {
    it('should throw error if no status exists for value', () => {
      expect(() => PreparationStatusFactory.create('UNKNOWN' as any)).toThrow(
        'Missing constructor for status value UNKNOWN',
      );
    });
  });

  describe.each([
    EPreparationStatus.Requested,
    EPreparationStatus.Started,
    EPreparationStatus.Completed,
  ])('PreparationStatusFactory.create', (value: EPreparationStatus) => {
    it(`should instantiate PreparationStatus for the ${value} state`, () => {
      const target = PreparationStatusFactory.create(value);
      expect(target.value).toBe(value);
    });
  });

  describe.each([
    [EPreparationStatus.Requested, EPreparationStatus.Requested, false],
    [EPreparationStatus.Requested, EPreparationStatus.Started, true],
    [EPreparationStatus.Requested, EPreparationStatus.Completed, false],
    [EPreparationStatus.Started, EPreparationStatus.Requested, false],
    [EPreparationStatus.Started, EPreparationStatus.Started, false],
    [EPreparationStatus.Started, EPreparationStatus.Completed, true],
    [EPreparationStatus.Completed, EPreparationStatus.Requested, false],
    [EPreparationStatus.Completed, EPreparationStatus.Started, false],
    [EPreparationStatus.Completed, EPreparationStatus.Completed, false],
  ])('Preparation Status Transitions', (from, to, success) => {
    it(`should not allow transition from ${from} to ${to}`, () => {
      const target = PreparationStatusFactory.create(
        from as PreparationStatusValues,
      );
      const methods: Record<EPreparationStatus, string> = {
        [EPreparationStatus.Requested]: 'request',
        [EPreparationStatus.Started]: 'start',
        [EPreparationStatus.Completed]: 'complete',
      };
      const method = methods[to];
      if (success) {
        const actual = target[method]();
        expect(actual.value).toBe(to);
      } else {
        expect(() => target[method]()).toThrow(
          new StatusTransitionException(from, to),
        );
      }
    });
  });
});
