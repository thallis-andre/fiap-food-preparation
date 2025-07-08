import { EntitySchemaFactory } from '@fiap-food/tactical-design/core';
import { Injectable } from '@nestjs/common';
import { Preparation } from '../../../domain/entities/preparation.aggregate';
import { PreparationStatusFactory } from '../../../domain/values/preparation-status.value';
import { TypeormPreparationSchema } from './preparation.schema';

@Injectable()
export class TypeormPreparationSchemaFactory
  implements EntitySchemaFactory<TypeormPreparationSchema, Preparation>
{
  entityToSchema(entity: Preparation): TypeormPreparationSchema {
    const schema = new TypeormPreparationSchema();
    schema._id = entity.id;
    schema.description = entity.description;
    schema.items = entity.items;
    schema.status = entity.status;
    schema.requestedAt = entity.requestedAt;
    schema.startedAt = entity.startedAt;
    schema.completedAt = entity.completedAt;
    return schema;
  }

  schemaToEntity(entitySchema: TypeormPreparationSchema): Preparation {
    return new Preparation(
      entitySchema._id,
      entitySchema.description,
      entitySchema.items,
      PreparationStatusFactory.create(entitySchema.status),
      entitySchema.requestedAt,
      entitySchema.startedAt,
      entitySchema.updatedAt,
    );
  }
}
