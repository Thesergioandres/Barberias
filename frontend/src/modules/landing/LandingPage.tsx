import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../shared/animations/gsapConfig';
import { VERTICALS_REGISTRY } from '../../shared/constants/verticalsRegistry';
import { AboutSection } from './components/AboutSection';
import { setGoogleTranslateLanguage } from '../../shared/utils/googleTranslate';
import { EssenceMiniLoader } from '../../shared/components/EssenceMiniLoader';

function setSeo(title: string, description: string) {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', description);
}

export function LandingPage() {
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [activeLang, setActiveLang] = useState<'es' | 'en' | 'pt' | 'fr' | 'it' | 'de' | 'zh-CN'>('es');
  const modulesRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setSeo(
      'Essence Factory | Plataforma SaaS White-Label',
      'Construimos el motor de tu negocio. Infraestructura SaaS white-label para verticales con marca propia, control total y expansion rapida.'
    );
  }, []);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.factory-module-card');
      cards.forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: 'power2.out',
          force3D: true,
          clearProps: 'all',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            once: true
          }
        });
      });
    },
    { scope: modulesRef }
  );

  const readySlugs = new Set(['barberias']);

  const moduleLabelMap: Record<string, string> = {
    agenda: 'Agenda',
    pos: 'POS',
    inventory: 'Inventario',
    staff: 'Staff',
    services: 'Servicios',
    subscriptions: 'Suscripciones',
    accounting: 'Finanzas',
    tables: 'Mesas',
    digital_menu: 'Menu',
    kitchen_display: 'Cocina',
    access_control: 'Acceso',
    progress_tracking: 'Progreso',
    assets_management: 'Activos',
    tasks: 'Tareas',
    projects: 'Proyectos',
    contracts: 'Contratos',
    commissions: 'Comisiones'
  };

  const formatModules = (modules: string[]) => {
    const labels = modules.map((module) => moduleLabelMap[module] || module).filter(Boolean);
    return labels.slice(0, 2).join(' + ');
  };

  const featuredVerticals = useMemo(() => VERTICALS_REGISTRY.slice(0, 8), []);

  return (
    <section className="space-y-16 pt-10 md:pt-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="app-card p-8 md:p-10">
          <p className="app-chip font-sans tracking-[0.35em]">The factory hub</p>
          <h2 className="mt-6 text-5xl font-semibold leading-tight md:text-6xl">
            Lanza tu white-label en dias
          </h2>
          <p className="mt-5 text-sm text-muted">
            Marca, permisos y rutas por tenant en tiempo real.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/barberias-landing">
              Explorar vertical barberias
            </Link>
            <Link className="btn-secondary" to="#quienes-somos">
              Quienes somos
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-[rgba(138,43,226,0.35)] bg-[#0b1224]/70 p-6 shadow-[0_24px_60px_rgba(3,6,18,0.6)] backdrop-blur-[24px]">
            <h3 className="text-lg font-semibold">Arquitectura white-label</h3>
            <p className="mt-2 text-sm text-muted">
              Rutas, permisos y branding por tenant con micro-frontends logicos para escalar sin fricciones.
            </p>
          </div>
          <div className="rounded-3xl border border-[rgba(138,43,226,0.35)] bg-[#0b1224]/70 p-6 shadow-[0_24px_60px_rgba(3,6,18,0.6)] backdrop-blur-[24px]">
            <h3 className="text-lg font-semibold">Operacion en tiempo real</h3>
            <p className="mt-2 text-sm text-muted">
              Reportes, automatizaciones y sincronizacion viva para equipos que no pueden parar.
            </p>
          </div>
        </div>
      </div>

      <AboutSection />

      <div ref={modulesRef} className="app-card py-24">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold">Verticales listas para escalar</h3>
            <p className="mt-2 text-sm text-muted">
              Modulos listos para operar en multiples industrias con marca propia.
            </p>
          </div>
          <Link className="btn-secondary" to="/barberias-landing">Ver detalle barberias</Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredVerticals.map((vertical) => {
            const isReady = readySlugs.has(vertical.slug);
            return (
              <Link
                key={vertical.slug}
                to={`/landing/${vertical.slug}`}
                className="factory-module-card group relative min-h-[190px] rounded-[24px] border border-[rgba(138,43,226,0.35)] bg-[#0b1224] p-6 transition hover:border-[rgba(0,240,255,0.8)]"
              >
                {isReady ? (
                  <span className="inline-flex items-center rounded-full border border-[rgba(0,240,255,0.5)] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-primary">
                    Listo para operar
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-[rgba(138,43,226,0.3)] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-muted">
                    Bajo demanda
                  </span>
                )}
                <h4 className="mt-4 text-lg font-semibold text-ink">{vertical.name}</h4>
                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted">
                  {formatModules(vertical.activeModules)}
                </p>
                <p className="mt-4 text-sm text-muted">Explora la fabrica con rutas y permisos listos.</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className={`btn-secondary relative ${isCatalogLoading ? 'pointer-events-none' : ''}`}
            onClick={() => {
              if (isCatalogLoading) return;
              setIsCatalogLoading(true);
              window.setTimeout(() => navigate('/industries'), 160);
            }}
          >
            <span className={isCatalogLoading ? 'opacity-0' : 'opacity-100'}>
              Explorar catalogo completo de industrias
            </span>
            {isCatalogLoading ? (
              <span className="absolute inset-0 flex items-center justify-center">
                <EssenceMiniLoader />
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <footer className="app-card-soft flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Idioma</p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={`btn-ghost ${activeLang === 'es' ? 'text-primary' : ''}`}
            type="button"
            onClick={() => {
              setGoogleTranslateLanguage('es');
              setActiveLang('es');
            }}
          >
            Espanol
          </button>
          <button
            className={`btn-ghost ${activeLang === 'en' ? 'text-primary' : ''}`}
            type="button"
            onClick={() => {
              setGoogleTranslateLanguage('en');
              setActiveLang('en');
            }}
          >
            Ingles
          </button>
          <button
            className={`btn-ghost ${activeLang === 'pt' ? 'text-primary' : ''}`}
            type="button"
            onClick={() => {
              setGoogleTranslateLanguage('pt');
              setActiveLang('pt');
            }}
          >
            Portugues
          </button>
          <button
            className={`btn-ghost ${activeLang === 'fr' ? 'text-primary' : ''}`}
            type="button"
            onClick={() => {
              setGoogleTranslateLanguage('fr');
              setActiveLang('fr');
            }}
          >
            Frances
          </button>
          <button
            className={`btn-ghost ${activeLang === 'it' ? 'text-primary' : ''}`}
            type="button"
            onClick={() => {
              setGoogleTranslateLanguage('it');
              setActiveLang('it');
            }}
          >
            Italiano
          </button>
          <button
            className={`btn-ghost ${activeLang === 'de' ? 'text-primary' : ''}`}
            type="button"
            onClick={() => {
              setGoogleTranslateLanguage('de');
              setActiveLang('de');
            }}
          >
            Aleman
          </button>
          <button
            className={`btn-ghost ${activeLang === 'zh-CN' ? 'text-primary' : ''}`}
            type="button"
            onClick={() => {
              setGoogleTranslateLanguage('zh-CN');
              setActiveLang('zh-CN');
            }}
          >
            Chino
          </button>
        </div>
      </footer>
    </section>
  );
}
