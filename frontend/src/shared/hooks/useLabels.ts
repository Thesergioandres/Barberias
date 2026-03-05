import { useMemo } from 'react';
import { useTenant } from '../context/TenantContext';
import { VERTICALS_REGISTRY } from '../constants/verticalsRegistry';

const defaultLabels = {
  staff: 'Equipo',
  staffPlural: 'Equipo',
  service: 'Servicio',
  appointment: 'Cita'
};

export function useLabels() {
  const { tenant } = useTenant();
  const verticalSlug = (tenant?.verticalSlug || '').toLowerCase();

  return useMemo(() => {
    const match = VERTICALS_REGISTRY.find((item) => item.slug === verticalSlug);
    const labels = match?.labels || defaultLabels;
    const staffPlural = labels.staffPlural || (labels.staff ? `${labels.staff}s` : defaultLabels.staffPlural);

    return {
      ...labels,
      staff: labels.staff || defaultLabels.staff,
      service: labels.service || defaultLabels.service,
      staffPlural,
      appointment: labels.appointment || defaultLabels.appointment
    };
  }, [verticalSlug]);
}
