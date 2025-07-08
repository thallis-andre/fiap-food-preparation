import { IsArray, IsString } from 'class-validator';

export class RequestPreparationInput {
  @IsString()
  orderId: string;

  @IsArray()
  @IsString({ each: true })
  items: string[];
}
