import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '@poss-web/shared/util-api-service';
import { of } from 'rxjs';

import { CachingStrategySetting } from '@poss-web/shared/models';
import {
  CacheableApiService,
  DexieService,
  HashkeyGeneratorService,
  StorageFacade
} from '@poss-web/shared/util-cacheable-api-service';
import * as moment from 'moment';

import { PinCodeDataService } from './pincodes.data.service';

export function apiServiceFactory(httpClient: HttpClient, apiURL: string) {
  return new ApiService(httpClient, apiURL);
}
export const getMasterPinCodesSummaryUrl = (
  countryCode: string,
  pincode: string,
  pageIndex?: number,
  pageSize?: number,
  isPageable?: boolean,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path = getEngineBaseUrl() + `/countries/${countryCode}/pincodes`;
  let params = new HttpParams();
  if (pincode) {
    params = params.append('pincode', pincode);
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

const getMasterLocationBaseUrl = (): string => {
  return `http://localhost:3000/location/v2`;
};
const getEngineBaseUrl = (): string => {
  return `http://localhost:3000/engine/v2/locations`;
};
describe('Testing pincode Data Service Functionality', () => {
  let service: PinCodeDataService;
  let cacheableApiService: CacheableApiService;

  const http: HttpClient = null;
  let pincodes: any;
  beforeAll(() => {
    pincodes = {
      results: [
        {
          id: 24059,
          pincode: '560059',
          cachementArea: 'R V Niketan',
          townName: 'Bangalore',
          stateName: 'Karnataka',
          countryCode: 'IND',
          isActive: true
        }
      ],
      pageNumber: 0,
      pageSize: 20,
      totalPages: 1,
      totalElements: 1
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

    service = new PinCodeDataService(cacheableApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get pincodes on the basis of countrycode and pincode', () => {
    const countryCode = 'IND';
    const pincode = '560059';
    spyOn(cacheableApiService, 'get').and.returnValue(of(pincodes));

    service.getPincodesSummary(countryCode, pincode).subscribe(x => {
      expect(x).toEqual(pincodes.results);
    });
  });
});
