import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

type DateRangePickerProps = {
  start?: string;
  end?: string;
  onChange: (range: { start?: string; end?: string }) => void;
};

export function DateRangePicker({ start, end, onChange }: DateRangePickerProps) {
  const selected: DateRange | undefined = start || end
    ? {
      from: start ? new Date(`${start}T00:00:00`) : undefined,
      to: end ? new Date(`${end}T00:00:00`) : undefined
    }
    : undefined;

  const handleSelect = (range?: DateRange) => {
    onChange({
      start: range?.from ? range.from.toISOString().split('T')[0] : undefined,
      end: range?.to ? range.to.toISOString().split('T')[0] : undefined
    });
  };

  return (
    <div className="app-card-soft">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">Rango personalizado</p>
          <p className="text-xs text-muted">Selecciona un inicio y un fin.</p>
        </div>
        <div className="text-xs text-muted">
          {start || '----/--/--'} - {end || '----/--/--'}
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <DayPicker
          mode="range"
          numberOfMonths={2}
          selected={selected}
          onSelect={handleSelect}
          showOutsideDays
        />
      </div>
    </div>
  );
}
