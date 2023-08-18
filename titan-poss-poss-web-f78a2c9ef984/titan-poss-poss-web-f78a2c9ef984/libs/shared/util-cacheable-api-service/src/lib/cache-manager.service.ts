import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheableApiService } from './cacheable-api.service';
import { HashkeyGeneratorService } from './hashkey-generator.service';
import { StorageFacade } from './storage.facade';

@Injectable({
  providedIn: 'root'
})
export class CacheManagerService {
  constructor(
    private cacheableApiService: CacheableApiService,
    private hashingService: HashkeyGeneratorService,
    private storageFacade: StorageFacade
  ) {}

  deleteCacheByUrl(
    url: string,
    body: object = {},
    params: HttpParams = new HttpParams(),
    moduleName: string = null
  ) {
    const hashKey =
      body && Object.keys(body).length > 0
        ? this.hashingService.generateKeyfromData(
            url,
            params,
            moduleName,
            JSON.stringify(body)
          )
        : this.hashingService.generateKeyfromData(url, params, moduleName);
    console.log('Caching - CacheManagerService: hashKey = ', hashKey);

    return this.storageFacade.deleteCacheByKey(hashKey);
  }

  clearAllCacheForModule(moduleName: string) {
    let moduleNameHash: string;

    moduleNameHash = this.hashingService.getHashKeyForModuleName(moduleName);
    this.storageFacade.deleteAllCachedDataForModule(moduleNameHash);
  }

  getAnalyticsCount(key: string): Observable<number> {
    return this.storageFacade.getAnalyticsCount(key);
  }

  getCacheSize(): Observable<any> {
    return this.storageFacade.getCacheSize();
  }
}
