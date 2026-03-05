import { Router, type Request, type Response } from 'express';
import type { ServicesRepository } from '../../application/ports/ServicesRepository';
import type { CreateServiceUseCase } from '../../application/use-cases/createServiceUseCase';
import type { authenticateJwt } from '../../../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../../../shared/interfaces/http/middlewares/requireRoles';

export function createServicesRoutes({
  servicesRepository,
  createServiceUseCase,
  authenticateJwt: authMiddleware,
  requireRoles: requireRolesMiddleware
}: {
  servicesRepository: ServicesRepository;
  createServiceUseCase: CreateServiceUseCase;
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
}) {
  const router = Router();

  router.get('/public', async (req: Request, res: Response) => {
    const tenantId = typeof req.query.tenantId === 'string' ? req.query.tenantId : '';
    if (!tenantId) return res.status(400).json({ message: 'tenantId is required' });

    const services = await servicesRepository.list(tenantId, { onlyActive: true });
    res.json(services);
  });

  router.get('/', async (req: Request, res: Response) => {
    const onlyActive = req.query.onlyActive === 'true';
    const tenantId = typeof req.query.tenantId === 'string' ? req.query.tenantId : '';
    if (!tenantId) return res.status(400).json({ message: 'tenantId is required' });

    const services = await servicesRepository.list(tenantId, { onlyActive });
    res.json(services);
  });

  router.post('/', authMiddleware, requireRolesMiddleware('ADMIN'), async (req: Request, res: Response) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) return res.status(403).json({ message: 'No tenantId' });

    const result = await createServiceUseCase.execute({
      ...(req.body || {}),
      tenantId
    } as Record<string, unknown>);
    if ('error' in result) {
      return res.status(result.statusCode).json({ message: result.error });
    }

    return res.status(201).json(result.service);
  });

  router.patch('/:id', authMiddleware, requireRolesMiddleware('ADMIN'), async (req: Request, res: Response) => {
    const service = await servicesRepository.update(req.params.id, (req.body || {}) as Record<string, unknown>);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    return res.json(service);
  });

  return router;
}
