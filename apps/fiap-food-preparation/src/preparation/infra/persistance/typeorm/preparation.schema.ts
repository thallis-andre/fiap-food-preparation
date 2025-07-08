import { TypeormEntitySchema } from '@fiap-food/tactical-design/typeorm';
import { Column, Entity } from 'typeorm';
import { PreparationStatusValues } from '../../../domain/values/preparation-status.value';

@Entity({ name: 'Preparations' })
export class TypeormPreparationSchema extends TypeormEntitySchema {
  @Column('text', { name: 'Description' })
  description: string;

  @Column('text', { name: 'Items', array: true, default: [] })
  items: string[];

  @Column('text', { name: 'Status' })
  status: PreparationStatusValues;

  @Column('timestamp', { name: 'RequestedAt', nullable: true })
  requestedAt?: Date;

  @Column('timestamp', { name: 'StartedAt', nullable: true })
  startedAt?: Date;

  @Column('timestamp', { name: 'CompletedAt', nullable: true })
  completedAt?: Date;
}
