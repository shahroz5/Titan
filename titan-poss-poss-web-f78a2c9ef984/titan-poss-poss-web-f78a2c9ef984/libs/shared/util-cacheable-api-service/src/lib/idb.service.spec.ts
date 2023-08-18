import { IdbService } from './idb.service';
import { waitForAsync } from '@angular/core/testing';
import { CachingEnum } from '@poss-web/shared/models';

describe('IdbService', () => {
  let service: IdbService;
  const hashkey = 'aKajOXVAgP7XT6hYXsN4n0o1cKsj23lQIITWTH2+yZM=';

  const dummyData = {
    name: 'nageshwar',
    email: 'nageshwar.s@mindtree.com'
  };

  beforeEach(() => {
    service = new IdbService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(
    'setCache(): Shoud call setDataInStore method - to set data in apiDataTable',
    waitForAsync(() => {
      service.clearCache();

      service.getCache(hashkey).subscribe(data => {
        expect(data).toBe(undefined);
        service.setCache(hashkey, dummyData);
      });
    })
  );

  it(
    'setDataInStore(): should set data in apiDataTable',
    waitForAsync(() => {
      service.setDataInStore('apiDataTable', hashkey, dummyData);

      service.getCache(hashkey).subscribe(data => {
        expect(data).toEqual(dummyData);
      });
    })
  );

  it(
    'getCache(): should call getDataFromStore - to get value from the apiDataTable',
    waitForAsync(() => {
      service.clearCache();
      service.setCache(hashkey, dummyData);
      service.getCache(hashkey).subscribe(data => {
        expect(data).toEqual(dummyData);
      });
    })
  );

  it(
    'getDataFromStore(): should get data from apiDataTable',
    waitForAsync(() => {
      service.clearCache();
      service.setDataInStore('apiDataTable', hashkey, dummyData);

      service.getDataFromStore('apiDataTable', hashkey).then(data => {
        expect(data).toEqual(dummyData);
      });
    })
  );

  it(
    'checkIfHashKeyExistInCache(): should get undefined when key does not exists in table',
    waitForAsync(() => {
      service.clearCache();
      service.checkIfHashKeyExistInCache(hashkey).subscribe(data => {
        expect(data).toBe(undefined);
      });
    })
  );

  it(
    'checkIfHashKeyExistInCache(): should get cached data when key exists in table',
    waitForAsync(() => {
      service.clearCache();
      service.setDataInStore('apiDataTable', hashkey, dummyData);
      service.checkIfHashKeyExistInCache(hashkey).subscribe(data => {
        expect(data).toEqual(dummyData);
      });
    })
  );

  it(
    'clearCache(): should clear all the data from table',
    waitForAsync(() => {
      service.clearCache();
      service.getCache(hashkey).subscribe(data => {
        expect(data).toBe(undefined);
      });
    })
  );

  it(
    'clearDataFromStore(): should clear all the data from table',
    waitForAsync(() => {
      service.clearDataFromStore('apiDataTable');
      service.getCache(hashkey).subscribe(data => {
        expect(data).toBe(undefined);
      });
    })
  );

  it(
    'deleteCacheByKey(): should delete date for the key in the table',
    waitForAsync(() => {
      service.clearCache();
      service.setCache(hashkey, dummyData);
      service.getCache(hashkey).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      service.deleteCacheByKey(hashkey);
      service.getCache(hashkey).subscribe(data => {
        expect(data).toBeUndefined();
      });
    })
  );

  it(
    'deleteDataFromStore(): should delete date for the key in the table',
    waitForAsync(() => {
      service.setCache(hashkey, dummyData);
      service.getCache(hashkey).subscribe(data => {
        expect(data).toEqual(dummyData);
      });
      service.deleteDataFromStore('apiDataTable', hashkey);

      service.getCache(hashkey).subscribe(data => {
        expect(data).toBeUndefined();
      });
    })
  );

  it(
    'updateCacheRequestCount(): should set the count value on the analyticsTable to 1, when count is undefined/zero/not available',
    waitForAsync(() => {
      const getDataFromStoreCalled = spyOn(
        service,
        'getDataFromStore'
      ).and.callFake(() => Promise.resolve(0));
      const setDataInStoreCalled = spyOn(service, 'setDataInStore');

      service
        .updateCacheRequestCount(CachingEnum.TOTAL_COUNT)
        .then(newCount => {
          expect(getDataFromStoreCalled).toHaveBeenCalled();
          expect(setDataInStoreCalled).toHaveBeenCalled();
          expect(newCount).toBe(1);
        });
    })
  );

  it(
    'updateCacheRequestCount(): should increment the count value on the analyticsTable, when count is available',
    waitForAsync(() => {
      const getDataFromStoreIsCalled = spyOn(
        service,
        'getDataFromStore'
      ).and.callFake(() => Promise.resolve(1));
      const setDataInStoreCalled = spyOn(service, 'setDataInStore');

      service
        .updateCacheRequestCount(CachingEnum.TOTAL_COUNT)
        .then(newCount => {
          expect(getDataFromStoreIsCalled).toHaveBeenCalled();
          expect(setDataInStoreCalled).toHaveBeenCalled();
          expect(newCount).toBe(2);
        });
    })
  );
});
