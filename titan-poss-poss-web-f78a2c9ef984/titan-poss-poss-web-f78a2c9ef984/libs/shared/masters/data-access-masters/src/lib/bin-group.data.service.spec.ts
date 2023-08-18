import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '@poss-web/shared/util-api-service';
import { of } from 'rxjs';

import {
  CacheableApiService,
  DexieService,
  HashkeyGeneratorService,
  StorageFacade
} from '@poss-web/shared/util-cacheable-api-service';
import { CachingStrategySetting } from '@poss-web/shared/models';
import { BinGroupDataService } from './bin-group.data.service';
import { Observable } from 'rxjs';

export function apiServiceFactory(httpClient: HttpClient, apiURL: string) {
  return new ApiService(httpClient, apiURL);
}
const getMasterBinGroupsUrl = (
  pageIndex?: number,
  pageSize?: number,
  locationCode?: string,
  isActive?: boolean,
  isPageable?: boolean,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path = getMasterInventoryBaseUrl() + '/bingroups';
  let params = new HttpParams();
  if (locationCode) {
    params = params.append('locationCode', locationCode);
  }
  if (isActive !== null && isActive !== undefined) {
    params = params.append('isActive', isActive.toString());
  }
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  if (pageIndex !== null && pageIndex !== undefined) {
    params = params.append('page', pageIndex.toString());
  }
  if (pageSize !== null && pageSize !== undefined) {
    params = params.append('size', pageSize.toString());
  }
  if (sort) {
    sort.forEach(sortvalue => {
      params = params.append('sort', sortvalue);
    });
  }
  return {
    path,
    params
  };
};
const getMasterInventoryBaseUrl = (): string => {
  return `http://localhost:3000/inventory/v2`;
};

export const getMasterBinGroupByCodeUrl = (binGroupCode): string => {
  return getMasterInventoryBaseUrl() + `/bingroups/${binGroupCode}`;
};

describe('Testing Bin Master Data Service Functionality', () => {
  let service: BinGroupDataService;
  let cacheableApiService: CacheableApiService;

  const http: HttpClient = null;
  let binGroupByCodeData: any;
  let testBinGroupData: any;
  beforeAll(() => {
    testBinGroupData = {
      results: [
        {
          binGroupCode: 'BinGroupCodeTest',
          description: 'Testing flow',
          isActive: true
        },
        {
          binGroupCode: 'BinGroupTestCODE',
          description: 'Testing flow',
          isActive: true
        },
        { binGroupCode: 'COIN', description: 'For Coins', isActive: true },
        { binGroupCode: 'CON', description: 'Consignment L3', isActive: true },
        {
          binGroupCode: 'CUSTOMERORDERBIN',
          description: 'CUSTOMERORDERBIN - Customised products against order',
          isActive: true
        }
      ],
      pageNumber: 0,
      pageSize: 5,
      totalPages: 6,
      totalElements: 26
    };
    binGroupByCodeData = {
      binGroupCode: '2Btv',
      description: 'Testing bin group creation flow',
      isActive: false
    };
  });
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

    service = new BinGroupDataService(cacheableApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get 5 Bin Groups', () => {
    // arrange

    spyOn(cacheableApiService, 'get').and.returnValue(of(testBinGroupData));

    service.getBinGroups().subscribe(x => {
      expect(x.length).toEqual(5);
    });
  });
  it('should get all Bin Groups', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(testBinGroupData));

    service.getBinGroups().subscribe(x => {
      expect(x).toEqual(testBinGroupData.results);
    });
  });
  it('should get total count of Bin Groups', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(testBinGroupData));

    service.getBingroupCount().subscribe(x => {
      expect(x).toEqual(testBinGroupData.totalElements);
    });
  });

  it('should get Bin-Group by Bin Group Code', () => {
    const binGroupCode = '2Btv';
    spyOn(cacheableApiService, 'get').and.returnValue(of(binGroupByCodeData));

    service.getBinGroupByCode(binGroupCode).subscribe(x => {
      expect(x).toEqual(binGroupByCodeData);
    });
  });
});
