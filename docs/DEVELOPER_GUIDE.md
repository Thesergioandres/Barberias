# Guia de Desarrollo - Barberia

## 1) Stack

Frontend:
- React 19 + TypeScript + Vite 6 + Tailwind CSS 4 + React Router 7

Backend:
- Node.js (>=18) + Express 4 + TypeScript + JWT
- MongoDB (principal) con fallback en memoria
- Redis + BullMQ (opcional, para jobs)

Infra:
- Railway deploy hooks
- Docker Compose (legacy/VPS)

## 2) Estructura del repo

Raiz:
- backend/
- frontend/
- docs/

Modulos backend:
- backend/src/modules/<feature>/{domain,application,infrastructure,interfaces}

Modulos frontend:
- frontend/src/modules/<feature>/{domain,application,infrastructure,presentation}

## 3) Setup local

1) Instala dependencias:

```bash
npm install
```

2) Variables de entorno:
- backend/.env.example -> backend/.env
- frontend/.env.example -> frontend/.env

3) Ejecuta todo:

```bash
npm run dev
```

URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Swagger: http://localhost:4000/docs

## 4) Scripts

Raiz:
- dev: inicia backend + frontend
- build: build de backend + frontend

Backend:
- dev: ts-node-dev
- build: tsc
- start: node dist/index.js

Frontend:
- dev: vite
- build: tsc -b + vite build

## 5) Variables de entorno

Backend (backend/.env):
- NODE_ENV=development
- PORT=4000
- MONGODB_URI=mongodb://localhost:27017/barberia
- USE_MONGO=true
- REDIS_URL=redis://localhost:6379
- ENABLE_JOBS=false (default en desarrollo)
- WHATSAPP_PROVIDER=mock|bullmq
- JWT_SECRET=change-me
- JWT_EXPIRES_IN=1d
- MIN_ADVANCE_MINUTES=60
- CANCEL_LIMIT_MINUTES=120
- RESCHEDULE_LIMIT_MINUTES=120
- QUIET_HOURS_START=22:00
- QUIET_HOURS_END=07:00
- CORS_ORIGINS=http://localhost:5173

Frontend (frontend/.env):
- VITE_API_BASE_URL=http://localhost:4000/api

## 6) Notas de arquitectura

Backend:
- domain: entidades + reglas
- application: casos de uso + puertos
- infrastructure: adaptadores (mongo, jwt, providers)
- interfaces: rutas/controladores HTTP

Frontend:
- domain: entidades + contratos de repositorio
- application: casos de uso
- infrastructure: repositorios API
- presentation: paginas, hooks, componentes

## 7) Auth y roles

Roles:
- GOD, ADMIN, BARBER, CLIENT

Auth:
- JWT via Authorization: Bearer <token>
- Middleware: authenticateJwt + requireRoles

Usuarios demo (seed):
- god@barberia.com / god123
- admin@barberia.com / admin123
- barbero@barberia.com / barbero123
- cliente@barberia.com / cliente123

Flujo de aprobacion:
- Clientes se registran como pending (approved=false).
- GOD revisa pendientes y aprueba acceso.
- Usuarios pendientes ven /waiting hasta aprobar.

## 8) Notificaciones WhatsApp

- Provider: mock por default, BullMQ opcional
- Quiet hours: se respetan
- Logs: en memoria y en Mongo cuando esta conectado
- Debounce: configurable via app config
- Job de recordatorios: scheduler BullMQ cada 5 minutos

## 9) Admin UI

Rutas (frontend):
- /admin (dashboard)
- /admin/users
- /admin/services
- /admin/appointments
- /admin/agenda
- /admin/notifications
- /admin/reports

## 10) UI Cliente + Barbero

- /client (dashboard cliente)
- /barber (dashboard barbero)
- /profile (perfil + consentimiento WhatsApp)
- /register (registro cliente)
- /password (recuperacion de clave)

## 11) Persistencia de datos

Modelos Mongo:
- User
- Service
- Appointment
- BarberSchedule
- BarberBlock
- WhatsAppLog
- AppointmentHistory

Fallback:
- base en memoria en backend/src/shared/infrastructure/memory/database.ts

## 12) Jobs

- WhatsApp queue worker (BullMQ)
- Appointment reminders scheduler (BullMQ)

Habilitar:
- ENABLE_JOBS=true
- WHATSAPP_PROVIDER=bullmq (envio por cola)
- REDIS_URL=redis://localhost:6379 (Redis activo)

## 13) Testing

- Backend: npm test (node --test)
- Build check: npm run build

## 14) Flujos comunes

Cliente:
- Register -> Login -> Book -> Cancel/Reschedule

Barbero:
- Login -> Set schedules -> Add blocks -> Confirm/Complete

Admin:
- Manage users/services -> Reassign -> Review logs

## 15) Troubleshooting

- 403 CORS: agrega origen en CORS_ORIGINS
- Mongo fallback: revisa MONGODB_URI + USE_MONGO
- Jobs no corren: revisa ENABLE_JOBS + REDIS_URL
- Reminders no salen: citas deben estar en Mongo (no en memoria)
