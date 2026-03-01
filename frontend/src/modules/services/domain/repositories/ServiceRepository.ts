import type { Service } from '../entities/Service';

export interface ServiceRepository {
  getFeatured(): Promise<Service[]>;
}
