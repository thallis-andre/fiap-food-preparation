import { TypeormEntitySchema } from '@fiap-food/tactical-design/typeorm';
import { Entity } from './entity';

export interface EntityFactory<TEntity extends Entity> {
  create(...args: any): TEntity | Promise<TEntity>;
}

export interface EntitySchemaFactory<
  TSchema extends TypeormEntitySchema,
  TEntity extends Entity,
> {
  entityToSchema(entity: TEntity): TSchema;
  schemaToEntity(entitySchema: TSchema): TEntity;
}
