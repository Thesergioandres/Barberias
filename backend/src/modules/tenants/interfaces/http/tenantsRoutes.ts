import { Router, type Request, type Response } from 'express';
import type { TenantsRepository } from '../../application/ports/TenantsRepository';
import type { authenticateJwt } from '../../../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../../../shared/interfaces/http/middlewares/requireRoles';

export function createTenantsRoutes(deps: { 
  tenantsRepository: TenantsRepository;
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
}) {
  const router = Router();

  router.get('/', deps.authenticateJwt, deps.requireRoles('GOD'), async (_req: Request, res: Response) => {
    const tenants = await deps.tenantsRepository.listAll();
    return res.json(tenants);
  });

  router.get('/slug/:slug', async (req: Request, res: Response) => {
    const tenant = await deps.tenantsRepository.findBySlug(req.params.slug);
    if (!tenant) {
      return res.status(404).json({ message: 'Barbería no encontrada' });
    }
    return res.json({ id: tenant.id, name: tenant.name, slug: tenant.slug });
  });

  router.get('/:id', async (req: Request, res: Response) => {
    const tenant = await deps.tenantsRepository.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: 'Barbería no encontrada' });
    }
    return res.json(tenant);
  });

  return router;
}
