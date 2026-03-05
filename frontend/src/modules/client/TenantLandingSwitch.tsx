import { BookingEnginePage } from './BookingEnginePage';
import { StorefrontPage } from './StorefrontPage';
import { useTenant } from '../../shared/context/TenantContext';

export function TenantLandingSwitch() {
  const { tenant, loading } = useTenant();

  if (loading) {
    return <div className="app-card">Cargando experiencia...</div>;
  }

  const activeModules = tenant?.activeModules || [];
  const hasStorefront = activeModules.includes('ecommerce_storefront');
  const hasAgenda = activeModules.includes('agenda');

  if (hasStorefront && !hasAgenda) {
    return <StorefrontPage />;
  }

  if (hasStorefront && hasAgenda) {
    return <StorefrontPage />;
  }

  if (hasAgenda) {
    return <BookingEnginePage />;
  }

  return <BookingEnginePage />;
}
