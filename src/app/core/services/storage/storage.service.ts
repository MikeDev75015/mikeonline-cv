import {EncryptionService} from '../encryption/encryption.service';

/**
 * The service used to manage the browser's localStorage and sessionStorage.
 *
 * It encrypts data before saving it and decrypts it before sending it back
 */
export class StorageService {
  /**
   * Sets the item's encrypted value to local or session storage.
   * @param type Storage type, local or session.
   * @param key The storage key, local or session
   * @param value The value to encrypt and save
   */
  public static setItem<T>(type: 'localStorage' | 'sessionStorage', key: string, value: T): void {
    try {
      const dataToEncrypt = typeof value === 'object' ? (value as any) : { value };
      window[type].setItem(key, EncryptionService.encryptUsingAES256(dataToEncrypt));
    } catch (e: any) {
      console.warn(`Cannot set the ${key} item in ${type}.\n => ${e.message}`);
    }
  }

  /**
   * Retrieves and decrypts, if it exists, the value of the item saved in local or session storage.
   * @param type Storage type, local or session.
   * @param key The storage key, local or session.
   * @param defaultValue Optional. The default value to return if the element does not exist
   * @returns, if it exists, the value of the item saved in local or session storage.
   */
  public static getItem<T>(type: 'localStorage' | 'sessionStorage', key: string, defaultValue?: T): T {
    try {
      const rawItem = window[type].getItem(key);
      if (!rawItem) {
        return defaultValue as T;
      }

      const decrypted = EncryptionService.decryptUsingAES256(rawItem);
      if (decrypted === null || decrypted === undefined) {
        this.removeItem(type, key);
        return defaultValue as T;
      }

      if (
        typeof decrypted === 'object'
        && 'value' in decrypted
        && Object.keys(decrypted).length === 1
      ) {
        return (decrypted as { value: T }).value;
      }

      return decrypted as T;
    } catch (e: any) {
      console.warn(`No valid item found for ${key} in ${type}.\n => ${e.message}`);
      this.removeItem(type, key);
      return defaultValue as T;
    }
  }

  /**
   * Deletes the item saved in the local or session storage if it exists.
   * @param type Storage type, local or session.
   * @param key The storage key, local or session
   */
  public static removeItem(type: 'localStorage' | 'sessionStorage', key: string): void {
    try {
      if (window[type].getItem(key)) {
        window[type].removeItem(key);
      }
    } catch (e: any) {
      console.warn(`Cannot remove the ${key} item in ${type}.\n => ${e.message}`);
    }
  }
}
