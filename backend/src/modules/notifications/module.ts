import { BullmqWhatsAppProvider } from './infrastructure/providers/BullmqWhatsAppProvider';
import { ConsoleWhatsAppProvider } from './infrastructure/providers/ConsoleWhatsAppProvider';
import { NotificationsService } from './application/NotificationsService';
import { createNotificationsRoutes } from './interfaces/http/notificationsRoutes';
import type { Env } from '../../config/env';
import type { authenticateJwt } from '../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../shared/interfaces/http/middlewares/requireRoles';
import type { TenantsRepository } from '../tenants/application/ports/TenantsRepository';

export function createNotificationsModule({
  env,
  authenticateJwt: authMiddleware,
  requireRoles: requireRolesMiddleware,
  tenantsRepository
}: {
  env: Env;
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
  tenantsRepository: TenantsRepository;
}) {
  const provider = env?.whatsappProvider === 'bullmq'
    ? new BullmqWhatsAppProvider()
    : new ConsoleWhatsAppProvider();
  const notificationsService = new NotificationsService(provider, tenantsRepository);
  const notificationsRoutes = createNotificationsRoutes({
    authenticateJwt: authMiddleware,
    requireRoles: requireRolesMiddleware
  });

  return { notificationsService, notificationsRoutes };
}
