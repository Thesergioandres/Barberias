import type { Appointment } from '../../domain/entities/Appointment';
import type { AppointmentsRepository } from '../../domain/repositories/AppointmentsRepository';

export function listClientAppointments(
  appointmentsRepository: AppointmentsRepository
): Promise<Appointment[]> {
  return appointmentsRepository.listMine();
}
