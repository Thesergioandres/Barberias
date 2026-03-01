export function AboutPage() {
  return (
    <section className="app-card space-y-4">
      <header>
        <h2 className="section-title">Stack de produccion</h2>
        <p className="section-subtitle">Tecnologia lista para operar en equipos exigentes.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Frontend</p>
          <p className="mt-2 text-sm text-zinc-200">React 19 + Vite 6 + Tailwind 4 + Router 7 + Framer Motion</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Backend</p>
          <p className="mt-2 text-sm text-zinc-200">Node + Express + JWT + Mongo + Redis + BullMQ</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Infra</p>
          <p className="mt-2 text-sm text-zinc-200">Railway + GitHub Actions + Docker Compose + Nginx</p>
        </div>
      </div>
    </section>
  );
}
