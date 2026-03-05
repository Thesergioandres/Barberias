import { FormEvent, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../../../shared/infrastructure/http/apiClient';
import { AdminNav } from '../components/AdminNav';
import { useTenant } from '../../../../shared/context/TenantContext';

type Service = {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  active: boolean;
};

export function AdminServicesPage() {
  const { tenant } = useTenant();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const emptyForm = useMemo(
    () => ({ name: '', description: '', durationMinutes: 30, price: 20000, active: true }),
    []
  );
  const [form, setForm] = useState(emptyForm);

  const servicesQuery = useQuery({
    queryKey: ['services', tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return [] as Service[];
      return apiRequest<Service[]>(`/services?tenantId=${tenant.id}`);
    },
    enabled: Boolean(tenant?.id)
  });

  const openCreate = () => {
    setEditingService(null);
    setForm(emptyForm);
    setActionError(null);
    setIsModalOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setForm({
      name: service.name,
      description: service.description || '',
      durationMinutes: service.durationMinutes,
      price: service.price,
      active: service.active
    });
    setActionError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setActionError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setActionError(null);
    try {
      if (editingService) {
        await apiRequest<Service>(`/services/${editingService.id}`, {
          method: 'PATCH',
          body: JSON.stringify(form)
        });
      } else {
        await apiRequest<Service>('/services', {
          method: 'POST',
          body: JSON.stringify(form)
        });
      }

      await queryClient.invalidateQueries({ queryKey: ['services', tenant?.id] });
      closeModal();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'No se pudo guardar el servicio');
    }
  };

  const toggleService = async (service: Service) => {
    setError(null);
    try {
      await apiRequest<Service>(`/services/${service.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !service.active })
      });
      await queryClient.invalidateQueries({ queryKey: ['services', tenant?.id] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar servicio');
    }
  };

  return (
    <section className="space-y-6">
      <header className="app-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="section-title">Servicios</h2>
            <p className="section-subtitle">Gestiona la oferta de servicios y precios.</p>
          </div>
          <button className="btn-primary" type="button" onClick={openCreate}>
            Nuevo servicio
          </button>
        </div>
      </header>

      <AdminNav />

      {error ? <p className="app-card-soft text-red-200">{error}</p> : null}

      {servicesQuery.isLoading ? (
        <p className="text-sm text-muted">Cargando servicios...</p>
      ) : servicesQuery.isError ? (
        <p className="text-sm text-secondary">No se pudieron cargar servicios.</p>
      ) : null}

      <div className="space-y-3">
        {(servicesQuery.data || []).map((service) => (
          <div key={service.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{service.name}</p>
                <p className="text-xs text-zinc-400">{service.description || 'Sin descripcion'}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span>{service.durationMinutes} min</span>
                <span>$ {service.price}</span>
                <button className="btn-ghost" type="button" onClick={() => openEdit(service)}>
                  Editar
                </button>
                <button className="btn-ghost" type="button" onClick={() => toggleService(service)}>
                  {service.active ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen ? (
        <div className="overlay-surface fixed inset-0 z-50 flex items-center justify-center backdrop-blur">
          <form className="app-card w-full max-w-lg space-y-4" onSubmit={handleSubmit}>
            <div>
              <h3 className="text-lg font-semibold">
                {editingService ? 'Editar servicio' : 'Nuevo servicio'}
              </h3>
              <p className="text-sm text-muted">Define el nombre, precio y duracion.</p>
            </div>

            {actionError ? <p className="text-sm text-secondary">{actionError}</p> : null}

            <label className="text-xs text-zinc-400">
              Nombre
              <input
                className="input-field mt-2"
                placeholder="Nombre"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
            </label>
            <label className="text-xs text-zinc-400">
              Descripcion
              <input
                className="input-field mt-2"
                placeholder="Descripcion"
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-xs text-zinc-400">
                Duracion (min)
                <input
                  className="input-field mt-2"
                  type="number"
                  min={5}
                  placeholder="Duracion (min)"
                  value={form.durationMinutes}
                  onChange={(event) => setForm((prev) => ({ ...prev, durationMinutes: Number(event.target.value) }))}
                  required
                />
              </label>
              <label className="text-xs text-zinc-400">
                Precio
                <input
                  className="input-field mt-2"
                  type="number"
                  min={0}
                  placeholder="Precio"
                  value={form.price}
                  onChange={(event) => setForm((prev) => ({ ...prev, price: Number(event.target.value) }))}
                  required
                />
              </label>
            </div>
            <label className="flex items-center gap-2 text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
              />
              Activo
            </label>

            <div className="flex flex-wrap justify-end gap-3">
              <button className="btn-ghost" type="button" onClick={closeModal}>
                Cancelar
              </button>
              <button className="btn-primary" type="submit">
                {editingService ? 'Guardar cambios' : 'Crear servicio'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
