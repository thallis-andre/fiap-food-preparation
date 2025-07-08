import { Injectable } from '@nestjs/common';
import {
  Repository as BaseTypeormRepository,
  FindOptionsWhere,
  QueryRunner,
} from 'typeorm';
import {
  AggregateMergeContext,
  AggregateRoot,
  Entity,
  EntitySchemaFactory,
  Repository,
  TransactionManager,
} from '../../core';
import { TypeormEntitySchema } from './entity.schema';

@Injectable()
export abstract class TypeormRepository<
  TSchema extends TypeormEntitySchema,
  TEntity extends Entity,
> implements Repository<TEntity>
{
  constructor(
    protected readonly mergeContext: AggregateMergeContext,
    protected readonly transactionManager: TransactionManager,
    protected readonly typeormRepository: BaseTypeormRepository<TSchema>,
    protected readonly entitySchemaFactory: EntitySchemaFactory<
      TSchema,
      TEntity
    >,
  ) {}

  async findById(id: string): Promise<TEntity> {
    return this.findOne({ _id: id } as unknown as FindOptionsWhere<TSchema>);
  }

  async findAll(): Promise<TEntity[]> {
    return this.find({});
  }

  private merge(entity: TEntity) {
    if (entity instanceof AggregateRoot) {
      this.mergeContext.mergeObjectContext(entity);
    }
    return entity;
  }

  protected async find(
    entityFilterQuery?: FindOptionsWhere<TSchema>,
  ): Promise<TEntity[]> {
    const schemas = await this.typeormRepository.find({
      where: entityFilterQuery,
    });
    return schemas.map((schema) =>
      this.merge(this.entitySchemaFactory.schemaToEntity(schema)),
    );
  }

  async create(entity: TEntity): Promise<void> {
    const queryRunner = this.getQueryRunner();
    const schema = this.entitySchemaFactory.entityToSchema(entity);
    if (!queryRunner) {
      await this.typeormRepository.save(schema);
      return;
    }
    await queryRunner.manager.save(schema);
    this.merge(entity);
  }

  async update(entity: TEntity): Promise<void> {
    const queryRunner = this.getQueryRunner();
    const schema = this.entitySchemaFactory.entityToSchema(entity);
    if (!queryRunner) {
      await this.typeormRepository.save(schema);
      return;
    }
    await queryRunner.manager.save(schema);
  }

  protected async findOne(
    entityFilterQuery?: FindOptionsWhere<TSchema>,
  ): Promise<TEntity> {
    const schema = await this.typeormRepository.findOne({
      where: entityFilterQuery,
    });

    if (!schema) {
      return;
    }

    return this.merge(this.entitySchemaFactory.schemaToEntity(schema));
  }

  protected getQueryRunner(): QueryRunner {
    return this.transactionManager.getRunningTransactionOrDefault()
      ?.hostTransaction;
  }
}
