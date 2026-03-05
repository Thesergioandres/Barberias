import type { AppModule } from '../types/appModules';

export type VerticalConfig = {
  slug: string;
  name: string;
  activeModules: AppModule[];
  labels: {
    staff: string;
    service: string;
    [key: string]: string;
  };
};

export const VERTICALS_REGISTRY: VerticalConfig[] = [
  {
    slug: 'barberias',
    name: 'Barberias',
    activeModules: ['agenda', 'staff', 'services', 'inventory', 'pos', 'commissions'],
    labels: { staff: 'Barbero', service: 'Servicio' }
  },
  {
    slug: 'salones-belleza',
    name: 'Salones de belleza',
    activeModules: ['agenda', 'staff', 'services', 'inventory', 'pos', 'commissions'],
    labels: { staff: 'Estilista', service: 'Servicio' }
  },
  {
    slug: 'estetica-avanzada',
    name: 'Centros de estetica avanzada',
    activeModules: ['agenda', 'staff', 'services', 'inventory', 'pos', 'commissions'],
    labels: { staff: 'Especialista', service: 'Tratamiento' }
  },
  {
    slug: 'spas-relajacion',
    name: 'Spas y centros de relajacion',
    activeModules: ['agenda', 'staff', 'services', 'inventory', 'pos', 'subscriptions'],
    labels: { staff: 'Terapeuta', service: 'Sesion' }
  },
  {
    slug: 'depilacion-laser',
    name: 'Centros de depilacion laser',
    activeModules: ['agenda', 'staff', 'services', 'inventory', 'pos'],
    labels: { staff: 'Especialista', service: 'Tratamiento' }
  },
  {
    slug: 'restaurantes',
    name: 'Restaurantes',
    activeModules: ['tables', 'pos', 'inventory', 'kitchen_display', 'digital_menu', 'staff'],
    labels: { staff: 'Mesero', service: 'Plato' }
  },
  {
    slug: 'discotecas-bares',
    name: 'Discotecas y bares nocturnos',
    activeModules: ['tables', 'pos', 'inventory', 'staff'],
    labels: { staff: 'Bartender', service: 'Consumo' }
  },
  {
    slug: 'gestor-gastos',
    name: 'Gestor de gastos',
    activeModules: ['accounting', 'pos'],
    labels: { staff: 'Analista', service: 'Movimiento' }
  },
  {
    slug: 'habitos',
    name: 'Habitos',
    activeModules: ['subscriptions', 'progress_tracking'],
    labels: { staff: 'Coach', service: 'Plan' }
  },
  {
    slug: 'veterinarias',
    name: 'Veterinarias',
    activeModules: ['agenda', 'staff', 'services', 'inventory', 'pos'],
    labels: { staff: 'Veterinario', service: 'Consulta' }
  },
  {
    slug: 'veterinarias-campo',
    name: 'Veterinarias de campo',
    activeModules: ['agenda', 'staff', 'services', 'inventory', 'assets_management'],
    labels: { staff: 'Veterinario', service: 'Visita' }
  },
  {
    slug: 'farmacias',
    name: 'Farmacias',
    activeModules: ['inventory', 'pos', 'accounting'],
    labels: { staff: 'Farmaceutico', service: 'Producto' }
  },
  {
    slug: 'opticas',
    name: 'Opticas',
    activeModules: ['inventory', 'pos', 'services', 'staff'],
    labels: { staff: 'Optometrista', service: 'Examen' }
  },
  {
    slug: 'clinicas',
    name: 'Clinicas',
    activeModules: ['agenda', 'staff', 'services', 'inventory', 'pos'],
    labels: { staff: 'Medico', service: 'Consulta' }
  },
  {
    slug: 'clinicas-odontologia',
    name: 'Clinicas de odontologia',
    activeModules: ['agenda', 'staff', 'services', 'inventory', 'pos'],
    labels: { staff: 'Odontologo', service: 'Tratamiento' }
  },
  {
    slug: 'psicologia',
    name: 'Consultorios de psicologia',
    activeModules: ['agenda', 'staff', 'services', 'subscriptions'],
    labels: { staff: 'Psicologo', service: 'Sesion' }
  },
  {
    slug: 'inventarios-pos',
    name: 'Inventarios y ventas POS',
    activeModules: ['inventory', 'pos', 'accounting'],
    labels: { staff: 'Cajero', service: 'Producto' }
  },
  {
    slug: 'tiendas-agropecuarias',
    name: 'Tiendas agropecuarias',
    activeModules: ['inventory', 'pos', 'accounting'],
    labels: { staff: 'Asesor', service: 'Producto' }
  },
  {
    slug: 'tiendas-ropa-calzado',
    name: 'Tiendas de ropa y calzado',
    activeModules: ['inventory', 'pos', 'accounting'],
    labels: { staff: 'Vendedor', service: 'Producto' }
  },
  {
    slug: 'ferreterias',
    name: 'Ferreterias',
    activeModules: ['inventory', 'pos', 'accounting'],
    labels: { staff: 'Asesor', service: 'Producto' }
  },
  {
    slug: 'papelerias-librerias',
    name: 'Papelerias y librerias',
    activeModules: ['inventory', 'pos', 'accounting'],
    labels: { staff: 'Asesor', service: 'Producto' }
  },
  {
    slug: 'regalos-floristerias',
    name: 'Tiendas de regalos y floristerias',
    activeModules: ['inventory', 'pos', 'accounting'],
    labels: { staff: 'Vendedor', service: 'Producto' }
  },
  {
    slug: 'tiendas-conveniencia',
    name: 'Tiendas de conveniencia',
    activeModules: ['inventory', 'pos', 'accounting'],
    labels: { staff: 'Cajero', service: 'Producto' }
  },
  {
    slug: 'colegios-universidades',
    name: 'Colegios o universidades',
    activeModules: ['subscriptions', 'progress_tracking', 'staff', 'access_control', 'tasks'],
    labels: { staff: 'Docente', service: 'Programa' }
  },
  {
    slug: 'academias-idiomas',
    name: 'Academias de idiomas',
    activeModules: ['subscriptions', 'progress_tracking', 'staff', 'tasks'],
    labels: { staff: 'Instructor', service: 'Curso' }
  },
  {
    slug: 'escuelas-musica-arte',
    name: 'Escuelas de musica y arte',
    activeModules: ['subscriptions', 'progress_tracking', 'staff', 'tasks'],
    labels: { staff: 'Instructor', service: 'Clase' }
  },
  {
    slug: 'bibliotecas-culturales',
    name: 'Bibliotecas y centros culturales',
    activeModules: ['assets_management', 'subscriptions', 'access_control'],
    labels: { staff: 'Bibliotecario', service: 'Prestamo' }
  },
  {
    slug: 'tutorias',
    name: 'Tutorias y clases particulares',
    activeModules: ['agenda', 'staff', 'subscriptions', 'progress_tracking'],
    labels: { staff: 'Tutor', service: 'Sesion' }
  },
  {
    slug: 'autoescuelas',
    name: 'Autoescuelas',
    activeModules: ['agenda', 'staff', 'progress_tracking', 'assets_management'],
    labels: { staff: 'Instructor', service: 'Clase' }
  },
  {
    slug: 'gimnasios',
    name: 'Gimnasios',
    activeModules: ['subscriptions', 'progress_tracking', 'staff', 'access_control'],
    labels: { staff: 'Coach', service: 'Rutina' }
  },
  {
    slug: 'servicio-fit',
    name: 'Servicio fit (rutinas + alimentacion)',
    activeModules: ['subscriptions', 'progress_tracking', 'staff'],
    labels: { staff: 'Coach', service: 'Plan' }
  },
  {
    slug: 'hoteleria',
    name: 'Hoteleria',
    activeModules: ['inventory', 'pos', 'staff', 'access_control', 'subscriptions'],
    labels: { staff: 'Recepcionista', service: 'Reserva' }
  },
  {
    slug: 'alquiler-vacacional',
    name: 'Alquiler vacacional',
    activeModules: ['subscriptions', 'access_control', 'inventory'],
    labels: { staff: 'Host', service: 'Reserva' }
  },
  {
    slug: 'camping-glamping',
    name: 'Camping y glamping',
    activeModules: ['subscriptions', 'access_control', 'inventory'],
    labels: { staff: 'Anfitrion', service: 'Reserva' }
  },
  {
    slug: 'talleres-mecanicos',
    name: 'Talleres mecanicos',
    activeModules: ['agenda', 'staff', 'inventory', 'pos', 'assets_management'],
    labels: { staff: 'Tecnico', service: 'Reparacion' }
  },
  {
    slug: 'despachos-abogados',
    name: 'Despachos de abogados',
    activeModules: ['contracts', 'projects', 'tasks', 'staff', 'accounting'],
    labels: { staff: 'Abogado', service: 'Asesoria' }
  },
  {
    slug: 'estudios-contables',
    name: 'Estudios contables',
    activeModules: ['accounting', 'projects', 'tasks', 'staff'],
    labels: { staff: 'Contador', service: 'Servicio' }
  },
  {
    slug: 'asesores-financieros',
    name: 'Asesores financieros',
    activeModules: ['accounting', 'projects', 'staff'],
    labels: { staff: 'Asesor', service: 'Asesoria' }
  },
  {
    slug: 'gestion-inversiones',
    name: 'Gestion de inversiones',
    activeModules: ['accounting', 'projects', 'staff'],
    labels: { staff: 'Asesor', service: 'Portafolio' }
  },
  {
    slug: 'control-creditos',
    name: 'Control de creditos',
    activeModules: ['accounting', 'contracts', 'staff'],
    labels: { staff: 'Analista', service: 'Credito' }
  },
  {
    slug: 'arquitectos-ingenieros',
    name: 'Arquitectos e ingenieros',
    activeModules: ['projects', 'tasks', 'staff', 'assets_management', 'contracts'],
    labels: { staff: 'Profesional', service: 'Proyecto' }
  },
  {
    slug: 'constructoras',
    name: 'Constructoras',
    activeModules: ['projects', 'tasks', 'staff', 'assets_management', 'contracts'],
    labels: { staff: 'Supervisor', service: 'Obra' }
  },
  {
    slug: 'inmobiliarias',
    name: 'Inmobiliarias',
    activeModules: ['contracts', 'projects', 'staff', 'assets_management'],
    labels: { staff: 'Agente', service: 'Propiedad' }
  },
  {
    slug: 'administracion-fincas',
    name: 'Administradores de fincas y edificios',
    activeModules: ['assets_management', 'contracts', 'tasks', 'staff'],
    labels: { staff: 'Administrador', service: 'Contrato' }
  },
  {
    slug: 'agencias-marketing',
    name: 'Agencias de marketing',
    activeModules: ['projects', 'tasks', 'staff', 'assets_management'],
    labels: { staff: 'Especialista', service: 'Campana' }
  },
  {
    slug: 'fotografos-videografos',
    name: 'Fotografos y videografos',
    activeModules: ['projects', 'tasks', 'staff', 'assets_management'],
    labels: { staff: 'Fotografo', service: 'Sesion' }
  },
  {
    slug: 'organizadores-eventos',
    name: 'Organizadores de eventos',
    activeModules: ['projects', 'tasks', 'staff', 'inventory'],
    labels: { staff: 'Productor', service: 'Evento' }
  },
  {
    slug: 'mudanzas-fletes',
    name: 'Mudanzas y fletes',
    activeModules: ['projects', 'tasks', 'staff', 'assets_management', 'inventory'],
    labels: { staff: 'Operador', service: 'Servicio' }
  },
  {
    slug: 'mensajeria-ultima-milla',
    name: 'Mensajeria y ultima milla',
    activeModules: ['projects', 'tasks', 'staff', 'assets_management'],
    labels: { staff: 'Mensajero', service: 'Envio' }
  },
  {
    slug: 'gestion-flotas',
    name: 'Gestion de flotas',
    activeModules: ['assets_management', 'projects', 'staff'],
    labels: { staff: 'Coordinador', service: 'Ruta' }
  },
  {
    slug: 'alquiler-vehiculos',
    name: 'Alquiler de vehiculos',
    activeModules: ['assets_management', 'contracts', 'pos', 'inventory', 'staff'],
    labels: { staff: 'Agente', service: 'Reserva' }
  },
  {
    slug: 'parqueaderos',
    name: 'Parqueaderos',
    activeModules: ['pos', 'staff', 'access_control'],
    labels: { staff: 'Operador', service: 'Ingreso' }
  },
  {
    slug: 'alquiler-mobiliario-sonido',
    name: 'Alquiler de mobiliario y sonido',
    activeModules: ['inventory', 'pos', 'contracts', 'staff'],
    labels: { staff: 'Tecnico', service: 'Alquiler' }
  },
  {
    slug: 'teatros-cines',
    name: 'Teatros y cines independientes',
    activeModules: ['pos', 'inventory', 'staff', 'access_control'],
    labels: { staff: 'Taquillero', service: 'Funcion' }
  },
  {
    slug: 'parques-atracciones',
    name: 'Parques de atracciones',
    activeModules: ['pos', 'inventory', 'staff', 'access_control'],
    labels: { staff: 'Operador', service: 'Entrada' }
  },
  {
    slug: 'servicios-domesticos',
    name: 'Servicios domesticos',
    activeModules: ['agenda', 'staff', 'services', 'subscriptions'],
    labels: { staff: 'Operador', service: 'Servicio' }
  },
  {
    slug: 'cuidadores-adultos',
    name: 'Cuidadores de adultos mayores',
    activeModules: ['agenda', 'staff', 'services', 'subscriptions'],
    labels: { staff: 'Cuidador', service: 'Servicio' }
  },
  {
    slug: 'paseadores-perros',
    name: 'Paseadores de perros',
    activeModules: ['agenda', 'staff', 'services'],
    labels: { staff: 'Paseador', service: 'Paseo' }
  },
  {
    slug: 'reparaciones-hogar',
    name: 'Reparaciones del hogar',
    activeModules: ['agenda', 'staff', 'services', 'inventory'],
    labels: { staff: 'Tecnico', service: 'Servicio' }
  },
  {
    slug: 'fincas-cultivos',
    name: 'Fincas y cultivos',
    activeModules: ['assets_management', 'inventory', 'projects', 'staff'],
    labels: { staff: 'Operador', service: 'Actividad' }
  },
  {
    slug: 'guias-turisticos',
    name: 'Guias turisticos',
    activeModules: ['agenda', 'staff', 'services'],
    labels: { staff: 'Guia', service: 'Tour' }
  },
  {
    slug: 'agencias-viajes',
    name: 'Agencias de viajes',
    activeModules: ['projects', 'staff', 'services', 'contracts'],
    labels: { staff: 'Agente', service: 'Paquete' }
  },
  {
    slug: 'ecommerce',
    name: 'Tienda en Linea',
    activeModules: ['ecommerce_storefront', 'shopping_cart', 'order_management', 'inventory', 'shipping_tracking'],
    labels: { staff: 'Asesor', service: 'Producto', category: 'Categoria' }
  },
  {
    slug: 'marketplace',
    name: 'Marketplace Multi-Vendedor',
    activeModules: ['ecommerce_storefront', 'shopping_cart', 'order_management', 'inventory', 'shipping_tracking', 'multi_vendor', 'commissions'],
    labels: { staff: 'Vendedor/Tienda', service: 'Publicacion', category: 'Departamento' }
  }
];
