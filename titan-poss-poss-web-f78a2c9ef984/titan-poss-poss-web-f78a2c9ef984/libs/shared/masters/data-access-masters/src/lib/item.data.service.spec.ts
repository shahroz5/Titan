import { fakeAsync } from '@angular/core/testing';
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

import { ItemDataService } from './item.data.service';
import { Observable } from 'rxjs';

export function apiServiceFactory(httpClient: HttpClient, apiURL: string) {
  return new ApiService(httpClient, apiURL);
}
const getMasterProductBaseUrl = (): string => {
  return `http://localhost:3000/product/v2`;
};
const getEngineUrl = (): string => {
  return `http://localhost:3000/engine/v2/products`;
};
describe('Testing item Master Data Service Functionality', () => {
  let service: ItemDataService;
  let cacheableApiService: CacheableApiService;
  let apiService: ApiService;
  const http: HttpClient = null;
  let itemByCode: any;
  let itemSummary: any;
  let conversionItem: any;
  let itemByCode1: any;
  beforeAll(() => {
    itemByCode = {
      itemCode: '007A007',
      description:
        'SILICON RUBBER BUSH(FOR CHARMS 4.5 SILICON BALL- PLAIN PRODUCTs)',
      stdWeight: 0.1,
      stdValue: 1,
      complexityCode: 'PNA',
      productGroupCode: '74',
      productCategoryCode: 'SY',
      brandCode: 'Tanishq',
      materialCode: 'OTHERS',
      leadTime: 0,
      orgCode: 'TJ',
      parentItemCode: '',
      itemDetails: {},
      configDetails: {},
      isActive: true,
      isEditable: null,
      indentTypeCode: 'string',
      pricingGroupType: 'ffff'
    };
    itemByCode1 = {
      itemCode: '007A007',
      description:
        'SILICON RUBBER BUSH(FOR CHARMS 4.5 SILICON BALL- PLAIN PRODUCTs)',
      stdWeight: 0.1,
      stdValue: 1,
      complexityCode: 'PNA',
      productGroupCode: '74',
      productCategoryCode: 'SY',
      brandCode: 'Tanishq',
      itemTypeCode: 'OTHERS',
      leadTime: 0,
      orgCode: 'TJ',
      parentItemCode: '',
      itemDetails: {},
      configDetails: {},
      isActive: true,
      isEditable: null,
      indentTypeCode: 'string',
      pricingGroupType: 'ffff'
    };
    itemSummary = {
      itemCode: '007A007',
      productGroupCode: '74',
      productCategoryCode: 'SY',
      stdValue: 1,
      productGroupDesc: 'Diamonds',
      productCategoryDesc: 'SYNTHETIC',
      isStudded: false
    };
    conversionItem = {
      itemCode: '00XTA007',
      productCategory: null,
      productType: null,
      productGroupCode: null,
      description: null,
      parentItemCode: null,
      complexityCode: null,
      stdWeight: null,
      stdValue: null,
      stoneDetails: null,
      lotNumber: null,
      mfgDate: null,
      productGroupDescription: null,
      childItems: null
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

    service = new ItemDataService(cacheableApiService, apiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get item by itemCode', () => {
    const itemCode = '007A007';

    spyOn(cacheableApiService, 'get').and.returnValue(of(itemByCode1));

    service.getItemByCode('007A007').subscribe(x => {
      expect(x).toEqual(itemByCode);
    });
  });

  it('should get Conversion itemSummary by ItemCode', () => {
    const itemCode = '00XTA007';

    spyOn(cacheableApiService, 'get').and.returnValue(of(conversionItem));

    service.getCoversionItemSummaryByItemCode(itemCode).subscribe(x => {
      expect(x).toEqual(conversionItem);
    });
  });
});
