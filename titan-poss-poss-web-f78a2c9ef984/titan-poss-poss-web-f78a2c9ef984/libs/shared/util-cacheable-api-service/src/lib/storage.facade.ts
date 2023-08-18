import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DexieService } from './dexie.service';
import { IdbService } from './idb.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StorageFacade {
  constructor(private indexedDBStorage: DexieService) {}

  setCache(hashKey: string, apiResponse: any, currentTime: string) {
    const value = { apiData: apiResponse, currentTime };

    this.indexedDBStorage.setCache(hashKey, value);
  }

  getCache(hashKey: string): Observable<any> {
    return this.indexedDBStorage.getCache(hashKey);
  }

  checkIfHashKeyExistInCache(hashKey: string): Observable<any> {
    return this.indexedDBStorage.checkIfHashKeyExistInCache(hashKey);
  }

  deleteCacheByKey(hashKey: string) {
    this.indexedDBStorage.deleteCacheByKey(hashKey);
  }

  deleteAllCachedDataForModule(moduleNameHash: string) {
    // Only available in dexie
    //TODO: Add this feature in local storage service
    this.indexedDBStorage.deleteAllCachedDataForModule(moduleNameHash);
  }

  clearCache() {
    this.indexedDBStorage.clearCache();
  }

  updateCacheRequestCount(countKey) {
    return this.indexedDBStorage.updateCacheRequestCount(countKey);
  }
  clearCachedDataForUser() {
    this.indexedDBStorage.clearCachedDataForUser();
  }
  getAnalyticsCount(key: string): Observable<number> {
    return this.indexedDBStorage.getAnalyticsCountByKey(key);
  }
  getCacheSize(): Observable<any> {
    return this.indexedDBStorage.getCacheSize();
  }
}
