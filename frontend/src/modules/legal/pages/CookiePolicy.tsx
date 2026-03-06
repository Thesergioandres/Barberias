import { EssenceMicroSymbol } from '../../../shared/components/EssenceMicroSymbol';
import { Link } from 'react-router-dom';

export function CookiePolicy() {
  return (
    <section className="space-y-8">
      <header className="app-card">
        <p className="app-chip">Documento legal</p>
        <h1 className="mt-4 text-3xl font-semibold">Politica de Cookies</h1>
        <p className="mt-2 text-sm text-muted">Ultima actualizacion: 05/03/2026.</p>
      </header>

      <article className="app-card space-y-6 text-sm text-muted">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">1. Que son las cookies</h2>
          <p>
            Las cookies son archivos pequenos que permiten recordar preferencias y medir el rendimiento del servicio.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">2. Clasificacion</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Necesarias: sesiones de login, configuracion de idioma y seguridad.</li>
            <li>Analiticas: Google Analytics y mediciones de producto (opcionales).</li>
            <li>Marketing: pixel de conversion y tracking de campanas (solo con consentimiento).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">3. Gestion del consentimiento</h2>
          <p>
            Puedes aceptar o rechazar cookies analiticas desde el banner de consentimiento. Las cookies necesarias son
            obligatorias para el funcionamiento del servicio.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">4. Cambios</h2>
          <p>
            Podremos actualizar esta politica para reflejar nuevas tecnologias o requisitos legales.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">5. Documentos relacionados</h2>
          <div className="flex flex-wrap gap-3">
            <Link className="btn-secondary" to="/legal/privacy">Politica de Privacidad</Link>
            <Link className="btn-secondary" to="/legal/ptd">Politica de Tratamiento</Link>
          </div>
        </section>
      </article>

      <footer className="app-card-soft flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Cookies y tracking</p>
          <p className="text-xs text-muted">Control total sobre analitica y marketing.</p>
        </div>
        <EssenceMicroSymbol size={28} />
      </footer>
    </section>
  );
}
