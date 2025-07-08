import { ContextService } from '@fiap-food/setup';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Transaction, TransactionManager } from '../../core';
import { TypeormTransaction } from './typeorm.transaction';

@Injectable()
export class TypeormTransactionManager extends TransactionManager {
  constructor(
    protected readonly context: ContextService,
    @InjectDataSource()
    protected readonly dataSource: DataSource,
  ) {
    super(context);
  }

  async createTransaction(): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    return new TypeormTransaction(queryRunner);
  }
}
