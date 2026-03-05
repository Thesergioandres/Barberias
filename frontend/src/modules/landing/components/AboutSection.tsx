import { useEffect, useRef, useState } from 'react';

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: 0.35 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="quienes-somos"
      ref={sectionRef}
      className="relative overflow-hidden rounded-3xl border border-[rgba(138,43,226,0.25)] p-10"
      style={{
        background: 'linear-gradient(135deg, rgba(10,15,30,0.9) 0%, rgba(138,43,226,0.06) 100%)'
      }}
    >
      <div
        className={
          isActive
            ? 'pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[rgba(0,240,255,0.35)] blur-[90px] opacity-100 transition-opacity duration-700'
            : 'pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[rgba(0,240,255,0.15)] blur-[90px] opacity-0 transition-opacity duration-700'
        }
      />

      <div className="relative z-10">
        <p className="app-chip">Quienes somos</p>
        <h3 className="mt-5 text-3xl font-semibold md:text-4xl">
          La infraestructura detras de las marcas que dominan el mercado.
        </h3>
        <p className="mt-4 max-w-3xl text-sm text-muted">
          En Essence Software Factory, transformamos la complejidad tecnica en velocidad de ejecucion. No solo creamos software; construimos ecosistemas white-label que permiten a emprendedores y empresas lanzar verticales tecnologicas con marca propia, control total y escalabilidad infinita.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[rgba(0,240,255,0.35)] bg-[#0b1224]/80 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Proposito</p>
            <p className="mt-3 text-sm text-muted">Democratizar la tecnologia Enterprise.</p>
          </div>
          <div className="rounded-2xl border border-[rgba(138,43,226,0.35)] bg-[#0b1224]/80 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Velocidad</p>
            <p className="mt-3 text-sm text-muted">Despliegue de verticales en dias, no meses.</p>
          </div>
          <div className="rounded-2xl border border-[rgba(0,240,255,0.35)] bg-[#0b1224]/80 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Identidad</p>
            <p className="mt-3 text-sm text-muted">Branding dinamico que respeta la esencia de cada negocio.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
