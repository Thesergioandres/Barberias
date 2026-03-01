# Deploy en Railway

## Servicios recomendados

- `backend` (Node/Express)
- `frontend` (Vite build + static serve o plataforma frontend)
- `mongodb` (plugin o externo tipo Atlas)
- `redis` (opcional si usas BullMQ)

## Variables backend

- `NODE_ENV=production`
- `PORT=4000`
- `MONGODB_URI=<uri-mongo>`
- `REDIS_URL=<uri-redis>`
- `ENABLE_JOBS=true|false`
- `WHATSAPP_PROVIDER=mock|bullmq`
- `JWT_SECRET=<secret>`
- `JWT_EXPIRES_IN=1d`
- `CLOUDINARY_CLOUD_NAME=<...>`
- `CLOUDINARY_API_KEY=<...>`
- `CLOUDINARY_API_SECRET=<...>`
- `VAPID_PUBLIC_KEY=<...>`
- `VAPID_PRIVATE_KEY=<...>`
- `VAPID_SUBJECT=mailto:tu-correo@dominio.com`

## Variables frontend

- `VITE_API_BASE_URL=https://<backend-domain>/api`

## Deploy hooks para CI/CD

Crea dos hooks en Railway:

- `RAILWAY_BACKEND_DEPLOY_HOOK`
- `RAILWAY_FRONTEND_DEPLOY_HOOK`

Luego configúralos como secretos en GitHub Actions.
