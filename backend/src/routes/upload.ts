import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import sharp from 'sharp';
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

  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_req, file, cb) => {
      if (!allowedMime.has(file.mimetype)) {
        return cb(new Error('Tipo de archivo no permitido'));
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }
  });

  router.post('/', authMiddleware, requireRolesMiddleware('ADMIN'), upload.single('file'), async (req, res) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) {
      return res.status(403).json({ message: 'No tenantId' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Archivo requerido' });
    }

    const target = path.join(process.cwd(), 'uploads', tenantId);
    fs.mkdirSync(target, { recursive: true });
    const safe = sanitizeFilename(req.file.originalname || 'image');
    const filename = `${Date.now()}-${safe}.webp`;
    const filepath = path.join(target, filename);

    try {
      await sharp(req.file.buffer)
        .rotate()
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(filepath);
    } catch (error) {
      return res.status(500).json({ message: 'No se pudo procesar la imagen' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const url = `${protocol}://${host}/uploads/${tenantId}/${filename}`;

    return res.status(201).json({ url });
  });

  return { uploadRoutes: router };
}
