import { EssenceMicroSymbol } from '../../../shared/components/EssenceMicroSymbol';
import { Link } from 'react-router-dom';

export function PrivacyPolicy() {
  return (
    <section className="space-y-8">
      <header className="app-card">
        <p className="app-chip">Documento legal</p>
        <h1 className="mt-4 text-3xl font-semibold">Politica de Privacidad</h1>
        <p className="mt-2 text-sm text-muted">Ultima actualizacion: 05/03/2026.</p>
      </header>

      <article className="app-card space-y-6 text-sm text-muted">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">1. Alcance</h2>
          <p>
            Esta politica describe como ESSENCE SOFTWARE FACTORY trata datos personales y empresariales al operar la
            plataforma SaaS. Es complementaria a la Politica de Tratamiento de Datos (Ley 1581) y aplica a todos los
            usuarios que interactuan con la solucion.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">2. Datos que se procesan</h2>
          <p>
            Procesamos datos de contacto (nombre, correo, telefono), datos de agenda (historial de citas), actividad de
            usuarios y parametros de configuracion del tenant.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">3. Finalidades</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Autenticacion, control de acceso y seguridad.</li>
            <li>Gestion de citas, servicios, staff y operaciones del tenant.</li>
            <li>Soporte, facturacion y mejoras continuas del servicio.</li>
            <li>Analitica agregada para optimizacion del producto (si el usuario lo autoriza).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">4. Proveedores y tecnologias</h2>
          <p>
            Utilizamos infraestructura en la nube de Google Cloud para almacenamiento, backups y servicios de
            disponibilidad. Para analitica podemos usar Google Analytics y otras herramientas equivalentes solo si el
            usuario acepta cookies analiticas.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">5. Transferencias internacionales</h2>
          <p>
            Cuando un proveedor se encuentra fuera de Colombia, se garantizan clausulas contractuales y medidas de
            seguridad que cumplen con GDPR y estandares internacionales aplicables.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">6. Seguridad de la informacion</h2>
          <p>
            Implementamos cifrado en transito (TLS), hashing seguro de contrasenas (bcrypt), controles de acceso
            multinivel y monitoreo de actividad para proteger los datos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">7. Derechos del titular</h2>
          <p>
            Los titulares pueden ejercer derechos de acceso, rectificacion, cancelacion y oposicion (ARCO), asi como
            portabilidad cuando aplique. Para solicitudes, consulta el modulo de derechos ARCO en tu panel.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">8. Documentos relacionados</h2>
          <div className="flex flex-wrap gap-3">
            <Link className="btn-secondary" to="/legal/ptd">Politica de Tratamiento de Datos</Link>
            <Link className="btn-secondary" to="/legal/cookies">Politica de Cookies</Link>
          </div>
        </section>
      </article>

      <footer className="app-card-soft flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Privacidad y seguridad</p>
          <p className="text-xs text-muted">Compromiso legal y tecnologico con tu vertical.</p>
        </div>
        <EssenceMicroSymbol size={28} />
      </footer>
    </section>
  );
}
