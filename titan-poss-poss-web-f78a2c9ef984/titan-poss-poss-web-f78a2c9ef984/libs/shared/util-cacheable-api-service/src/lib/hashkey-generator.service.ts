import { Injectable, Inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';

@Injectable({
  providedIn: 'root'
})
export class HashkeyGeneratorService {
  constructor(@Inject(POSS_WEB_API_URL) private apiURL: string) {}

  generateKeyfromData(
    url: string,
    params: HttpParams,
    moduleName: string = null,
    data: string = ''
  ): string {
    let dataForHashCodeGeneration: string;
    if (data.length > 0) {
      dataForHashCodeGeneration = `${this.apiURL}${url}?${params}?${data}`;
    } else {
      dataForHashCodeGeneration = `${this.apiURL}${url}?${params}`;
    }
    const hashDigest = sha256(dataForHashCodeGeneration);
    const base64 = Base64.stringify(hashDigest);

    if (moduleName) {
      const moduleNameHashCode = sha256(moduleName);
      const moduleNameHashKey = Base64.stringify(moduleNameHashCode);
      return `${moduleNameHashKey}.${base64}`;
    }

    return base64;
  }

  getHashKeyForModuleName(moduleName: string = null) {
    if (moduleName) {
      const moduleNameHashCode = sha256(moduleName);
      const moduleNameHashKey = Base64.stringify(moduleNameHashCode);
      return `${moduleNameHashKey}`;
    }
  }
}
