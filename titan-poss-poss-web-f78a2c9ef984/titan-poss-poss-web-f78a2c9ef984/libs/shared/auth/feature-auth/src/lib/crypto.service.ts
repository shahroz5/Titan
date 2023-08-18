import { Injectable } from '@angular/core';

@Injectable()
export class CryptoService {
  encryptPassword(publickey: string, password: string): string {
    return password;
  }
}
