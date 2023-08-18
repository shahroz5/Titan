import { StorageFacade } from './storage.facade';
import { waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { DexieService } from './dexie.service';
import { IdbService } from './idb.service';
import { CachingEnum } from '@poss-web/shared/models';

describe('Caching: Storage facade Test Suite', () => {
  let storageFacade: StorageFacade;
  let indexedDBStorage: DexieService;
  const hashKey = 'key';
  const apiResponse = {
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
  };
  let currentTime: string;
  let value;

  beforeEach(() => {
    indexedDBStorage = new DexieService();
    storageFacade = new StorageFacade(indexedDBStorage);

    const now = new Date();
    currentTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    value = { apiData: apiResponse, currentTime };
  });

  afterEach(() => {
    indexedDBStorage = null;
    storageFacade = null;
  });

  it('should be created', () => {
    expect(storageFacade).toBeTruthy();
  });

  it(
    'setCache(): Should call setCache method of indexedDBStorage library - to set data in cache',
    waitForAsync(() => {
      const clearCacheCalled = spyOn(indexedDBStorage, 'clearCache');
      const setCacheCalled = spyOn(indexedDBStorage, 'setCache');

      storageFacade.clearCache();
      expect(clearCacheCalled).toHaveBeenCalled();

      storageFacade.setCache(hashKey, apiResponse, currentTime);
      expect(setCacheCalled).toHaveBeenCalled();
    })
  );

  it(
    'getCache(): should call getCache method of indexedDBStorage library - to get data from cache',
    waitForAsync(() => {
      // const getcacheCalled = spyOn(indexedDBStorage, 'getCache');
      const clearCacheCalled = spyOn(indexedDBStorage, 'clearCache');
      const setCacheCalled = spyOn(indexedDBStorage, 'setCache');

      storageFacade.clearCache();
      expect(clearCacheCalled).toHaveBeenCalled();

      storageFacade.setCache(hashKey, apiResponse, currentTime);
      expect(setCacheCalled).toHaveBeenCalled();

      storageFacade.getCache(hashKey).subscribe(data => {
        expect(data).toBe(value);
      });
    })
  );

  it(
    'checkIfHashKeyExistInCache(): should check if key exists in cache - return undefined when there is no data',
    waitForAsync(() => {
      // const checkIfHashKeyExistInCacheCalled = spyOn(
      //   indexedDBStorage,
      //   'checkIfHashKeyExistInCache'
      // ).and.returnValue(of(undefined));
      const clearCacheCalled = spyOn(indexedDBStorage, 'clearCache');

      storageFacade.clearCache();
      expect(clearCacheCalled).toHaveBeenCalled();

      storageFacade.checkIfHashKeyExistInCache(hashKey).subscribe(data => {
        // expect(checkIfHashKeyExistInCacheCalled).toHaveBeenCalled();
        expect(data).toBeUndefined();
      });
    })
  );

  it(
    'deleteCacheByKey(): should call deleteCacheByKey of indexedDBStorage library - to delete the data in the table for the key',
    waitForAsync(() => {
      const deleteCacheByKeyCalled = spyOn(
        indexedDBStorage,
        'deleteCacheByKey'
      );

      storageFacade.deleteCacheByKey(hashKey);
      expect(deleteCacheByKeyCalled).toHaveBeenCalled();

      storageFacade.getCache(hashKey).subscribe(data => {
        expect(data).toBe(undefined);
      });
    })
  );

  it(
    'clearCache(): should call the clearCache method of indexedDBStorage library - to clear the cache',
    waitForAsync(() => {
      const clearCacheCalled = spyOn(indexedDBStorage, 'clearCache');

      storageFacade.clearCache();
      expect(clearCacheCalled).toHaveBeenCalled();

      storageFacade.getCache(hashKey).subscribe(data => {
        expect(data).toBe(undefined);
      });
    })
  );

  it(
    'updateCacheRequestCount(): should call updateCacheRequestCount of indexedDBStorage library - to update the cache count on the metaDataTable',
    waitForAsync(() => {
      const updateCacheRequestCountCalled = spyOn(
        indexedDBStorage,
        'updateCacheRequestCount'
      );

      storageFacade.updateCacheRequestCount(CachingEnum.TOTAL_COUNT);
      expect(updateCacheRequestCountCalled).toHaveBeenCalled();
    })
  );
});
