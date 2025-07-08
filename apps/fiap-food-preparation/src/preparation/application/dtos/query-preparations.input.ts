import { IsOptional, IsString } from 'class-validator';

export class QueryPreparationsInput {
  @IsString()
  @IsOptional()
  orderId?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
