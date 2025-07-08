import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AggregatePersistanceContext } from '../../core/domain/aggregate-root';
import { EventRepository } from '../../core/domain/repository';
import { TypeormPersistanceContext } from './aggregate-context';
import { AggregateEventsController } from './aggregate-events.controller';
import { TypeormEventRepository } from './event.repository';
import { EventSchema } from './event.schema';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([EventSchema])],
  controllers: [AggregateEventsController],
  providers: [
    {
      provide: EventRepository,
      useClass: TypeormEventRepository,
    },
    {
      provide: AggregatePersistanceContext,
      useClass: TypeormPersistanceContext,
    },
  ],
  exports: [AggregatePersistanceContext],
})
export class TypeormTacticalDesignModule {}
