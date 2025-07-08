import { destroyTestApp } from '@fiap-food/test-factory/utils';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from './create-app';
import { fakeToken } from './fake.token';

const basePath = '/v1/preparations';

describe('Preparations', () => {
  let app: INestApplication;
  let server: App;

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await destroyTestApp(app);
  });

  describe('POST /v1/preparations', () => {
    it('should request a new preparation', async () => {
      const input = { orderId: randomUUID(), items: ['XFood'] };
      const postResponse = await request(server).post(basePath).send(input);
      const { statusCode, body } = postResponse;
      expect(statusCode).toBe(201);
      expect(body).toEqual({ id: expect.any(String) });
    });
  });

  describe('GET /v1/preparations/:id', () => {
    it('should return existing preparation', async () => {
      const input = { orderId: randomUUID(), items: ['XFood'] };
      const postResponse = await request(server).post(basePath).send(input);
      const { id } = postResponse.body;

      const getResponse = await request(server).get(`${basePath}/${id}`);
      expect(getResponse.statusCode).toBe(200);
      expect(getResponse.body).toEqual(expect.objectContaining({ id }));
      expect(getResponse.body.status).toBe('Requested');
    });

    it('should return not found for non existing preparation', async () => {
      const id = randomUUID();
      const getResponse = await request(server).get(`${basePath}/${id}`);
      expect(getResponse.statusCode).toBe(404);
    });

    it('should return bad request if an invalid id is provided', async () => {
      const id = `Invalid:${randomUUID()}`;
      const getResponse = await request(server).get(`${basePath}/${id}`);
      expect(getResponse.statusCode).toBe(400);
    });
  });

  describe('PATCH /v1/preparations/:id/advance', () => {
    it('should advance preparation status', async () => {
      const input = { orderId: randomUUID(), items: ['XFood'] };
      const postResponse = await request(server)
        .post(basePath)
        .set('Authorization', fakeToken.admin)
        .send(input);
      const { id } = postResponse.body;
      const patchResponse = await request(server)
        .patch(`${basePath}/${id}/advance`)
        .set('Authorization', fakeToken.admin)
        .send();
      expect(patchResponse.statusCode).toBe(200);
      const getResponse = await request(server).get(`${basePath}/${id}`);
      expect(getResponse.statusCode).toBe(200);
      expect(getResponse.body.id).toBe(id);
      expect(getResponse.body.status).toBe('Started');
    });

    it('should reject with 403 when invalid roles', async () => {
      const input = { orderId: randomUUID(), items: ['XFood'] };
      const postResponse = await request(server)
        .post(basePath)
        .set('Authorization', fakeToken.admin)
        .send(input);
      const { id } = postResponse.body;
      const patchResponse = await request(server)
        .patch(`${basePath}/${id}/advance`)
        .set('Authorization', fakeToken.customer)
        .send();
      expect(patchResponse.statusCode).toBe(403);
    });

    it('should reject with 401 when unauthorized', async () => {
      const input = { orderId: randomUUID(), items: ['XFood'] };
      const postResponse = await request(server).post(basePath).send(input);
      const { id } = postResponse.body;
      const patchResponse = await request(server)
        .patch(`${basePath}/${id}/advance`)
        .send();
      expect(patchResponse.statusCode).toBe(401);
    });

    it('should advance preparation status', async () => {
      const input = { orderId: randomUUID(), items: ['XFood'] };
      const postResponse = await request(server)
        .post(basePath)
        .set('Authorization', fakeToken.admin)
        .send(input);
      const { id } = postResponse.body;
      const patchResponse = await request(server)
        .patch(`${basePath}/${id}/advance`)
        .set('Authorization', fakeToken.admin)
        .send();
      expect(patchResponse.statusCode).toBe(200);
      const getResponse = await request(server).get(`${basePath}/${id}`);
      expect(getResponse.statusCode).toBe(200);
      expect(getResponse.body.id).toBe(id);
      expect(getResponse.body.status).toBe('Started');
    });
    it('should return an error if preparation is already completed', async () => {
      const input = { orderId: randomUUID(), items: ['XFood'] };
      const postResponse = await request(server).post(basePath).send(input);
      const { id } = postResponse.body;
      await request(server)
        .patch(`${basePath}/${id}/advance`)
        .set('Authorization', fakeToken.admin)
        .send();
      await request(server)
        .patch(`${basePath}/${id}/advance`)
        .set('Authorization', fakeToken.admin)
        .send();
      const patchResponse = await request(server)
        .patch(`${basePath}/${id}/advance`)
        .set('Authorization', fakeToken.admin)
        .send();
      expect(patchResponse.statusCode).toBe(422);
      const getResponse = await request(server).get(`${basePath}/${id}`);
      expect(getResponse.statusCode).toBe(200);
      expect(getResponse.body.id).toBe(id);
      expect(getResponse.body.status).toBe('Completed');
    });
    it('should return not found when advancing a preparation that does not exist', async () => {
      const id = randomUUID();
      const patchResponse = await request(server)
        .patch(`${basePath}/${id}/advance`)
        .set('Authorization', fakeToken.admin)
        .send();
      expect(patchResponse.statusCode).toBe(404);
    });
  });

  describe('GET /v1/preparations', () => {
    it('should return all existing preparations', async () => {
      const input = { orderId: randomUUID(), items: ['XFood'] };
      const values = await Promise.all(
        Array(3)
          .fill(null)
          .map(() => request(server).post(basePath).send(input)),
      );

      const getResponse = await request(server).get(`${basePath}`);
      expect(getResponse.statusCode).toBe(200);
      expect(getResponse.body.data).toBeInstanceOf(Array);
      expect(getResponse.body.data).toEqual(
        expect.arrayContaining(
          values.map((x) => expect.objectContaining({ id: x.body.id })),
        ),
      );
    });

    it('should return all existing preparations', async () => {
      const input = { orderId: randomUUID(), items: ['XFood'] };
      const [first, second] = await Promise.all(
        Array(3)
          .fill(null)
          .map(() => request(server).post(basePath).send(input)),
      );

      await request(server)
        .patch(`${basePath}/${first.body.id}/advance`)
        .set('Authorization', fakeToken.admin)
        .send();
      await request(server)
        .patch(`${basePath}/${first.body.id}/advance`)
        .set('Authorization', fakeToken.admin)
        .send();
      await request(server)
        .patch(`${basePath}/${second.body.id}/advance`)
        .set('Authorization', fakeToken.admin)
        .send();

      const getResponse = await request(server)
        .get(`${basePath}`)
        .query({ status: 'Completed' });
      expect(getResponse.statusCode).toBe(200);
      expect(getResponse.body.data).toBeInstanceOf(Array);
      expect(getResponse.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: first.body.id }),
        ]),
      );
    });

    it('should return all existing preparations', async () => {
      const firstInput = { orderId: randomUUID(), items: ['XFood'] };
      const secondInput = { orderId: randomUUID(), items: ['XFood'] };
      const [first] = await Promise.all([
        request(server).post(basePath).send(firstInput),
        request(server).post(basePath).send(secondInput),
      ]);
      const getResponse = await request(server)
        .get(`${basePath}`)
        .query({ orderId: firstInput.orderId });
      expect(getResponse.statusCode).toBe(200);
      expect(getResponse.body.data).toBeInstanceOf(Array);
      expect(getResponse.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: first.body.id }),
        ]),
      );
    });
  });
});
