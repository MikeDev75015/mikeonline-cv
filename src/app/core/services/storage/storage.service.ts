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
      window[type].setItem(key, EncryptionService.encryptUsingAES256(value));
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
      if (!window[type].getItem(key)) {
        return defaultValue as T;
      }
      return EncryptionService.decryptUsingAES256(window[type].getItem(key) as string) as T;
    } catch (e: any) {
      console.warn(`No valid item found for ${key} in ${type}.\n => ${e.message}`);
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
