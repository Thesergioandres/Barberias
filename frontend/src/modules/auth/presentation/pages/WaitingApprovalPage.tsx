import { useAuth } from '../../../../shared/context/AuthContext';

export function WaitingApprovalPage() {
  const { user } = useAuth();

  return (
    <section className="space-y-4">
      <div className="app-card">
        <h2 className="section-title">Cuenta en revision</h2>
        <p className="section-subtitle">Tu acceso esta pendiente de aprobacion por el GOD.</p>
      </div>

      <div className="app-card-soft text-sm">
        <p>Cuenta: {user?.email}</p>
        <p>Estado: pendiente</p>
      </div>

      <p className="text-sm text-muted">
        Te notificaremos cuando tu cuenta sea aprobada. Cuando eso ocurra, cierra sesion e ingresa de nuevo.
      </p>
    </section>
  );
}
