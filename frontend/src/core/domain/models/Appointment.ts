export interface Appointment {
  id: string;
  barberId: string;
  clientId: string;
  serviceId: string;
  startAt: string;
  endAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  notes?: string | null;
}
