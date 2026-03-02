import type { InventoryRepository, RestockInput } from '../ports/InventoryRepository';

export class RecordRestockUseCase {
  constructor(private readonly deps: { inventoryRepository: InventoryRepository }) {}

  private error(message: string, statusCode: number) {
    return { error: message, statusCode };
  }

  async execute({ tenantId, input }: { tenantId?: string; input?: RestockInput }): Promise<{ product: Awaited<ReturnType<InventoryRepository['recordRestock']>> } | { error: string; statusCode: number }> {
    if (!tenantId) {
      return this.error('tenantId es requerido', 400);
    }
    if (!input?.productId || Number(input.quantity) <= 0) {
      return this.error('productId y quantity > 0 son requeridos', 400);
    }
    if (input.unitCost === undefined || Number(input.unitCost) < 0) {
      return this.error('unitCost es requerido', 400);
    }

    const product = await this.deps.inventoryRepository.recordRestock(tenantId, {
      ...input,
      quantity: Number(input.quantity),
      unitCost: Number(input.unitCost)
    });

    if (!product) {
      return this.error('Producto no encontrado', 404);
    }

    return { product };
  }
}
