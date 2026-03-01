export const AppointmentState = {
  PENDIENTE: 'PENDIENTE',
  CONFIRMADA: 'CONFIRMADA',
  CANCELADA: 'CANCELADA',
  COMPLETADA: 'COMPLETADA',
  NO_ASISTIO: 'NO_ASISTIO'
} as const;

export type AppointmentState = (typeof AppointmentState)[keyof typeof AppointmentState];
