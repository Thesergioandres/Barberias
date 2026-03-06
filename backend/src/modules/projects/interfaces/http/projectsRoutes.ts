import { Router, type Request, type Response } from 'express';
import type { ProjectsRepository, ProjectStatus } from '../../application/ports/ProjectsRepository';
import type { authenticateJwt } from '../../../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../../../shared/interfaces/http/middlewares/requireRoles';

export function createProjectsRoutes({
  projectsRepository,
  authenticateJwt: authMiddleware,
  requireRoles: requireRolesMiddleware
}: {
  projectsRepository: ProjectsRepository;
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
}) {
  const router = Router();

  router.get('/', authMiddleware, requireRolesMiddleware('ADMIN'), async (req: Request, res: Response) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) return res.status(403).json({ message: 'No tenantId' });

    const projects = await projectsRepository.list(tenantId);
    return res.json(projects);
  });

  router.post('/', authMiddleware, requireRolesMiddleware('ADMIN'), async (req: Request, res: Response) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) return res.status(403).json({ message: 'No tenantId' });

    const { name, dueDate } = (req.body || {}) as { name?: string; dueDate?: string };
    if (!name) return res.status(400).json({ message: 'name es requerido' });

    const project = await projectsRepository.create({ tenantId, name, dueDate });
    return res.status(201).json(project);
  });

  router.patch('/:id/status', authMiddleware, requireRolesMiddleware('ADMIN'), async (req: Request, res: Response) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) return res.status(403).json({ message: 'No tenantId' });

    const status = (req.body as { status?: ProjectStatus })?.status;
    if (!status) return res.status(400).json({ message: 'status es requerido' });

    const updated = await projectsRepository.updateStatus(tenantId, req.params.id, status);
    if (!updated) return res.status(404).json({ message: 'Proyecto no encontrado' });

    return res.json(updated);
  });

  return router;
}
