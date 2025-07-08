import { Preparation } from '../dtos/preparation.dto';

export class GetPreparationByIdQuery {
  constructor(public readonly id: string) {}
}

export class GetPreparationByIdResult {
  constructor(public readonly data: Preparation) {}
}
