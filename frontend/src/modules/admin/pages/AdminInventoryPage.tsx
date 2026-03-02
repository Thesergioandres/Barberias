import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../../shared/infrastructure/http/apiClient';

const LOW_STOCK_THRESHOLD = 5;

type InventoryItem = {
  id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  active: boolean;
  lastCost?: number;
  averageCost?: number;
  lastRestockedAt?: string;
  restocks?: Array<{
    date: string;
    supplier?: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
};

type SaleItem = {
  productId: string;
  quantity: number;
};

const initialProduct = {
  name: '',
  sku: '',
  price: '',
  stock: ''
};

const initialRestock = {
  productId: '',
  quantity: 1,
  unitCost: '',
  supplier: '',
  arrivedAt: new Date().toISOString().split('T')[0]
};

export function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialProduct);
  const [sale, setSale] = useState<SaleItem>({ productId: '', quantity: 1 });
  const [saleMessage, setSaleMessage] = useState<string | null>(null);
  const [restock, setRestock] = useState(initialRestock);
  const [restockMessage, setRestockMessage] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState('');

  const lowStock = useMemo(() => items.filter((item) => item.stock <= LOW_STOCK_THRESHOLD), [items]);
  const selectedProduct = useMemo(
    () => items.find((item) => item.id === selectedProductId) || null,
    [items, selectedProductId]
  );

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<InventoryItem[]>('/inventory');
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'No se pudo cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const updateField = (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const createProduct = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await apiRequest('/inventory', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          sku: form.sku || undefined,
          price: Number(form.price),
          stock: Number(form.stock)
        })
      });
      setForm(initialProduct);
      await loadInventory();
    } catch (err: any) {
      setError(err.message || 'No se pudo crear producto');
    }
  };

  const recordSale = async (event: FormEvent) => {
    event.preventDefault();
    setSaleMessage(null);

    try {
      const result = await apiRequest<{ total: number }>('/inventory/sales', {
        method: 'POST',
        body: JSON.stringify({
          items: [{ productId: sale.productId, quantity: Number(sale.quantity) }]
        })
      });
      setSaleMessage(`Venta registrada. Total $${result.total}`);
      setSale({ productId: '', quantity: 1 });
      await loadInventory();
    } catch (err: any) {
      setError(err.message || 'No se pudo registrar venta');
    }
  };

  const recordRestock = async (event: FormEvent) => {
    event.preventDefault();
    setRestockMessage(null);

    try {
      await apiRequest('/inventory/restock', {
        method: 'POST',
        body: JSON.stringify({
          productId: restock.productId,
          quantity: Number(restock.quantity),
          unitCost: Number(restock.unitCost),
          supplier: restock.supplier || undefined,
          arrivedAt: restock.arrivedAt
        })
      });
      setRestockMessage('Stock actualizado correctamente.');
      setRestock(initialRestock);
      await loadInventory();
    } catch (err: any) {
      setError(err.message || 'No se pudo registrar el pedido');
    }
  };

  return (
    <section className="space-y-6">
      <header className="app-card">
        <h2 className="section-title">Panel de inventario</h2>
        <p className="section-subtitle">Controla stock y registra ventas rapidas.</p>
      </header>

      {error ? <div className="app-card text-sm text-secondary">{error}</div> : null}

      {lowStock.length > 0 ? (
        <div className="app-card">
          <h3 className="text-lg font-semibold">Alertas de stock bajo</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {lowStock.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>{item.name}</span>
                <span className="text-ink">{item.stock} uds</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="app-card">
          <h3 className="text-lg font-semibold">Productos</h3>
          {loading ? (
            <p className="mt-4 text-sm text-muted">Cargando inventario...</p>
          ) : (
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="app-card-soft flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted">SKU: {item.sku || 'N/A'}</p>
                    <p className="text-xs text-muted">
                      Costo prom: $ {item.averageCost?.toFixed(2) ?? '0.00'}
                    </p>
                    <p className="text-xs text-muted">
                      Margen: {item.price > 0
                        ? `${Math.round(((item.price - (item.averageCost ?? 0)) / item.price) * 100)}%`
                        : '0%'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-ink">$ {item.price}</p>
                    <p className={`text-xs ${item.stock <= LOW_STOCK_THRESHOLD ? 'text-secondary' : 'text-muted'}`}>
                      Stock: {item.stock}
                    </p>
                    <p className="text-xs text-muted">
                      Ultimo ingreso: {item.lastRestockedAt ? item.lastRestockedAt.slice(0, 10) : 'Sin datos'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <form className="app-card space-y-3" onSubmit={createProduct}>
            <h3 className="text-lg font-semibold">Agregar producto</h3>
            <label className="text-sm">
              Nombre
              <input className="input-field mt-2" value={form.name} onChange={updateField('name')} required />
            </label>
            <label className="text-sm">
              SKU
              <input className="input-field mt-2" value={form.sku} onChange={updateField('sku')} />
            </label>
            <label className="text-sm">
              Precio
              <input className="input-field mt-2" type="number" value={form.price} onChange={updateField('price')} required />
            </label>
            <label className="text-sm">
              Stock inicial
              <input className="input-field mt-2" type="number" value={form.stock} onChange={updateField('stock')} required />
            </label>
            <button className="btn-primary" type="submit">Guardar producto</button>
          </form>

          <form className="app-card space-y-3" onSubmit={recordSale}>
            <h3 className="text-lg font-semibold">Venta rapida</h3>
            <label className="text-sm">
              Producto
              <select
                className="select-field mt-2"
                value={sale.productId}
                onChange={(event) => setSale((prev) => ({ ...prev, productId: event.target.value }))}
                required
              >
                <option value="">Selecciona producto</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Cantidad
              <input
                className="input-field mt-2"
                type="number"
                min={1}
                value={sale.quantity}
                onChange={(event) => setSale((prev) => ({ ...prev, quantity: Number(event.target.value) }))}
                required
              />
            </label>
            <button className="btn-secondary" type="submit">Registrar venta</button>
            {saleMessage ? <p className="text-xs text-muted">{saleMessage}</p> : null}
          </form>

          <form className="app-card space-y-3" onSubmit={recordRestock}>
            <h3 className="text-lg font-semibold">Ingreso de proveedor</h3>
            <label className="text-sm">
              Producto
              <select
                className="select-field mt-2"
                value={restock.productId}
                onChange={(event) => setRestock((prev) => ({ ...prev, productId: event.target.value }))}
                required
              >
                <option value="">Selecciona producto</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Cantidad recibida
              <input
                className="input-field mt-2"
                type="number"
                min={1}
                value={restock.quantity}
                onChange={(event) => setRestock((prev) => ({ ...prev, quantity: Number(event.target.value) }))}
                required
              />
            </label>
            <label className="text-sm">
              Costo unitario
              <input
                className="input-field mt-2"
                type="number"
                min={0}
                step="0.01"
                value={restock.unitCost}
                onChange={(event) => setRestock((prev) => ({ ...prev, unitCost: event.target.value }))}
                required
              />
            </label>
            <label className="text-sm">
              Proveedor
              <input
                className="input-field mt-2"
                value={restock.supplier}
                onChange={(event) => setRestock((prev) => ({ ...prev, supplier: event.target.value }))}
              />
            </label>
            <label className="text-sm">
              Fecha de llegada
              <input
                className="input-field mt-2"
                type="date"
                value={restock.arrivedAt}
                onChange={(event) => setRestock((prev) => ({ ...prev, arrivedAt: event.target.value }))}
                required
              />
            </label>
            <button className="btn-secondary" type="submit">Registrar ingreso</button>
            {restockMessage ? <p className="text-xs text-muted">{restockMessage}</p> : null}
          </form>
        </div>
      </div>

      <div className="app-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Historial de reabastecimiento</h3>
            <p className="text-sm text-muted">Consulta fechas, proveedores y costos de compra.</p>
          </div>
          <select
            className="select-field max-w-xs"
            value={selectedProductId}
            onChange={(event) => setSelectedProductId(event.target.value)}
          >
            <option value="">Selecciona producto</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>

        {!selectedProduct ? (
          <p className="mt-4 text-sm text-muted">Selecciona un producto para ver su historial.</p>
        ) : selectedProduct.restocks && selectedProduct.restocks.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.2em] text-muted">
                <tr>
                  <th className="pb-3">Fecha</th>
                  <th className="pb-3">Proveedor</th>
                  <th className="pb-3">Cantidad</th>
                  <th className="pb-3">Costo unit.</th>
                  <th className="pb-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {[...selectedProduct.restocks]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((restockItem, index) => (
                    <tr key={`${restockItem.date}-${index}`} className="border-t border-outline">
                      <td className="py-3 text-muted">{restockItem.date.slice(0, 10)}</td>
                      <td className="py-3">{restockItem.supplier || 'Sin proveedor'}</td>
                      <td className="py-3">{restockItem.quantity}</td>
                      <td className="py-3">$ {restockItem.unitCost.toFixed(2)}</td>
                      <td className="py-3">$ {restockItem.totalCost.toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">No hay reabastecimientos registrados.</p>
        )}
      </div>
    </section>
  );
}
