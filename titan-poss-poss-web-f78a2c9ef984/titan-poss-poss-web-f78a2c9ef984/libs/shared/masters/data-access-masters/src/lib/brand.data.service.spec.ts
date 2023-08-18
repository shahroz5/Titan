import { HttpClient } from '@angular/common/http';

import { ApiService } from '@poss-web/shared/util-api-service';
import { BrandDataService } from './brand.data.service';
import { of } from 'rxjs';
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

export const getMasterProductBaseUrl = (): string => {
  return `http://localhost:3000/product/v2`;
};
describe('Testing Brand Data Service Functionality', () => {
  let service: BrandDataService;
  let cacheableApiService: CacheableApiService;

  const http: HttpClient = null;
  let brandData: any;
  let brandByCodeData: any;
  let brandSummaryData: any;
  beforeAll(() => {
    brandData = {
      results: [
        {
          brandCode: '123',
          description: 'testing',
          parentBrandCode: '',
          orgCode: 'TJ',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        },
        {
          brandCode: 'B0001',
          description: 'TEST',
          parentBrandCode: '',
          orgCode: 'TJ',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        },
        {
          brandCode: 'B0002',
          description: 'TEST...',
          parentBrandCode: '',
          orgCode: 'TJ',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        },
        {
          brandCode: 'brandtest',
          description: 'string',
          parentBrandCode: '',
          orgCode: 'TJ',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        },
        {
          brandCode: 'brandtest1',
          description: 'string',
          parentBrandCode: '',
          orgCode: 'TJ',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        },
        {
          brandCode: 'GoldPlus',
          description: 'GoldPlus',
          parentBrandCode: '',
          orgCode: 'T',
          customerDetails: {},
          panCardDetails: {},
          configDetails: {},
          isActive: true
        },
        {
          brandCode: 'h8ARS',
          description: 'Add Brand Unit Testing',
          parentBrandCode: '',
          orgCode: '',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        },
        {
          brandCode: 'L0012',
          description: 'TEST',
          parentBrandCode: '',
          orgCode: '',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        },
        {
          brandCode: 'Lc0Vt',
          description: 'Add Brand Unit Testing',
          parentBrandCode: '',
          orgCode: '',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        },
        {
          brandCode: 'NEWBR',
          description: 'new brand',
          parentBrandCode: '',
          orgCode: 'TJ',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        },
        {
          brandCode: 'PQR001',
          description: 'TEST',
          parentBrandCode: '',
          orgCode: 'TJ',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        },
        {
          brandCode: 'Q00123',
          description: 'Test................',
          parentBrandCode: '',
          orgCode: 'TJ',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        },
        {
          brandCode: 'Q001234',
          description: 'Admin',
          parentBrandCode: '',
          orgCode: 'TJ',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        },
        {
          brandCode: 'R0021',
          description: 'TEST',
          parentBrandCode: '',
          orgCode: '',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: false
        },
        {
          brandCode: 'R0022',
          description: 'TEST',
          parentBrandCode: '',
          orgCode: '',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},

          isActive: true
        },
        {
          brandCode: 'R0023',
          description: 'TEST',
          parentBrandCode: '',
          orgCode: '',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        },
        {
          brandCode: 'RES001',
          description: 'TEST',
          parentBrandCode: '',
          orgCode: 'TJ',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        },
        {
          brandCode: 'RQ006',
          description: 'TEST',
          parentBrandCode: '',
          orgCode: 'TJ',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        },
        {
          brandCode: 'SfgqZ',
          description: 'Add Brand Unit Testing',
          parentBrandCode: '',
          orgCode: '',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        },
        {
          brandCode: 'T0001',
          description: 'Test',
          parentBrandCode: '',
          orgCode: 'TJ',
          configDetails: {},
          customerDetails: {},
          panCardDetails: {},
          isActive: true
        }
      ],
      pageNumber: 0,
      pageSize: 20,
      totalPages: 3,
      totalElements: 41
    };
    brandByCodeData = {
      brandCode: '123',
      description: 'testing',
      parentBrandCode: '',
      orgCode: 'TJ',
      configDetails: {},
      customerDetails: {},
      panCardDetails: {},
      isActive: true
    };
    brandSummaryData = {
      results: [
        {
          brandCode: '123',
          description: 'testing'
        },
        {
          brandCode: '1HKVp',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: '27DGE',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: '5hepS',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: '9S0eX',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'A6Nrg',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'AAmKy',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'AYif9',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'B0001',
          description: 'TEST'
        },
        {
          brandCode: 'B0002',
          description: 'TEST...'
        },
        {
          brandCode: 'BentX',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'brandtest',
          description: 'string'
        },
        {
          brandCode: 'brandtest1',
          description: 'string'
        },
        {
          brandCode: 'cU99h',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'D30qA',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'GoldPlus',
          description: 'GoldPlus'
        },
        {
          brandCode: 'h8ARS',
          description: 'Update Brand Test'
        },
        {
          brandCode: 'h8axi',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'JrMYp',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'L0012',
          description: 'TEST'
        },
        {
          brandCode: 'Lc0Vt',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'NEWBR',
          description: 'new brand'
        },
        {
          brandCode: 'NiPHM',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'P3iRp',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'p7Ep9',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'PaQ4e',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'pEJtf',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'PQR001',
          description: 'TEST'
        },
        {
          brandCode: 'Q00123',
          description: 'Test................'
        },
        {
          brandCode: 'Q001234',
          description: 'Admin'
        },
        {
          brandCode: 'Q0Qzh',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'R0022',
          description: 'TEST'
        },
        {
          brandCode: 'R0023',
          description: 'TEST'
        },
        {
          brandCode: 'RES001',
          description: 'TEST'
        },
        {
          brandCode: 'RQ006',
          description: 'TEST'
        },
        {
          brandCode: 'SfgqZ',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'T0001',
          description: 'Test'
        },
        {
          brandCode: 'T0011',
          description: 'GoldPlus'
        },
        {
          brandCode: 'T00111',
          description: 'DescTest'
        },
        {
          brandCode: 'T001111',
          description: 'Test................'
        },
        {
          brandCode: 'T0012',
          description: 'Admin'
        },
        {
          brandCode: 'Tanishq',
          description: 'Tanishq'
        },
        {
          brandCode: 'TEST008',
          description: 'DescTest'
        },
        {
          brandCode: 'Test1',
          description: 'string'
        },
        {
          brandCode: 'TEST123',
          description: 'Admin'
        },
        {
          brandCode: 'TEST32100',
          description: 'TEST'
        },
        {
          brandCode: 'testing brand',
          description: 'string'
        },
        {
          brandCode: 'testingbrand',
          description: 'string'
        },
        {
          brandCode: 'TIT01',
          description: 'TEST'
        },
        {
          brandCode: 'TNSQB',
          description: 'dfg'
        },
        {
          brandCode: 'TQ001',
          description: 'TEST'
        },
        {
          brandCode: 'TT001',
          description: 'DescTest'
        },
        {
          brandCode: 'W00123',
          description: 'DescTest'
        },
        {
          brandCode: 'W492s',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'wJPfc',
          description: 'Add Brand Unit Testing'
        },
        {
          brandCode: 'ZAPP1',
          description: 'TEST'
        },
        {
          brandCode: 'ZZZZ',
          description: 'Add Brand Unit Testing'
        }
      ],
      pageNumber: 0,
      pageSize: 2147483647,
      totalPages: 1,
      totalElements: 57
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

    service = new BrandDataService(cacheableApiService);
  });
  afterEach(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get 20 brands', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(brandData));

    service.getBrands().subscribe(x => {
      expect(x.length).toEqual(20);
    });
  });
  it('should get all Brand', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(brandData));

    service.getBrands().subscribe(x => {
      expect(x).toEqual(brandData.results);
    });
  });
  it('should get total count of Brands', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(brandData));

    service.getBrandsCount().subscribe(x => {
      expect(x).toEqual(brandData.totalElements);
    });
  });
  it('should get brand by brandCode', () => {
    const brandCode = '123';

    spyOn(cacheableApiService, 'get').and.returnValue(of(brandByCodeData));

    service.getBrandByCode(brandCode).subscribe(x => {
      expect(x).toEqual(brandByCodeData);
    });
  });

  it('should get brandSummary', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(brandSummaryData));

    // act
    service.getBrandSummary(false).subscribe(x => {
      expect(x).toEqual(brandSummaryData.results);
    });
  });
});
