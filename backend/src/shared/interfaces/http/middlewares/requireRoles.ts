import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '../../../domain/roles';

export function requireRoles(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.auth?.role;
    if (!userRole) {
      return res.status(403).json({ message: 'No autorizado para esta acción' });
    }

    if (userRole === 'GOD') {
      return next();
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'No autorizado para esta acción' });
    }

    return next();
  };
}
