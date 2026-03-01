import type { NextFunction, Request, Response } from 'express';

export function requireApproved() {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.auth?.role;
    const approved = req.auth?.approved;

    if (role === 'GOD' || role === 'ADMIN') {
      return next();
    }

    if (!approved) {
      return res.status(403).json({ message: 'Cuenta pendiente de aprobacion' });
    }

    return next();
  };
}
