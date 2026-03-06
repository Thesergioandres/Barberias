import { InMemoryProjectsRepository } from './infrastructure/persistence/InMemoryProjectsRepository';
import { MongoProjectsRepository } from './infrastructure/persistence/MongoProjectsRepository';
import { createProjectsRoutes } from './interfaces/http/projectsRoutes';
import type { authenticateJwt } from '../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../shared/interfaces/http/middlewares/requireRoles';

export function createProjectsModule({
  useMongo = false,
  authenticateJwt: authMiddleware,
  requireRoles: requireRolesMiddleware
}: {
  useMongo?: boolean;
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
}) {
  const projectsRepository = useMongo ? new MongoProjectsRepository() : new InMemoryProjectsRepository();
  const projectsRoutes = createProjectsRoutes({
    projectsRepository,
    authenticateJwt: authMiddleware,
    requireRoles: requireRolesMiddleware
  });

  return { projectsRoutes, projectsRepository };
}
