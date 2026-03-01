import { ServiceModel } from '../../../../shared/infrastructure/mongoose/models/ServiceModel';
import type { ServicesRepository, CreateServiceInput, UpdateServiceInput } from '../../application/ports/ServicesRepository';
import type { ServiceRecord } from '../../domain/entities/Service';

function mapService(document: {
  _id: { toString(): string };
  tenantId: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
} | null): ServiceRecord | null {
  if (!document) {
    return null;
  }

  return {
    id: document._id.toString(),
    tenantId: document.tenantId,
    name: document.name,
    description: document.description,
    durationMinutes: document.durationMinutes,
    price: document.price,
    active: document.active
  };
}

export class MongoServicesRepository implements ServicesRepository {
  async list(tenantId: string, { onlyActive = false }: { onlyActive?: boolean } = {}): Promise<ServiceRecord[]> {
    const query: Record<string, unknown> = { tenantId };
    if (onlyActive) query.active = true;
    const docs = await ServiceModel.find(query).lean();
    return docs.map((doc) => mapService(doc as typeof doc & { _id: { toString(): string } }) as ServiceRecord);
  }

  async findById(id: string, tenantId: string): Promise<ServiceRecord | null> {
    const doc = await ServiceModel.findOne({ _id: id, tenantId }).lean();
    return mapService(doc as typeof doc & { _id: { toString(): string } });
  }

  async create(payload: CreateServiceInput): Promise<ServiceRecord> {
    const doc = await ServiceModel.create({
      tenantId: payload.tenantId,
      name: payload.name,
      description: payload.description || '',
      durationMinutes: Number(payload.durationMinutes),
      price: Number(payload.price),
      active: payload.active ?? true
    });

    return mapService(doc.toObject() as typeof doc & { _id: { toString(): string } }) as ServiceRecord;
  }

  async update(id: string, payload: UpdateServiceInput): Promise<ServiceRecord | null> {
    const update: Record<string, unknown> = {};
    if (payload.name !== undefined) update.name = payload.name;
    if (payload.description !== undefined) update.description = payload.description;
    if (payload.durationMinutes !== undefined) update.durationMinutes = Number(payload.durationMinutes);
    if (payload.price !== undefined) update.price = Number(payload.price);
    if (payload.active !== undefined) update.active = payload.active;

    const doc = await ServiceModel.findByIdAndUpdate(id, update, { new: true }).lean();
    return mapService(doc as typeof doc & { _id: { toString(): string } });
  }
}
