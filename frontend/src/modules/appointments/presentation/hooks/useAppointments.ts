import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Appointment } from '../../domain/entities/Appointment';
import type { CreateAppointmentInput } from '../../domain/repositories/AppointmentsRepository';
import { createAppointment } from '../../application/use-cases/createAppointment';
import { listClientAppointments } from '../../application/use-cases/listClientAppointments';
import { HttpAppointmentsRepository } from '../../infrastructure/repositories/HttpAppointmentsRepository';

export function useAppointments(isAuthenticated: boolean) {
  const appointmentsRepository = useMemo(() => new HttpAppointmentsRepository(), []);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!isAuthenticated) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await listClientAppointments(appointmentsRepository);
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las citas');
    } finally {
      setLoading(false);
    }
  }, [appointmentsRepository, isAuthenticated]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addAppointment = useCallback(
    async (input: CreateAppointmentInput) => {
      setError(null);
      try {
        await createAppointment(appointmentsRepository, input);
        await reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo crear la cita');
      }
    },
    [appointmentsRepository, reload]
  );

  return { appointments, loading, error, addAppointment };
}
