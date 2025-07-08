import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeormPreparationSchema } from '../../infra/persistance/typeorm/preparation.schema';
import { Preparation } from '../dtos/preparation.dto';
import {
  GetPreparationByIdQuery,
  GetPreparationByIdResult,
} from './get-preparation-by-id.query';

@QueryHandler(GetPreparationByIdQuery)
export class GetPreparationByIdHandler
  implements IQueryHandler<GetPreparationByIdQuery, GetPreparationByIdResult>
{
  constructor(
    @InjectRepository(TypeormPreparationSchema)
    private readonly queryModel: Repository<TypeormPreparationSchema>,
  ) {}

  async execute({
    id,
  }: GetPreparationByIdQuery): Promise<GetPreparationByIdResult> {
    const result = await this.queryModel.findOneBy({ _id: id });

    if (!result) {
      throw new NotFoundException();
    }

    return new GetPreparationByIdResult(
      new Preparation({
        id: result._id,
        description: result.description,
        items: result.items,
        status: result.status,
        requestedAt: result.requestedAt,
        startedAt: result.startedAt,
        completedAt: result.completedAt,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      }),
    );
  }
}
