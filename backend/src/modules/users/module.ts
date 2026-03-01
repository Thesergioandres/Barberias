import { InMemoryUsersRepository } from './infrastructure/persistence/InMemoryUsersRepository';
import { MongoUsersRepository } from './infrastructure/persistence/MongoUsersRepository';
import { RegisterClientUseCase } from './application/use-cases/registerClientUseCase';
import { CreateUserByAdminUseCase } from './application/use-cases/createUserByAdminUseCase';
import { createUsersRoutes } from './interfaces/http/usersRoutes';
import type { authenticateJwt } from '../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../shared/interfaces/http/middlewares/requireRoles';

export function createUsersModule({
  useMongo = false,
  authenticateJwt: authMiddleware,
  requireRoles: requireRolesMiddleware
}: {
  useMongo?: boolean;
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
}) {
  const usersRepository = useMongo ? new MongoUsersRepository() : new InMemoryUsersRepository();
  const registerClientUseCase = new RegisterClientUseCase({ usersRepository });
  const createUserByAdminUseCase = new CreateUserByAdminUseCase({ usersRepository });

  const usersRoutes = createUsersRoutes({
    registerClientUseCase,
    createUserByAdminUseCase,
    usersRepository,
    authenticateJwt: authMiddleware,
    requireRoles: requireRolesMiddleware
  });

  return { usersRoutes, usersRepository };
}
