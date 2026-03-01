import { Appointment } from '../entities/Appointment';
import { BarberId } from '../value-objects/BarberId';
import { TimeRange } from '../value-objects/TimeRange';

export interface IAppointmentRepository {
  existsOverlapping(barberId: BarberId, timeRange: TimeRange): Promise<boolean>;
  save(appointment: Appointment): Promise<void>;
}
