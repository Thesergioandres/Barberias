import { InMemoryPosRepository } from './infrastructure/persistence/InMemoryPosRepository';
import { MongoPosRepository } from './infrastructure/persistence/MongoPosRepository';
import { CreateSaleUseCase } from './application/use-cases/createSaleUseCase';
import { createPosRoutes } from './interfaces/http/posRoutes';
import type { authenticateJwt } from '../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../shared/interfaces/http/middlewares/requireRoles';

export function createPosModule({
  useMongo = false,
  authenticateJwt: authMiddleware,
  requireRoles: requireRolesMiddleware
}: {
  useMongo?: boolean;
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
}) {
  const posRepository = useMongo ? new MongoPosRepository() : new InMemoryPosRepository();
  const createSaleUseCase = new CreateSaleUseCase(posRepository);

  const posRoutes = createPosRoutes({
    posRepository,
    createSaleUseCase,
    authenticateJwt: authMiddleware,
    requireRoles: requireRolesMiddleware
  });

  return { posRoutes, posRepository };
}
