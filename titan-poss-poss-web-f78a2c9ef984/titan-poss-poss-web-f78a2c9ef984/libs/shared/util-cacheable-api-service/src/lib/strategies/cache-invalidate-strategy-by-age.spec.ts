import { CacheInvalidateStrategyByAge } from './cache-invalidate-strategy-by-age';
import { CacheableApiService } from '../cacheable-api.service';
import { HashkeyGeneratorService } from '../hashkey-generator.service';
import { StorageFacade } from '../storage.facade';
import { ApiService } from '@poss-web/shared/util-api-service';
import { CachingStrategySetting } from '@poss-web/shared/models';
import { waitForAsync } from '@angular/core/testing';
import { HttpParams, HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { DexieService } from '../dexie.service';

describe('Caching: Cache Invalidate Strategy by Age', () => {
  let cacheableApiService: CacheableApiService;
  let cacheInvalidateStrategyByAge: CacheInvalidateStrategyByAge;
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
    type: 1,
    name: 'InvalidatedByAge',
    category: 'key',
    options: { age: '00:01:00' }
  };
  const url = '/engine/v2/product/product-groups';
  let params: HttpParams = new HttpParams();
  params = params.append('sort', 'description,asc');
  params = params.append('isPageable', 'false');
  const hashKey = 'aKajOXVAgP7XT6hYXsN4n0o1cKsj23lQIITWTH2+yZM=';
  const apiType = 'GET';
  const body = {};

  const cachedResponse = {
    apiData: {
      results: [
        { productGroupCode: '1', description: '123456789011' },
        { productGroupCode: '4', description: 'ATP' },
        { productGroupCode: 'B6', description: 'Bi-Metal Plain' },
        { productGroupCode: 'B5', description: 'Bi-Metal Studded' },
        { productGroupCode: '7', description: 'Clocky' },
        { productGroupCode: '93', description: 'Col+CZ' },
        { productGroupCode: '79', description: 'CZ  Jewellery' },
        { productGroupCode: '85', description: 'Diamantine' },
        { productGroupCode: '74', description: 'Diamonds' },
        {
          productGroupCode: 'GP',
          description: 'For Gold plus silver coin gift'
        },
        { productGroupCode: 'B4', description: 'FOR MIA - SILVER' },
        { productGroupCode: 'NE', description: 'FOR NEBULA WATCH' },
        { productGroupCode: 'Ganesha', description: 'Ganesha' },
        { productGroupCode: 'GV', description: 'Gift Voucher' },
        { productGroupCode: '95', description: 'Glass Kundan' },
        { productGroupCode: '73', description: 'Gold Coins' },
        { productGroupCode: '71', description: 'Gold Plain' },
        { productGroupCode: '76', description: 'Gold Plain - UCP Jewellery' },
        { productGroupCode: '72', description: 'Gold Studded' },
        { productGroupCode: '86', description: 'High Value Studded' },
        { productGroupCode: 'A6', description: 'Jewel Care' },
        {
          productGroupCode: 'A8',
          description: 'JEWEL CARE - CLEANING SOLUTION'
        },
        { productGroupCode: '89', description: 'KUNDAN POLKI STONES' },
        { productGroupCode: 'LAMP', description: 'LAMP' },
        { productGroupCode: '92', description: 'Mangalsutra' },
        { productGroupCode: 'A3', description: 'MIA Colour Stone' },
        { productGroupCode: '90', description: 'MIA PLAIN' },
        { productGroupCode: 'B2', description: 'Mia Plain UCP' },
        { productGroupCode: '91', description: 'MIA Studded' },
        { productGroupCode: 'B1', description: 'Mia Studded  UCP' },
        { productGroupCode: 'B3', description: 'MIA-Colour Stone-UCP' },
        { productGroupCode: '88', description: 'OPEN POLKI STONES' },
        { productGroupCode: 'B7', description: 'Open Polki with BOM' },
        { productGroupCode: '98', description: 'Other Products' },
        { productGroupCode: '5', description: 'PhilipChariol' },
        { productGroupCode: '75', description: 'Plain Jewellery with Stones' },
        { productGroupCode: '83', description: 'Platinum' },
        { productGroupCode: 'A4', description: 'PLATINUM PLAIN' },
        { productGroupCode: 'A9', description: 'PLATINUM SOLITAIRE' },
        { productGroupCode: 'A5', description: 'PLATINUM STUDDED' },
        { productGroupCode: '2wd', description: 'sdsad' },
        { productGroupCode: '81', description: 'Silver' },
        { productGroupCode: 'A2', description: 'SILVER - PLAIN' },
        { productGroupCode: 'A1', description: 'SILVER - STUDDED' },
        { productGroupCode: '82', description: 'Silver Coins' },
        { productGroupCode: '78', description: 'Studded - Color Stones' },
        { productGroupCode: '77', description: 'Studded - Solitaire' },
        { productGroupCode: '87', description: 'Studded UCP' },
        { productGroupCode: 'VA', description: 'TANISHQ GIFT CARD' },
        { productGroupCode: '2', description: 'Tanishq Watches' },
        { productGroupCode: '99', description: 'unit test' }
      ],
      pageNumber: 0,
      pageSize: 2147483647,
      totalPages: 1,
      totalElements: 51
    },
    currentTime: '19:21:50'
  };

  let today: Date;
  let time: string;
  let timeArray: string[];

  beforeEach(() => {
    cacheableApiService = new CacheableApiService(
      hashingService,
      storageFacade,
      apiService,
      cachingStrategySettings
    );
    cacheInvalidateStrategyByAge = new CacheInvalidateStrategyByAge(
      cacheableApiService,
      configObj
    );

    today = new Date();
    time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    timeArray = time.split(':');
  });
  afterEach(() => {
    cacheableApiService = null;
    cacheInvalidateStrategyByAge = null;
  });

  it('should be created', () => {
    expect(cacheInvalidateStrategyByAge).toBeTruthy();
  });

  it(
    'getData(): Should get data from the cache if it is valid/not-expired',
    waitForAsync(() => {
      const getDataFromCachecalled = spyOn(
        cacheableApiService,
        'getDataFromCache'
      ).and.returnValue(of(cachedResponse));

      const checkIfKeyExpiredCalled = spyOn(
        cacheInvalidateStrategyByAge,
        'checkIfKeyExpired'
      ).and.returnValue(false);
      const updateCacheRequestCountCalled = spyOn(
        cacheableApiService,
        'updateCacheRequestCount'
      );

      cacheInvalidateStrategyByAge
        .getData(url, params, hashKey, apiType, body)
        .subscribe(data => {
          expect(getDataFromCachecalled).toHaveBeenCalled();
          expect(checkIfKeyExpiredCalled).toHaveBeenCalled();
          expect(updateCacheRequestCountCalled).toHaveBeenCalled();
          expect(data).toBe(cachedResponse.apiData);
        });
    })
  );

  it(
    'getData(): Should get data from the API if cached data is invalid/expired',
    waitForAsync(() => {
      const getDataFromCachecalled = spyOn(
        cacheableApiService,
        'getDataFromCache'
      ).and.returnValue(of(cachedResponse));

      const checkIfKeyExpiredCalled = spyOn(
        cacheInvalidateStrategyByAge,
        'checkIfKeyExpired'
      ).and.returnValue(true);
      const deleteCachedKeyCalled = spyOn(
        cacheableApiService,
        'deleteCachedKey'
      );
      const getDataFromApiCalled = spyOn(
        cacheableApiService,
        'getDataFromApi'
      ).and.returnValue(of(cachedResponse));

      cacheInvalidateStrategyByAge
        .getData(url, params, hashKey, apiType, body)
        .subscribe(data => {
          expect(getDataFromCachecalled).toHaveBeenCalled();
          expect(checkIfKeyExpiredCalled).toHaveBeenCalled();
          expect(deleteCachedKeyCalled).toHaveBeenCalled();
          expect(getDataFromApiCalled).toHaveBeenCalled();
          expect(data).toBe(cachedResponse);
        });
    })
  );

  it(
    'getData(): Should get data from the API if cached data is undefined',
    waitForAsync(() => {
      const getDataFromCacheCalled = spyOn(
        cacheableApiService,
        'getDataFromCache'
      ).and.returnValue(of(undefined));
      const getDataFromApiCalled = spyOn(
        cacheableApiService,
        'getDataFromApi'
      ).and.returnValue(of(cachedResponse));

      cacheInvalidateStrategyByAge
        .getData(url, params, hashKey, apiType)
        .subscribe(data => {
          expect(getDataFromCacheCalled).toHaveBeenCalled();
          expect(getDataFromApiCalled).toHaveBeenCalled();
          expect(data).toBe(cachedResponse);
        });
    })
  );

  it('checkIfKeyExpired(): Should return true for data expired in cache', () => {
    const date = new Date();
    const mins = date.getMinutes();
    const minuteMinusRequired = 2;
    date.setMinutes(mins - minuteMinusRequired);
    const currentTimeMinusRequiredMin = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const cachedResponseData = {
      currentTime: currentTimeMinusRequiredMin,
      apiData: {
        name: 'nageshwar',
        email: 'nageshwar.s@mindtree.com'
      }
    };

    expect(
      cacheInvalidateStrategyByAge.checkIfKeyExpired(
        configObj,
        cachedResponseData
      )
    ).toBe(true);
  });

  it('checkIfKeyExpired(): Should return false for data valid in cache', () => {
    const date = new Date();
    const currentTimeNow = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const cachedResponseData = {
      currentTime: currentTimeNow,
      apiData: {
        name: 'nageshwar',
        email: 'nageshwar.s@mindtree.com'
      }
    };

    expect(
      cacheInvalidateStrategyByAge.checkIfKeyExpired(
        configObj,
        cachedResponseData
      )
    ).toBe(false);
  });

  it('getCurrentTime(): should get current time in HH:MM:SS format', () => {
    expect(cacheInvalidateStrategyByAge.getCurrentTime()).toBe(time);
  });

  it('getTimeinSeconds(): should get time in seconds', () => {
    const hourToSeconds = Number(timeArray[0]) * 60 * 60;
    const minToSeconds = Number(timeArray[1]) * 60;
    const seconds = Number(timeArray[2]);
    const timeInSeconds = hourToSeconds + minToSeconds + seconds;

    expect(cacheInvalidateStrategyByAge.getTimeinSeconds(time)).toEqual(
      timeInSeconds
    );
  });

  it('getSecondsForHours(): should get number of seconds for given hours', () => {
    const seconds = Number(timeArray[0]) * 60 * 60;

    expect(
      cacheInvalidateStrategyByAge.getSecondsForHours(timeArray[0])
    ).toEqual(seconds);
  });

  it('getSecondsForMinutes(): should get number of seconds for given minutes', () => {
    const seconds = Number(timeArray[1]) * 60;

    expect(
      cacheInvalidateStrategyByAge.getSecondsForMinutes(timeArray[1])
    ).toEqual(seconds);
  });
});
