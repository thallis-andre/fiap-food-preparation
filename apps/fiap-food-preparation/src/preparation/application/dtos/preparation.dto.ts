import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PreparationStatusValues } from '../../domain/values/preparation-status.value';

export class Preparation {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly description: string;

  @ApiProperty()
  public readonly items: string[];

  @ApiProperty()
  public readonly status: PreparationStatusValues;

  @ApiProperty()
  public readonly requestedAt: Date;

  @ApiPropertyOptional()
  public readonly startedAt?: Date;

  @ApiPropertyOptional()
  public readonly completedAt?: Date;

  @ApiProperty()
  public readonly createdAt: Date;

  @ApiPropertyOptional()
  public readonly updatedAt?: Date;

  constructor(values: Preparation) {
    Object.assign(this, values);
  }
}
