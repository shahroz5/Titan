import { CacheableApiService } from '../cacheable-api.service';
import { CachingStrategySetting, CachingEnum } from '@poss-web/shared/models';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export class CacheInvalidateStrategyBySize {
  configObject: CachingStrategySetting;

  constructor(
    private cacheableApiService: CacheableApiService,
    configObj: CachingStrategySetting
  ) {
    this.configObject = configObj;
  }

  getData(
    url: string,
    params: HttpParams,
    hashKey: string,
    apiType: string,
    body: Object = {}
  ): Observable<any> {
    return this.cacheableApiService.getCacheSize().pipe(
      switchMap(cacheSize => {
        if (cacheSize && cacheSize > 0) {
          const sizeExceeded = this.checkIfCacheSizeExceedsLimit(
            this.configObject,
            cacheSize
          );

          if (sizeExceeded && this.configObject.category === 'cache') {
            this.cacheableApiService.clearCache();
            return this.cacheableApiService.getDataFromApi(
              url,
              params,
              hashKey,
              apiType,
              body
            );
          } else if (sizeExceeded && this.configObject.category === 'key') {
            this.cacheableApiService.deleteCachedKey(hashKey);
            return this.cacheableApiService.getDataFromApi(
              url,
              params,
              hashKey,
              apiType,
              body
            );
          } else {
            return this.cacheableApiService.getDataFromCache(hashKey).pipe(
              switchMap(cachedData => {
                if (!!cachedData) {
                  this.cacheableApiService.updateCacheRequestCount(
                    CachingEnum.TOTAL_COUNT
                  );
                  this.cacheableApiService.updateCacheRequestCount(
                    CachingEnum.SESSION_COUNT
                  );
                  return of(cachedData.apiData);
                } else {
                  return this.cacheableApiService.getDataFromApi(
                    url,
                    params,
                    hashKey,
                    apiType,
                    body
                  );
                }
              })
            );
          }
        }
        // For size less than or equal zero, check if key exist in cache, if exists return observable of cached response, else return api response
        else {
          return this.cacheableApiService.getDataFromCache(hashKey).pipe(
            map(cachedData => {
              if (!!cachedData) {
                this.cacheableApiService.updateCacheRequestCount(
                  CachingEnum.TOTAL_COUNT
                );
                this.cacheableApiService.updateCacheRequestCount(
                  CachingEnum.SESSION_COUNT
                );
                return of(cachedData.apiData);
              } else {
                return this.cacheableApiService.getDataFromApi(
                  url,
                  params,
                  hashKey,
                  apiType,
                  body
                );
              }
            })
          );
        }
      })
    );
  }

  checkIfCacheSizeExceedsLimit(
    configObj: CachingStrategySetting,
    cacheSize
  ): boolean {
    let cacheDataSize: number;
    let cacheSizeExceedsLimit: boolean;

    if (configObj.unit === CachingEnum.UNIT_KB) {
      cacheDataSize = Number(cacheSize) / 1024;
    } else if (configObj.unit === CachingEnum.UNIT_MB) {
      cacheDataSize = Number(cacheSize) / (1024 * 1024);
    }

    if (cacheDataSize > configObj.size) {
      cacheSizeExceedsLimit = true;
    } else {
      cacheSizeExceedsLimit = false;
    }
    return cacheSizeExceedsLimit;
  }
}
