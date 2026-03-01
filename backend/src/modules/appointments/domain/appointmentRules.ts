import { AppointmentState } from './appointmentStates';

function parseTimeToMinutes(value: string) {
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}

export function isWithinQuietHours(date: Date, startHHmm: string, endHHmm: string) {
  const totalMinutes = date.getHours() * 60 + date.getMinutes();
  const start = parseTimeToMinutes(startHHmm);
  const end = parseTimeToMinutes(endHHmm);

  if (start < end) {
    return totalMinutes >= start && totalMinutes < end;
  }

  return totalMinutes >= start || totalMinutes < end;
}

export function hasOverlap(startA: Date, endA: Date, startB: Date, endB: Date) {
  return startA < endB && endA > startB;
}

export function canTransition(current: string, next: string) {
  const allowedTransitions: Record<string, string[]> = {
    [AppointmentState.PENDIENTE]: [AppointmentState.CONFIRMADA, AppointmentState.CANCELADA],
    [AppointmentState.CONFIRMADA]: [AppointmentState.CANCELADA, AppointmentState.COMPLETADA, AppointmentState.NO_ASISTIO],
    [AppointmentState.CANCELADA]: [],
    [AppointmentState.COMPLETADA]: [],
    [AppointmentState.NO_ASISTIO]: []
  };

  return (allowedTransitions[current] || []).includes(next);
}
