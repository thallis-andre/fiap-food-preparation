import { Preparation } from '../dtos/preparation.dto';
import { QueryPreparationsInput } from '../dtos/query-preparations.input';

export class QueryPreparationsQuery {
  constructor(public readonly data: QueryPreparationsInput) {}
}

export class QueryPreparationsResult {
  constructor(public readonly data: Preparation[]) {}
}
