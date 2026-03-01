import { FormEvent, useState } from 'react';
import { apiRequest } from '../../../../shared/infrastructure/http/apiClient';

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', whatsappConsent: false });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await apiRequest('/users/register', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', password: '', whatsappConsent: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar');
    }
  };

  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Registro de cliente</h2>
        <p className="section-subtitle">Crea tu cuenta para agendar citas y recibir recordatorios.</p>
      </header>

      {success ? <p className="app-card-soft text-emerald-200">Cuenta creada con exito.</p> : null}
      {error ? <p className="app-card-soft text-red-200">{error}</p> : null}

      <form className="app-card grid gap-4 md:max-w-2xl" onSubmit={handleSubmit}>
        <label className="text-xs text-zinc-400">
          Nombre
          <input
            className="input-field mt-2"
            placeholder="Nombre completo"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
        </label>
        <label className="text-xs text-zinc-400">
          Email
          <input
            className="input-field mt-2"
            placeholder="correo@barberia.com"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
        </label>
        <label className="text-xs text-zinc-400">
          Telefono
          <input
            className="input-field mt-2"
            placeholder="Telefono (+57...)"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            required
          />
        </label>
        <label className="text-xs text-zinc-400">
          Contrasena
          <input
            className="input-field mt-2"
            type="password"
            placeholder="Contrasena"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
        </label>
        <label className="flex items-center gap-2 text-xs text-zinc-300">
          <input
            type="checkbox"
            checked={form.whatsappConsent}
            onChange={(event) => setForm((prev) => ({ ...prev, whatsappConsent: event.target.checked }))}
          />
          Acepto notificaciones por WhatsApp
        </label>
        <button className="btn-primary w-fit" type="submit">
          Crear cuenta
        </button>
      </form>
    </section>
  );
}
