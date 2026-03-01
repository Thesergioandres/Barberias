import { PlanType, TenantStatus } from '../enums/TenantEnums';

type TenantProps = {
  id: string;
  name: string;
  slug: string;
  planType: PlanType;
  status: TenantStatus;
  config?: {
    bufferTimeMinutes?: number;
    requirePaymentForNoShows?: boolean;
    maxNoShowsBeforePayment?: number;
  };
  createdAt: string;
};

export type TenantRecord = TenantProps;

export class Tenant {
  id: string;
  name: string;
  slug: string;
  planType: PlanType;
  status: TenantStatus;
  config: {
    bufferTimeMinutes: number;
    requirePaymentForNoShows: boolean;
    maxNoShowsBeforePayment: number;
  };
  createdAt: string;

  constructor(props: TenantProps) {
    this.id = props.id;
    this.name = props.name;
    this.slug = props.slug;
    this.planType = props.planType;
    this.status = props.status;
    this.config = {
      bufferTimeMinutes: props.config?.bufferTimeMinutes ?? 10,
      requirePaymentForNoShows: props.config?.requirePaymentForNoShows ?? false,
      maxNoShowsBeforePayment: props.config?.maxNoShowsBeforePayment ?? 3,
    };
    this.createdAt = props.createdAt;
  }

  getBufferTime(): number {
    return this.config.bufferTimeMinutes;
  }

  isActive(): boolean {
    return this.status === TenantStatus.ACTIVE;
  }
}
