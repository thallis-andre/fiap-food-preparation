import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeormPreparationSchema } from '../../infra/persistance/typeorm/preparation.schema';
import { Preparation } from '../dtos/preparation.dto';
import {
  QueryPreparationsQuery,
  QueryPreparationsResult,
} from './query-preparations.query';

@QueryHandler(QueryPreparationsQuery)
export class QueryPreparationsHandler
  implements IQueryHandler<QueryPreparationsQuery, QueryPreparationsResult>
{
  constructor(
    @InjectRepository(TypeormPreparationSchema)
    private readonly queryModel: Repository<TypeormPreparationSchema>,
  ) {}

  async execute({
    data,
  }: QueryPreparationsQuery): Promise<QueryPreparationsResult> {
    const { orderId, status } = data;
    const query: any = {};
    if (orderId) {
      query.description = `Order:${orderId}`;
    }
    if (status) {
      query.status = status;
    }
    const result = await this.queryModel.find({ where: query });

    return new QueryPreparationsResult(
      (result ?? []).map(
        (x) =>
          new Preparation({
            id: x._id,
            description: x.description,
            items: x.items,
            status: x.status,
            requestedAt: x.requestedAt,
            startedAt: x.startedAt,
            completedAt: x.completedAt,
            createdAt: x.createdAt,
            updatedAt: x.updatedAt,
          }),
      ),
    );
  }
}
