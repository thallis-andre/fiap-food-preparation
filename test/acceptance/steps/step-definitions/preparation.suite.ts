import { Given, Suite, Then, When } from '@fiap-food/acceptance-factory';
import { HttpService } from '@nestjs/axios';
import { fakeToken } from 'apps/fiap-food-preparation/test/fake.token';
import { strict as assert } from 'assert';
import { randomUUID } from 'crypto';

@Suite()
export class PreparationSuite {
  private targetId: string;

  constructor(private readonly http: HttpService) {}

  @Given('a preparation was requested')
  async createTarget() {
    const res = await this.http.axiosRef.post(
      'http://localhost:5000/v1/preparations',
      {
        orderId: randomUUID(),
        items: ['XFood'],
      },
    );
    this.targetId = res.data.id;
  }

  @When('a colaborator advances its status')
  async advanceTargetStatus() {
    await this.http.axiosRef.patch(
      `http://localhost:5000/v1/preparations/${this.targetId}/advance`,
      {},
      { headers: { Authorization: fakeToken.admin } },
    );
  }

  @When('a colaborator advances its status twice')
  async advanceTargetStatusTwice() {
    await this.http.axiosRef.patch(
      `http://localhost:5000/v1/preparations/${this.targetId}/advance`,
      {},
      { headers: { Authorization: fakeToken.admin } },
    );
    await this.http.axiosRef.patch(
      `http://localhost:5000/v1/preparations/${this.targetId}/advance`,
      {},
      { headers: { Authorization: fakeToken.admin } },
    );
  }

  @Then('the preparation gets started')
  async verifyStarted() {
    const res = await this.http.axiosRef.get(
      `http://localhost:5000/v1/preparations/${this.targetId}`,
    );

    const targetStatus = res.data.status;
    assert.equal(targetStatus, 'Started');
  }

  @Then('the preparation gets completed')
  async verifyCompleted() {
    const res = await this.http.axiosRef.get(
      `http://localhost:5000/v1/preparations/${this.targetId}`,
    );

    const targetStatus = res.data.status;
    assert.equal(targetStatus, 'Completed');
  }
}
