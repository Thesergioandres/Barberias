# Frontend - Barberia

## Resumen

SPA en React + TypeScript para el sistema de agenda de barberia. Incluye experiencias separadas para admin, barbero y cliente, mas el flujo de aprobacion GOD para nuevos registros.

## Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- React Router 7
- Framer Motion

## Arquitectura

Modulos base: frontend/src/modules

Cada modulo usa capas:
- domain: entidades + contratos de repositorio
- application: casos de uso
- infrastructure: repositorios API
- presentation: paginas, hooks, componentes

Wiring de la app:
- src/app/AppRouter.tsx: rutas
- src/App.tsx: entry UI

## Mapa de carpetas

- src/modules: modulos por feature
- src/shared: UI comun, context, utilidades
- src/app: router + providers
- src/main.tsx: entry de Vite

## Variables de entorno

Crea frontend/.env desde frontend/.env.example.

- VITE_API_BASE_URL=http://localhost:4000/api

## Scripts

Desde /frontend:
- npm run dev: Vite dev server
- npm run build: tsc -b + vite build

Desde la raiz:
- npm run dev: backend + frontend
- npm run build: backend + frontend

## Ejecutar localmente

1) Instala deps en la raiz:

npm install

2) Variables de entorno:
- frontend/.env.example -> frontend/.env

3) Levanta solo el frontend:

npm run dev -w frontend

App:
- http://localhost:5173

## Rutas

Publicas:
- /login
- /register
- /password
- /waiting (aprobacion pendiente)

Admin:
- /admin
- /admin/users
- /admin/approvals (solo GOD)
- /admin/services
- /admin/appointments
- /admin/agenda
- /admin/notifications
- /admin/reports

Cliente:
- /client
- /profile

Barbero:
- /barber

## Auth y flujo de aprobacion

- Register -> aprobacion pendiente
- GOD aprueba en Admin Approvals
- Usuarios aprobados pueden loguear y acceder a rutas por rol

## Troubleshooting

- 401/403: revisa token y rol, o aprobacion pendiente
- CORS: actualiza CORS_ORIGINS en backend
- Errores API: verifica VITE_API_BASE_URL
