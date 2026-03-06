import type { CreatePosSaleInput, PosRepository, PosSale } from '../../application/ports/PosRepository';

export class MongoPosRepository implements PosRepository {
  async listSales(_tenantId: string): Promise<PosSale[]> {
    throw new Error('MongoPosRepository.listSales not implemented');
  }

  async findById(_tenantId: string, _id: string): Promise<PosSale | null> {
    throw new Error('MongoPosRepository.findById not implemented');
  }

  async createSale(_input: CreatePosSaleInput): Promise<PosSale> {
    throw new Error('MongoPosRepository.createSale not implemented');
  }
}
