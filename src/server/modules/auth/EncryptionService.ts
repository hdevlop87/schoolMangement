
import { Injectable } from 'najm-api';
import bcrypt from 'bcrypt'

@Injectable()
export class EncryptionService {
  constructor() { }

  async hashPassword(password) {
    if (!password) return null;
    if (typeof password !== 'string' || password.trim().length === 0) {
      return null;
    }
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

}
