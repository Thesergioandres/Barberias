import type { UserRepository } from '../../application/ports/UserRepository';
import { User } from '../../domain/entities/User';
import { database } from '../../../../shared/infrastructure/memory/database';

export class InMemoryUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = database.users.find((item) => item.email === email && item.active);
    return user ? new User(user) : null;
  }

  async findByResetToken(tokenHash: string): Promise<User | null> {
    const now = Date.now();
    const user = database.users.find(
      (item) => item.resetTokenHash === tokenHash && !!item.resetTokenExpiresAt && new Date(item.resetTokenExpiresAt).getTime() > now
    );
    return user ? new User(user) : null;
  }

  async setResetToken(userId: string, tokenHash: string, expiresAt: string): Promise<User | null> {
    const user = database.users.find((item) => item.id === userId);
    if (!user) {
      return null;
    }

    user.resetTokenHash = tokenHash;
    user.resetTokenExpiresAt = expiresAt;
    return new User(user);
  }

  async clearResetToken(userId: string): Promise<User | null> {
    const user = database.users.find((item) => item.id === userId);
    if (!user) {
      return null;
    }

    user.resetTokenHash = null;
    user.resetTokenExpiresAt = null;
    return new User(user);
  }

  async update(id: string, input: { passwordHash?: string; resetTokenHash?: string | null; resetTokenExpiresAt?: string | null }): Promise<User | null> {
    const user = database.users.find((item) => item.id === id);
    if (!user) {
      return null;
    }

    if (input.passwordHash !== undefined) user.passwordHash = input.passwordHash;
    if (input.resetTokenHash !== undefined) user.resetTokenHash = input.resetTokenHash;
    if (input.resetTokenExpiresAt !== undefined) user.resetTokenExpiresAt = input.resetTokenExpiresAt;
    return new User(user);
  }
}
