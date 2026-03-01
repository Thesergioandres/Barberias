import { randomUUID } from 'crypto';
import { database } from '../../../../shared/infrastructure/memory/database';
import type { BarberAvailabilityRepository, CreateBlockInput, UpsertScheduleInput } from '../../application/ports/BarberAvailabilityRepository';
import type { BarberBlock, BarberSchedule } from '../../domain/entities/BarberAvailability';

export class InMemoryBarberAvailabilityRepository implements BarberAvailabilityRepository {
  async listSchedules(barberId: string): Promise<BarberSchedule[]> {
    return database.barberSchedules.filter((item) => item.barberId === barberId) as BarberSchedule[];
  }

  async upsertSchedule({ barberId, dayOfWeek, startTime, endTime }: UpsertScheduleInput): Promise<BarberSchedule> {
    const existing = database.barberSchedules.find(
      (item) => item.barberId === barberId && item.dayOfWeek === dayOfWeek
    ) as BarberSchedule | undefined;

    if (existing) {
      existing.startTime = startTime;
      existing.endTime = endTime;
      return existing;
    }

    const schedule: BarberSchedule = { id: randomUUID(), barberId, dayOfWeek, startTime, endTime };
    database.barberSchedules.push(schedule);
    return schedule;
  }

  async addBlock({ barberId, startAt, endAt, reason }: CreateBlockInput): Promise<BarberBlock> {
    const block: BarberBlock = { id: randomUUID(), barberId, startAt, endAt, reason: reason || '' };
    database.barberBlocks.push(block);
    return block;
  }

  async listBlocks(barberId: string): Promise<BarberBlock[]> {
    return database.barberBlocks.filter((item) => item.barberId === barberId) as BarberBlock[];
  }
}
