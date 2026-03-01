import type { ReactNode } from 'react';
import { useTenant } from '../context/TenantContext';
import { UpgradeRequiredCard } from './UpgradeRequiredCard';

export type PlanTier = 'BASIC' | 'PRO' | 'GOD';

type PlanGuardProps = {
  requiredPlan: PlanTier;
  children: ReactNode;
  fallback?: ReactNode;
};

const PLAN_RANK: Record<PlanTier, number> = {
  BASIC: 0,
  PRO: 1,
  GOD: 2
};

function normalizePlan(value?: string | null): PlanTier {
  const normalized = (value || '').toUpperCase();
  if (normalized.includes('GOD')) return 'GOD';
  if (normalized.includes('PRO')) return 'PRO';
  return 'BASIC';
}

export function PlanGuard({ requiredPlan, children, fallback }: PlanGuardProps) {
  const { tenant } = useTenant();
  const currentPlan = normalizePlan(tenant?.planName || tenant?.planId);
  const allowed = PLAN_RANK[currentPlan] >= PLAN_RANK[requiredPlan];

  if (allowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return <UpgradeRequiredCard requiredPlan={requiredPlan} currentPlan={currentPlan} />;
}
