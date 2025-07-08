export enum EPreparationStatus {
  Requested = 'Requested',
  Started = 'Started',
  Completed = 'Completed',
}

import { StatusTransitionException } from '../errors/status-transition.exception';

export type PreparationStatusValues = `${EPreparationStatus}`;

export abstract class PreparationStatus {
  protected abstract readonly _value: PreparationStatusValues;

  get value() {
    return this._value;
  }

  request(): PreparationStatus {
    throw new StatusTransitionException(
      this._value,
      EPreparationStatus.Requested,
    );
  }

  start(): PreparationStatus {
    throw new StatusTransitionException(
      this._value,
      EPreparationStatus.Started,
    );
  }

  complete(): PreparationStatus {
    throw new StatusTransitionException(
      this._value,
      EPreparationStatus.Completed,
    );
  }
}

class RequestedPreparationStatus extends PreparationStatus {
  protected readonly _value = EPreparationStatus.Requested;

  start() {
    return new StartedPreparationStatus();
  }
}

class StartedPreparationStatus extends PreparationStatus {
  protected readonly _value = EPreparationStatus.Started;

  complete(): PreparationStatus {
    return new CompletedPreparationStatus();
  }
}

class CompletedPreparationStatus extends PreparationStatus {
  protected readonly _value = EPreparationStatus.Completed;
}

export class PreparationStatusFactory {
  private static readonly values: Record<
    PreparationStatusValues,
    new () => PreparationStatus
  > = {
    Requested: RequestedPreparationStatus,
    Started: StartedPreparationStatus,
    Completed: CompletedPreparationStatus,
  };

  static new() {
    return new RequestedPreparationStatus();
  }

  static create(value: PreparationStatusValues) {
    const Status = this.values[value];
    if (!Status) {
      throw new Error(`Missing constructor for status value ${value}`);
    }

    return new Status();
  }
}
