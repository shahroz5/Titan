import { DexieService } from './dexie.service';
import { waitForAsync } from '@angular/core/testing';
import { CachingEnum } from '@poss-web/shared/models';

describe('DexieService', () => {
  let service: DexieService;

  const dummyData = [
    {
      id: 1,
      title: 'Securing React Apps with Auth0',
      slug: 'react-auth0-authentication-security',
      authorId: 2,
      category: 'JavaScript'
    }
  ];

  const hashkey = 'aKajOXVAgP7XT6hYXsN4n0o1cKsj23lQIITWTH2+yZM=';

  beforeEach(() => {
    service = new DexieService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it(
    'should check if key exists in table',
    waitForAsync(() => {
      service.clearCache();
      service.checkIfHashKeyExistInCache(hashkey).subscribe(data => {
        expect(data).toBe(undefined);
      });
    })
  );

  it(
    'should remove old data from table',
    waitForAsync(() => {
      service.clearCache();
      service.getCache(hashkey).subscribe(data => {
        expect(data).toBe(undefined);
      });
    })
  );

  it(
    'Shoud insert value to the table',
    waitForAsync(() => {
      service.clearCache();
      service.getCache(hashkey).subscribe(data => {
        expect(data).toBe(undefined);
        service.setCache(hashkey, dummyData);
      });
    })
  );

  it(
    'should get value from the table',
    waitForAsync(() => {
      service.clearCache();
      service.setCache(hashkey, dummyData);
      service.getCache(hashkey).subscribe(data => {
        expect(data).toEqual(dummyData);
      });
    })
  );

  it(
    'updateCacheRequestCount(): should update the count value on the analyticsTable',
    waitForAsync(() => {
      const getDataFromStoreCalled = spyOn(
        service.analyticsTable,
        'get'
      ).and.callFake(() => Promise.resolve(0));
      const setDataInStoreCalled = spyOn(service.analyticsTable, 'put');

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
    'deleteCacheByKey(): should delete value from the table',
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
});
