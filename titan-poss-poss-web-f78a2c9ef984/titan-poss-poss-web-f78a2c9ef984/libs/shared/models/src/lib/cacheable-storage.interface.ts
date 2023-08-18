import { Observable } from 'rxjs';

export interface CacheableStorage {
  setCache(hashKey: string, value: object);

  getCache(hashKey: string): Observable<any>;

  checkIfHashKeyExistInCache(hashKey: string): Observable<any>;

  clearCache(storeName);

  deleteCacheByKey(hashKey: string, storeName);
}
