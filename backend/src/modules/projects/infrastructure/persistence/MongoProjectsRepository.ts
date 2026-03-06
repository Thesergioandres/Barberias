import type { CreateProjectInput, ProjectRecord, ProjectStatus, ProjectsRepository } from '../../application/ports/ProjectsRepository';

export class MongoProjectsRepository implements ProjectsRepository {
  async list(_tenantId: string): Promise<ProjectRecord[]> {
    throw new Error('MongoProjectsRepository.list not implemented');
  }

  async create(_input: CreateProjectInput): Promise<ProjectRecord> {
    throw new Error('MongoProjectsRepository.create not implemented');
  }

  async updateStatus(_tenantId: string, _id: string, _status: ProjectStatus): Promise<ProjectRecord | null> {
    throw new Error('MongoProjectsRepository.updateStatus not implemented');
  }
}
