import * as CryptoJS from 'crypto-js';

export class EncryptionService {
  private static key = CryptoJS.enc.Utf8.parse('4512631236589784');
  private static iv = CryptoJS.enc.Utf8.parse('4512631236589784');

  public static encryptUsingAES256(data: { [key: string]: any }): string {
    // @ts-ignore
    return CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(JSON.stringify(data)),
      this.key,
      {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
  }

  public static decryptUsingAES256(decString: string): { [key: string]: any } {
    return JSON.parse(CryptoJS.AES.decrypt(decString, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8));
  }
}
