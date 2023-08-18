import { Injectable } from '@angular/core';
import { hextob64, KEYUTIL, KJUR } from 'jsrsasign';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  encryptPassword(publicKey: string, toEncrypt: string): string {
    const rsaPub = `
    -----BEGIN PUBLIC KEY-----
    ${publicKey}
    -----END PUBLIC KEY-----
    `;
    const keyObj = KEYUTIL.getKey(rsaPub);
    const enc = KJUR.crypto.Cipher.encrypt(toEncrypt, keyObj);
    // const enc2 = KJUR.crypto.Cipher.encrypt(toEncrypt, keyObj, 'RSAOAEP');
    const enc2 = KJUR.crypto.Cipher.encrypt(toEncrypt, keyObj, 'RSA');
    const encrypted = hextob64(enc2);
    return encrypted;
  }
}
