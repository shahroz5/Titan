import { fakeAsync } from '@angular/core/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '@poss-web/shared/util-api-service';
import { of } from 'rxjs';
import { PaymentDataService } from './payment-data.service';
import {
  CacheableApiService,
  DexieService,
  HashkeyGeneratorService,
  StorageFacade
} from '@poss-web/shared/util-cacheable-api-service';
import { CachingStrategySetting } from '@poss-web/shared/models';

export function apiServiceFactory(httpClient: HttpClient, apiURL: string) {
  return new ApiService(httpClient, apiURL);
}
const getMasterLocationBaseUrl = (): string => {
  return `http://localhost:3000/location/v2`;
};
export const getMasterRegionsUrl = (
  regionType: string,
  pageIndex?: number,
  pageSize?: number,
  isActive?: boolean,
  isPageable?: boolean,
  parentRegionCode?: string,
  sort?: string[]
): { path: string; params: HttpParams } => {
  const path = getMasterLocationBaseUrl() + '/regions';
  let params = new HttpParams();

  if (regionType !== null && regionType !== undefined) {
    params = params.append('regionType', regionType);
  }

  if (isActive !== null && isActive !== undefined) {
    params = params.append('isActive', isActive.toString());
  }
  if (pageIndex !== null && pageIndex !== undefined) {
    params = params.append('page', pageIndex.toString());
  }
  if (pageSize !== null && pageSize !== undefined) {
    params = params.append('size', pageSize.toString());
  }
  if (parentRegionCode) {
    params = params.append('parentRegionCode', parentRegionCode);
  }
  if (sort) {
    sort.forEach(sortvalue => {
      params = params.append('sort', sortvalue);
    });
  }
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path,
    params
  };
};
describe('Testing Payment Data Service Functionality', () => {
  let service: PaymentDataService;
  let cacheableApiService: CacheableApiService;

  const http: HttpClient = null;

  beforeAll(() => {});
  beforeEach(() => {
    const indexedDBStorage = new DexieService();
    const cachingStrategySettings: CachingStrategySetting[] = [
      {
        type: 3,
        name: 'InvalidatedBySize',
        category: 'cache',
        size: 1,
        unit: 'MB'
      }
    ];
    cacheableApiService = new CacheableApiService(
      new HashkeyGeneratorService('test'),
      new StorageFacade(indexedDBStorage),
      new ApiService(http, 'test'),
      cachingStrategySettings
    );

    service = new PaymentDataService(cacheableApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
