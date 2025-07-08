import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../application/application.module';
import { AdvancePreparationController } from './advance-preparation.controller';
import { GetPreparationByIdController } from './get-preparation-by-id.controller';
import { QueryPreparationsController } from './query-preparations.controller';
import { RequestPreparationController } from './request-preparation.controller';

const HttpDrivers = [
  RequestPreparationController,
  AdvancePreparationController,
  GetPreparationByIdController,
  QueryPreparationsController,
];
const AmqpDrivers = [];

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [...HttpDrivers],
  providers: [...AmqpDrivers],
})
export class DriversModule {}
