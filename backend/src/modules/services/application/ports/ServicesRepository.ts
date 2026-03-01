import type { ServiceRecord } from '../../domain/entities/Service';

export type CreateServiceInput = {
  tenantId: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  active?: boolean;
};

export type UpdateServiceInput = Partial<CreateServiceInput>;

export interface ServicesRepository {
  list(tenantId: string, options?: { onlyActive?: boolean }): Promise<ServiceRecord[]>;
  findById(id: string, tenantId: string): Promise<ServiceRecord | null>;
  create(input: CreateServiceInput): Promise<ServiceRecord>;
  update(id: string, input: UpdateServiceInput): Promise<ServiceRecord | null>;
}
