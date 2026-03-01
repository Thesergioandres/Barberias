# MVP Sistema de Agendamiento Barbería

## Módulos backend implementados

- `auth`: login JWT.
- `users`: registro cliente, creación de usuarios por admin, consentimiento WhatsApp.
- `approvals`: flujo GOD para aprobar acceso.
- `services`: CRUD básico de servicios y consulta activos.
- `barbers`: horarios y bloqueos por barbero.
- `appointments`: crear, cambiar estado, cancelar, reprogramar, listar.
- `notifications`: configuración y logs de mensajes WhatsApp.

## Endpoints base

- `POST /api/auth/login`
- `GET /api/users`
- `POST /api/users/register`
- `POST /api/users/admin`
- `GET /api/users/pending`
- `PATCH /api/users/:id/approve`
- `PATCH /api/users/:id/whatsapp-consent`
- `GET /api/services?onlyActive=true`
- `POST /api/services`
- `PATCH /api/services/:id`
- `GET /api/barbers/:barberId/schedules`
- `POST /api/barbers/:barberId/schedules`
- `GET /api/barbers/:barberId/blocks`
- `POST /api/barbers/:barberId/blocks`
- `GET /api/appointments?clientId=...`
- `POST /api/appointments`
- `PATCH /api/appointments/:id/status`
- `POST /api/appointments/:id/cancel`
- `POST /api/appointments/:id/reschedule`
- `GET /api/notifications/logs`
- `GET /api/notifications/config`
- `PATCH /api/notifications/config`

## Seguridad y operación (producción)

- JWT obligatorio en rutas protegidas.
- RBAC aplicado por rol (`ADMIN`, `BARBER`, `CLIENT`).
- Ownership aplicado en citas por id:
	- Barbero solo cambia estado de sus propias citas.
	- Cliente solo cancela/reprograma sus propias citas.
- Hardening HTTP:
	- `helmet`
	- `express-rate-limit`
	- CORS con allowlist (`CORS_ORIGINS`)
	- `trust proxy` configurable
- Health check operativo en `/api/health` con estado de Mongo.
- Logs de WhatsApp en memoria y en Mongo cuando hay conexión.

## Registros seed

Usuarios seed:
- `admin@barberia.com` / `admin123`
- `god@barberia.com` / `god123`
- `barbero@barberia.com` / `barbero123`
- `cliente@barberia.com` / `cliente123`

## Decisiones actuales

- Persistencia híbrida: MongoDB como primario (`USE_MONGO=true`) con fallback a memoria si no conecta.
- Seed automático en Mongo para cuentas demo y servicios iniciales.
- WhatsApp provider actual: cola BullMQ + simulación de envío (log).
- RBAC JWT activo en endpoints sensibles (admin/barber/client) con middleware.
- Flujo de aprobacion: clientes registrados quedan pendientes hasta aprobacion GOD.

## Próximo sprint recomendado

1. Persistir configuración de notificaciones (quiet hours/eventos) en Mongo.
2. Agregar recordatorios programados (cron + cola).
3. Implementar proveedor real de WhatsApp (Meta API/Twilio).
4. Añadir pruebas de integración HTTP para RBAC y ownership.
5. Incorporar observabilidad (logs estructurados + métricas + trazas).

## Comandos de validación

- Backend tests: `npm test` (en `backend`)
- Backend sintaxis: `node --check` en `src/**/*.js`
- Frontend build: `npm run build -w frontend`
