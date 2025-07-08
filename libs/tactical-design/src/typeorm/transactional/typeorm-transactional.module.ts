import { TransactionalModule } from '@fiap-food/tactical-design/core';
import { Module } from '@nestjs/common';
import { TypeormTransactionManager } from './typeorm-transaction.manager';

@Module({
  imports: [
    TransactionalModule.forFeature({
      TransactionManagerAdapter: TypeormTransactionManager,
    }),
  ],
})
export class TypeormTransactionalModule {}
