import { CacheableApiService } from './cacheable-api.service';
import { HashkeyGeneratorService } from './hashkey-generator.service';
import { ApiService } from '@poss-web/shared/util-api-service';
import { StorageFacade } from './storage.facade';
import { CachingStrategySetting, CachingEnum } from '@poss-web/shared/models';
import { HttpParams, HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { waitForAsync } from '@angular/core/testing';
import { CacheInvalidateStrategyByAge } from './strategies/cache-invalidate-strategy-by-age';
import { CacheInvalidateStrategyNow } from './strategies/cache-invalidate-strategy-now';
import { DexieService } from './dexie.service';
import { IdbService } from './idb.service';

describe('Caching: Cacheable api service', () => {
  let cacheableApiService: CacheableApiService;
  let hashingService: HashkeyGeneratorService;
  let storageFacade: StorageFacade;
  let indexedDBStorage: DexieService;
  let apiService: ApiService;
  let configObject: CachingStrategySetting;

  const cachingStrategySettings: CachingStrategySetting[] = [
    {
      type: 3,
      name: 'InvalidatedBySize',
      category: 'cache',
      size: 1,
      unit: 'MB'
    }
  ];
  const http: HttpClient = null;
  const apiURL =
    'http://ec2-13-234-124-250.ap-south-1.compute.amazonaws.com/api';
  const url = '/engine/v2/product/product-groups';
  let params: HttpParams = new HttpParams();
  params = params.append('sort', 'description,asc');
  params = params.append('isPageable', 'false');
  const hashKey = 'aKajOXVAgP7XT6hYXsN4n0o1cKsj23lQIITWTH2+yZM=';
  const apiType = 'GET';
  const body = {};

  const apiResponse = {
    name: 'nageshwar',
    email: 'nageshwar.s@mindtree.com'
  };
  let currentTime: string;
  let value;

  beforeEach(() => {
    hashingService = new HashkeyGeneratorService(apiURL);
    indexedDBStorage = new DexieService();
    storageFacade = new StorageFacade(indexedDBStorage);
    apiService = new ApiService(http, apiURL);

    cacheableApiService = new CacheableApiService(
      hashingService,
      storageFacade,
      apiService,
      cachingStrategySettings
    );

    const now = new Date();
    currentTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    value = { apiData: apiResponse, currentTime };
  });
  afterEach(() => {
    cacheableApiService = null;
    hashingService = null;
    indexedDBStorage = null;
    storageFacade = null;
    apiService = null;
  });

  it('should be created', () => {
    expect(cacheableApiService).toBeTruthy();
  });

  it(
    'get(): should get data from API - if data is not in cache',
    waitForAsync(() => {
      const generateKeyfromDataCalled = spyOn(
        hashingService,
        'generateKeyfromData'
      ).and.returnValue(hashKey);

      const checkIfHashKeyExistInCacheCalled = spyOn(
        storageFacade,
        'checkIfHashKeyExistInCache'
      ).and.returnValue(of(undefined));

      spyOn(cacheableApiService, 'getDataFromApi').and.returnValue(
        of(apiResponse)
      );

      cacheableApiService.get(url, params).subscribe(data => {
        expect(generateKeyfromDataCalled).toHaveBeenCalled();
        expect(checkIfHashKeyExistInCacheCalled).toHaveBeenCalled();
        expect(data).toEqual(apiResponse);
      });
    })
  );

  it(
    'get(): should get data from InvalidatedByAge strategy - if data exists in cache and configObjectName is InvalidatedByAge',
    waitForAsync(() => {
      configObject = {
        type: 1,
        name: 'InvalidatedByAge',
        category: 'key',
        options: { age: '00:01:00' }
      };

      const generateKeyfromDataCalled = spyOn(
        hashingService,
        'generateKeyfromData'
      ).and.returnValue(hashKey);

      const checkIfHashKeyExistInCacheCalled = spyOn(
        storageFacade,
        'checkIfHashKeyExistInCache'
      ).and.returnValue(of(apiResponse));

      const strategy = new CacheInvalidateStrategyByAge(
        cacheableApiService,
        configObject
      );
      const getCurrentStrategyCalled = spyOn(
        cacheableApiService,
        'getCurrentStrategy'
      ).and.returnValue(strategy);
      const getDataCalled = spyOn(strategy, 'getData').and.returnValue(
        of(apiResponse)
      );

      cacheableApiService.get(url, params).subscribe(data => {
        expect(generateKeyfromDataCalled).toHaveBeenCalled();
        expect(checkIfHashKeyExistInCacheCalled).toHaveBeenCalled();
        expect(getCurrentStrategyCalled).toHaveBeenCalled();
        expect(getDataCalled).toHaveBeenCalled();
        expect(data).toEqual(apiResponse);
      });
    })
  );

  it(
    'get(): should get data from InvalidatedNow strategy - if data exists in cache and configObjectName is InvalidatedNow',
    waitForAsync(() => {
      configObject = {
        type: 2,
        name: 'InvalidatedNow',
        category: 'cache'
      };

      const generateKeyfromDataCalled = spyOn(
        hashingService,
        'generateKeyfromData'
      ).and.returnValue(hashKey);

      const checkIfHashKeyExistInCacheCalled = spyOn(
        storageFacade,
        'checkIfHashKeyExistInCache'
      ).and.returnValue(of(apiResponse));

      const strategy = new CacheInvalidateStrategyNow(
        cacheableApiService,
        configObject
      );
      const getCurrentStrategyCalled = spyOn(
        cacheableApiService,
        'getCurrentStrategy'
      ).and.returnValue(strategy);
      const getDataCalled = spyOn(strategy, 'getData').and.returnValue(
        of(apiResponse)
      );

      cacheableApiService.get(url, params).subscribe(data => {
        expect(generateKeyfromDataCalled).toHaveBeenCalled();
        expect(checkIfHashKeyExistInCacheCalled).toHaveBeenCalled();
        expect(getCurrentStrategyCalled).toHaveBeenCalled();
        expect(getDataCalled).toHaveBeenCalled();
        expect(data).toEqual(apiResponse);
      });
    })
  );

  it(
    'getDataFromApi(): Should get data from apiService',
    waitForAsync(() => {
      const apiServiceCalled = spyOn(apiService, 'get').and.returnValue(
        of(apiResponse)
      );
      // const setDataInCacheCalled = spyOn(cacheableApiService, 'setDataInCache');

      cacheableApiService
        .getDataFromApi(url, params, hashKey, apiType, body)
        .subscribe(data => {
          expect(apiServiceCalled).toHaveBeenCalled();
          // expect(setDataInCacheCalled).toHaveBeenCalled();
          expect(data).toEqual(apiResponse);
        });
    })
  );

  it(
    'setDataInCache(): Should call setCache of local storage service - to set data in cache',
    waitForAsync(() => {
      const clearCacheCalled = spyOn(storageFacade, 'clearCache');
      const getCurrentTimeCalled = spyOn(cacheableApiService, 'getCurrentTime');
      const setCacheCalled = spyOn(storageFacade, 'setCache');

      cacheableApiService.clearCache();
      expect(clearCacheCalled).toHaveBeenCalled();

      cacheableApiService.setDataInCache(hashKey, apiResponse);
      expect(getCurrentTimeCalled).toHaveBeenCalled();
      expect(setCacheCalled).toHaveBeenCalled();
    })
  );

  it(
    'getDataFromCache(): Should call getCache method of storageFacade file - to get data from cache',
    waitForAsync(() => {
      cacheableApiService.clearCache();
      cacheableApiService.setDataInCache(hashKey, apiResponse);

      cacheableApiService.getDataFromCache(hashKey).subscribe(data => {
        expect(data).toEqual(value);
      });
    })
  );

  it(
    'deleteCachedKey(): should call deleteCacheByKey of storageFacade - to delete the data for the key in the table',
    waitForAsync(() => {
      const clearCacheCalled = spyOn(storageFacade, 'clearCache');
      cacheableApiService.clearCache();
      expect(clearCacheCalled).toHaveBeenCalled();

      cacheableApiService.setDataInCache(hashKey, apiResponse);

      cacheableApiService.getDataFromCache(hashKey).subscribe(cachedData => {
        expect(cachedData).toEqual(value);
      });

      cacheableApiService.deleteCachedKey(hashKey);

      cacheableApiService.getDataFromCache(hashKey).subscribe(cachedData => {
        expect(cachedData).toBeUndefined();
      });
    })
  );

  it(
    'clearCache(): should call the clearCache method of storageFacade - to clear the cache',
    waitForAsync(() => {
      const clearCacheCalled = spyOn(storageFacade, 'clearCache');

      cacheableApiService.clearCache();
      expect(clearCacheCalled).toHaveBeenCalled();

      cacheableApiService.getDataFromCache(hashKey).subscribe(cachedData => {
        expect(cachedData).toBeUndefined();
      });
    })
  );

  it(
    'updateCacheRequestCount(): should call updateCacheRequestCount of storageFacade - to update the cache count on the metaDataTable',
    waitForAsync(() => {
      const updateCacheRequestCountCalled = spyOn(
        storageFacade,
        'updateCacheRequestCount'
      );
      cacheableApiService.updateCacheRequestCount(CachingEnum.TOTAL_COUNT);
      expect(updateCacheRequestCountCalled).toHaveBeenCalled();
    })
  );

  it('getCurrentStrategy(): should return instance of CacheInvalidateStrategyByAge when configObjectName is InvalidatedByAge', () => {
    configObject = {
      type: 1,
      name: 'InvalidatedByAge',
      category: 'key',
      options: { age: '00:01:00' }
    };
    const cacheInvalidateStrategyByAge = new CacheInvalidateStrategyByAge(
      cacheableApiService,
      configObject
    );

    const strategyObj = cacheableApiService.getCurrentStrategy(
      configObject,
      cacheableApiService
    );
    expect(strategyObj).toEqual(cacheInvalidateStrategyByAge);
  });

  it('getCurrentStrategy(): should return instance of CacheInvalidateStrategyNow when configObjectName is InvalidatedNow', () => {
    configObject = {
      type: 2,
      name: 'InvalidatedNow',
      category: 'cache'
    };
    const cacheInvalidateStrategyNow = new CacheInvalidateStrategyNow(
      cacheableApiService,
      configObject
    );

    const strategyObj = cacheableApiService.getCurrentStrategy(
      configObject,
      cacheableApiService
    );
    expect(strategyObj).toEqual(cacheInvalidateStrategyNow);
  });

  it('getCurrentTime(): should get current time in HH:MM:SS format', () => {
    expect(cacheableApiService.getCurrentTime()).toBe(currentTime);
  });
});
