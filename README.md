
# Barbería Fullstack - Plataforma de Gestión (Producción)

Plataforma completa para la gestión integral de una barbería y sector de cuidado personal. Incluye agenda, notificaciones enviadas por WhatsApp, gestión de servicios, y paneles administrativos basados en roles (RBAC).
Este repositorio contiene tanto el frontend como el backend desarrollados bajo un enfoque **modular** y con arquitectura limpia (Hexagonal en backend, Clean Architecture en frontend).

## 🚀 Tecnologías Principales (Stack)

### Frontend (Workspace `frontend`)

- **Core**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Estilos**: Tailwind CSS 4
- **Enrutamiento**: React Router 7
- **Animaciones**: Framer Motion

### Backend (Workspace `backend`)

- **Core**: Node.js (>=18) + Express 4 + TypeScript
- **Base de Datos**: MongoDB (Driver: Mongoose)
- **Caché y Colas**: Redis + BullMQ (Opcional, para jobs en segundo plano)
- **Seguridad y Autenticación**: JWT (JSON Web Tokens), bcryptjs, Helmet, Express Rate Limit
- **Documentación de API**: Swagger (OpenAPI)

### Infraestructura y Despliegue

- **Producción Principal**: Railway (Hooks de despliegue configurados)
- **Legacy o VPS**: Docker Compose + Nginx proxy
- **CI/CD**: GitHub Actions

---

## 🏗 Arquitectura del Proyecto

El proyecto está diseñado como un **Monorepo** gestionado con npm workspaces (`package.json` raíz). La comunicación entre front y back se da vía API REST.

### Backend: Arquitectura Hexagonal y Diseño Modular

Se ubica en `backend/src/modules`. Cada módulo de la aplicación está estrictamente separado en capas:

- **`domain`**: Entidades core y reglas de negocio puras. Sin dependencias externas.
- **`application`**: Casos de uso de la aplicación y definición de puertos (interfaces / contratos).
- **`infrastructure`**: Implementación de los adaptadores (JWT, base de datos Mongo, repoditorios, drivers HTTP).
- **`interfaces`**: Controladores de entrada/salida HTTP, middlewares locales y rutas Express.

**Módulos del Backend:**

1. **`appointments`**: Gestión completa de reservas. Permite agendar, reprogramar, cancelar, reasignar citas y revisar el historial.
2. **`auth`**: Autenticación segura, recuperación de contraseñas, login y perfil.
3. **`users`**: Gestión de usuarios, roles (RBAC), aprobaciones del administrador Dios (GOD) y controles de consentimiento corporativo (WhatsApp).
4. **`barbers`**: Perfiles de barberos, disponibilidad de horarios, ausencias o bloqueos en agenda.
5. **`services`**: Catálogo de servicios ofrecidos (cortes, barba, etc.) con sus precios y duración.
6. **`notifications`**: Integración con proveedores de mensajería (WhatsApp), encolamiento de mensajes vía BullMQ y logs de envío.
7. **`reports`**: Generación de reportes operativos y resúmenes financieros/estadísticos de la barbería.

### Frontend: Clean Architecture Modular

Se ubica en `frontend/src/modules`. Cada dominio visual y lógico sigue una estructura por capas para máximo desacoplamiento:

- **`domain`**: Tipos, interfaces de entidades y modelos del frontend.
- **`application`**: Lógica asíncrona, hooks de manejo de estado y casos de uso.
- **`infrastructure`**: Clientes API, adaptadores de fetch, almacenamiento local.
- **`presentation`**: Componentes UI, páginas completas, y hooks puramente visuales.

**Módulos del Frontend:**

1. **`admin`**: Páginas exclusivas para el rol GOD/ADMIN para gestión avanzada (aprobaciones pendentes, revisión general, reportes).
2. **`appointments`**: Calendario interactivo, formulario de agendamiento y mis reservas.
3. **`auth`**: Vistas de login, registro, olvidó su contraseña.
4. **`barber`**: Panel del barbero para verificar sus citas próximas y gestionar disponibilidades.
5. **`client`**: Panel del cliente regular para ver y gestionar sus propios cortes.
6. **`services`**: Catálogo visual de servicios para el usuario y gestión para el administrador.
7. **`users`**: UI del perfil de usuario y configuraciones.
8. **`info`**: Páginas de información estática y soporte.

---

## 🛡 Roles y Privilegios (RBAC)

El sistema soporta una jerarquía estricta de accesos:

- **`GOD`**: Superadministrador. Acceso a reportes, aprobación de nuevos usuarios y control total.
- **`ADMIN`**: Administrador de la sucursal.
- **`BARBER`**: Profesional de la barbería. Puede ver y gestionar su agenda de turnos.
- **`CLIENT`**: Cliente regular, puede agendar citas, reprogramar (según reglas) y cancelar.

### Flujo de Aprobación de Usuarios

1. Los nuevos usuarios se registran como inactivos/pendientes (`approved = false`).
2. Tienen acceso únicamente a la vista de "sala de espera" (`/waiting`).
3. El usuario `GOD` revisa la solicitud en el panel `/admin/approvals` y aprueba el acceso.
4. Una vez aprobado, el usuario ingresa a su flujo normal (Client o Barber).

---

## 💻 Desarrollo Local

### 1. Prerequisitos iniciales

Clona el repositorio e instala las dependencias usando npm (reconocerá los workspaces automáticamente):

```bash
npm install
```

### 2. Variables de entorno (Environment)

Necesitas crear los archivos `.env` basándote en los templates proporcionados:

- Copiar `backend/.env.example` -> `backend/.env`
- Copiar `frontend/.env.example` -> `frontend/.env`

**Principales Variables:**

- **Backend:** `MONGODB_URI`, `JWT_SECRET`, `PORT`, `REDIS_URL` (opcional), `WHATSAPP_PROVIDER`. Configuración de reglas de negocio (`MIN_ADVANCE_MINUTES`, `CANCEL_LIMIT_MINUTES`).
- **Frontend:** `VITE_API_BASE_URL` (Apunta a `http://localhost:4000/api` en desarrollo local).

### 3. Levantar los Servicios

El proyecto cuenta con scripts de concurrencia para arrancar ambos servicios simultáneamente:

```bash
npm run dev
```

Los servicios estarán disponibles en:

- **Aplicación Web (Front)**: [http://localhost:5173](http://localhost:5173)
- **API Server (Back)**: [http://localhost:4000](http://localhost:4000)
- **Swagger Docs (Back)**: [http://localhost:4000/docs](http://localhost:4000/docs)

_Alternativa para correr individualmente:_ `npm run dev:backend` o `npm run dev:frontend`.

---

## 🐳 Docker (VPS o Legacy)

Puedes correr toda la pila tecnológica localmente a través de contenedores:

```bash
docker compose up --build
```

Servicios que levanta Docker Compose:

- **Nginx (proxy inverso)**: `http://localhost` (Maneja el frontend estático)
- **Node.js Backend**: `http://localhost:4000`
- **MongoDB**: Expuesto en puerto `27017`
- **Redis**: Expuesto en puerto `6379`

---

## ⚡ Colas y Procesador en Segundo Plano (Jobs / Redis)

En desarrollo local, el sistema de jobs con BullMQ está desactivado por defecto para facilitar pruebas simples.
Para habilitarlo (y simular el entorno de producción al 100%):

1. Levantar una instancia local de Redis (o por el `docker-compose.yml`).
2. Configurar en `backend/.env`:
   - `ENABLE_JOBS=true`
   - `REDIS_URL=redis://localhost:6379`
   - `WHATSAPP_PROVIDER=bullmq` (o provider de producción en vez de `mock`).

---

## 📝 Guía de Contribución y Buenas Prácticas

1. **Nueva Funcionalidad (Feature):** Crea un nuevo módulo bajo la filosofía modular. Backend en `backend/src/modules/{feature}` y frontend en `frontend/src/modules/{feature}`.
2. **Dependencias Direccionales:** `interfaces` (o `presentation`) depende de `application`, y este último de `domain`. El dominio **nunca** debe importar librerías externas ni utilidades de infraestructura asíncronas.
3. **Controladores delgados:** Mantén Express y React lo más enfocados en la vista/HTTP posible. Toda regla de negocio debe ir en los Use Cases de `application`.
4. **Variables de Entorno:** Si agregas una llave nueva a `.env`, debes reflejarlo también en `.env.example`.

## 📚 Documentación Adjunta de Referencia

Dentro del repositorio, se cuenta con material adicional:

- **`backend/README.md`**: Detalles profundos sobre configuraciones, seguridad y arquitectura del servidor.
- **`frontend/README.md`**: Referencia específica para React, Tailwind, Vite.
- **`docs/DEVELOPER_GUIDE.md`**: Guía paso a paso para añadir entidades, dtos, hooks, etc.
- **`docs/API_REFERENCE.md`**: Modelos de REST, headers estandar, formatos de error.
- **`DOCUMENTACION_MVP_AGENDAMIENTO.md`**: Registro histórico de avances y alcance inicial del MVP.
- **`RAILWAY_DEPLOY.md`**: Pasos exactos para despliegue en entornos Serverless de Railway.
