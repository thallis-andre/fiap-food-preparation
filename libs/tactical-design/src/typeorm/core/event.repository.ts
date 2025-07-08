import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { AggregateEvent, DomainEvent } from '../../core/domain/aggregate-root';
import { EventRepository } from '../../core/domain/repository';
import { TransactionManager } from '../../core/transactional/transaction.manager';
import { EventSchema } from './event.schema';

@Injectable()
export class TypeormEventRepository<
  TEvent extends AggregateEvent = AggregateEvent,
  TSchema extends EventSchema = EventSchema,
> implements EventRepository<TEvent>
{
  constructor(
    protected readonly transactionManager: TransactionManager,
    @InjectRepository(EventSchema)
    protected readonly eventRepository: Repository<EventSchema>,
  ) {}

  async findById(id: string): Promise<TEvent> {
    return this.findOne({ _id: id } as unknown as FindOptionsWhere<TSchema>);
  }

  async findByAggregateId(aggregateId: string): Promise<TEvent[]> {
    return this.find({ aggregateId } as unknown as FindOptionsWhere<TSchema>);
  }

  async create(event: TEvent): Promise<void> {
    const session = this.getSession();
    (event as any).id = randomUUID();
    const schema = this.toSchema(event);
    await session.manager.save(schema);
  }

  protected async find(
    entityFilterQuery?: FindOptionsWhere<TSchema>,
  ): Promise<TEvent[]> {
    const foundValues = await this.eventRepository.find({
      where: { ...entityFilterQuery },
      order: { timestamp: 'ASC' },
    });
    return foundValues.map((entitySchema) => this.toEvent(entitySchema));
  }

  protected async findOne(
    entityFilterQuery?: FindOptionsWhere<TSchema>,
  ): Promise<TEvent> {
    const entityDocument = await this.eventRepository.findOne({
      where: entityFilterQuery,
    });

    if (!entityDocument) {
      return;
    }

    return this.toEvent(entityDocument as TSchema);
  }

  protected getSession(): QueryRunner {
    return this.transactionManager.getRunningTransactionOrDefault()
      ?.hostTransaction;
  }

  private toSchema(aggregateEvent: TEvent): EventSchema<TEvent> {
    const schema = new EventSchema<TEvent>();
    schema._id = aggregateEvent.id;
    schema.aggregateId = aggregateEvent.aggregateId;
    schema.eventName = aggregateEvent.eventName;
    schema.timestamp = aggregateEvent.timestamp;
    schema.version = aggregateEvent.version;
    schema.event = aggregateEvent.data;
    return schema;
  }

  private toEvent(schema: EventSchema<AggregateEvent<DomainEvent>>): TEvent {
    const EventConstructor = function (data) {
      Object.assign(this, data);
    };
    Object.defineProperty(EventConstructor, 'name', {
      value: schema.eventName,
    });
    const domainEvent = new EventConstructor(schema.event);
    return new AggregateEvent(
      schema._id,
      schema.aggregateId,
      schema.eventName,
      schema.timestamp,
      schema.version,
      domainEvent,
    ) as TEvent;
  }
}
