import type { CreateTableInput, TableRecord, TableStatus, TablesRepository } from '../../application/ports/TablesRepository';

export class MongoTablesRepository implements TablesRepository {
  async list(_tenantId: string): Promise<TableRecord[]> {
    throw new Error('MongoTablesRepository.list not implemented');
  }

  async create(_input: CreateTableInput): Promise<TableRecord> {
    throw new Error('MongoTablesRepository.create not implemented');
  }

  async updateStatus(_tenantId: string, _id: string, _status: TableStatus): Promise<TableRecord | null> {
    throw new Error('MongoTablesRepository.updateStatus not implemented');
  }
}
