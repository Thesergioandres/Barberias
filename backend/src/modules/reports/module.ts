import { createReportsRoutes } from './interfaces/http/reportsRoutes';
import type { authenticateJwt } from '../../shared/interfaces/http/middlewares/authenticateJwt';
import type { requireRoles } from '../../shared/interfaces/http/middlewares/requireRoles';

export function createReportsModule({
  usersRepository,
  servicesRepository,
  appointmentsRepository,
  authenticateJwt: authMiddleware,
  requireRoles: requireRolesMiddleware
}: {
  usersRepository: { list(tenantId: string, role?: string): Promise<Array<{ id: string; role: string }>> };
  servicesRepository: { list(tenantId: string, options?: { onlyActive?: boolean }): Promise<Array<{ id: string; price?: number }>> };
  appointmentsRepository: { list(tenantId: string, filters?: { clientId?: string; barberId?: string }): Promise<Array<{ id: string; status: string; clientId: string; barberId: string }>> };
  authenticateJwt: ReturnType<typeof authenticateJwt>;
  requireRoles: typeof requireRoles;
}) {
  const getSummary = async (tenantId: string) => {
    const [users, services, appointments] = await Promise.all([
      usersRepository.list(tenantId),
      servicesRepository.list(tenantId),
      appointmentsRepository.list(tenantId)
    ]);

    const byStatus = appointments.reduce<Record<string, number>>((acc, appointment) => {
      acc[appointment.status] = (acc[appointment.status] || 0) + 1;
      return acc;
    }, {});

    const barbersCount = users.filter(u => u.role === 'BARBER').length;
    const productivity = barbersCount > 0 ? +(appointments.length / barbersCount).toFixed(1) : 0;
    
    // Asumimos un aproximado de 8 citas máximas por barbero al día.
    const occupancy = barbersCount > 0 
      ? Math.min(100, Math.round((appointments.length / (barbersCount * 8)) * 100)) + '%'
      : '0%';

    const clientCounts: Record<string, number> = {};
    appointments.forEach(apt => {
      if (apt.clientId) {
        clientCounts[apt.clientId] = (clientCounts[apt.clientId] || 0) + 1;
      }
    });
    
    const uniqueClients = Object.keys(clientCounts).length;
    const returningClients = Object.values(clientCounts).filter(c => c > 1).length;
    const retention = uniqueClients > 0 ? Math.round((returningClients / uniqueClients) * 100) + '%' : '0%';

    return {
      totals: {
        users: users.length,
        services: services.length,
        appointments: appointments.length
      },
      appointmentsByStatus: byStatus,
      analytics: {
        productivity: `${productivity} citas / barbero`,
        occupancy,
        retention
      }
    };
  };

  const reportsRoutes = createReportsRoutes({
    getSummary,
    authenticateJwt: authMiddleware,
    requireRoles: requireRolesMiddleware
  });

  return { reportsRoutes };
}
