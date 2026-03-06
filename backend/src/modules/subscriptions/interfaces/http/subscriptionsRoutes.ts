import { Router, type Request, type Response } from 'express';
import type { SubscriptionsRepository, SubscriptionStatus } from '../../application/ports/SubscriptionsRepository';
import type { authenticateJwt } from '../../../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../../../shared/interfaces/http/middlewares/requireRoles';

export function createSubscriptionsRoutes({
  subscriptionsRepository,
  authenticateJwt: authMiddleware,
  requireRoles: requireRolesMiddleware
}: {
  subscriptionsRepository: SubscriptionsRepository;
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
}) {
  const router = Router();

  router.get('/', authMiddleware, requireRolesMiddleware('ADMIN'), async (req: Request, res: Response) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) return res.status(403).json({ message: 'No tenantId' });

    const subscriptions = await subscriptionsRepository.list(tenantId);
    return res.json(subscriptions);
  });

  router.post('/', authMiddleware, requireRolesMiddleware('ADMIN'), async (req: Request, res: Response) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) return res.status(403).json({ message: 'No tenantId' });

    const { customerId, planName, nextChargeAt } = (req.body || {}) as {
      customerId?: string;
      planName?: string;
      nextChargeAt?: string;
    };
    if (!customerId || !planName) {
      return res.status(400).json({ message: 'customerId y planName son requeridos' });
    }

    const subscription = await subscriptionsRepository.create({ tenantId, customerId, planName, nextChargeAt });
    return res.status(201).json(subscription);
  });

  router.patch('/:id/status', authMiddleware, requireRolesMiddleware('ADMIN'), async (req: Request, res: Response) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) return res.status(403).json({ message: 'No tenantId' });

    const status = (req.body as { status?: SubscriptionStatus })?.status;
    if (!status) return res.status(400).json({ message: 'status es requerido' });

    const updated = await subscriptionsRepository.updateStatus(tenantId, req.params.id, status);
    if (!updated) return res.status(404).json({ message: 'Suscripcion no encontrada' });

    return res.json(updated);
  });

  return router;
}
