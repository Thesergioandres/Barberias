export function AdminBranchesPage() {
  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Sedes y cobertura</h2>
        <p className="section-subtitle">Administra aperturas, buffers y aforo.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {['Centro', 'Norte', 'Sur'].map((branch) => (
          <div key={branch} className="app-card">
            <h3 className="text-lg font-semibold">{branch}</h3>
            <p className="mt-2 text-sm text-muted">Horario 09:00 - 20:00</p>
            <button className="btn-secondary mt-4" type="button">Editar reglas</button>
          </div>
        ))}
      </div>
    </section>
  );
}
