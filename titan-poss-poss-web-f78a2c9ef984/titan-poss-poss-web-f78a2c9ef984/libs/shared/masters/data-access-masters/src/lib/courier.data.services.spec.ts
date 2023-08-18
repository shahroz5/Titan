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
import { CourierDataService } from './courier.data.service';

export function apiServiceFactory(httpClient: HttpClient, apiURL: string) {
  return new ApiService(httpClient, apiURL);
}
const getMasterInventoryBaseUrl = (): string => {
  return `http://localhost:3000/inventory/v2`;
};
const getMasterCourierUrl = (
  pageIndex?: number,
  pageSize?: number,
  isActive?: boolean,
  locationCode?: string,
  isPageable?: boolean,
  sort?: string[]
): { path: string; params: HttpParams } => {
  const path = getMasterInventoryBaseUrl() + '/couriers';
  let params = new HttpParams();
  if (locationCode) {
    params = params.append('locationCode', locationCode);
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
describe('Testing Courier Master Data Service Functionality', () => {
  let service: CourierDataService;
  let cacheableApiService: CacheableApiService;

  const http: HttpClient = null;
  let courierData: any;
  beforeAll(() => {
    courierData = {
      results: [
        {
          courierName: '0009999',
          address: 'BANGLAORE',
          stateCode: '1',
          townCode: '3',
          mailId: 'ramaiiit9@gmail.com',
          phoneNumber: '9010462817',
          mobileNumber: '8096478669',
          contactPerson: 'admin',
          isActive: true
        },
        {
          courierName: '001 Hand Carry',
          address: 'Bangalore',
          stateCode: '19',
          townCode: '45',
          mailId: 'ramya@gmail.com',
          phoneNumber: '9010462817',
          mobileNumber: '8096478669',
          contactPerson: 'admin',
          isActive: true
        },
        {
          courierName: '0duS',
          address: 'pWr82n',
          stateCode: 'Xosn7',
          townCode: 'sYey',
          mailId: 'XKEE@jeeaya.com',
          phoneNumber: '0179221642',
          mobileNumber: '9816513241',
          contactPerson: 'v676c',
          isActive: true
        },
        {
          courierName: '123 Hand Carry',
          address: 'Tarakatur',
          stateCode: '2',
          townCode: '6',
          mailId: 'ramaiiit9@gmail.com',
          phoneNumber: '9010462817',
          mobileNumber: '8096478669',
          contactPerson: 'admin',
          isActive: true
        },
        {
          courierName: '123rama',
          address: 'vijayawada 1',
          stateCode: '4',
          townCode: '13',
          mailId: 'ramya@gmail.com',
          phoneNumber: '9010462817',
          mobileNumber: '9010462817',
          contactPerson: 'admins',
          isActive: false
        },
        {
          courierName: '123rama1111234',
          address: 'Bangalore ',
          stateCode: '1',
          townCode: '1',
          mailId: 'ramaiiit9@gmail.com',
          phoneNumber: '9010462817',
          mobileNumber: '8096478669',
          contactPerson: 'admin',
          isActive: true
        },
        {
          courierName: '123rama2',
          address: 'asdf',
          stateCode: '1',
          townCode: '2',
          mailId: 'sad@asd.w',
          phoneNumber: '2222222222',
          mobileNumber: '2222222222',
          contactPerson: 'rama',
          isActive: true
        },
        {
          courierName: '3eej',
          address: 'LmN5wK',
          stateCode: 'z4kAB',
          townCode: 'U2ye',
          mailId: '33Wx@jeeaya.com',
          phoneNumber: '0179221642',
          mobileNumber: '9816513241',
          contactPerson: '1gJBX',
          isActive: false
        },
        {
          courierName: '3QF5',
          address: 'yvWq9u',
          stateCode: 'EM0z7',
          townCode: 'YNBc',
          mailId: 'B9qQ@jeeaya.com',
          phoneNumber: '0179221642',
          mobileNumber: '9816513241',
          contactPerson: '8KbBS',
          isActive: false
        },
        {
          courierName: '456 Hand Carry ',
          address: 'Banglaore',
          stateCode: '1',
          townCode: '3',
          mailId: 'ramaiiit9@gmail.com',
          phoneNumber: '9010462817',
          mobileNumber: '9010462817',
          contactPerson: 'admin',
          isActive: true
        },
        {
          courierName: '5Jrt',
          address: 'gY0tGu',
          stateCode: 'YXP7d',
          townCode: 'jJCc',
          mailId: 'P20o@jeeaya.com',
          phoneNumber: '0179221642',
          mobileNumber: '9816513241',
          contactPerson: 'FKPwx',
          isActive: false
        },
        {
          courierName: '5oEV',
          address: 'xNbPoS',
          stateCode: 'eUUU9',
          townCode: 'cRf9',
          mailId: '6Xsm@jeeaya.com',
          phoneNumber: '0179221642',
          mobileNumber: '9816513241',
          contactPerson: 'F0Jrn',
          isActive: false
        },
        {
          courierName: '654 Hand Carry',
          address: 'Vijayawada',
          stateCode: '1',
          townCode: '3',
          mailId: 'ramaiiit9@gmail.com',
          phoneNumber: '9010462817',
          mobileNumber: '9010462817',
          contactPerson: 'admin',
          isActive: true
        },
        {
          courierName: '6FGd',
          address: 'yFdRMN',
          stateCode: 'jwyfp',
          townCode: 'gcLB',
          mailId: 'Rsi2@jeeaya.com',
          phoneNumber: '0179221642',
          mobileNumber: '9816513241',
          contactPerson: 'y2CW5',
          isActive: false
        },
        {
          courierName: '72rh',
          address: 'LNKUrz',
          stateCode: 'yPPb9',
          townCode: 'giFX',
          mailId: 'U915@jeeaya.com',
          phoneNumber: '0179221642',
          mobileNumber: '9816513241',
          contactPerson: 'Sb4k6',
          isActive: false
        },
        {
          courierName: '897HandCarry',
          address: 'Bnagaore',
          stateCode: '1',
          townCode: '124',
          mailId: 'ramaiiit9@gmail.com',
          phoneNumber: '9010462817',
          mobileNumber: '8096478669',
          contactPerson: 'admin',
          isActive: false
        },
        {
          courierName: '9DXZ',
          address: '0e95Et',
          stateCode: '6bgpu',
          townCode: 'D8ot',
          mailId: 'hy3n@jeeaya.com',
          phoneNumber: '0179221642',
          mobileNumber: '9816513241',
          contactPerson: 'UwR0F',
          isActive: false
        },
        {
          courierName: 'ABC',
          address: 'string',
          stateCode: '1',
          townCode: '2',
          mailId: 'ramaiiit9@gmail.com',
          phoneNumber: '9010462817',
          mobileNumber: '9010462817',
          contactPerson: 'admi',
          isActive: true
        },
        {
          courierName: 'ABC1234',
          address: 'Bangalore555',
          stateCode: '5',
          townCode: '17',
          mailId: 'admin@gmail.com',
          phoneNumber: '8096478669',
          mobileNumber: '',
          contactPerson: 'ram',
          isActive: false
        },
        {
          courierName: 'ABC1456',
          address: 'Banglaore',
          stateCode: '2',
          townCode: '5',
          mailId: 'ramaiiit9@gmail.com',
          phoneNumber: '9010462817',
          mobileNumber: '',
          contactPerson: 'admin',
          isActive: true
        }
      ],
      pageNumber: 0,
      pageSize: 20,
      totalPages: 7,
      totalElements: 128
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

    service = new CourierDataService(cacheableApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get 20 Courier', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(courierData));

    service.getCouriers().subscribe(x => {
      expect(x.length).toEqual(20);
    });
  });
  it('should get all Couriers', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(courierData));

    service.getCouriers().subscribe(x => {
      expect(x).toEqual(courierData.results);
    });
  });
  it('should get total count of Couriers', () => {
    // arrange

    spyOn(cacheableApiService, 'get').and.returnValue(of(courierData));

    service.getCouriersCount().subscribe(x => {
      expect(x).toEqual(courierData.totalElements);
    });
  });

  it('should get courierSummary ', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(courierData));

    service.getCouriersSummary().subscribe(x => {
      expect(x).toEqual(courierData.results);
    });
  });
});
