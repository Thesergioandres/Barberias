import { AdminNav } from '../presentation/components/AdminNav';

export function AdminSystemPage() {
  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Configuracion del sistema</h2>
        <p className="section-subtitle">Parametros globales y ajustes de plataforma.</p>
      </header>

      <AdminNav />

      <div className="app-card">
        <p className="text-sm text-muted">Modulo en construccion para configuraciones globales.</p>
      </div>
    </section>
  );
}
