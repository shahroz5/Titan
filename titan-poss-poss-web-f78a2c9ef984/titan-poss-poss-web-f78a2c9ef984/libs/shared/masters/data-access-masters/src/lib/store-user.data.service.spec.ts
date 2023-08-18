import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '@poss-web/shared/util-api-service';
import { of } from 'rxjs';
import { StoreUserDataService } from './store-user.data.service';
import { CachingStrategySetting } from '@poss-web/shared/models';
import {
  CacheableApiService,
  DexieService,
  HashkeyGeneratorService,
  StorageFacade
} from '@poss-web/shared/util-cacheable-api-service';
import * as moment from 'moment';

export function apiServiceFactory(httpClient: HttpClient, apiURL: string) {
  return new ApiService(httpClient, apiURL);
}

export const getMasterStoreUserBaseUrl = (): string => {
  return `http://localhost:3000/engine/v2`;
};
export const getMasterStoreUserUrl = (
  pageIndex?: number,
  pageSize?: number,
  isActive?: boolean,
  searchField?: string,
  roleCodes?: string[],
  sort?: string[]
): { path: string; params: HttpParams } => {
  const path = getMasterStoreUserBaseUrl() + '/users';
  let params = new HttpParams();
  if (searchField) {
    params = params.append('searchField', searchField);
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
  if (roleCodes) {
    roleCodes.forEach(roleCodevalue => {
      params = params.append('roleCodes', roleCodevalue);
    });
  }
  return {
    path,
    params
  };
};
describe('Testing StoreUser Master Data Service Functionality', () => {
  let service: StoreUserDataService;
  let cacheableApiService: CacheableApiService;

  const http: HttpClient = null;
  let storeUserData: any;
  let storeUser: any;
  beforeAll(() => {
    storeUserData = {
      results: [
        {
          employeeCode: '2344',
          empName: 'Testing User',
          locationCode: 'URB',
          mobileNo: '1342545565'
        }
      ],
      pageNumber: 0,
      pageSize: 1,
      totalPages: 1,
      totalElements: 1
    };
    storeUser = {
      employeeCode: 'bos.urb',
      empName: 'URB User',
      locationCode: 'URB',
      userType: 'L1',
      employeeType: 'PERMANENT',
      mobileNo: '8608455845',
      address: {},
      joiningDate: moment(1574070698628),
      resignationDate: moment(1574070698628),
      birthDate: moment(1574070698628),
      emailId: 'bos.urb@mindtree.com',
      hasLoginAccess: true,
      forcePasswordChange: false,
      roles: [
        {
          roleCode: 'BOS',
          roleName: 'Boutique Operations Specialist',
          description: 'Boutique Operations Specialist in Tanishq Jewellers',
          isPrimary: true,
          startTime: null,
          expiryTime: null,
          corpAccess: false
        }
      ],
      regionCode: null,
      orgCode: 'TJ',
      requestedMobileNo: null,
      isLoginActive: true,
      isLocked: false,
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

    service = new StoreUserDataService(cacheableApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get 1 StoreUser', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(storeUserData));

    service.getStoreUsers().subscribe(x => {
      expect(x.length).toEqual(1);
    });
  });
  it('should get all StoreUsers', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(storeUserData));

    service.getStoreUsers().subscribe(x => {
      expect(x).toEqual(storeUserData.results);
    });
  });
  it('should get total count of StoreUsers', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(storeUserData));

    service.getStoreUsersCount().subscribe(x => {
      expect(x).toEqual(storeUserData.totalElements);
    });
    // arrange
  });
});
