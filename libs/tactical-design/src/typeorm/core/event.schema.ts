import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { AggregateEvent } from '../../core/domain/aggregate-root';

@Entity({ name: 'Events' })
@Index(['aggregateId', 'version'])
@Index(['aggregateId', 'eventName'])
@Index(['aggregateId', 'timestamp'])
export class EventSchema<T extends AggregateEvent = AggregateEvent> {
  @PrimaryColumn('uuid', { name: 'Id' })
  _id: string;

  @Column('text', { name: 'EventName' })
  eventName: string;

  @Column('text', { name: 'AggregateId' })
  aggregateId: string;

  @Column('timestamp', { name: 'Timestamp' })
  timestamp: Date;

  @Column('numeric', { name: 'Version' })
  version: number;

  @Column('json', { name: 'Event' })
  event: T['data'];
}
