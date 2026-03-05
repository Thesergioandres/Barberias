export const UserRole = {
  GOD: 'GOD',
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CLIENT: 'CLIENT'
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
