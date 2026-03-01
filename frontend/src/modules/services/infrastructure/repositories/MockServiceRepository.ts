import type { Service } from '../../domain/entities/Service';
import type { ServiceRepository } from '../../domain/repositories/ServiceRepository';

const featuredServices: Service[] = [
  { id: 'svc-1', name: 'Corte Clásico', durationMinutes: 30, price: 12 },
  { id: 'svc-2', name: 'Barba Premium', durationMinutes: 25, price: 10 },
  { id: 'svc-3', name: 'Corte + Barba', durationMinutes: 50, price: 20 }
];

export class MockServiceRepository implements ServiceRepository {
  async getFeatured(): Promise<Service[]> {
    return featuredServices;
  }
}
