Gemini ha dicho
Esta es la Documentación Maestra de tu nuevo proyecto: BarberSync SaaS. He estructurado el documento siguiendo la misma lógica de "Poder Absoluto" de tu ERP anterior, escalable para múltiples negocios y con un enfoque agresivo en automatización por WhatsApp.

📘 Especificación Técnica: BarberSync SaaS
Sistema Multi-Tenant de Agendamiento y Gestión de Barberías

1. Arquitectura del Sistema (Estructura de Poder)
   El sistema opera bajo un modelo SaaS Multi-tenant. Un solo despliegue de código sirve a infinitos negocios de forma aislada.

1.1 Niveles de Acceso
Nivel GOD (Super Admin): Dueño de la plataforma. Controla suscripciones, límites de los planes y salud global de la API de WhatsApp.

Nivel Business Admin (Dueño de Barbería): Administra su propio ecosistema (Sedes, Barberos, Servicios).

Nivel Staff (Barbero): Gestiona su agenda personal y atención al cliente.

Nivel Cliente: Usuario final que reserva servicios.

2. Roles y Permisos Detallados
   2.1 Rol GOD
   Gestión de Tenants: Crear, suspender y activar negocios.

Editor de Planes: Definir límites (ej. Plan Básico: 1 Sede / 2 Barberos).

Monitor de Mensajería: Visualizar el log global de WhatsApp y balance de costos de la API.

Análisis Macro: Ver ganancias totales por cobro de suscripciones.

2.2 Administrador de Negocio (Tenant Admin)
Multi-Sede: Crear y gestionar diferentes locales físicos.

Catálogo de Servicios: Definir precios y tiempos de ejecución (ej. Corte: 30 min, Barba: 20 min).

Gestión de Staff: Contratar/Despedir barberos en el sistema y asignarles una sede.

Configuración de Reglas: Definir margen de cancelación (ej. "No se puede cancelar 1 hora antes").

2.3 Barbero (Staff)
Agenda Dinámica: Vista diaria/semanal de sus citas asignadas.

Bloqueos Manuales: Marcar tiempos de almuerzo o permisos personales para que no le agenden.

Control de Cita: Cambiar estado a COMPLETADA o NO_ASISTIO.

2.4 Cliente (User)
Booking Engine: Interfaz para elegir Sede -> Servicio -> Barbero -> Fecha/Hora.

Mis Citas: Historial y gestión de reprogramación.

3. El Motor de Agendamiento (Reglas Lógicas)
   Este es el "cerebro" que evita que dos personas se corten el cabello con el mismo barbero al mismo tiempo.

RN-01 (Cálculo de Slots): El sistema calcula la disponibilidad basada en Hora_Inicio + Duración_Servicio. Si un servicio dura 40 min, el slot siguiente se abre automáticamente a los 40 min.

RN-02 (Buffer Time): (Configurable) Añadir 5-10 minutos automáticos entre citas para limpieza de herramientas.

RN-03 (Colisión Multi-Sede): Si un barbero rota entre sedes, su agenda es global. Si está ocupado en la Sede A, el sistema bloquea automáticamente ese horario en la Sede B.

4. Ecosistema de Notificaciones WhatsApp
   El sistema no usa correos; usa WhatsApp como canal principal para asegurar una tasa de apertura del 98%.

Evento Destinatario Contenido del Mensaje
Nueva Reserva Cliente "¡Hola! Tu cita en {Barbería} ha sido agendada para el {Fecha}."
Nueva Cita Barbero "{Barbero}, tienes un nuevo cliente: {Cliente} a las {Hora}."
Recordatorio Cliente "Faltan 2 horas para tu cita. Te esperamos en {Dirección_Sede}."
Cancelación Ambas partes "Cita cancelada. {Cliente}, puedes re-agendar aquí: {Link}."
Post-Venta Cliente "Gracias por visitarnos. Califica a {Barbero} aquí: {Link_Reseña}." 5. Modelo de Datos (Entidades Core)
5.1 Business (Tenant)
id, name, slug (ej: barberia-el-god), plan_type (Basic/Pro/God), status (Active/Inactive).

5.2 Appointments (Citas)
id, business_id, branch_id, client_id, barber_id, service_id.

start_time, end_time, status (PENDING, CONFIRMED, COMPLETED, CANCELLED, NOSHOW).

5.3 WhatsAppLogs
id, business_id, phone_to, message_body, status (Sent/Failed), error_msg.

6. Dashboard de Analíticas (Admin de Negocio)
   Para que el dueño del negocio sienta que tiene el control total:

Productividad por Barbero: Quién genera más dinero y quién tiene más "No asistió".

Ocupación de Agenda: Porcentaje de tiempo que la barbería está produciendo vs. tiempo muerto.

Retención de Clientes: Cuántos clientes regresan después de su primera cita.

7. Flujo de Implementación Propuesto
   Fase 1 (Core): Autenticación Multi-tenant y creación de perfiles.

Fase 2 (Inventario de Tiempo): Configuración de horarios y servicios.

Fase 3 (Booking): Algoritmo de reserva y validación de colisiones.

Fase 4 (WhatsApp): Integración con el proveedor de mensajería (Twilio/Meta).

Fase 5 (GOD Panel): Herramientas de control de suscripciones y límites.

8. El Factor Diferencial (Tu ventaja competitiva)
   A diferencia de un agendador normal, BarberSync hereda la lógica de tu ERP:

Pre-registro de Deudas: Si un cliente cancela muchas veces, el sistema puede exigir un abono previo (vía link de pago) para dejarlo reservar de nuevo.

Inteligencia de Negocio: Reportes de "Pérdida por No-Asistencia" (cuánto dinero dejó de ganar la barbería hoy por citas fallidas).
