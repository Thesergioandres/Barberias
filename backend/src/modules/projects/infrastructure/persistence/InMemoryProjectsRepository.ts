import { randomUUID } from 'crypto';
import type { CreateProjectInput, ProjectRecord, ProjectStatus, ProjectsRepository } from '../../application/ports/ProjectsRepository';

export class InMemoryProjectsRepository implements ProjectsRepository {
  private projects: ProjectRecord[] = [];

  async list(tenantId: string) {
    return this.projects.filter((project) => project.tenantId === tenantId);
  }

  async create(input: CreateProjectInput) {
    const project: ProjectRecord = {
      id: randomUUID(),
      tenantId: input.tenantId,
      name: input.name,
      status: 'ACTIVO',
      dueDate: input.dueDate,
      createdAt: new Date().toISOString()
    };
    this.projects.push(project);
    return project;
  }

  async updateStatus(tenantId: string, id: string, status: ProjectStatus) {
    const index = this.projects.findIndex((project) => project.tenantId === tenantId && project.id === id);
    if (index < 0) return null;
    const updated: ProjectRecord = { ...this.projects[index], status };
    this.projects[index] = updated;
    return updated;
  }
}
