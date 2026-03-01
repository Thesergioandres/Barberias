import type { AppointmentsRepository } from '../ports/AppointmentsRepository';
import type { AppointmentHistoryRepository } from '../ports/AppointmentHistoryRepository';
import type { AppointmentRecord } from '../../domain/entities/AppointmentRecord';

type ScheduleRecord = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

type BlockRecord = {
  startAt: string;
  endAt: string;
};

type AvailabilityRepository = {
  listSchedules(barberId: string): Promise<ScheduleRecord[]>;
  listBlocks(barberId: string): Promise<BlockRecord[]>;
};

type UsersRepository = {
  list(tenantId: string, role?: string): Promise<Array<{ id: string; role: string; phone?: string; whatsappConsent?: boolean }>>;
};

type NotificationsService = {
  emitEvent(input: { event: string; appointment: AppointmentRecord & { tenantId: string }; recipients: Array<{ id: string; role: string; phone?: string; whatsappConsent?: boolean }> }): Promise<void>;
};

type TenantsRepository = {
  findById(id: string): Promise<{ id: string; config: { bufferTimeMinutes: number } } | null>;
};

type ServicesRepository = {
  findById(id: string, tenantId: string): Promise<{ durationMinutes: number } | null>;
};

export class ReassignAppointmentUseCase {
  constructor(
    private readonly deps: {
      appointmentsRepository: AppointmentsRepository;
      availabilityRepository: AvailabilityRepository;
      servicesRepository: ServicesRepository;
      usersRepository: UsersRepository;
      notificationsService: NotificationsService;
      historyRepository: AppointmentHistoryRepository;
      tenantsRepository: TenantsRepository;
    }
  ) {}

  async execute({ tenantId, appointmentId, newBarberId, actorRole, actorUserId }: {
    tenantId: string;
    appointmentId?: string;
    newBarberId?: string;
    actorRole?: string;
    actorUserId?: string;
  }): Promise<{ appointment: AppointmentRecord } | { error: string; statusCode: number }> {
    if (!tenantId || !appointmentId || !newBarberId) {
      return { error: 'tenantId, appointmentId y newBarberId son requeridos', statusCode: 400 };
    }

    const appointment = await this.deps.appointmentsRepository.findById(appointmentId, tenantId);
    if (!appointment) {
      return { error: 'Cita no encontrada', statusCode: 404 };
    }

    const service = await this.deps.servicesRepository.findById(appointment.serviceId, tenantId);
    if (!service) {
      return { error: 'Servicio no encontrado', statusCode: 404 };
    }

    const tenant = await this.deps.tenantsRepository.findById(tenantId);
    if (!tenant) {
      return { error: 'Tenant inválido', statusCode: 404 };
    }

    const startDate = new Date(appointment.startAt);
    const bufferTimeMinutes = tenant.config.bufferTimeMinutes || 0;
    const endDate = new Date(startDate.getTime() + (service.durationMinutes + bufferTimeMinutes) * 60 * 1000);

    const schedules = await this.deps.availabilityRepository.listSchedules(newBarberId);
    if (schedules.length > 0) {
      const day = startDate.getDay();
      const schedule = schedules.find((item) => item.dayOfWeek === day);
      if (!schedule) {
        return { error: 'Barbero no disponible para ese día', statusCode: 400 };
      }

      const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
      const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();
      const [sh, sm] = schedule.startTime.split(':').map(Number);
      const [eh, em] = schedule.endTime.split(':').map(Number);
      const scheduleStart = sh * 60 + sm;
      const scheduleEnd = eh * 60 + em;

      if (startMinutes < scheduleStart || endMinutes > scheduleEnd) {
        return { error: 'Cita fuera del horario del barbero', statusCode: 400 };
      }
    }

    const blocks = await this.deps.availabilityRepository.listBlocks(newBarberId);
    const hasBlockConflict = blocks.some((block) => {
      const blockStart = new Date(block.startAt);
      const blockEnd = new Date(block.endAt);
      return startDate < blockEnd && endDate > blockStart;
    });

    if (hasBlockConflict) {
      return { error: 'Horario bloqueado por el barbero', statusCode: 409 };
    }

    const overlaps = await this.deps.appointmentsRepository.findByBarberInRange(tenantId, newBarberId, startDate, endDate, appointment.id);
    if (overlaps.length > 0) {
      return { error: 'El barbero ya tiene cita en ese rango', statusCode: 409 };
    }

    const previousBarberId = appointment.barberId;
    appointment.barberId = newBarberId;
    await this.deps.appointmentsRepository.update(appointment.id, { barberId: newBarberId });

    await this.deps.historyRepository.create({
      appointmentId: appointment.id,
      actorRole: actorRole || 'ADMIN',
      actorUserId: actorUserId || 'SYSTEM',
      action: 'REASSIGNED',
      prevBarberId: previousBarberId,
      nextBarberId: newBarberId
    });

    const users = await this.deps.usersRepository.list(tenantId);
    const client = users.find((item) => item.id === appointment.clientId);
    const newBarber = users.find((item) => item.id === newBarberId);

    await this.deps.notificationsService.emitEvent({
      event: 'APPOINTMENT_REASSIGNED',
      appointment,
      recipients: [client, newBarber].filter(Boolean) as Array<{ id: string; role: string; phone?: string; whatsappConsent?: boolean }>
    });

    return { appointment };
  }
}
