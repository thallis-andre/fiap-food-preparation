import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export class TypeormEntitySchema {
  @PrimaryColumn('uuid', { name: 'Id' })
  _id: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt?: Date;
}
