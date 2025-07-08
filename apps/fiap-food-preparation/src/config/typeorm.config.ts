import {
  CommonModuleOptions,
  InjectCommonModuleOptions,
} from '@fiap-food/setup';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeormConfig implements TypeOrmOptionsFactory {
  constructor(
    private readonly config: ConfigService,
    @InjectCommonModuleOptions()
    private readonly options: CommonModuleOptions,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const url = this.config.getOrThrow('POSTGRES_URL');
    const appName = this.options.appName;
    return {
      type: 'postgres',
      url,
      applicationName: appName,
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}
