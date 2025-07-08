import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreparationRepository } from '../application/abstractions/preparation.repository';
import { TypeormPreparationSchemaFactory } from './persistance/typeorm/preparation-schema.factory';
import { TypeormPreparationRepository } from './persistance/typeorm/preparation.repository';
import { TypeormPreparationSchema } from './persistance/typeorm/preparation.schema';

const TypeormSchemaModule = TypeOrmModule.forFeature([
  TypeormPreparationSchema,
]);

TypeormSchemaModule.global = true;
@Module({
  imports: [TypeormSchemaModule],
  providers: [
    TypeormPreparationSchemaFactory,
    {
      provide: PreparationRepository,
      useClass: TypeormPreparationRepository,
    },
  ],
  exports: [PreparationRepository],
})
export class InfraModule {}
