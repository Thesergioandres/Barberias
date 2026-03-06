import { InMemorySubscriptionsRepository } from './infrastructure/persistence/InMemorySubscriptionsRepository';
import { MongoSubscriptionsRepository } from './infrastructure/persistence/MongoSubscriptionsRepository';
import { createSubscriptionsRoutes } from './interfaces/http/subscriptionsRoutes';
import type { authenticateJwt } from '../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../shared/interfaces/http/middlewares/requireRoles';

export function createSubscriptionsModule({
  useMongo = false,
  authenticateJwt: authMiddleware,
  requireRoles: requireRolesMiddleware
}: {
  useMongo?: boolean;
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
}) {
  const subscriptionsRepository = useMongo ? new MongoSubscriptionsRepository() : new InMemorySubscriptionsRepository();
  const subscriptionsRoutes = createSubscriptionsRoutes({
    subscriptionsRepository,
    authenticateJwt: authMiddleware,
    requireRoles: requireRolesMiddleware
  });

  return { subscriptionsRoutes, subscriptionsRepository };
}
