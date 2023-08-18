import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { ApiService } from '@poss-web/shared/util-api-service';
import { Observable, of } from 'rxjs';
import { CountryDataService } from './country.data.service';
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
export const getMasterCountriesUrl = (
  pageIndex?: number,
  pageSize?: number,
  isActive?: boolean,
  isPageable?: boolean,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path = getMasterLocationBaseUrl() + `/countries`;
  let params = new HttpParams();
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
const getMasterLocationBaseUrl = (): string => {
  return `http://localhost:3000/location/v2`;
};
const getEngineBaseUrl = (): string => {
  return `http://localhost:3000/engine/v2/location`;
};
describe('Testing Country Master Data Service Functionality', () => {
  let testCountryData: any;
  let testCountryData1: any;
  let countrySummary: any;
  let service: CountryDataService;
  let cacheableApiService: CacheableApiService;
  let spy: any;
  const http: HttpClient = null;

  beforeAll(() => {
    testCountryData = {
      results: [
        {
          id: 123,
          countryCode: 'IND',
          description: 'India',
          isActive: true,
          currencyCode: null,
          dateFormat: 'mm-dd-yyyy',
          locale: 'en_IN',
          phoneLength: 10,
          timeFormat: 'hh:MM:SSS',
          isdCode: '+91'
        }
      ],
      pageNumber: 0,
      ageSize: 20,
      totalPages: 1,
      totalElements: 1
    };

    testCountryData1 = {
      results: [
        {
          id: 123,
          countryCode: 'IND',
          description: 'India',
          isActive: true,
          currencyCode: null,
          dateFormat: 'mm-dd-yyyy',
          locale: 'en_IN',
          phoneLength: 10,
          timeFormat: 'hh:MM:SSS',
          isdCode: '+91',
          fiscalYear: 2021
        }
      ],
      pageNumber: 0,
      ageSize: 20,
      totalPages: 1,
      totalElements: 1
    };
    countrySummary = {
      results: [
        {
          countryCode: 'IND',
          description: 'India',
          isdCode: '+91'
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

    service = new CountryDataService(cacheableApiService);
  });
  afterEach(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get 1 Country', () => {
    spy = spyOn(cacheableApiService, 'get').and.returnValue(
      of(testCountryData)
    );

    // act
    service.getCountries().subscribe(x => {
      expect(x.length).toEqual(1);
    });
  });
  it('should get all Countries', () => {
    spy = spyOn(cacheableApiService, 'get').and.returnValue(
      of(testCountryData)
    );

    // act
    service.getCountries().subscribe(x => {
      expect(x).toEqual(testCountryData.results);
    });
  });
  it('should get total count of Countries', () => {
    spy = spyOn(cacheableApiService, 'get').and.returnValue(
      of(testCountryData)
    );

    // act
    service.getCountriesCount().subscribe(x => {
      expect(x).toEqual(testCountryData.totalElements);
    });
  });

  it('should get country by countryCode', () => {
    const countryCode = 'IND';

    spy = spyOn(cacheableApiService, 'get').and.returnValue(
      of(testCountryData1.results[0])
    );

    // act
    service.getCountryByCode(countryCode).subscribe(x => {
      expect(x).toEqual(testCountryData1.results[0]);
    });
  });

  it('should get countrySummary ', () => {
    spy = spyOn(cacheableApiService, 'get').and.returnValue(of(countrySummary));

    // act
    service.getCountrySummary().subscribe(x => {
      expect(x).toEqual(countrySummary.results);
    });
  });
});
