import { InMemoryTablesRepository } from './infrastructure/persistence/InMemoryTablesRepository';
import { MongoTablesRepository } from './infrastructure/persistence/MongoTablesRepository';
import { createTablesRoutes } from './interfaces/http/tablesRoutes';
import type { authenticateJwt } from '../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../shared/interfaces/http/middlewares/requireRoles';

export function createTablesModule({
  useMongo = false,
  authenticateJwt: authMiddleware,
  requireRoles: requireRolesMiddleware
}: {
  useMongo?: boolean;
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
}) {
  const tablesRepository = useMongo ? new MongoTablesRepository() : new InMemoryTablesRepository();
  const tablesRoutes = createTablesRoutes({
    tablesRepository,
    authenticateJwt: authMiddleware,
    requireRoles: requireRolesMiddleware
  });

  return { tablesRoutes, tablesRepository };
}
