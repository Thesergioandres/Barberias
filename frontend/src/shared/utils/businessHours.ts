export type BusinessHour = {
  day: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
};

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

export const createDefaultBusinessHours = (): BusinessHour[] => (
  [
    { day: 0, openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 1, openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 2, openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 3, openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 4, openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 5, openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 6, openTime: '09:00', closeTime: '18:00', isOpen: true }
  ]
);

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map((value) => Number(value));
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
  return hours * 60 + minutes;
};

export const getBusinessStatus = (hours?: BusinessHour[] | null, now: Date = new Date()) => {
  if (!hours || hours.length === 0) {
    return { isOpen: true, nextOpenLabel: '' };
  }

  const todayIndex = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const byDay = new Map(hours.map((entry) => [entry.day, entry]));
  const today = byDay.get(todayIndex);

  if (today?.isOpen) {
    const openMinutes = toMinutes(today.openTime);
    const closeMinutes = toMinutes(today.closeTime);
    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      return { isOpen: true, nextOpenLabel: '' };
    }

    if (currentMinutes < openMinutes) {
      return { isOpen: false, nextOpenLabel: `${DAYS[todayIndex]} ${today.openTime}` };
    }
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const dayIndex = (todayIndex + offset) % 7;
    const entry = byDay.get(dayIndex);
    if (entry?.isOpen) {
      return { isOpen: false, nextOpenLabel: `${DAYS[dayIndex]} ${entry.openTime}` };
    }
  }

  return { isOpen: false, nextOpenLabel: 'proximamente' };
};
