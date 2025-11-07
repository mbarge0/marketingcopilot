import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32-character key
const ALGORITHM = 'aes-256-cbc';

/**
 * Encrypts a token using AES-256-CBC
 * Returns: iv:encrypted (hex strings)
 */
export function encryptToken(token: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  const key = Buffer.from(ENCRYPTION_KEY.substring(0, 32), 'utf8');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts a token encrypted with encryptToken
 * Input format: iv:encrypted (hex strings)
 */
export function decryptToken(encryptedToken: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  const [ivHex, encrypted] = encryptedToken.split(':');
  if (!ivHex || !encrypted) {
    throw new Error('Invalid encrypted token format');
  }

  const key = Buffer.from(ENCRYPTION_KEY.substring(0, 32), 'utf8');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

