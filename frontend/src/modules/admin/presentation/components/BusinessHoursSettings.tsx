import type { ChangeEvent } from 'react';
import type { BusinessHour } from '../../../../shared/utils/businessHours';

const DAYS = [
  { day: 0, label: 'Domingo' },
  { day: 1, label: 'Lunes' },
  { day: 2, label: 'Martes' },
  { day: 3, label: 'Miercoles' },
  { day: 4, label: 'Jueves' },
  { day: 5, label: 'Viernes' },
  { day: 6, label: 'Sabado' }
];

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map((value) => Number(value));
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
  return hours * 60 + minutes;
};

type BusinessHoursSettingsProps = {
  value: BusinessHour[];
  onChange: (next: BusinessHour[]) => void;
};

export function BusinessHoursSettings({ value, onChange }: BusinessHoursSettingsProps) {
  const handleToggle = (day: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const next = value.map((entry) =>
      entry.day === day ? { ...entry, isOpen: event.target.checked } : entry
    );
    onChange(next);
  };

  const handleTimeChange = (day: number, key: 'openTime' | 'closeTime') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = value.map((entry) =>
        entry.day === day ? { ...entry, [key]: event.target.value } : entry
      );
      onChange(next);
    };

  return (
    <div className="space-y-3">
      {DAYS.map((item) => {
        const entry = value.find((hour) => hour.day === item.day);
        const isOpen = entry?.isOpen ?? false;
        const openTime = entry?.openTime || '09:00';
        const closeTime = entry?.closeTime || '18:00';
        const invalid = isOpen && toMinutes(closeTime) <= toMinutes(openTime);

        return (
          <div key={item.day} className="rounded-2xl border border-[#00F0FF]/70 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-3 text-sm font-semibold text-ink">
                <input
                  type="checkbox"
                  checked={isOpen}
                  onChange={handleToggle(item.day)}
                />
                {item.label}
              </label>
              <div className="flex flex-wrap items-end gap-3">
                <label className={`text-xs ${isOpen ? 'text-ink' : 'text-muted'}`}>
                  Apertura
                  <input
                    className="input-field mt-2"
                    type="time"
                    value={openTime}
                    onChange={handleTimeChange(item.day, 'openTime')}
                    disabled={!isOpen}
                  />
                </label>
                <label className={`text-xs ${isOpen ? 'text-ink' : 'text-muted'}`}>
                  Cierre
                  <input
                    className="input-field mt-2"
                    type="time"
                    value={closeTime}
                    onChange={handleTimeChange(item.day, 'closeTime')}
                    disabled={!isOpen}
                  />
                </label>
              </div>
            </div>
            {invalid ? (
              <p className="mt-2 text-xs text-secondary">
                La hora de cierre no puede ser anterior a la de apertura.
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
