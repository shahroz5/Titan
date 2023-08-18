import { Injectable } from '@angular/core';
import { CacheableStorage, CachingEnum } from '@poss-web/shared/models';
import sizeof from 'object-sizeof';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements CacheableStorage {
  apiDataTable = 'apiDataTable';
  metaDataTable = 'metaDataTable';
  analyticsTable = 'analyticsTable';

  setCache(hashKey: string, value: any, storeName = this.apiDataTable) {
    try {
      let cachedApiData = new Map();
      const tableData = JSON.parse(localStorage.getItem(storeName));
      if (!!tableData && tableData.length > 0) {
        cachedApiData = new Map(tableData);
      }

      const mapInput = cachedApiData.set(hashKey, value);
      localStorage.setItem(storeName, JSON.stringify([...mapInput]));
      if (storeName === this.apiDataTable) {
        this.updateCacheSize(CachingEnum.ADD, sizeof(value));
      }
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  getCache(hashKey: string): Observable<any> {
    try {
      const response = this.getDataFromStore(hashKey);
      return of(response);
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return null;
    }
  }

  getDataFromStore(key: string, storeName: string = this.apiDataTable) {
    const tableData = JSON.parse(localStorage.getItem(storeName));
    if (tableData && tableData.length > 0) {
      const tableDataMap = new Map(tableData);
      return tableDataMap.get(key);
    } else {
      return undefined;
    }
  }

  checkIfHashKeyExistInCache(hashKey: string): Observable<any> {
    return this.getCache(hashKey);
  }

  clearCache(storeName: string = this.apiDataTable) {
    this.clearDataFromStore(storeName);
  }

  clearDataFromStore(storeName: string) {
    localStorage.removeItem(storeName);
    if (storeName === this.apiDataTable) {
      this.updateCacheSize(CachingEnum.CLEAR, 0);
    }
  }

  clearCachedDataForUser() {
    this.clearCache(this.apiDataTable);
    this.deleteCacheByKey(CachingEnum.SESSION_COUNT, this.analyticsTable);
  }

  deleteCacheByKey(hashKey: string, storeName: any = this.apiDataTable) {
    const tableData = JSON.parse(localStorage.getItem(storeName));
    if (tableData && tableData.length > 0) {
      const tableDataMap = new Map(tableData);
      if (tableDataMap.has(hashKey)) {
        const responsevalue = tableDataMap.get(hashKey);
        tableDataMap.delete(hashKey);
        localStorage.setItem(storeName, JSON.stringify([...tableDataMap]));

        // To update the cacheSize in metaDataTable
        if (!!responsevalue && storeName === this.apiDataTable) {
          this.updateCacheSize(CachingEnum.DELETE, sizeof(responsevalue));
        }
      }
    }
  }

  updateCacheRequestCount(countKey: string) {
    let currentCount = 0;
    let newCount = 0;
    let cachedAnalyticsData = new Map();

    const tableData = JSON.parse(localStorage.getItem(this.analyticsTable));
    if (!!tableData && tableData.length > 0) {
      cachedAnalyticsData = new Map(tableData);
      currentCount = cachedAnalyticsData.get(countKey);
    }
    if (!currentCount) {
      currentCount = 0;
    }
    newCount = Number(currentCount) + 1;
    const response = cachedAnalyticsData.set(countKey, newCount);
    localStorage.setItem(this.analyticsTable, JSON.stringify([...response]));
  }

  getAnalyticsCount(key: string): number {
    let newCount = 0;
    const hitCount = this.getDataFromStore(key, this.analyticsTable);
    if (!!hitCount) {
      newCount = Number(hitCount);
    }
    return newCount;
  }

  getCacheSize(): Observable<number> {
    const cacheSize = this.getMetaCacheSize();
    return of(cacheSize);
  }

  getMetaCacheSize(): number {
    let cacheSize = 0;
    let cachedMetaData = new Map();
    const tableData = JSON.parse(localStorage.getItem(this.metaDataTable));
    if (!!tableData && tableData.length > 0) {
      cachedMetaData = new Map(tableData);
      cacheSize = cachedMetaData.get(CachingEnum.CACHE_SIZE);
    }

    if (!!cacheSize) {
      cacheSize = Number(cacheSize);
    }
    return cacheSize;
  }

  updateCacheSize(type: string, objectSize: number) {
    let currentSize = 0;
    let newSize = 0;
    let cacheSize = 0;
    let cachedMetaData = new Map();

    const tableData = JSON.parse(localStorage.getItem(this.metaDataTable));
    if (!!tableData && tableData.length > 0) {
      cachedMetaData = new Map(tableData);
      cacheSize = cachedMetaData.get(CachingEnum.CACHE_SIZE);
    }
    if (!!cacheSize) {
      currentSize = Number(cacheSize);
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
    }

    const response = cachedMetaData.set(CachingEnum.CACHE_SIZE, newSize);
    localStorage.setItem(this.metaDataTable, JSON.stringify([...response]));
  }
}
