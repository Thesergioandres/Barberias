import { InMemoryServicesRepository } from './infrastructure/persistence/InMemoryServicesRepository';
import { MongoServicesRepository } from './infrastructure/persistence/MongoServicesRepository';
import { CreateServiceUseCase } from './application/use-cases/createServiceUseCase';
import { createServicesRoutes } from './interfaces/http/servicesRoutes';
import type { authenticateJwt } from '../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../shared/interfaces/http/middlewares/requireRoles';

export function createServicesModule({
  useMongo = false,
  authenticateJwt: authMiddleware,
  requireRoles: requireRolesMiddleware
}: {
  useMongo?: boolean;
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
}) {
  const servicesRepository = useMongo ? new MongoServicesRepository() : new InMemoryServicesRepository();
  const createServiceUseCase = new CreateServiceUseCase({ servicesRepository });
  const servicesRoutes = createServicesRoutes({
    servicesRepository,
    createServiceUseCase,
    authenticateJwt: authMiddleware,
    requireRoles: requireRolesMiddleware
  });

  return { servicesRoutes, servicesRepository };
}
