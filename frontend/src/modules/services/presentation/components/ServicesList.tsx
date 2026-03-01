import type { Service } from '../../domain/entities/Service';

type Props = {
  services: Service[];
};

export function ServicesList({ services }: Props) {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {services.map((service) => (
        <li key={service.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">{service.name}</p>
            <span className="status-pill">{service.durationMinutes} min</span>
          </div>
          <p className="mt-6 text-2xl font-semibold text-amber-200">$ {service.price}</p>
          <p className="text-xs text-zinc-400">Incluye lavado y acabado premium.</p>
        </li>
      ))}
    </ul>
  );
}
