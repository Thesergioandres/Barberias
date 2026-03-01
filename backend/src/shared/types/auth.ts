import type { UserRole } from '../domain/roles';

export type AuthPayload = {
  sub: string;
  role: UserRole;
  approved: boolean;
  tenantId?: string;
};
