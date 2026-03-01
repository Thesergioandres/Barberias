export function AdminTeamPage() {
  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Equipo y barberos</h2>
        <p className="section-subtitle">Gestiona roles, horarios y cobertura.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="app-card">
          <h3 className="text-lg font-semibold">Barberos activos</h3>
          <p className="mt-2 text-sm text-muted">7 barberos disponibles hoy.</p>
          <button className="btn-primary mt-4" type="button">Invitar barbero</button>
        </div>
        <div className="app-card">
          <h3 className="text-lg font-semibold">Cobertura por sede</h3>
          <p className="mt-2 text-sm text-muted">Rotacion inteligente segun demanda.</p>
          <button className="btn-secondary mt-4" type="button">Configurar turnos</button>
        </div>
      </div>
    </section>
  );
}
