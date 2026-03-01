import { InMemoryBarberAvailabilityRepository } from './infrastructure/persistence/InMemoryBarberAvailabilityRepository';
import { MongoBarberAvailabilityRepository } from './infrastructure/persistence/MongoBarberAvailabilityRepository';
import { createBarbersRoutes } from './interfaces/http/barbersRoutes';
import type { authenticateJwt } from '../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../shared/interfaces/http/middlewares/requireRoles';
import type { requireApproved } from '../../shared/interfaces/http/middlewares/requireApproved';

export function createBarbersModule({
  useMongo = false,
  authenticateJwt: authMiddleware,
  requireRoles: requireRolesMiddleware,
  requireApproved: requireApprovedMiddleware
}: {
  useMongo?: boolean;
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
  requireApproved: ReturnType<typeof requireApproved>;
}) {
  const availabilityRepository = useMongo
    ? new MongoBarberAvailabilityRepository()
    : new InMemoryBarberAvailabilityRepository();
  const barbersRoutes = createBarbersRoutes({
    availabilityRepository,
    authenticateJwt: authMiddleware,
    requireApproved: requireApprovedMiddleware,
    requireRoles: requireRolesMiddleware
  });

  return { barbersRoutes, availabilityRepository };
}
