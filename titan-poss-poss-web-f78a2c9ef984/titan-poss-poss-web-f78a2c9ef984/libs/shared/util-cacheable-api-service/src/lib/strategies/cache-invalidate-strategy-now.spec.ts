import { CacheInvalidateStrategyNow } from './cache-invalidate-strategy-now';
import { CacheableApiService } from '../cacheable-api.service';
import { CachingStrategySetting } from '@poss-web/shared/models';
import { HttpParams, HttpClient } from '@angular/common/http';
import { HashkeyGeneratorService } from '../hashkey-generator.service';
import { StorageFacade } from '../storage.facade';
import { ApiService } from '@poss-web/shared/util-api-service';
import { waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { DexieService } from '../dexie.service';

describe('Caching: Cache Invalidate Strategy Now', () => {
  let cacheableApiService: CacheableApiService;
  let cacheInvalidateStrategyNow: CacheInvalidateStrategyNow;
  const apiURL =
    'http://ec2-13-234-124-250.ap-south-1.compute.amazonaws.com/api';
  const http: HttpClient = null;
  const hashingService = new HashkeyGeneratorService(apiURL);
  const indexedDBStorage = new DexieService();
  const storageFacade = new StorageFacade(indexedDBStorage);
  const apiService = new ApiService(http, apiURL);
  const cachingStrategySettings: CachingStrategySetting[] = [
    {
      type: 3,
      name: 'InvalidatedBySize',
      category: 'cache',
      size: 1,
      unit: 'MB'
    }
  ];

  const configObj: CachingStrategySetting = {
    type: 2,
    name: 'InvalidatedNow',
    category: 'cache'
  };

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

  beforeEach(() => {
    cacheableApiService = new CacheableApiService(
      hashingService,
      storageFacade,
      apiService,
      cachingStrategySettings
    );

    cacheInvalidateStrategyNow = new CacheInvalidateStrategyNow(
      cacheableApiService,
      configObj
    );
  });

  afterEach(() => {
    cacheableApiService = null;
    cacheInvalidateStrategyNow = null;
  });

  it('should be created', () => {
    expect(cacheInvalidateStrategyNow).toBeTruthy();
  });

  it(
    'getData(): Should delete the entire cached data - and get the api data',
    waitForAsync(() => {
      const clearCacheCalled = spyOn(cacheableApiService, 'clearCache');
      spyOn(cacheableApiService, 'getDataFromApi').and.returnValue(
        of(apiResponse)
      );

      cacheInvalidateStrategyNow
        .getData(url, params, hashKey, apiType)
        .subscribe(data => {
          // console.log(`data is: ${data}`);
          expect(clearCacheCalled).toHaveBeenCalled();
          expect(data).toEqual(apiResponse);
        });
    })
  );
});
