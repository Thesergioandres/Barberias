import { Router, type Request, type Response } from 'express';
import type { BarberAvailabilityRepository } from '../../application/ports/BarberAvailabilityRepository';
import type { authenticateJwt } from '../../../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../../../shared/interfaces/http/middlewares/requireRoles';
import type { requireApproved } from '../../../../shared/interfaces/http/middlewares/requireApproved';

export function createBarbersRoutes({
  availabilityRepository,
  authenticateJwt: authMiddleware,
  requireApproved: requireApprovedMiddleware,
  requireRoles: requireRolesMiddleware
}: {
  availabilityRepository: BarberAvailabilityRepository;
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireApproved: ReturnType<typeof requireApproved>;
  requireRoles: typeof requireRoles;
}) {
  const router = Router();

  router.get('/:barberId/schedules', authMiddleware, requireApprovedMiddleware, requireRolesMiddleware('ADMIN', 'BARBER', 'CLIENT'), async (req: Request, res: Response) => {
    const schedules = await availabilityRepository.listSchedules(req.params.barberId);
    res.json(schedules);
  });

  router.post('/:barberId/schedules', authMiddleware, requireApprovedMiddleware, requireRolesMiddleware('ADMIN', 'BARBER'), async (req: Request, res: Response) => {
    if (req.auth?.role === 'BARBER' && req.auth?.sub !== req.params.barberId) {
      return res.status(403).json({ message: 'Solo puedes configurar tu propia agenda' });
    }

    const { dayOfWeek, startTime, endTime } = (req.body || {}) as {
      dayOfWeek?: number;
      startTime?: string;
      endTime?: string;
    };

    if (typeof dayOfWeek !== 'number' || !startTime || !endTime) {
      return res.status(400).json({ message: 'dayOfWeek, startTime y endTime son requeridos' });
    }

    const schedule = await availabilityRepository.upsertSchedule({
      barberId: req.params.barberId,
      dayOfWeek,
      startTime,
      endTime
    });

    return res.status(201).json(schedule);
  });

  router.get('/:barberId/blocks', authMiddleware, requireApprovedMiddleware, requireRolesMiddleware('ADMIN', 'BARBER'), async (req: Request, res: Response) => {
    if (req.auth?.role === 'BARBER' && req.auth?.sub !== req.params.barberId) {
      return res.status(403).json({ message: 'Solo puedes consultar tus propios bloqueos' });
    }

    const blocks = await availabilityRepository.listBlocks(req.params.barberId);
    res.json(blocks);
  });

  router.post('/:barberId/blocks', authMiddleware, requireApprovedMiddleware, requireRolesMiddleware('ADMIN', 'BARBER'), async (req: Request, res: Response) => {
    if (req.auth?.role === 'BARBER' && req.auth?.sub !== req.params.barberId) {
      return res.status(403).json({ message: 'Solo puedes crear bloqueos sobre tu agenda' });
    }

    const { startAt, endAt, reason } = (req.body || {}) as {
      startAt?: string;
      endAt?: string;
      reason?: string;
    };

    if (!startAt || !endAt) {
      return res.status(400).json({ message: 'startAt y endAt son requeridos' });
    }

    const block = await availabilityRepository.addBlock({
      barberId: req.params.barberId,
      startAt,
      endAt,
      reason
    });

    return res.status(201).json(block);
  });

  return router;
}
