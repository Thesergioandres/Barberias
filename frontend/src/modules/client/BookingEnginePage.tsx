import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../../shared/context/TenantContext';
import { apiRequest } from '../../shared/infrastructure/http/apiClient';
import { useLabels } from '../../shared/hooks/useLabels';
import { getBusinessStatus } from '../../shared/utils/businessHours';

type StaffMember = {
  id: string;
  name: string;
  role: string;
};

type StaffSchedule = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

type StepOption = {
  label: string;
  value: string;
  staffId?: string;
  detail?: string;
};

type ServiceRecord = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  active: boolean;
};

const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

export function BookingEnginePage() {
  const { tenant } = useTenant();
  const labels = useLabels();
  const [stepIndex, setStepIndex] = useState(0);
  const [selection, setSelection] = useState<Record<string, string>>({});
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [schedules, setSchedules] = useState<StaffSchedule[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  const activeModules = tenant?.activeModules || [];
  const isBarbershop = (tenant?.verticalSlug || '').toLowerCase() === 'barberias';
  const hasStaff = activeModules.includes('staff');
  const hasAgenda = activeModules.includes('agenda');
  const hasStorefront = activeModules.includes('ecommerce_storefront');
  const showCrossNav = hasAgenda && hasStorefront;
  const { isOpen: isBusinessOpen, nextOpenLabel } = getBusinessStatus(tenant?.businessHours);

  const steps = useMemo(() => {
    const list = [labels.service];
    if (hasStaff) list.push(labels.staff);
    if (hasAgenda) list.push('Fecha y hora');
    return list;
  }, [hasAgenda, hasStaff, labels.service, labels.staff]);

  const currentStep = steps[stepIndex] || steps[0];

  useEffect(() => {
    if (!isBarbershop) return;
    setError(null);
    setLoadingStaff(true);
    apiRequest<StaffMember[]>('/users/public/staff')
      .then((data) => setStaff(data))
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar el staff'))
      .finally(() => setLoadingStaff(false));
  }, [isBarbershop]);

  useEffect(() => {
    if (!tenant?.id) return;
    setError(null);
    setLoadingServices(true);
    apiRequest<ServiceRecord[]>(`/services/public?tenantId=${tenant.id}`)
      .then((data) => setServices(data))
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudieron cargar los servicios'))
      .finally(() => setLoadingServices(false));
  }, [tenant?.id]);

  useEffect(() => {
    if (!selectedStaffId) return;
    if (!hasAgenda) return;
    setError(null);
    setLoadingSchedules(true);
    setSchedules([]);
    apiRequest<StaffSchedule[]>(`/staff/${selectedStaffId}/schedules`)
      .then((data) => setSchedules(data))
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar la agenda'))
      .finally(() => setLoadingSchedules(false));
  }, [selectedStaffId, hasAgenda]);

  const options = useMemo(() => {
    const next: Record<string, StepOption[]> = {
      [labels.service]: services.map((service) => ({
        label: service.name,
        value: service.name,
        detail: `$${service.price} · ${service.durationMinutes} min`
      }))
    };

    if (hasStaff) {
      next[labels.staff] = staff.map((member) => ({ label: member.name, value: member.name, staffId: member.id }));
    }

    if (hasAgenda) {
      next['Fecha y hora'] = schedules.map((schedule) => ({
        label: `${days[schedule.dayOfWeek] || 'Dia'} ${schedule.startTime} - ${schedule.endTime}`,
        value: `${schedule.dayOfWeek}-${schedule.startTime}-${schedule.endTime}`
      }));
    }

    return next;
  }, [hasAgenda, hasStaff, labels.service, labels.staff, schedules, services, staff]);

  const summary = useMemo(() => steps.map((step) => ({ step, value: selection[step] })), [selection, steps]);

  const advance = (option: StepOption) => {
    if (option.staffId) {
      setSelectedStaffId(option.staffId);
      setSchedules([]);
      setSelection((prev) => ({ ...prev, [currentStep]: option.value, ['Fecha y hora']: '' }));
    } else {
      setSelection((prev) => ({ ...prev, [currentStep]: option.value }));
    }
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] bg-app text-app-text p-6 rounded-3xl">
      <div className="app-card">
        <div className="flex flex-wrap items-center gap-3">
          {tenant?.logoUrl ? (
            <img
              alt={tenant.name || 'Logo'}
              className="h-12 w-12 rounded-2xl object-cover"
              src={tenant.logoUrl}
            />
          ) : null}
          <div>
            <p className="app-chip">{tenant?.name || 'Reserva express'}</p>
            <h2 className="mt-3 text-3xl font-semibold">Paso {stepIndex + 1}: {currentStep}</h2>
            <p className="mt-2 text-sm text-muted">Completa el flujo en menos de un minuto.</p>
          </div>
        </div>

        {showCrossNav ? (
          <div className="mt-4 flex items-center justify-center">
            <div className="flex rounded-full border border-outline bg-black/20 p-1">
              <Link
                className="rounded-full px-4 py-2 text-sm text-muted hover:text-ink"
                to="/storefront"
              >
                Tienda
              </Link>
              <span className="rounded-full px-4 py-2 text-sm font-semibold text-primary">Reservas</span>
            </div>
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm text-secondary">{error}</p> : null}

        {loadingServices && currentStep === labels.service ? (
          <p className="mt-6 text-sm text-muted">Cargando {labels.service.toLowerCase()}...</p>
        ) : null}

        {loadingStaff && currentStep === labels.staff ? (
          <p className="mt-6 text-sm text-muted">Cargando {labels.staff.toLowerCase()}...</p>
        ) : null}

        {loadingSchedules && currentStep === 'Fecha y hora' ? (
          <p className="mt-6 text-sm text-muted">Cargando agenda...</p>
        ) : null}

        {!loadingStaff && currentStep === labels.staff && (options[currentStep] || []).length === 0 ? (
          <p className="mt-6 text-sm text-muted">No hay {labels.staff.toLowerCase()} disponibles.</p>
        ) : null}

        {!loadingSchedules && currentStep === 'Fecha y hora' && (options[currentStep] || []).length === 0 ? (
          <p className="mt-6 text-sm text-muted">No hay horarios disponibles.</p>
        ) : null}

        {!loadingServices && currentStep === labels.service && (options[currentStep] || []).length === 0 ? (
          <p className="mt-6 text-sm text-muted">No hay {labels.service.toLowerCase()} disponibles.</p>
        ) : null}

        <div className="mt-6 grid gap-3">
          {(options[currentStep] || []).map((item) => (
            <button
              key={item.value}
              className="app-card-soft text-left text-sm font-semibold"
              type="button"
              onClick={() => advance(item)}
            >
              {item.label}
              {item.detail ? <span className="mt-1 block text-xs text-muted">{item.detail}</span> : null}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button className="btn-secondary" type="button" onClick={goBack} disabled={stepIndex === 0}>
            Volver
          </button>
          <button className="btn-primary" type="button" disabled={!selection[currentStep] || !isBusinessOpen}>
            Confirmar
          </button>
        </div>
        {!isBusinessOpen ? (
          <p className="mt-3 text-xs text-secondary">
            El establecimiento esta cerrado en este momento. Volvemos el {nextOpenLabel}.
          </p>
        ) : null}
      </div>

      <div className="app-card">
        <h3 className="text-lg font-semibold">Resumen</h3>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          {summary.map((item) => (
            <li key={item.step} className="flex items-center justify-between">
              <span>{item.step}</span>
              <span className="text-ink">
                {item.value || 'Pendiente'}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 app-card-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Tiempo estimado</p>
          <p className="mt-2 text-2xl font-semibold">15 min</p>
        </div>
      </div>
    </section>
  );
}
