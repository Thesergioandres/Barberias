import { randomUUID } from 'crypto';
import { database } from '../../../../shared/infrastructure/memory/database';
import type { ServicesRepository, CreateServiceInput, UpdateServiceInput } from '../../application/ports/ServicesRepository';
import type { ServiceRecord } from '../../domain/entities/Service';

export class InMemoryServicesRepository implements ServicesRepository {
  async list(tenantId: string, { onlyActive = false }: { onlyActive?: boolean } = {}): Promise<ServiceRecord[]> {
    let result = database.services.filter(s => s.tenantId === tenantId);
    if (onlyActive) {
      return result.filter((service) => service.active);
    }

    return result;
  }

  async findById(id: string, tenantId: string): Promise<ServiceRecord | null> {
    const service = database.services.find((service) => service.id === id);
    return service?.tenantId === tenantId ? service : null;
  }

  async create(payload: CreateServiceInput): Promise<ServiceRecord> {
    const service: ServiceRecord = {
      id: randomUUID(),
      tenantId: payload.tenantId,
      name: payload.name,
      description: payload.description || '',
      durationMinutes: Number(payload.durationMinutes),
      price: Number(payload.price),
      active: payload.active ?? true
    };

    database.services.push(service);
    return service;
  }

  async update(id: string, payload: UpdateServiceInput): Promise<ServiceRecord | null> {
    const service = database.services.find((s) => s.id === id);
    if (!service) {
      return null;
    }

    service.name = payload.name ?? service.name;
    service.description = payload.description ?? service.description;
    service.durationMinutes = payload.durationMinutes ? Number(payload.durationMinutes) : service.durationMinutes;
    service.price = payload.price ? Number(payload.price) : service.price;
    if (typeof payload.active === 'boolean') {
      service.active = payload.active;
    }

    return service;
  }
}
