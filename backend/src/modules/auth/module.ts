import type { Env } from '../../config/env';
import { LoginUserUseCase } from './application/use-cases/LoginUserUseCase';
import { InMemoryUserRepository } from './infrastructure/persistence/InMemoryUserRepository';
import { BcryptPasswordHasher } from './infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from './infrastructure/security/JwtTokenService';
import { createAuthController } from './interfaces/http/authController';
import { createAuthRoutes } from './interfaces/http/authRoutes';
import { authenticateJwt } from '../../shared/interfaces/http/middlewares/authenticateJwt';
import type { UserRepository } from './application/ports/UserRepository';

export function createAuthModule({ env, usersRepository }: { env: Env; usersRepository?: UserRepository }) {
  const userRepository = usersRepository || new InMemoryUserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService({
    secret: env.jwtSecret,
    expiresIn: env.jwtExpiresIn
  });

  const loginUserUseCase = new LoginUserUseCase({
    userRepository,
    passwordHasher,
    tokenService
  });

  const authController = createAuthController({ loginUserUseCase, usersRepository: userRepository });
  const authRoutes = createAuthRoutes({
    authController,
    authenticateJwt: authenticateJwt({ jwtSecret: env.jwtSecret })
  });

  return { authRoutes };
}
