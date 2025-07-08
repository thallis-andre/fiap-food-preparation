import { RequestPreparationInput } from '../dtos/request-preparation.input';

export class RequestPreparationCommand {
  constructor(readonly data: RequestPreparationInput) {}
}

export class RequestPreparationResult {
  constructor(readonly id: string) {}
}
