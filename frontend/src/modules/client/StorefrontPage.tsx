import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../shared/infrastructure/http/apiClient';
import { useTenant } from '../../shared/context/TenantContext';

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
};

export function StorefrontPage() {
  const { tenant } = useTenant();
  const activeModules = tenant?.activeModules || [];
  const hasAgenda = activeModules.includes('agenda');
  const hasStorefront = activeModules.includes('ecommerce_storefront');
  const showCrossNav = hasAgenda && hasStorefront;

  const productsQuery = useQuery({
    queryKey: ['inventory', 'public', tenant?.id],
    queryFn: () => apiRequest<Product[]>(`/inventory/public?tenantId=${tenant?.id}`),
    enabled: Boolean(tenant?.id)
  });

  const products = useMemo(() => productsQuery.data || [], [productsQuery.data]);

  return (
    <section className="space-y-6 bg-app text-app-text p-6 rounded-3xl">
      <header className="app-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="section-title">Tienda de {tenant?.name || 'tu negocio'}</h2>
            <p className="section-subtitle">Explora productos disponibles y compra en minutos.</p>
          </div>
        </div>
        {showCrossNav ? (
          <div className="mt-4 flex items-center justify-center">
            <div className="flex rounded-full border border-outline bg-black/20 p-1">
              <span className="rounded-full px-4 py-2 text-sm font-semibold text-primary">Tienda</span>
              <Link
                className="rounded-full px-4 py-2 text-sm text-muted hover:text-ink"
                to="/booking"
              >
                Reservas
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      {productsQuery.isLoading ? (
        <p className="text-sm text-muted">Cargando catalogo...</p>
      ) : productsQuery.isError ? (
        <p className="text-sm text-secondary">No se pudo cargar el catalogo.</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-muted">No hay productos disponibles en este momento.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="app-card-soft flex flex-col gap-3">
              <div className="h-36 w-full overflow-hidden rounded-2xl bg-black/20">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{product.name}</p>
                  <p className="text-xs text-muted">{product.category}</p>
                </div>
                <span className="text-sm font-semibold">$ {product.price}</span>
              </div>
              <p className="text-xs text-muted">Stock disponible: {product.stock}</p>
              <button className="btn-primary" type="button">
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
