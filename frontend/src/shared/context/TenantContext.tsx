import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../infrastructure/http/apiClient';
import { useAuth } from './AuthContext';

export type TenantRecord = {
  id: string;
  name: string;
  slug: string;
};

type TenantContextValue = {
  tenant: TenantRecord | null;
  loading: boolean;
  setTenant: (tenant: TenantRecord | null) => void;
  loadTenantBySlug: (slug: string) => Promise<void>;
};

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tenant, setTenantState] = useState<TenantRecord | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-resolve tenant for ADMIN or BARBER roles based on their tied tenantId
  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'BARBER') && user.tenantId && !tenant) {
      setLoading(true);
      apiRequest<{ id: string; name: string; slug: string }>(`/tenants/${user.tenantId}`)
        .then(setTenantState)
        .catch(() => setTenantState(null))
        .finally(() => setLoading(false));
    }
  }, [user, tenant]);

  const setTenant = useCallback((t: TenantRecord | null) => {
    setTenantState(t);
  }, []);

  const loadTenantBySlug = useCallback(async (slug: string) => {
    try {
      setLoading(true);
      const data = await apiRequest<TenantRecord>(`/tenants/slug/${slug}`);
      setTenantState(data);
    } catch (_err) {
      setTenantState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(() => ({ tenant, loading, setTenant, loadTenantBySlug }), [tenant, loading, setTenant, loadTenantBySlug]);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}
