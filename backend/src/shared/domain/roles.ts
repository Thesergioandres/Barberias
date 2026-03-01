export const UserRole = {
  GOD: 'GOD',
  ADMIN: 'ADMIN',
  BARBER: 'BARBER',
  CLIENT: 'CLIENT'
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
