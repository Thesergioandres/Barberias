const appointments = [
  { id: '1', client: 'Mario Lopez', service: 'Fade premium', time: '17:30' },
  { id: '2', client: 'Lucia Reyes', service: 'Barba express', time: '18:00' },
  { id: '3', client: 'Ana Diaz', service: 'Color', time: '18:30' }
];

export function StaffDashboardPage() {
  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Proximas citas</h2>
        <p className="section-subtitle">Gestiona tus servicios con un toque.</p>
      </header>

      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="app-card flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted">{appointment.time}</p>
              <p className="text-lg font-semibold">{appointment.client}</p>
              <p className="text-sm text-muted">{appointment.service}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" type="button">Completado</button>
              <button className="btn-secondary" type="button">No asistio</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
