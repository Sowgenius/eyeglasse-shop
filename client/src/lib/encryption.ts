import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY!;
const ivLength = 16;

export function encryptUrl(url: string) {
  try {
    const iv = crypto.randomBytes(ivLength);
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encryptedUrl = cipher.update(url, 'utf8', 'hex');
    encryptedUrl += cipher.final('hex');

    return iv.toString('hex') + ':' + encryptedUrl;
  } catch (e) {
    return url;
  }
}

export function decryptUrl(url: string) {
  try {
    const parts = url.split(':');
    if (parts.length !== 2) return url;
    
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedUrl = parts[1];
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decryptedUrl = decipher.update(encryptedUrl, 'hex', 'utf8');
    decryptedUrl += decipher.final('utf8');

    return decryptedUrl;
  } catch (e) {
    return url;
  }
}
