import { Router, type Request, type Response } from 'express';
import type { CreateSaleUseCase } from '../../application/use-cases/createSaleUseCase';
import type { PosRepository } from '../../application/ports/PosRepository';
import type { authenticateJwt } from '../../../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../../../shared/interfaces/http/middlewares/requireRoles';

export function createPosRoutes({
  posRepository,
  createSaleUseCase,
  authenticateJwt: authMiddleware,
  requireRoles: requireRolesMiddleware
}: {
  posRepository: PosRepository;
  createSaleUseCase: CreateSaleUseCase;
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
}) {
  const router = Router();

  router.get('/sales', authMiddleware, requireRolesMiddleware('ADMIN'), async (req: Request, res: Response) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) return res.status(403).json({ message: 'No tenantId' });

    const sales = await posRepository.listSales(tenantId);
    return res.json(sales);
  });

  router.get('/sales/:id', authMiddleware, requireRolesMiddleware('ADMIN'), async (req: Request, res: Response) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) return res.status(403).json({ message: 'No tenantId' });

    const sale = await posRepository.findById(tenantId, req.params.id);
    if (!sale) return res.status(404).json({ message: 'Venta no encontrada' });

    return res.json(sale);
  });

  router.post('/sales', authMiddleware, requireRolesMiddleware('ADMIN'), async (req: Request, res: Response) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) return res.status(403).json({ message: 'No tenantId' });

    const result = await createSaleUseCase.execute({
      tenantId,
      items: (req.body as { items?: Array<{ productId: string; name: string; quantity: number; price: number }> })?.items || [],
      paymentMethod: (req.body as { paymentMethod?: string })?.paymentMethod
    });

    if ('error' in result) {
      return res.status(result.statusCode).json({ message: result.error });
    }

    return res.status(201).json(result.sale);
  });

  return router;
}
