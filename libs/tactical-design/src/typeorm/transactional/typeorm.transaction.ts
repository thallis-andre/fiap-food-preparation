import { QueryRunner } from 'typeorm';
import { Transaction } from '../../core';

export class TypeormTransaction extends Transaction<QueryRunner> {
  async begin(): Promise<void> {
    await this._hostTransaction.startTransaction();
  }

  async commit(): Promise<void> {
    await this._hostTransaction.commitTransaction();
  }

  async rollback(): Promise<void> {
    await this._hostTransaction.rollbackTransaction();
  }

  async end(): Promise<void> {
    await this._hostTransaction.release();
  }
}
