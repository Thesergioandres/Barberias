import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import type { authenticateJwt } from '../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../shared/interfaces/http/middlewares/requireRoles';

const allowedMime = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']);

function sanitizeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9.-]/g, '_');
}

export function createUploadRoutes({
  authenticateJwt: authMiddleware,
  requireRoles: requireRolesMiddleware
}: {
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
}) {
  const router = Router();

  const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
      const tenantId = req.auth?.tenantId;
      if (!tenantId) {
        return cb(new Error('No tenantId'), '');
      }
      const target = path.join(process.cwd(), 'uploads', tenantId);
      fs.mkdirSync(target, { recursive: true });
      cb(null, target);
    },
    filename: (_req, file, cb) => {
      const safe = sanitizeFilename(file.originalname || 'image');
      cb(null, `${Date.now()}-${safe}`);
    }
  });

  const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
      if (!allowedMime.has(file.mimetype)) {
        return cb(new Error('Tipo de archivo no permitido'));
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }
  });

  router.post('/', authMiddleware, requireRolesMiddleware('ADMIN'), upload.single('file'), (req, res) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) {
      return res.status(403).json({ message: 'No tenantId' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Archivo requerido' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const url = `${protocol}://${host}/uploads/${tenantId}/${req.file.filename}`;

    return res.status(201).json({ url });
  });

  return { uploadRoutes: router };
}
