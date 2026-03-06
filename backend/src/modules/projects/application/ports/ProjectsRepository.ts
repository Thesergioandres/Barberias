export type ProjectStatus = 'ACTIVO' | 'PAUSADO' | 'CERRADO';

export type ProjectRecord = {
  id: string;
  tenantId: string;
  name: string;
  status: ProjectStatus;
  dueDate?: string;
  createdAt: string;
};

export type CreateProjectInput = {
  tenantId: string;
  name: string;
  dueDate?: string;
};

export interface ProjectsRepository {
  list(tenantId: string): Promise<ProjectRecord[]>;
  create(input: CreateProjectInput): Promise<ProjectRecord>;
  updateStatus(tenantId: string, id: string, status: ProjectStatus): Promise<ProjectRecord | null>;
}
