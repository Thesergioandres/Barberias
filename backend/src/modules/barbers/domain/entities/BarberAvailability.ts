export type BarberSchedule = {
  id: string;
  barberId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export type BarberBlock = {
  id: string;
  barberId: string;
  startAt: string;
  endAt: string;
  reason: string;
};
