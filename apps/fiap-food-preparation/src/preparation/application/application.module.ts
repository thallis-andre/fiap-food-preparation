import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InfraModule } from '../infra/infra.module';
import { AdvancePreparationHandler } from './commands/advance-preparation.handler';
import { RequestPreparationHandler } from './commands/request-preparation.handler';
import { GetPreparationByIdHandler } from './queries/get-preparation-by-id.handler';
import { QueryPreparationsHandler } from './queries/query-preparations.handler';

const QueryHandlers = [GetPreparationByIdHandler, QueryPreparationsHandler];
const CommandHandlers = [RequestPreparationHandler, AdvancePreparationHandler];

@Module({
  imports: [CqrsModule, InfraModule],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class ApplicationModule {}
