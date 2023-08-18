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
import { RegionDataService } from './region.data.service';

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
describe('Testing Region Master Data Service Functionality', () => {
  let service: RegionDataService;
  let cacheableApiService: CacheableApiService;

  const http: HttpClient = null;
  let regionData: any;
  let regionSummaryData: any;
  beforeAll(() => {
    regionData = {
      results: [
        {
          regionCode: 'East',
          description: 'East',
          configDetails: {},
          parentRegionCode: '',
          orgCode: 'TJ',
          isActive: true
        },
        {
          regionCode: 'North',
          description: 'North',
          configDetails: {},
          parentRegionCode: '',
          orgCode: 'TJ',
          isActive: true
        },
        {
          regionCode: 'NorthEast',
          description: 'testingtttt',
          configDetails: {},
          parentRegionCode: '',
          orgCode: null,
          isActive: true
        },
        {
          regionCode: 'Northhhh',
          description: 'testing',
          configDetails: {},
          parentRegionCode: '',
          orgCode: null,
          isActive: true
        },
        {
          regionCode: 'NorthWEST',
          description: 'testing',
          configDetails: {},
          parentRegionCode: '',
          orgCode: null,
          isActive: true
        },
        {
          regionCode: 'South',
          description: 'South',
          configDetails: {},
          parentRegionCode: '',
          orgCode: 'TJ',
          isActive: true
        },
        {
          regionCode: 'West',
          description: 'West ',
          configDetails: {},
          parentRegionCode: '',
          orgCode: 'TJ',
          isActive: true
        }
      ],
      pageNumber: 0,
      pageSize: 20,
      totalPages: 1,
      totalElements: 7
    };
    regionSummaryData = {
      results: [
        {
          regionCode: 'East',
          description: 'East'
        },
        {
          regionCode: 'North',
          description: 'North'
        },
        {
          regionCode: 'NorthEast',
          description: 'testingtttt'
        },
        {
          regionCode: 'Northhhh',
          description: 'testing'
        },
        {
          regionCode: 'NorthWEST',
          description: 'testing'
        },
        {
          regionCode: 'South',
          description: 'South'
        },
        {
          regionCode: 'West',
          description: 'West '
        },
        {
          regionCode: 'West4',
          description: 'West4'
        },
        {
          regionCode: 'Westt',
          description: 'West'
        },
        {
          regionCode: 'Westt1',
          description: 'West'
        }
      ],
      pageNumber: 0,
      pageSize: 2147483647,
      totalPages: 1,
      totalElements: 10
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

    service = new RegionDataService(cacheableApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get 7 Region', () => {
    const regionType = 'REGION';

    spyOn(cacheableApiService, 'get').and.returnValue(of(regionData));

    service.getRegions(regionType).subscribe(x => {
      expect(x.length).toEqual(7);
    });
  });
  it('should get all Regions', () => {
    // arrange
    const regionType = 'REGION';

    spyOn(cacheableApiService, 'get').and.returnValue(of(regionData));

    service.getRegions(regionType).subscribe(x => {
      expect(x).toEqual(regionData.results);
    });
  });
  it('should get total count of Regions', () => {
    // arrange
    const regionType = 'REGION';

    spyOn(cacheableApiService, 'get').and.returnValue(of(regionData));

    service.getRegionsCount(regionType).subscribe(x => {
      expect(x).toEqual(regionData.totalElements);
    });
  });

  it('should get regionSummary ', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(regionSummaryData));

    service.getRegionSummary(false).subscribe(x => {
      expect(x).toEqual(regionSummaryData.results);
    });
  });
});
