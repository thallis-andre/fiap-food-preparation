import {
  configureCORS,
  configureCompression,
  configureContextWrappers,
  configureExceptionHandler,
  configureHelmet,
  configureHttpInspectorInbound,
  configureLogger,
  configureOpenAPI,
  configureRoutePrefix,
  configureValidation,
  configureVersioning,
} from '@fiap-food/setup';
import { INestApplication, Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { setTimeout } from 'timers/promises';
import { DataSource } from 'typeorm';
import {
  environment,
  postgresURL,
  rabbitmqURL,
  virtualEnvironment,
} from './environment';

export type TestOptions = {
  env?: Record<string, any>;
  silentLogger?: boolean;
};

let dataSource: DataSource;

export async function createTestApp(
  AppModule: Type<any>,
  options?: TestOptions,
) {
  const { env = {}, silentLogger = true } = options ?? {};
  if (silentLogger) {
    env['LOG_SILENT'] = 'true';
  }
  Object.entries({ ...env, ...environment }).forEach(
    ([key, value]) => (process.env[key] = value),
  );
  dataSource = new DataSource({ url: postgresURL, type: 'postgres' });
  await dataSource.initialize();
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.createDatabase(virtualEnvironment);
  await queryRunner.release();
  await axios.put(`${rabbitmqURL}/api/vhosts/${virtualEnvironment}`);
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication();
  configureContextWrappers(app);
  configureLogger(app);
  configureExceptionHandler(app);
  configureHttpInspectorInbound(app);
  configureCORS(app);
  configureHelmet(app);
  configureCompression(app);
  configureValidation(app);
  configureVersioning(app);
  configureRoutePrefix(app);
  configureOpenAPI(app);

  await app.init();
  await setTimeout(250);
  return app;
}

const gracefulShutdownPeriod = () => setTimeout(250);

export async function destroyTestApp(app: INestApplication) {
  await app.close();
  await gracefulShutdownPeriod();
  await axios.delete(`${rabbitmqURL}/api/vhosts/${virtualEnvironment}`);
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.dropDatabase(virtualEnvironment);
  await queryRunner.release();
  await dataSource.destroy();
}
