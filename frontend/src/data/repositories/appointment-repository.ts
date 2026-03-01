export interface AppointmentRepository {
  bookAppointment(input: {
    serviceId: string;
    barberId: string;
    clientId: string;
    startAt: string;
  }): Promise<void>;
}
