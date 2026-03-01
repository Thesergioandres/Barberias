import type { BarberBlock, BarberSchedule } from '../../domain/entities/BarberAvailability';

export type UpsertScheduleInput = {
  barberId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export type CreateBlockInput = {
  barberId: string;
  startAt: string;
  endAt: string;
  reason?: string;
};

export interface BarberAvailabilityRepository {
  listSchedules(barberId: string): Promise<BarberSchedule[]>;
  upsertSchedule(input: UpsertScheduleInput): Promise<BarberSchedule>;
  addBlock(input: CreateBlockInput): Promise<BarberBlock>;
  listBlocks(barberId: string): Promise<BarberBlock[]>;
}
