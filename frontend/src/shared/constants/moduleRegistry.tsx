import type { ReactElement } from 'react';
import { AdminAgendaPage } from '../../modules/admin/pages/AdminAgendaPage';
import { AdminTeamPage } from '../../modules/admin/pages/AdminTeamPage';
import { AdminBranchesPage } from '../../modules/admin/pages/AdminBranchesPage';
import { AdminWhatsAppPage } from '../../modules/admin/pages/AdminWhatsAppPage';
import { AdminInventoryPage } from '../../modules/admin/pages/AdminInventoryPage';
import { AdminReportsPage } from '../../modules/admin/pages/AdminReportsPage';
import { AdminServicesPage } from '../../modules/admin/presentation/pages/AdminServicesPage';
import { AdminPOSPage } from '../../modules/admin/pages/AdminPOSPage';
import { StaffDashboardPage } from '../../modules/staff/presentation/pages/StaffDashboardPage';
import { ModulePlaceholder } from '../components/ModulePlaceholder';
import type { AppModule } from '../types/appModules';

export type ModuleKey = Extract<
  AppModule,
  'agenda' | 'staff' | 'inventory' | 'pos' | 'commissions' | 'digital_menu' | 'services'
> | 'branches' | 'whatsapp' | 'reports';

export type ModuleRegistryEntry = {
  key: ModuleKey;
  label: string;
  adminPath?: string;
  adminElement?: ReactElement;
  staffPath?: string;
  staffElement?: ReactElement;
  staffLabel?: string;
};

export const moduleRegistry: Record<ModuleKey, ModuleRegistryEntry> = {
  agenda: {
    key: 'agenda',
    label: 'Agenda viva',
    adminPath: '/admin/agenda',
    adminElement: <AdminAgendaPage />
  },
  staff: {
    key: 'staff',
    label: 'Equipo',
    adminPath: '/admin/team',
    adminElement: <AdminTeamPage />,
    staffPath: '/staff/dashboard',
    staffElement: <StaffDashboardPage />,
    staffLabel: 'Staff'
  },
  branches: {
    key: 'branches',
    label: 'Sedes',
    adminPath: '/admin/branches',
    adminElement: <AdminBranchesPage />
  },
  whatsapp: {
    key: 'whatsapp',
    label: 'WhatsApp',
    adminPath: '/admin/whatsapp',
    adminElement: <AdminWhatsAppPage />
  },
  inventory: {
    key: 'inventory',
    label: 'Inventario',
    adminPath: '/admin/inventory',
    adminElement: <AdminInventoryPage />
  },
  reports: {
    key: 'reports',
    label: 'Cierre diario',
    adminPath: '/admin/reports',
    adminElement: <AdminReportsPage />
  },
  services: {
    key: 'services',
    label: 'Servicios',
    adminPath: '/admin/services',
    adminElement: <AdminServicesPage />
  },
  pos: {
    key: 'pos',
    label: 'POS',
    adminPath: '/admin/pos',
    adminElement: <AdminPOSPage />
  },
  digital_menu: {
    key: 'digital_menu',
    label: 'Menu digital',
    adminPath: '/admin/digital-menu',
    adminElement: (
      <ModulePlaceholder
        title="Menu digital"
        description="Catalogo interactivo para clientes y QR en mesas."
      />
    )
  },
  commissions: {
    key: 'commissions',
    label: 'Comisiones',
    adminPath: '/admin/commissions',
    adminElement: (
      <ModulePlaceholder
        title="Comisiones"
        description="Panel para incentivos, metas y liquidacion del equipo."
      />
    )
  }
};
