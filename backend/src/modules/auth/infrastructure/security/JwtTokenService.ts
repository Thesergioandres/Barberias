import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import type { TokenService, AuthTokenPayload } from '../../application/ports/TokenService';

export class JwtTokenService implements TokenService {
  private readonly secret: string;
  private readonly expiresIn: SignOptions['expiresIn'];

  constructor({ secret, expiresIn }: { secret: string; expiresIn: SignOptions['expiresIn'] }) {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  sign(payload: AuthTokenPayload): string {
    const options: SignOptions = { expiresIn: this.expiresIn };
    return jwt.sign(payload, this.secret as Secret, options);
  }
}
