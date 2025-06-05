import * as crypto from 'crypto';
import { getEnv } from './getEnv';

const encryptionKey = getEnv('ENCRYPTION_KEY');

const key = crypto.createHash('sha256').update(encryptionKey).digest('hex');

class Encryption {
  private key: Buffer;
  constructor(key: string) {
    this.key = Buffer.from(key, 'hex');
  }
  encrypt(text: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');

    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
  }
  decrypt(encryptedText: string) {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv);
    let decrypted = decipher.update(parts[1], 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
  hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }
}

export const encryption = new Encryption(key);
