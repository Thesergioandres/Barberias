import type { Service } from '../../domain/entities/Service';
import type { ServiceRepository } from '../../domain/repositories/ServiceRepository';

export async function getFeaturedServices(serviceRepository: ServiceRepository): Promise<Service[]> {
  return serviceRepository.getFeatured();
}
