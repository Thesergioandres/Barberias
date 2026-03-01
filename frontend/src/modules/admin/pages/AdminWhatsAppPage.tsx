export function AdminWhatsAppPage() {
  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Automatizacion WhatsApp</h2>
        <p className="section-subtitle">Activa reglas y plantillas por evento.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="app-card">
          <h3 className="text-lg font-semibold">Recordatorios</h3>
          <p className="mt-2 text-sm text-muted">Envio automatico 2h antes de la cita.</p>
          <button className="btn-secondary mt-4" type="button">Editar plantillas</button>
        </div>
        <div className="app-card">
          <h3 className="text-lg font-semibold">Recuperacion no show</h3>
          <p className="mt-2 text-sm text-muted">Flujos para reactivar clientes.</p>
          <button className="btn-primary mt-4" type="button">Activar flujo</button>
        </div>
      </div>
    </section>
  );
}
