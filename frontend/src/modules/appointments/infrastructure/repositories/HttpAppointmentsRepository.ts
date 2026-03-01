import type { Appointment } from '../../domain/entities/Appointment';
import type { AppointmentsRepository, CreateAppointmentInput } from '../../domain/repositories/AppointmentsRepository';
import { apiRequest } from '../../../../shared/infrastructure/http/apiClient';

export class HttpAppointmentsRepository implements AppointmentsRepository {
  async listMine(): Promise<Appointment[]> {
    return apiRequest<Appointment[]>('/appointments');
  }

  async create(input: CreateAppointmentInput): Promise<Appointment> {
    return apiRequest<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  }
}
