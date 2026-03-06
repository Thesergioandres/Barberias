import type { CreatePosSaleInput, PosRepository } from '../ports/PosRepository';

export class CreateSaleUseCase {
  constructor(private readonly posRepository: PosRepository) {}

  async execute(input: CreatePosSaleInput) {
    if (!input.items || input.items.length === 0) {
      return { error: 'Items requeridos', statusCode: 400 } as const;
    }

    const sale = await this.posRepository.createSale(input);
    return { sale } as const;
  }
}
