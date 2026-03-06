export type SubscriptionStatus = 'ACTIVA' | 'PAUSADA' | 'CANCELADA';

export type SubscriptionRecord = {
  id: string;
  tenantId: string;
  customerId: string;
  planName: string;
  status: SubscriptionStatus;
  startedAt: string;
  nextChargeAt?: string;
};

export type CreateSubscriptionInput = {
  tenantId: string;
  customerId: string;
  planName: string;
  nextChargeAt?: string;
};

export interface SubscriptionsRepository {
  list(tenantId: string): Promise<SubscriptionRecord[]>;
  create(input: CreateSubscriptionInput): Promise<SubscriptionRecord>;
  updateStatus(tenantId: string, id: string, status: SubscriptionStatus): Promise<SubscriptionRecord | null>;
}
