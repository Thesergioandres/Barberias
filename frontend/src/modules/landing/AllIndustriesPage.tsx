import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../shared/animations/gsapConfig';
import { VERTICALS_REGISTRY } from '../../shared/constants/verticalsRegistry';
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

export function AllIndustriesPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [isFiltering, setIsFiltering] = useState(false);
  const modulesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSeo(
      'Essence Factory | Catalogo completo de industrias',
      'Explora todas las industrias disponibles y encuentra el vertical ideal para tu marca.'
    );
  }, []);

  useEffect(() => {
    if (!isFiltering) return undefined;
    const timeout = window.setTimeout(() => setIsFiltering(false), 500);
    return () => window.clearTimeout(timeout);
  }, [isFiltering]);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.factory-module-card');
      cards.forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 24,
          duration: 0.01,
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

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.factory-module-card');
      if (cards.length === 0) return;
      const tl = gsap.timeline();
      tl.to(cards, {
        opacity: 0,
        scale: 0.95,
        duration: 0.01,
        stagger: 0.001,
        ease: 'power1.in'
      }).fromTo(
        cards,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.09,
          stagger: 0.015,
          ease: 'power2.out',
          force3D: true
        }
      );
    },
    { scope: modulesRef, dependencies: [activeCategory] }
  );

  const filterOptions = ['Todos', 'Belleza', 'Salud', 'Retail', 'Logistica', 'Profesionales'];
  const readySlugs = new Set(['barberias']);

  const categoryForSlug = (slug: string) => {
    const keywordMap: Record<string, string[]> = {
      Belleza: ['barberias', 'salones', 'estetica', 'spas', 'depilacion', 'belleza'],
      Salud: ['clinicas', 'odontologia', 'psicologia', 'veterinarias', 'farmacias', 'opticas', 'salud'],
      Retail: ['tiendas', 'inventarios', 'ferreterias', 'papelerias', 'regalos', 'floristerias', 'conveniencia'],
      Logistica: ['logistica', 'transporte', 'envios', 'almacen', 'bodega', 'mensajeria', 'delivery', 'courier'],
      Profesionales: ['abogados', 'contables', 'consultoria', 'consultorias', 'agencias', 'estudios', 'despachos']
    };

    const match = Object.entries(keywordMap).find(([, keywords]) => keywords.some((keyword) => slug.includes(keyword)));
    return match ? match[0] : 'Profesionales';
  };

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

  const filteredVerticals = useMemo(() => {
    if (activeCategory === 'Todos') {
      return VERTICALS_REGISTRY;
    }
    return VERTICALS_REGISTRY.filter((vertical) => categoryForSlug(vertical.slug) === activeCategory);
  }, [activeCategory]);

  return (
    <main ref={modulesRef} className="industries-container min-h-screen flex flex-col space-y-10 pt-10 md:pt-16">
      <header className="app-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="app-chip">Catalogo completo</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Explora todas las industrias</h2>
          <p className="mt-3 text-sm text-muted">Selecciona una categoria para ver cada vertical disponible.</p>
        </div>
        <div className="flex items-center gap-2">
          {isFiltering ? <EssenceMiniLoader /> : null}
          <Link className="btn-secondary" to="/">
            Volver al inicio
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap gap-3">
        {filterOptions.map((filter) => {
          const isActive = filter === activeCategory;
          return (
            <button
              key={filter}
              className={
                isActive
                  ? 'rounded-full border border-[rgba(0,240,255,0.6)] bg-[rgba(0,240,255,0.12)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-primary'
                  : 'rounded-full border border-[rgba(138,43,226,0.35)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted transition hover:border-[rgba(0,240,255,0.6)] hover:text-primary'
              }
              type="button"
              onClick={() => {
                setIsFiltering(true);
                setActiveCategory(filter);
              }}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredVerticals.map((vertical) => {
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
    </main>
  );
}
