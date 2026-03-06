import { Router, type Request, type Response } from 'express';
import type { TablesRepository, TableStatus } from '../../application/ports/TablesRepository';
import type { authenticateJwt } from '../../../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../../../shared/interfaces/http/middlewares/requireRoles';

export function createTablesRoutes({
  tablesRepository,
  authenticateJwt: authMiddleware,
  requireRoles: requireRolesMiddleware
}: {
  tablesRepository: TablesRepository;
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
}) {
  const router = Router();

  router.get('/', authMiddleware, requireRolesMiddleware('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) return res.status(403).json({ message: 'No tenantId' });

    const tables = await tablesRepository.list(tenantId);
    return res.json(tables);
  });

  router.post('/', authMiddleware, requireRolesMiddleware('ADMIN'), async (req: Request, res: Response) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) return res.status(403).json({ message: 'No tenantId' });

    const { name, capacity } = (req.body || {}) as { name?: string; capacity?: number };
    if (!name) return res.status(400).json({ message: 'name es requerido' });

    const table = await tablesRepository.create({ tenantId, name, capacity });
    return res.status(201).json(table);
  });

  router.patch('/:id/status', authMiddleware, requireRolesMiddleware('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) return res.status(403).json({ message: 'No tenantId' });

    const status = (req.body as { status?: TableStatus })?.status;
    if (!status) return res.status(400).json({ message: 'status es requerido' });

    const updated = await tablesRepository.updateStatus(tenantId, req.params.id, status);
    if (!updated) return res.status(404).json({ message: 'Mesa no encontrada' });

    return res.json(updated);
  });

  return router;
}
