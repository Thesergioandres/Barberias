import type { TenantsRepository, TenantEntity } from '../../application/ports/TenantsRepository';
import { database } from '../../../../shared/infrastructure/memory/database';

const mockTenants: TenantEntity[] = [
  {
    id: 'default_tenant',
    name: 'Barberia Noir',
    slug: 'noir',
    isActive: true,
    planType: 'PRO',
    config: { bufferTimeMinutes: 10, requirePaymentForNoShows: false, maxNoShowsBeforePayment: 3 }
  },
  {
    id: 'second_tenant',
    name: 'Cortes Clasicos',
    slug: 'clasicos',
    isActive: true,
    planType: 'BASIC',
    config: { bufferTimeMinutes: 0, requirePaymentForNoShows: false, maxNoShowsBeforePayment: 3 }
  }
];

export class InMemoryTenantsRepository implements TenantsRepository {
  async listAll() {
    return mockTenants;
  }

  async findById(id: string) {
    const t = mockTenants.find(t => t.id === id);
    return t || null;
  }

  async findBySlug(slug: string) {
    const t = mockTenants.find(t => t.slug === slug);
    return t || null;
  }
}
