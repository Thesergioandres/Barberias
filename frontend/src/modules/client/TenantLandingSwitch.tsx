import { TenantPublicHome } from './TenantPublicHome';
import { CartProvider, useCart } from '../../shared/context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { CartToast } from './components/CartToast';
import { useTenant, type TenantRecord } from '../../shared/context/TenantContext';

export function TenantLandingSwitch() {
  const { tenant, loading } = useTenant();

  if (loading) {
    return <div className="app-card">Cargando experiencia...</div>;
  }

  return (
    <CartProvider tenantId={tenant?.id}>
      <TenantShell tenant={tenant} />
    </CartProvider>
  );
}

function TenantShell({ tenant }: { tenant: TenantRecord | null }) {
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <>
      <TenantPublicHome tenant={tenant} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        tenantPhone={tenant?.phone}
      />
      <CartToast />
    </>
  );
}
