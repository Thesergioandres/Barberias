import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthPayload } from '../../../types/auth';
import type { UserRole } from '../../../domain/roles';

function isAuthPayload(payload: jwt.JwtPayload | string): payload is jwt.JwtPayload & AuthPayload {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const candidate = payload as jwt.JwtPayload & Partial<AuthPayload>;
  return typeof candidate.sub === 'string' && typeof candidate.role === 'string' && typeof candidate.approved === 'boolean';
}

export function authenticateJwt({ jwtSecret }: { jwtSecret: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Token requerido' });
    }

    try {
      const payload = jwt.verify(token, jwtSecret);
      if (!isAuthPayload(payload)) {
        return res.status(401).json({ message: 'Token inválido' });
      }

      req.auth = {
        sub: payload.sub,
        role: payload.role as UserRole,
        approved: Boolean(payload.approved),
        tenantId: payload.tenantId as string | undefined
      };

      return next();
    } catch (_error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  };
}
