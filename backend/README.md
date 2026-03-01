# Backend - Barberia

## Resumen

Este backend es una API Express + TypeScript modular que sigue una arquitectura hexagonal por feature. Expone endpoints REST para auth, usuarios, servicios, barberos, citas, notificaciones y reportes. MongoDB es la persistencia principal, con fallback a memoria para desarrollo local. Los jobs (recordatorios y cola de WhatsApp) son opcionales y requieren Redis + BullMQ.

## Stack

- Node.js >= 18
- Express 4
- TypeScript
- JWT auth
- MongoDB (principal) + fallback en memoria
- Redis + BullMQ (jobs opcionales)
- Pino logging
- Swagger UI

## Arquitectura

Modulos base: backend/src/modules

Cada modulo usa capas:
- domain: entidades + reglas de negocio
- application: casos de uso + puertos
- infrastructure: adaptadores (mongo, jwt, providers)
- interfaces: rutas/controladores HTTP

Bootstrap:
- src/index.ts: entrypoint
- src/bootstrap/startServer.ts: Mongo, webpush, cloudinary, jobs
- src/app/createApp.ts: wiring de Express

## Mapa de carpetas

- src/modules: modulos por feature
- src/shared: tipos, config, middleware, logging
- src/bootstrap: arranque del servidor
- src/jobs: jobs en background (BullMQ)
- src/config: loader de env
- test: pruebas con node --test

## Variables de entorno

Crea backend/.env desde backend/.env.example.

Requeridas para dev local:
- NODE_ENV=development
- PORT=4000
- MONGODB_URI=mongodb://localhost:27017/barberia
- USE_MONGO=true
- JWT_SECRET=change-me-in-production
- CORS_ORIGINS=http://localhost:5173

Opcionales / avanzadas:
- ENABLE_JOBS=false (default en desarrollo)
- REDIS_URL=redis://localhost:6379
- WHATSAPP_PROVIDER=mock|bullmq
- MIN_ADVANCE_MINUTES=60
- CANCEL_LIMIT_MINUTES=120
- RESCHEDULE_LIMIT_MINUTES=120
- QUIET_HOURS_START=22:00
- QUIET_HOURS_END=07:00
- CLOUDINARY_CLOUD_NAME=...
- CLOUDINARY_API_KEY=...
- CLOUDINARY_API_SECRET=...
- VAPID_PUBLIC_KEY=...
- VAPID_PRIVATE_KEY=...
- VAPID_SUBJECT=mailto:admin@barberia.com

## Scripts

Desde /backend:
- npm run dev: ts-node-dev
- npm run build: tsc
- npm run start: node dist/index.js
- npm run test: node --test

Desde la raiz:
- npm run dev: backend + frontend
- npm run build: backend + frontend

## Ejecutar localmente

1) Instala dependencias en la raiz:

npm install

2) Variables de entorno:
- backend/.env.example -> backend/.env

3) Levanta solo el backend:

npm run dev -w backend

Swagger UI:
- http://localhost:4000/docs

## Auth y roles

Roles:
- GOD, ADMIN, BARBER, CLIENT

JWT:
- Authorization: Bearer <token>
- Middleware: authenticateJwt + requireRoles + requireApproved

Flujo de aprobacion:
- Clientes se registran como approved=false
- GOD aprueba via /users/pending + /users/:id/approve
- Usuarios pendientes ven la pantalla waiting en frontend

Usuarios demo (seed):
- god@barberia.com / god123
- admin@barberia.com / admin123
- barbero@barberia.com / barbero123
- cliente@barberia.com / cliente123

## Jobs y Redis

Jobs deshabilitados por defecto en desarrollo. Para habilitar:
- ENABLE_JOBS=true
- REDIS_URL=redis://localhost:6379
- WHATSAPP_PROVIDER=bullmq

Jobs incluidos:
- WhatsApp queue worker
- Appointment reminders scheduler

## Persistencia

- MongoDB es principal.
- Si Mongo cae o USE_MONGO=false, se usa memoria.
- La memoria se reinicia al reiniciar el proceso.

## Documentacion de API

- Swagger: http://localhost:4000/docs
- API reference: docs/API_REFERENCE.md

## Testing

- npm run test (node --test)

## Troubleshooting

- Redis ECONNREFUSED: deshabilita jobs o inicia Redis
- Mongo fallback: verifica MONGODB_URI + USE_MONGO
- 403 CORS: agrega origen en CORS_ORIGINS
- Jobs no corren: ENABLE_JOBS=true + Redis + WHATSAPP_PROVIDER=bullmq
