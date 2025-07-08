import { randomUUID } from 'crypto';

const rabbitmqHost = 'localhost';
const postgresHost = 'localhost';

const username = {
  rabbitmq: 'fiapfood',
  postgres: 'postgres',
};
const password = `fiapfood`;
export const virtualEnvironment = randomUUID().split('-').at(0);
export const rabbitmqURL = `http://${username.rabbitmq}:${password}@${rabbitmqHost}:15672`;
export const postgresURL = `http://${username.postgres}:${password}@${postgresHost}:5432/postgres`;

export const environment = {
  NODE_ENV: 'testing',
  POSTGRES_URL: `postgresql://postgres:fiapfood@${postgresHost}/${virtualEnvironment}?ApplicationName=FiapFoodPreparationTest`,
  AMQP_URL: `amqp://${username.rabbitmq}:${password}@${rabbitmqHost}:5672/${virtualEnvironment}`,
};
