import type { InventoryRepository } from '../ports/InventoryRepository';

export class CreateProductUseCase {
  constructor(private readonly deps: { inventoryRepository: InventoryRepository }) {}

  private error(message: string, statusCode: number) {
    return { error: message, statusCode };
  }

  async execute({
    tenantId,
    name,
    sku,
    category,
    description,
    price,
    stock,
    imageUrl,
    active
  }: {
    tenantId?: string;
    name?: string;
    sku?: string;
    category?: string;
    description?: string;
    price?: number;
    stock?: number;
    imageUrl?: string;
    active?: boolean;
  }): Promise<{ product: Awaited<ReturnType<InventoryRepository['create']>> } | { error: string; statusCode: number }> {
    if (!tenantId) {
      return this.error('tenantId es requerido', 400);
    }
    if (!name || !category || price === undefined || stock === undefined) {
      return this.error('name, category, price y stock son requeridos', 400);
    }
    if (Number(price) < 0 || Number(stock) < 0) {
      return this.error('price y stock no pueden ser negativos', 400);
    }

    const product = await this.deps.inventoryRepository.create({
      tenantId,
      name,
      sku,
      category,
      description,
      price: Number(price),
      stock: Number(stock),
      imageUrl,
      active
    });

    return { product };
  }
}
