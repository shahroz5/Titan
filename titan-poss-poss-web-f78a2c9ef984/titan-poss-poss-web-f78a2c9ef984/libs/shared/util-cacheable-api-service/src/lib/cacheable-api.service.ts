import { Injectable, Inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HashkeyGeneratorService } from './hashkey-generator.service';
import { StorageFacade } from './storage.facade';
import { ApiService } from '@poss-web/shared/util-api-service';
import { POSS_WEB_CACHING_STRATEGY } from '@poss-web/shared/util-config';
import { CachingStrategySetting, CachingEnum } from '@poss-web/shared/models';
import { tap, switchMap } from 'rxjs/operators';
import { CacheInvalidateStrategyByAge } from './strategies/cache-invalidate-strategy-by-age';
import { CacheInvalidateStrategyNow } from './strategies/cache-invalidate-strategy-now';
import { CacheInvalidateStrategyBySize } from './strategies/cache-invalidate-strategy-by-size';

@Injectable({
  providedIn: 'root'
})
export class CacheableApiService {
  apiResponse: any;
  hashKey: string;

  constructor(
    private hashingService: HashkeyGeneratorService,
    private storageFacade: StorageFacade,
    private apiService: ApiService,
    @Inject(POSS_WEB_CACHING_STRATEGY)
    private cachingStrategySettings: CachingStrategySetting[]
  ) {}

  get(
    url: string,
    params: HttpParams = new HttpParams(),
    moduleName: string = null
  ): Observable<any> {
    let hashKey: string;

    hashKey = this.hashingService.generateKeyfromData(url, params, moduleName);
    return this.getStrategyBasedResponse(
      url,
      params,
      hashKey,
      CachingEnum.API_TYPE_GET
    );
  }

  post(
    url: string,
    body: object = {},
    params: HttpParams = new HttpParams(),
    moduleName: string = null
  ): Observable<any> {
    let hashKey: string;

    hashKey = this.hashingService.generateKeyfromData(
      url,
      params,
      moduleName,
      JSON.stringify(body)
    );
    return this.getStrategyBasedResponse(
      url,
      params,
      hashKey,
      CachingEnum.API_TYPE_POST,
      body
    );
  }

  getStrategyBasedResponse(
    url: string,
    params: HttpParams,
    hashKey: string,
    apiType: string,
    body: Object = {}
  ): Observable<any> {
    let keyExists: boolean;

    return this.storageFacade.checkIfHashKeyExistInCache(hashKey).pipe(
      switchMap(response => {
        let strategy;

        if (response) {
          keyExists = true;
        } else {
          keyExists = false;
        }

        if (keyExists) {
          const strategyConfiguration = this.cachingStrategySettings;

          strategyConfiguration.forEach(configObject => {
            strategy = this.getCurrentStrategy(configObject, this);
            this.apiResponse = strategy.getData(
              url,
              params,
              hashKey,
              apiType,
              body
            );
          });
          return this.apiResponse;
        } else {
          return this.getDataFromApi(url, params, hashKey, apiType, body);
        }
      })
    );
  }

  getDataFromApi(
    url: string,
    params: HttpParams,
    hashKey: string,
    apiType: string,
    body?: Object
  ): Observable<any> {
    switch (apiType) {
      case CachingEnum.API_TYPE_POST:
        return this.apiService.post(url, body, params).pipe(
          tap(response => {
            if (response && response.results && response.results.length > 0) {
              this.setDataInCache(hashKey, response);
            }
          })
        );
      // case CachingEnum.API_TYPE_PATCH:
      //   return this.apiService.patch(url, body, params).pipe(
      //     tap(response => {
      //       if (response && response.results && response.results.length > 0) {
      //         this.setDataInCache(hashKey, response);
      //       }
      //     })
      //   );
      default:
        return this.apiService.get(url, params).pipe(
          tap(response => {
            if (response && response.results && response.results.length > 0) {
              this.setDataInCache(hashKey, response);
            }
          })
        );
    }
    
  }

  setDataInCache(hashKey: string, apiResponse) {
    const startTime = this.getCurrentTime();
    this.storageFacade.setCache(hashKey, apiResponse, startTime);
  }

  getDataFromCache(hashKey: string): Observable<any> {
    const cachedResponse = this.storageFacade.getCache(hashKey);
    return cachedResponse;
  }

  deleteCachedKey(hashKey: string) {
    return this.storageFacade.deleteCacheByKey(hashKey);
  }

  clearCache() {
    return this.storageFacade.clearCache();
  }

  updateCacheRequestCount(countKey) {
    return this.storageFacade.updateCacheRequestCount(countKey);
  }

  getCacheSize(): Observable<any> {
    return this.storageFacade.getCacheSize();
  }

  getCurrentStrategy(
    configObject: CachingStrategySetting,
    cacheableApiService: CacheableApiService
  ):
    | CacheInvalidateStrategyByAge
    | CacheInvalidateStrategyNow
    | CacheInvalidateStrategyBySize {
    switch (configObject.name) {
      case 'InvalidatedByAge':
        const strategyByAge = new CacheInvalidateStrategyByAge(
          cacheableApiService,
          configObject
        );
        return strategyByAge;
      case 'InvalidatedNow':
        const strategyNow = new CacheInvalidateStrategyNow(
          cacheableApiService,
          configObject
        );
        return strategyNow;
      case 'InvalidatedBySize':
        const strategyBySize = new CacheInvalidateStrategyBySize(
          cacheableApiService,
          configObject
        );
        return strategyBySize;
    }
  }

  getCurrentTime() {
    const today = new Date();
    const time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    return time;
  }
}
