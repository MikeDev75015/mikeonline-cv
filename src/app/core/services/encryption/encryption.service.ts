import nacl from 'tweetnacl';

/**
 * EncryptionService - Uses TweetNaCl.js for secure encryption
 * Note: tweetnacl-js uses secretbox (XSalsa20-Poly1305) instead of AES-256-CBC
 * For backward compatibility with existing encrypted data, consider using Web Crypto API
 */
export class EncryptionService {
  // Fixed key and nonce for backward compatibility (NOT recommended for new code)
  private static readonly key = new Uint8Array(
    [69, 81, 50, 54, 51, 50, 51, 54, 53, 56, 57, 55, 56, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  );

  private static readonly nonce = new Uint8Array(24);

  /**
   * Encrypts data using TweetNaCl secretbox (XSalsa20-Poly1305)
   * WARNING: This uses fixed nonce which is NOT secure for production
   * Consider using Web Crypto API for AES-256-CBC compatibility
   */
  public static encryptUsingAES256(data: { [key: string]: any }): string {
    try {
      const message = new TextEncoder().encode(JSON.stringify(data));
      const encrypted = nacl.secretbox(message, this.nonce, this.key);

      if (!encrypted) {
        throw new Error('Encryption failed');
      }

      // Convert to base64 for storage
      return btoa(String.fromCharCode(...encrypted));
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  }

  /**
   * Decrypts data using TweetNaCl secretbox (XSalsa20-Poly1305).
   * Returns null when data cannot be decrypted with current key/format.
   */
  public static decryptUsingAES256(encryptedString: string): { [key: string]: any } | null {
    if (!encryptedString) {
      return null;
    }

    try {
      // Convert from base64 and try NaCl format first.
      const encrypted = new Uint8Array(
        atob(encryptedString).split('').map(c => c.charCodeAt(0))
      );

      const decrypted = nacl.secretbox.open(encrypted, this.nonce, this.key);
      if (decrypted) {
        const message = new TextDecoder().decode(decrypted);
        return JSON.parse(message);
      }

      // Base64 payload exists but cannot be decrypted with current key/format.
      return null;
    } catch {
      // Ignore and try legacy/plaintext fallback below.
    }

    // Fallback for legacy/plaintext values stored before migration.
    try {
      const parsed = JSON.parse(encryptedString);
      return parsed && typeof parsed === 'object' ? parsed : { value: String(parsed) };
    } catch {
      return { value: encryptedString };
    }
  }
}
