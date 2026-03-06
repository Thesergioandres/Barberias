import { EssenceMicroSymbol } from '../../../shared/components/EssenceMicroSymbol';
import { Link } from 'react-router-dom';

export function DataTreatmentPolicy() {
  return (
    <section className="space-y-8">
      <header className="app-card">
        <p className="app-chip">Politica obligatoria SIC</p>
        <h1 className="mt-4 text-3xl font-semibold">Politica de Tratamiento de Datos Personales (PTD)</h1>
        <p className="mt-2 text-sm text-muted">
          Ultima actualizacion: 05/03/2026. Documento en cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013.
        </p>
      </header>

      <article className="app-card space-y-6 text-sm text-muted">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">1. Identificacion del encargado</h2>
          <p>
            ESSENCE SOFTWARE FACTORY, proveedor de infraestructura SaaS, actua como Encargado del tratamiento cuando el
            tenant es Responsable. Contacto: legal@essencefactory.com.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">2. Datos personales tratados</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Datos de identificacion: nombre completo, documento (si aplica).</li>
            <li>Datos de contacto: telefono, correo electronico.</li>
            <li>Datos de operacion: historial de citas, servicios y preferencias.</li>
            <li>Datos de autenticacion: credenciales cifradas y tokens de acceso.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">3. Finalidades del tratamiento</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Gestionar reservas, staff, clientes y operaciones del negocio.</li>
            <li>Enviar notificaciones operativas (recordatorios y cambios de cita).</li>
            <li>Soporte tecnico, facturacion y auditoria de la plataforma.</li>
            <li>Analitica agregada para mejorar el servicio, con consentimiento cuando aplique.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">4. Derechos de los titulares</h2>
          <p>
            El titular puede ejercer derechos de acceso, rectificacion, actualizacion, cancelacion y oposicion (ARCO).
            Las solicitudes se gestionan mediante el panel del tenant o al correo legal@essencefactory.com.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">5. Autorizacion y prueba</h2>
          <p>
            La autorizacion se obtiene en el registro del tenant mediante checkbox obligatorio. Se conserva fecha y
            version del documento aceptado como prueba de consentimiento.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">6. Transferencias y encargados</h2>
          <p>
            Podremos transferir o transmitir datos a proveedores (Google Cloud, analitica, mensajeria) bajo contratos
            de confidencialidad y medidas de seguridad equivalentes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">7. Seguridad y conservacion</h2>
          <p>
            Aplicamos cifrado, control de accesos, backups y monitoreo continuo. Los datos se conservan mientras exista
            relacion contractual y por el tiempo legalmente requerido.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">8. Vigencia y cambios</h2>
          <p>
            Esta politica puede actualizarse. Notificaremos cambios relevantes y solicitaremos nueva autorizacion cuando
            aplique. Version vigente: 2026-03-05.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">9. Documentos relacionados</h2>
          <div className="flex flex-wrap gap-3">
            <Link className="btn-secondary" to="/legal/privacy">Politica de Privacidad</Link>
            <Link className="btn-secondary" to="/legal/dpa">Acuerdo de Procesamiento (DPA)</Link>
          </div>
        </section>
      </article>

      <footer className="app-card-soft flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Proteccion de datos</p>
          <p className="text-xs text-muted">Cumplimiento Ley 1581 y GDPR.</p>
        </div>
        <EssenceMicroSymbol size={28} />
      </footer>
    </section>
  );
}
