import { AmqpModule } from '@fiap-food/amqp';
import { CommonModule, ContextModule, HealthzModule } from '@fiap-food/setup';
import { AmqpTacticalDesignModule } from '@fiap-food/tactical-design/amqp';
import { TacticalDesignModule } from '@fiap-food/tactical-design/core';
import {
  TypeormTacticalDesignModule,
  TypeormTransactionalModule,
} from '@fiap-food/tactical-design/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmqpConfig } from './config/amqp.config';
import { AppConfig } from './config/app.config';
import { TypeormConfig } from './config/typeorm.config';
import { PreparationModule } from './preparation/preparation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ContextModule.forRoot({}),
    CommonModule.forRootAsync({ useClass: AppConfig }),
    TypeOrmModule.forRootAsync({ useClass: TypeormConfig }),
    AmqpModule.forRootAsync({ useClass: AmqpConfig }),
    HealthzModule,
    TacticalDesignModule,
    TypeormTacticalDesignModule,
    TypeormTransactionalModule,
    AmqpTacticalDesignModule,
    PreparationModule,
  ],
})
export class AppModule {}
