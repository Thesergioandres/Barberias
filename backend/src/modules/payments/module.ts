import { PaymentsService } from './application/PaymentsService';
import { createPaymentsRoutes } from './interfaces/http/paymentsRoutes';
import type { authenticateJwt } from '../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../shared/interfaces/http/middlewares/requireRoles';
import type { PlansRepository } from '../plans/application/ports/PlansRepository';
import type { TenantsRepository } from '../tenants/application/ports/TenantsRepository';
import type { Env } from '../../config/env';

export function createPaymentsModule({
  env,
  plansRepository,
  tenantsRepository,
  authenticateJwt: authMiddleware,
  requireRoles: requireRolesMiddleware
}: {
  env: Env;
  plansRepository: PlansRepository;
  tenantsRepository: TenantsRepository;
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
}) {
  const paymentsService = new PaymentsService({
    accessToken: env.mercadoPagoAccessToken,
    notificationUrl: env.mercadoPagoWebhookUrl,
    successUrl: env.mercadoPagoSuccessUrl,
    failureUrl: env.mercadoPagoFailureUrl,
    pendingUrl: env.mercadoPagoPendingUrl,
    currencyId: env.mercadoPagoCurrency,
    plansRepository,
    tenantsRepository
  });

  const paymentsRoutes = createPaymentsRoutes({
    paymentsService,
    authenticateJwt: authMiddleware,
    requireRoles: requireRolesMiddleware
  });

  return { paymentsRoutes };
}
