import type { Request, Response } from 'express';
import { createHash, randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import type { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
import type { UserRepository } from '../../application/ports/UserRepository';
import type { TenantsRepository } from '../../../tenants/application/ports/TenantsRepository';

export function createAuthController({
  loginUserUseCase,
  usersRepository,
  tenantsRepository
}: {
  loginUserUseCase: LoginUserUseCase;
  usersRepository: UserRepository;
  tenantsRepository?: TenantsRepository;
}) {
  return {
    login: async (req: Request, res: Response) => {
      const result = await loginUserUseCase.execute((req.body || {}) as { email?: string; password?: string });

      if ('error' in result) {
        return res.status(result.statusCode).json({ message: result.error });
      }
      const tenantId = result.user?.tenantId;
      const tenant = tenantId ? await tenantsRepository?.findById(tenantId) : null;
      const tenantConfig = tenant
        ? {
            tenantId: tenant.id,
            verticalSlug: tenant.verticalSlug,
            activeModules: tenant.activeModules || [],
            features: (tenant as { features?: string[] }).features || []
          }
        : null;

      return res.json({ token: result.token, user: result.user, tenantConfig });
    },
    me: async (req: Request, res: Response) => {
      const auth = req.auth;
      if (!auth?.sub) {
        return res.status(401).json({ message: 'No autenticado' });
      }

      const user = await usersRepository.findById?.(auth.sub);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const { passwordHash, ...safeUser } = user as { passwordHash?: string };
      return res.json(safeUser);
    },
    forgotPassword: async (req: Request, res: Response) => {
      const email = (req.body as { email?: string })?.email;
      if (!email) {
        return res.status(400).json({ message: 'email es requerido' });
      }

      const user = await usersRepository.findByEmail(email);
      if (!user || !usersRepository.setResetToken) {
        return res.json({ message: 'Si existe la cuenta, se envio un token de recuperacion.' });
      }

      const token = randomBytes(32).toString('hex');
      const tokenHash = createHash('sha256').update(token).digest('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      await usersRepository.setResetToken(user.id, tokenHash, expiresAt);

      return res.json({ message: 'Token generado', resetToken: token });
    },
    resetPassword: async (req: Request, res: Response) => {
      const { token, password } = (req.body || {}) as { token?: string; password?: string };
      if (!token || !password) {
        return res.status(400).json({ message: 'token y password son requeridos' });
      }

      if (!usersRepository.findByResetToken || !usersRepository.update || !usersRepository.clearResetToken) {
        return res.status(501).json({ message: 'Recuperacion no soportada' });
      }

      const tokenHash = createHash('sha256').update(token).digest('hex');
      const user = await usersRepository.findByResetToken(tokenHash);
      if (!user) {
        return res.status(400).json({ message: 'Token invalido o expirado' });
      }

      const passwordHash = bcrypt.hashSync(password, 10);
      await usersRepository.update(user.id, { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null });
      await usersRepository.clearResetToken(user.id);

      return res.json({ message: 'Password actualizado' });
    }
  };
}
