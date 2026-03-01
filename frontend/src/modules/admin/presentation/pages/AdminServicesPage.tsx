import { FormEvent, useEffect, useState } from 'react';
import { apiRequest } from '../../../../shared/infrastructure/http/apiClient';
import { AdminNav } from '../components/AdminNav';

type Service = {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  active: boolean;
};

export function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', durationMinutes: 30, price: 10, active: true });

  const loadServices = async () => {
    try {
      const data = await apiRequest<Service[]>('/services');
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar servicios');
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await apiRequest<Service>('/services', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setForm({ name: '', description: '', durationMinutes: 30, price: 10, active: true });
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear servicio');
    }
  };

  const updateService = async (id: string, patch: Partial<Service>) => {
    setError(null);
    try {
      await apiRequest<Service>(`/services/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch)
      });
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar servicio');
    }
  };

  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Servicios</h2>
        <p className="section-subtitle">Gestiona la oferta de servicios y precios.</p>
      </header>

      <AdminNav />

      {error ? <p className="app-card-soft text-red-200">{error}</p> : null}

      <form className="app-card grid gap-4 md:grid-cols-2" onSubmit={handleCreate}>
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
        <label className="flex items-center gap-2 text-xs text-zinc-300">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
          />
          Activo
        </label>
        <div className="flex items-end">
          <button className="btn-primary" type="submit">
            Crear servicio
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{service.name}</p>
                <p className="text-xs text-zinc-400">{service.description || 'Sin descripcion'}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span>{service.durationMinutes} min</span>
                <span>$ {service.price}</span>
                <button
                  className="btn-ghost"
                  onClick={() => updateService(service.id, { active: !service.active })}
                >
                  {service.active ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
