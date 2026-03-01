import { Appointment } from '../../domain/entities/Appointment';
import { OverlappingAppointmentError } from '../../domain/errors/AppointmentErrors';
import { IAppointmentRepository } from '../../domain/ports/IAppointmentRepository';
import { IWhatsAppService } from '../../domain/ports/IWhatsAppService';
import { AppointmentId } from '../../domain/value-objects/AppointmentId';
import { BarberId } from '../../domain/value-objects/BarberId';
import { ClientId } from '../../domain/value-objects/ClientId';
import { ServiceId } from '../../domain/value-objects/ServiceId';
import { TimeRange } from '../../domain/value-objects/TimeRange';

export interface BookAppointmentInput {
  tenantId: string;
  branchId: string;
  appointmentId: string;
  barberId: string;
  clientId: string;
  serviceId: string;
  startAt: Date;
  durationMinutes: number;
  notes?: string | null;
  notifyWhatsapp?: boolean;
  clientPhone?: string;
  barberPhone?: string;
}

export class BookAppointmentUseCase {
  constructor(
    private readonly repository: IAppointmentRepository,
    private readonly whatsappService: IWhatsAppService
  ) {}

  async execute(input: BookAppointmentInput) {
    if (input.durationMinutes <= 0) {
      throw new Error('Duration must be greater than zero');
    }

    const startAt = new Date(input.startAt);
    const endAt = addMinutes(startAt, input.durationMinutes);
    const timeRange = new TimeRange(startAt, endAt);

    const barberId = new BarberId(input.barberId);

    const isOverlapping = await this.repository.existsOverlapping(
      barberId,
      timeRange
    );

    if (isOverlapping) {
      throw new OverlappingAppointmentError(
        'Barber already has an appointment in the selected time range'
      );
    }

    const appointment = Appointment.schedule({
      id: new AppointmentId(input.appointmentId),
      tenantId: input.tenantId,
      branchId: input.branchId,
      barberId,
      clientId: new ClientId(input.clientId),
      serviceId: new ServiceId(input.serviceId),
      timeRange,
      notes: input.notes
    });

    await this.repository.save(appointment);

    if (input.notifyWhatsapp && input.clientPhone && input.barberPhone) {
      await this.whatsappService.sendAppointmentCreated({
        appointmentId: appointment.id,
        barberId,
        serviceId: new ServiceId(input.serviceId),
        clientPhone: input.clientPhone,
        barberPhone: input.barberPhone,
        startAt: appointment.getStartAt()
      });
    }

    return appointment;
  }
}

function addMinutes(startAt: Date, minutes: number) {
  return new Date(startAt.getTime() + minutes * 60000);
}
