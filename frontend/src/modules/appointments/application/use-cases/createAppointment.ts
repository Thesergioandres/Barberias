import type { Appointment } from '../../domain/entities/Appointment';
import type { AppointmentsRepository, CreateAppointmentInput } from '../../domain/repositories/AppointmentsRepository';

export function createAppointment(
  appointmentsRepository: AppointmentsRepository,
  input: CreateAppointmentInput
): Promise<Appointment> {
  return appointmentsRepository.create(input);
}
