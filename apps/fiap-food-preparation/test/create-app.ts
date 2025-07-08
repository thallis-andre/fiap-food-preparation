import { createTestApp as baseCreateTestApp } from '@fiap-food/test-factory/utils';
import { AppModule } from '../src/app.module';

export const env = {
  APP_NAME: 'fiap-food-preparation-test-app',
  APP_DESCRIPTION: 'Preparations Component for Fiap Food',
  APP_VERSION: '1.0.0',
};

export const createTestApp = (silentLogger: boolean = true) =>
  baseCreateTestApp(AppModule, { env, silentLogger });
