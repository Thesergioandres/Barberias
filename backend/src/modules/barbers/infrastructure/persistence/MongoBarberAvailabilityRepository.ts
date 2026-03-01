import { BarberScheduleModel, BarberBlockModel } from '../../../../shared/infrastructure/mongoose/models/BarberAvailabilityModels';
import type { BarberAvailabilityRepository, CreateBlockInput, UpsertScheduleInput } from '../../application/ports/BarberAvailabilityRepository';
import type { BarberBlock, BarberSchedule } from '../../domain/entities/BarberAvailability';

function mapSchedule(document: {
  _id: { toString(): string };
  barberId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}): BarberSchedule {
  return {
    id: document._id.toString(),
    barberId: document.barberId,
    dayOfWeek: document.dayOfWeek,
    startTime: document.startTime,
    endTime: document.endTime
  };
}

function mapBlock(document: {
  _id: { toString(): string };
  barberId: string;
  startAt: Date;
  endAt: Date;
  reason?: string;
}): BarberBlock {
  return {
    id: document._id.toString(),
    barberId: document.barberId,
    startAt: new Date(document.startAt).toISOString(),
    endAt: new Date(document.endAt).toISOString(),
    reason: document.reason || ''
  };
}

export class MongoBarberAvailabilityRepository implements BarberAvailabilityRepository {
  async listSchedules(barberId: string): Promise<BarberSchedule[]> {
    const docs = await BarberScheduleModel.find({ barberId }).lean();
    return docs.map((doc) => mapSchedule(doc as typeof doc & { _id: { toString(): string } }));
  }

  async upsertSchedule({ barberId, dayOfWeek, startTime, endTime }: UpsertScheduleInput): Promise<BarberSchedule> {
    const doc = await BarberScheduleModel.findOneAndUpdate(
      { barberId, dayOfWeek },
      { barberId, dayOfWeek, startTime, endTime },
      { upsert: true, new: true }
    ).lean();

    return mapSchedule(doc as typeof doc & { _id: { toString(): string } });
  }

  async addBlock({ barberId, startAt, endAt, reason }: CreateBlockInput): Promise<BarberBlock> {
    const doc = await BarberBlockModel.create({
      barberId,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      reason: reason || ''
    });

    return mapBlock(doc.toObject() as typeof doc & { _id: { toString(): string } });
  }

  async listBlocks(barberId: string): Promise<BarberBlock[]> {
    const docs = await BarberBlockModel.find({ barberId }).lean();
    return docs.map((doc) => mapBlock(doc as typeof doc & { _id: { toString(): string } }));
  }
}
