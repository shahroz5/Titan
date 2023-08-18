import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '@poss-web/shared/util-api-service';
import { of } from 'rxjs';
import { StateDataService } from './state.data.service';
import { CachingStrategySetting } from '@poss-web/shared/models';
import {
  CacheableApiService,
  DexieService,
  HashkeyGeneratorService,
  StorageFacade
} from '@poss-web/shared/util-cacheable-api-service';

export function apiServiceFactory(httpClient: HttpClient, apiURL: string) {
  return new ApiService(httpClient, apiURL);
}

const getMasterLocationBaseUrl = (): string => {
  return `http://localhost:3000/location/v2`;
};
const getApiURL = (): string => {
  return `http://localhost:3000`;
};
export const getMasterStatesUrl = (
  pageIndex?: number,
  pageSize?: number,
  isActive?: boolean,
  countryCode?: string,
  isPageable?: boolean,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path = getMasterLocationBaseUrl() + `/states`;
  let params = new HttpParams();
  if (countryCode) {
    params = params.append('countryCode', countryCode);
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
describe('Testing State Master Data Service Functionality', () => {
  let service: StateDataService;
  let cacheableApiService: CacheableApiService;

  const http: HttpClient = null;
  let stateData: any;
  let stateSummaryData: any;
  let stateByIdData: any;
  beforeAll(() => {
    stateSummaryData = {
      results: [
        {
          stateId: 1,
          description: 'KARNATAKA',
          stateTaxCode: 12
        }
      ],
      pageNumber: 0,
      pageSize: 1,
      totalPages: 1,
      totalElements: 1
    };
    stateData = {
      results: [
        {
          stateId: 1,
          description: 'KARNATAKA',
          countryCode: 'IND',
          stateCode: 'KA',
          stateTaxCode: 29,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 2,
          description: 'TAMIL NADU',
          countryCode: 'IND',
          stateCode: 'TN',
          stateTaxCode: 33,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 3,
          description: 'KERALA',
          countryCode: 'IND',
          stateCode: 'KL',
          stateTaxCode: 32,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 4,
          description: 'ANDHRA PRADESH',
          countryCode: 'IND',
          stateCode: 'AP',
          stateTaxCode: 37,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 5,
          description: 'GOA',
          countryCode: 'IND',
          stateCode: 'GA',
          stateTaxCode: 30,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 6,
          description: 'PONDICHERRY',
          countryCode: 'IND',
          stateCode: 'PY',
          stateTaxCode: 34,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 7,
          description: 'MAHARASHTRA',
          countryCode: 'IND',
          stateCode: 'MH',
          stateTaxCode: 27,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 8,
          description: 'GUJARAT',
          countryCode: 'IND',
          stateCode: 'GJ',
          stateTaxCode: 24,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 9,
          description: 'MADHYA PRADESH',
          countryCode: 'IND',
          stateCode: 'MP',
          stateTaxCode: 23,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 10,
          description: 'CHATTISGARH',
          countryCode: 'IND',
          stateCode: 'CT',
          stateTaxCode: 22,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 11,
          description: 'DELHI',
          countryCode: 'IND',
          stateCode: 'DL',
          stateTaxCode: 7,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 12,
          description: 'RAJASTHAN',
          countryCode: 'IND',
          stateCode: 'RJ',
          stateTaxCode: 8,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 13,
          description: 'UTTAR PRADESH',
          countryCode: 'IND',
          stateCode: 'UP',
          stateTaxCode: 9,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 14,
          description: 'UTTARANCHAL',
          countryCode: 'IND',
          stateCode: 'UT',
          stateTaxCode: 36,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 15,
          description: 'HIMACHAL PRADESH',
          countryCode: 'IND',
          stateCode: 'HP',
          stateTaxCode: 2,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 16,
          description: 'JAMMU & KASHMIR',
          countryCode: 'IND',
          stateCode: 'JK',
          stateTaxCode: 1,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 17,
          description: 'PUNJAB',
          countryCode: 'IND',
          stateCode: 'PB',
          stateTaxCode: 3,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 18,
          description: 'HARYANA',
          countryCode: 'IND',
          stateCode: 'HR',
          stateTaxCode: 6,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        },
        {
          stateId: 19,
          description: 'CHANDIGARH',
          countryCode: 'IND',
          stateCode: 'CH',
          stateTaxCode: 4,
          configDetails: {},
          isActive: true,
          isUnionTerritory: true
        },
        {
          stateId: 20,
          description: 'WEST BENGAL',
          countryCode: 'IND',
          stateCode: 'WB',
          stateTaxCode: 19,
          configDetails: {},
          isActive: true,
          isUnionTerritory: false
        }
      ],
      pageNumber: 0,
      pageSize: 20,
      totalPages: 2,
      totalElements: 37
    };
    stateByIdData = {
      configDetails: {},
      countryCode: 'IND',
      description: 'KARNATAKA',
      isActive: true,
      stateCode: 'KA',
      stateId: 1,
      stateTaxCode: 29,
      isUnionTerritory: false
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

    service = new StateDataService(cacheableApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get 20 State', () => {
    // arrange

    spyOn(cacheableApiService, 'get').and.returnValue(of(stateData));

    // act
    service.getStates().subscribe(x => {
      expect(x.length).toEqual(20);
    });
  });
  it('should get all States', () => {
    // arrange
    spyOn(cacheableApiService, 'get').and.returnValue(of(stateData));

    // act
    service.getStates().subscribe(x => {
      expect(x).toEqual(stateData.results);
    });
  });
  it('should get total count of States', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(stateData));

    service.getStatesCount().subscribe(x => {
      expect(x).toEqual(stateData.totalElements);
    });
  });

  it('should get stateSummary ', () => {
    const countryCode = 'IND';
    spyOn(cacheableApiService, 'get').and.returnValue(of(stateSummaryData));

    service.getStatesSummary(countryCode).subscribe(x => {
      expect(x).toEqual(stateSummaryData.results);
    });
  });
  it('should get state by State Id ', () => {
    // act
    const stateId = 1;

    spyOn(cacheableApiService, 'get').and.returnValue(of(stateByIdData));

    service.getStateById(stateId).subscribe(x => {
      expect(x).toEqual(stateByIdData);
    });
  });
});
