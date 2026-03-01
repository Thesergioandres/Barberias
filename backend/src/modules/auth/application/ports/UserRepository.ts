import type { User } from '../../domain/entities/User';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById?(id: string): Promise<User | null>;
  findByResetToken?(tokenHash: string): Promise<User | null>;
  setResetToken?(userId: string, tokenHash: string, expiresAt: string): Promise<User | null>;
  clearResetToken?(userId: string): Promise<User | null>;
  update?(id: string, input: { passwordHash?: string; resetTokenHash?: string | null; resetTokenExpiresAt?: string | null }): Promise<User | null>;
}
