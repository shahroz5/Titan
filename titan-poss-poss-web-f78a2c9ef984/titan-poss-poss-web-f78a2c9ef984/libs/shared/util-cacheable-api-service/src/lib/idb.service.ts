import { Injectable } from '@angular/core';
import { CacheableStorage } from '@poss-web/shared/models';
import { openDB } from 'idb';
import { from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdbService implements CacheableStorage {
  cachedDB;

  constructor() {
    this.openIndexedDB();
  }

  openIndexedDB() {
    this.cachedDB = openDB<any>('PossDB-idb', 1, {
      upgrade(cacheDB) {
        cacheDB.createObjectStore('apiDataTable');
        cacheDB.createObjectStore('metaDataTable');
        cacheDB.createObjectStore('analyticsTable');
      }
    });
  }

  setCache(hashKey: string, value) {
    this.setDataInStore('apiDataTable', hashKey, value);
  }

  setDataInStore(storeName: string, key: string, value) {
    return this.cachedDB
      .then(async db => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.put(value, key).then();
      })
      .catch(this.openIndexedDB());
  }

  getCache(hashKey: string): Observable<any> {
    const response = this.getDataFromStore('apiDataTable', hashKey);
    return from(response);
  }

  async getDataFromStore(storeName: string, key: string) {
    let cachedResponse;
    await this.cachedDB
      .then(db => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        cachedResponse = store.get(key);
      })
      .catch(this.openIndexedDB());
    return cachedResponse;
  }

  checkIfHashKeyExistInCache(hashKey: string): Observable<any> {
    return this.getCache(hashKey);
  }

  clearCache() {
    this.clearDataFromStore('apiDataTable');
  }

  clearDataFromStore(storeName: string) {
    this.cachedDB.then(db => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.clear();
    });
  }

  deleteCacheByKey(hashKey: string) {
    this.deleteDataFromStore('apiDataTable', hashKey);
  }

  deleteDataFromStore(storeName: string, hashKey: string) {
    this.cachedDB.then(db => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.delete(hashKey);
    });
  }

  updateCacheRequestCount(countKey: string) {
    let newCount: number;
    return this.getDataFromStore('analyticsTable', 'count').then(countValue => {
      if (!countValue) {
        countValue = 0;
      }
      newCount = countValue + 1;
      this.setDataInStore('analyticsTable', 'count', newCount);
      return newCount;
    });
  }



  getCacheSize(): Observable<any> {
    return of();
  }
}
