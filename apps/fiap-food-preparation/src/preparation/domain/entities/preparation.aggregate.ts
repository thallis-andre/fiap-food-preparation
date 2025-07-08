import { AggregateRoot } from '@fiap-food/tactical-design/core';
import { FinalPreparationStatus } from '../errors/final-preparation-status.exception';
import { PreparationCompleted } from '../events/preparation-completed.event';
import { PreparationRequested } from '../events/preparation-requested.event';
import { PreparationStarted } from '../events/preparation-started.event';
import {
  EPreparationStatus,
  PreparationStatus,
} from '../values/preparation-status.value';

export class Preparation extends AggregateRoot {
  constructor(
    protected readonly _id: string,
    private readonly _description: string,
    private readonly _items: string[],
    private _status: PreparationStatus,
    private _requestedAt: Date,
    private _startedAt: Date,
    private _completedAt: Date,
  ) {
    super(_id);
  }

  get description() {
    return this._description;
  }

  get items() {
    return this._items.map((x) => x);
  }

  get status() {
    return this._status.value;
  }

  get requestedAt() {
    return this._requestedAt;
  }

  get startedAt() {
    return this._startedAt;
  }

  get completedAt() {
    return this._completedAt;
  }

  advanceStatus() {
    switch (this.status) {
      case EPreparationStatus.Completed:
        throw new FinalPreparationStatus(this.id);
      case EPreparationStatus.Requested:
        this.start();
        break;
      case EPreparationStatus.Started:
        this.complete();
        break;
    }
  }

  request() {
    this.apply(new PreparationRequested());
  }

  onPreparationRequested({ requestedAt }: PreparationRequested) {
    this._requestedAt = requestedAt;
  }

  start() {
    this.apply(new PreparationStarted());
  }

  onPreparationStarted({ startedAt }: PreparationStarted) {
    this._status = this._status.start();
    this._startedAt = startedAt;
  }

  complete() {
    this.apply(new PreparationCompleted());
  }

  onPreparationCompleted({ completedAt }: PreparationCompleted) {
    this._status = this._status.complete();
    this._completedAt = completedAt;
  }
}
