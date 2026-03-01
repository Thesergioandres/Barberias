import bcrypt from 'bcryptjs';
import type { PasswordHasher } from '../../application/ports/PasswordHasher';

export class BcryptPasswordHasher implements PasswordHasher {
  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
