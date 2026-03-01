export interface TenantEntity {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
  planType: string;
  config: {
    bufferTimeMinutes: number;
    requirePaymentForNoShows: boolean;
    maxNoShowsBeforePayment: number;
  };
}

export interface TenantsRepository {
  findById(id: string): Promise<TenantEntity | null>;
  findBySlug(slug: string): Promise<TenantEntity | null>;
  listAll(): Promise<TenantEntity[]>;
}
