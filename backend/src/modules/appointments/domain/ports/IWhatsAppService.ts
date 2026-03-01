import { AppointmentId } from '../value-objects/AppointmentId';
import { BarberId } from '../value-objects/BarberId';
import { ServiceId } from '../value-objects/ServiceId';

export interface IWhatsAppService {
  sendAppointmentCreated(input: {
    appointmentId: AppointmentId;
    barberId: BarberId;
    serviceId: ServiceId;
    clientPhone: string;
    barberPhone: string;
    startAt: Date;
  }): Promise<void>;
}
