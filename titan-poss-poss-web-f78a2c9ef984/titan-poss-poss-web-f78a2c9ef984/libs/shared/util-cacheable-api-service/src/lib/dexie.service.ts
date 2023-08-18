import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Observable, from } from 'rxjs';
import { CacheableStorage, CachingEnum } from '@poss-web/shared/models';
import sizeof from 'object-sizeof';

@Injectable({
  providedIn: 'root'
})
export class DexieService implements CacheableStorage {
  cachedDB: any;
  apiDataTable: Dexie.Table<any, string>;
  metaDataTable: Dexie.Table<number, string>;
  analyticsTable: Dexie.Table<number, string>;

  constructor() {
    this.openIndexedDB();
  }

  openIndexedDB() {
    const apiDataTableName = 'apiDataTable';
    const metaDataTableName = 'metaDataTable';
    const analyticsTableName = 'analyticsTable';

    // creating db
    this.cachedDB = new Dexie(CachingEnum.DB_NAME);
    this.cachedDB.version(1).stores({
      apiDataTable: 'hashkey',
      metaDataTable: '',
      analyticsTable: ''
    });
    this.cachedDB.open();

    // All available tables
    this.apiDataTable = this.cachedDB.table(apiDataTableName);
    this.metaDataTable = this.cachedDB.table(metaDataTableName);
    this.analyticsTable = this.cachedDB.table(analyticsTableName);
  }

  setCache(hashKey: string, value) {
    this.setDataInStore(hashKey, value);
  }
  setDataInStore(keyString: string, responseValue) {
    return this.cachedDB
      .transaction('rw', this.apiDataTable, async () => {
        this.apiDataTable
          .put({ hashkey: keyString, data: responseValue })
          .then(() => {
            console.log(
              `Caching: Added data of size ${sizeof(
                responseValue
              )} in apiDataTable`
            );
          });
      })
      .then(() => {
        this.updateCacheSize(CachingEnum.ADD, sizeof(responseValue));
      })
      .catch(() => {
        this.openIndexedDB();
      });
  }

  getCache(hashKey: string): Observable<any> {
    const response = this.getDataFromStore(hashKey);
    return from(response);
  }

  async getDataFromStore(key: string) {
    let cachedResponse;
    await this.cachedDB
      .transaction('rw', this.apiDataTable, async () => {
        this.apiDataTable.get(key).then(response => {
          console.log('cachedResponse', response);
          if (response) {
            cachedResponse = response.data;
          }
        });
      })
      // .then(() => {
      //   console.log('Caching: Transaction committed - get');
      // })
      .catch(() => {

        this.openIndexedDB();
      });
    return cachedResponse;
  }

  checkIfHashKeyExistInCache(Key: string): Observable<any> {
    return this.getCache(Key);
  }

  clearCache(storeName: Dexie.Table<any, string> = this.apiDataTable) {
    this.clearDataFromStore(storeName);
  }

  clearDataFromStore(storeName: Dexie.Table<any, string>) {
    this.cachedDB
      .transaction('rw', storeName, () => {
        storeName.clear();
      })
      .then(() => {
        if (storeName === this.apiDataTable) {
          this.updateCacheSize(CachingEnum.CLEAR, 0);
        }
      });
  }

  clearCachedDataForUser() {
    this.clearCache(this.apiDataTable);
    this.deleteCacheByKey(CachingEnum.SESSION_COUNT, this.analyticsTable);
  }

  deleteCacheByKey(
    hashKey: string,
    storeName: Dexie.Table<any, string> = this.apiDataTable
  ) {
    this.deleteDataFromStore(storeName, hashKey);
  }

  deleteAllCachedDataForModule(moduleNameHash: string) {
    this.apiDataTable
      .where('hashkey')
      .startsWith(moduleNameHash)
      .toArray()
      .then(responseData => {
        console.log('Cachinh: All Cached Data for Module', responseData);
        if (responseData && responseData.length > 0) {
          responseData.forEach(cachedDataForModule => {
            this.deleteCacheByKey(cachedDataForModule.hashkey);
          });
        }
      })
      .catch(err => {
        console.log('responseData', 'errorwhile querying the records');
      });
  }

  deleteDataFromStore(storeName: Dexie.Table<any, string>, key: string) {
    let responsevalue: any;
    this.cachedDB
      .transaction('rw', storeName, () => {
        storeName.get(key).then(value => {
          if (!!value) {
            responsevalue = value.data;
            storeName.delete(key).then();
          }
        });
      })
      .then(() => {
        if (!!responsevalue && storeName === this.apiDataTable) {
          this.updateCacheSize(CachingEnum.DELETE, sizeof(responsevalue));
        }
      });
  }

  updateCacheRequestCount(countKey: string) {
    let newCount: number;
    return this.cachedDB.transaction('rw', this.analyticsTable, async () => {
      this.analyticsTable.get(countKey).then(currentCount => {
        if (!currentCount) {
          currentCount = 0;
        }
        newCount = currentCount + 1;
        this.analyticsTable.put(newCount, countKey).then(() => {
          console.log(`caching: this.updateCacheRequestCount - ${newCount}`);
        });
        return newCount;
      });
    });
  }

  getAnalyticsCountByKey(key: string): Observable<number> {
    const cacheCount = this.getAnalyticsCount(key);
    return from(cacheCount);
  }

  async getAnalyticsCount(key: string) {
    let hitCount;
    await this.analyticsTable.get(key).then(count => {
      hitCount = count;
    });
    console.log(`Caching: this.analyticsTable, hitCount - ${hitCount}`);
    return hitCount;
  }

  getCacheSize(): Observable<any> {
    const cacheSize = this.getMetaCacheSize();
    return from(cacheSize);
  }

  async getMetaCacheSize() {
    let cacheSize;
    await this.metaDataTable.get(CachingEnum.CACHE_SIZE).then(size => {
      cacheSize = size;
    });
    return cacheSize;
  }

  updateCacheSize(type: string, objectSize: number) {
    this.cachedDB.transaction('rw', this.metaDataTable, () => {
      this.metaDataTable.get(CachingEnum.CACHE_SIZE).then(size => {
        let currentSize: number;
        let newSize: number;
        if (size !== undefined && size !== null) {
          currentSize = size;
        } else {
          currentSize = 0;
        }
        switch (type) {
          case CachingEnum.ADD:
            newSize = currentSize + objectSize;
            break;
          case CachingEnum.DELETE:
            newSize = currentSize - objectSize;
            break;
          case CachingEnum.CLEAR:
            newSize = 0;
            break;
          default:
            break;
        }
        this.metaDataTable.put(newSize, CachingEnum.CACHE_SIZE).then(() => {
          console.log(
            `Caching: metaDataTable - ${type}: currentSize:${currentSize}, objectSize:${objectSize}, newSize:${newSize}`
          );
        });
      });
    });
  }
}
