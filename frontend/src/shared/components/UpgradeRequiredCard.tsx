import type { PlanTier } from './PlanGuard';

export function UpgradeRequiredCard({ requiredPlan, currentPlan }: { requiredPlan: PlanTier; currentPlan: PlanTier }) {
  return (
    <div className="app-card">
      <p className="app-chip">Upgrade required</p>
      <h3 className="mt-3 text-xl font-semibold">Desbloquea {requiredPlan}</h3>
      <p className="mt-2 text-sm text-muted">
        Tu plan actual es {currentPlan}. Este modulo necesita {requiredPlan} para activarse.
      </p>
      <button className="btn-primary mt-4" type="button">
        Ver planes
      </button>
    </div>
  );
}
