import { randomUUID } from 'crypto';
import type { CreateSubscriptionInput, SubscriptionRecord, SubscriptionStatus, SubscriptionsRepository } from '../../application/ports/SubscriptionsRepository';

export class InMemorySubscriptionsRepository implements SubscriptionsRepository {
  private subscriptions: SubscriptionRecord[] = [];

  async list(tenantId: string) {
    return this.subscriptions.filter((sub) => sub.tenantId === tenantId);
  }

  async create(input: CreateSubscriptionInput) {
    const subscription: SubscriptionRecord = {
      id: randomUUID(),
      tenantId: input.tenantId,
      customerId: input.customerId,
      planName: input.planName,
      status: 'ACTIVA',
      startedAt: new Date().toISOString(),
      nextChargeAt: input.nextChargeAt
    };
    this.subscriptions.push(subscription);
    return subscription;
  }

  async updateStatus(tenantId: string, id: string, status: SubscriptionStatus) {
    const index = this.subscriptions.findIndex((sub) => sub.tenantId === tenantId && sub.id === id);
    if (index < 0) return null;
    const updated: SubscriptionRecord = { ...this.subscriptions[index], status };
    this.subscriptions[index] = updated;
    return updated;
  }
}
