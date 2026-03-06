import type { CreateSubscriptionInput, SubscriptionRecord, SubscriptionStatus, SubscriptionsRepository } from '../../application/ports/SubscriptionsRepository';

export class MongoSubscriptionsRepository implements SubscriptionsRepository {
  async list(_tenantId: string): Promise<SubscriptionRecord[]> {
    throw new Error('MongoSubscriptionsRepository.list not implemented');
  }

  async create(_input: CreateSubscriptionInput): Promise<SubscriptionRecord> {
    throw new Error('MongoSubscriptionsRepository.create not implemented');
  }

  async updateStatus(_tenantId: string, _id: string, _status: SubscriptionStatus): Promise<SubscriptionRecord | null> {
    throw new Error('MongoSubscriptionsRepository.updateStatus not implemented');
  }
}
