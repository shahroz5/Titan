import { HttpClient, HttpParams } from '@angular/common/http';

import { of } from 'rxjs';
import { TownDataService } from './town.data.service';
import {
  CacheableApiService,
  DexieService,
  HashkeyGeneratorService,
  StorageFacade
} from '@poss-web/shared/util-cacheable-api-service';
import { CachingStrategySetting } from '@poss-web/shared/models';
import { fakeAsync } from '@angular/core/testing';
import { ApiService } from '@poss-web/shared/util-api-service';
export function apiServiceFactory(httpClient: HttpClient, apiURL: string) {
  return new ApiService(httpClient, apiURL);
}
const getMasterLocationBaseUrl = (): string => {
  return `http://localhost:3000/location/v2`;
};

export const getMasterTownsUrl = (
  pageIndex?: number,
  pageSize?: number,
  isActive?: boolean,
  stateCode?: string,
  isPageable?: boolean,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path = getMasterLocationBaseUrl() + `/towns`;
  let params = new HttpParams();
  if (stateCode) {
    params = params.append('stateCode', stateCode);
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

describe('Testing Town Master Data Service Functionality', () => {
  let testService: TownDataService;
  let cacheableApiService: CacheableApiService;

  const http: HttpClient = null;

  let townData: any;

  let town: any;
  let townDataDummy: any;
  let townSummaryDataDummy: any;
  let townSummaryDataDummy1: any;
  let townDummy: any;

  beforeAll(() => {
    townData = {
      results: [
        {
          townCode: 1,
          stateCode: 1,
          description: 'Bangaloreaxsxx',
          isActive: true
        },
        {
          townCode: 2,
          stateCode: 19,
          description: 'MANGALORE',
          isActive: true
        },
        {
          townCode: 3,
          stateCode: 1,
          description: 'HUBLI',
          isActive: true
        },
        {
          townCode: 4,
          stateCode: 2,
          description: 'CHENNAI',
          isActive: true
        },
        {
          townCode: 5,
          stateCode: 2,
          description: 'MADURAI',
          isActive: true
        },
        {
          townCode: 6,
          stateCode: 2,
          description: 'COIMBATORE',
          isActive: true
        },
        {
          townCode: 7,
          stateCode: 3,
          description: 'TUTICORIN',
          isActive: true
        },
        {
          townCode: 8,
          stateCode: 2,
          description: 'SALEM',
          isActive: true
        },
        {
          townCode: 9,
          stateCode: 2,
          description: 'HOSUR',
          isActive: true
        },
        {
          townCode: 10,
          stateCode: 2,
          description: 'TRICHY',
          isActive: true
        },
        {
          townCode: 11,
          stateCode: 3,
          description: 'COCHIN',
          isActive: true
        },
        {
          townCode: 12,
          stateCode: 3,
          description: 'CALICUT',
          isActive: true
        },
        {
          townCode: 13,
          stateCode: 4,
          description: 'HYDERABAD',
          isActive: true
        },
        {
          townCode: 14,
          stateCode: 4,
          description: 'VIZAG',
          isActive: true
        },
        {
          townCode: 15,
          stateCode: 4,
          description: 'VIJAYAWADA',
          isActive: true
        },
        {
          townCode: 16,
          stateCode: 4,
          description: 'SECUNDARABAD',
          isActive: true
        },
        {
          townCode: 17,
          stateCode: 5,
          description: 'PANJIM',
          isActive: true
        },
        {
          townCode: 18,
          stateCode: 7,
          description: 'MUMBAI',
          isActive: true
        },
        {
          townCode: 19,
          stateCode: 7,
          description: 'THANE',
          isActive: true
        },
        {
          townCode: 20,
          stateCode: 7,
          description: 'PUNE',
          isActive: true
        }
      ],
      pageNumber: 0,
      pageSize: 20,
      totalPages: 15,
      totalElements: 284
    };

    town = {
      townCode: 1,
      stateCode: 1,
      description: 'Bangaloreaxsxx',
      isActive: true
    };
    townSummaryDataDummy = {
      results: [
        {
          townId: 1,
          description: 'Bangaloreaxsxx'
        },
        {
          townId: 3,
          description: 'HUBLI'
        },
        {
          townId: 114,
          description: 'Belgaum'
        },
        {
          townId: 115,
          description: 'MYSORE'
        },
        {
          townId: 124,
          description: 'Shimoga'
        },
        {
          townId: 143,
          description: 'KAMMANAHALLI'
        },
        {
          townId: 165,
          description: 'GULBARGA'
        },
        {
          townId: 166,
          description: 'BELLARY'
        },
        {
          townId: 204,
          description: 'KALABURAGI'
        },
        {
          townId: 205,
          description: 'BENGALURU'
        },
        {
          townId: 206,
          description: 'MANGALURU'
        },
        {
          townId: 207,
          description: 'BALLARI'
        },
        {
          townId: 208,
          description: 'BELAGAVI'
        },
        {
          townId: 209,
          description: 'MYSURU'
        },
        {
          townId: 210,
          description: 'SHIVAMOGGA'
        },
        {
          townId: 1076,
          description: 'Udupi'
        },
        {
          townId: 1077,
          description: 'KUDAL'
        },
        {
          townId: 1080,
          description: 'Tumkur'
        },
        {
          townId: 1081,
          description: 'Vijayapura'
        },
        {
          townId: 1083,
          description: 'Test'
        }
      ],
      pageNumber: 0,
      pageSize: 20,
      totalPages: 2,
      totalElements: 31
    };
    townSummaryDataDummy1 = {
      results: [
        {
          townCode: 1,
          description: 'Bangaloreaxsxx'
        },
        {
          townCode: 3,
          description: 'HUBLI'
        },
        {
          townCode: 114,
          description: 'Belgaum'
        },
        {
          townCode: 115,
          description: 'MYSORE'
        },
        {
          townCode: 124,
          description: 'Shimoga'
        },
        {
          townCode: 143,
          description: 'KAMMANAHALLI'
        },
        {
          townCode: 165,
          description: 'GULBARGA'
        },
        {
          townCode: 166,
          description: 'BELLARY'
        },
        {
          townCode: 204,
          description: 'KALABURAGI'
        },
        {
          townCode: 205,
          description: 'BENGALURU'
        },
        {
          townCode: 206,
          description: 'MANGALURU'
        },
        {
          townCode: 207,
          description: 'BALLARI'
        },
        {
          townCode: 208,
          description: 'BELAGAVI'
        },
        {
          townCode: 209,
          description: 'MYSURU'
        },
        {
          townCode: 210,
          description: 'SHIVAMOGGA'
        },
        {
          townCode: 1076,
          description: 'Udupi'
        },
        {
          townCode: 1077,
          description: 'KUDAL'
        },
        {
          townCode: 1080,
          description: 'Tumkur'
        },
        {
          townCode: 1081,
          description: 'Vijayapura'
        },
        {
          townCode: 1083,
          description: 'Test'
        }
      ],
      pageNumber: 0,
      pageSize: 20,
      totalPages: 2,
      totalElements: 31
    };
    townDataDummy = {
      results: [
        {
          townId: 1,
          stateId: 1,
          description: 'Bangaloreaxsxx',
          isActive: true
        },
        {
          townId: 2,
          stateId: 19,
          description: 'MANGALORE',
          isActive: true
        },
        {
          townId: 3,
          stateId: 1,
          description: 'HUBLI',
          isActive: true
        },
        {
          townId: 4,
          stateId: 2,
          description: 'CHENNAI',
          isActive: true
        },
        {
          townId: 5,
          stateId: 2,
          description: 'MADURAI',
          isActive: true
        },
        {
          townId: 6,
          stateId: 2,
          description: 'COIMBATORE',
          isActive: true
        },
        {
          townId: 7,
          stateId: 3,
          description: 'TUTICORIN',
          isActive: true
        },
        {
          townId: 8,
          stateId: 2,
          description: 'SALEM',
          isActive: true
        },
        {
          townId: 9,
          stateId: 2,
          description: 'HOSUR',
          isActive: true
        },
        {
          townId: 10,
          stateId: 2,
          description: 'TRICHY',
          isActive: true
        },
        {
          townId: 11,
          stateId: 3,
          description: 'COCHIN',
          isActive: true
        },
        {
          townId: 12,
          stateId: 3,
          description: 'CALICUT',
          isActive: true
        },
        {
          townId: 13,
          stateId: 4,
          description: 'HYDERABAD',
          isActive: true
        },
        {
          townId: 14,
          stateId: 4,
          description: 'VIZAG',
          isActive: true
        },
        {
          townId: 15,
          stateId: 4,
          description: 'VIJAYAWADA',
          isActive: true
        },
        {
          townId: 16,
          stateId: 4,
          description: 'SECUNDARABAD',
          isActive: true
        },
        {
          townId: 17,
          stateId: 5,
          description: 'PANJIM',
          isActive: true
        },
        {
          townId: 18,
          stateId: 7,
          description: 'MUMBAI',
          isActive: true
        },
        {
          townId: 19,
          stateId: 7,
          description: 'THANE',
          isActive: true
        },
        {
          townId: 20,
          stateId: 7,
          description: 'PUNE',
          isActive: true
        }
      ],
      pageNumber: 0,
      pageSize: 20,
      totalPages: 15,
      totalElements: 284
    };
    townDummy = {
      townId: 1,
      stateId: 1,
      description: 'Bangaloreaxsxx',
      isActive: true
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

    testService = new TownDataService(cacheableApiService);
  });
  afterEach(() => {
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

    testService = new TownDataService(cacheableApiService);
  });

  it('should be created', () => {
    fakeAsync(() => {
      expect(testService).toBeTruthy();
    });
  });

  it('should get 20 Town', () => {
    // arrange

    spyOn(cacheableApiService, 'get').and.returnValue(of(townData));

    // act
    testService.getTowns().subscribe(x => {
      expect(x.length).toEqual(20);
    });
  });
  it('should get all Towns', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(townDataDummy));

    // act
    testService.getTowns().subscribe(x => {
      expect(x).toEqual(townData.results);
    });

    // arrange
  });
  it('should get total count of Towns', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(townData));

    // act
    testService.getTownsCount().subscribe(x => {
      expect(x).toEqual(townData.totalElements);
    });
  });

  it('should get townSummary ', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(townSummaryDataDummy));
    testService.getTownsSummary('1').subscribe(x => {
      expect(x).toEqual(townSummaryDataDummy1.results);
    });
  });
  it('should get town by town Code ', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(townDummy));
    testService.getTownByCode(1).subscribe(x => {
      expect(x).toEqual(town);
    });
  });
});
