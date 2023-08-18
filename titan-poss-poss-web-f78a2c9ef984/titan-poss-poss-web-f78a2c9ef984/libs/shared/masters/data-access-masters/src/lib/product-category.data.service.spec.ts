import { HttpClient } from '@angular/common/http';
import { ApiService } from '@poss-web/shared/util-api-service';
import { of } from 'rxjs';
import { ProductCategoryDataService } from './product-category.data.service';
import { CachingStrategySetting } from '@poss-web/shared/models';
import {
  CacheableApiService,
  DexieService,
  HashkeyGeneratorService,
  StorageFacade
} from '@poss-web/shared/util-cacheable-api-service';
import { fakeAsync } from '@angular/core/testing';

describe('Product Category', () => {
  let service: ProductCategoryDataService;
  let cacheableApiService: CacheableApiService;
  const http: HttpClient = null;
  let productCategories: any;
  let productcategoriesSummary: any;

  beforeAll(() => {
    productCategories = {
      results: [
        {
          productCategoryCode: '0',
          description: 'Chain + Pendant + Earring',
          orgCode: 'test',
          configDetails: {
            isAlddFrDmyStdASSM: true,
            isActive: true
          },
          isActive: true
        },
        {
          productCategoryCode: '00',
          description: 'Update testing',
          orgCode: 'TJ',
          configDetails: {
            isAlddFrDmyStdASSM: true,
            isActive: true
          },
          isActive: true
        }
      ],
      pageNumber: 0,
      pageSize: 2,
      totalPages: 1,
      totalElements: 2
    };
    productcategoriesSummary = {
      results: [
        {
          productCategoryCode: '0',
          description: 'Chain + Pendant + Earring'
        },
        {
          productCategoryCode: '0',
          description: 'Update testing'
        }
      ],
      pageNumber: 0,
      pageSize: 2,
      totalPages: 1,
      totalElements: 2
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

    service = new ProductCategoryDataService(cacheableApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get product Categories', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(productCategories));
    service.getProductCategoriesMaster().subscribe(x => {
      expect(x).toEqual(productCategories.results);
    });
  });

  it('should get total Elements from product category', () => {
    fakeAsync(() => {
      spyOn(cacheableApiService, 'get').and.returnValue(
        of(productCategories.totalElements)
      );
      service.getProductCategoriesMasterCount().subscribe(x => {
        expect(x).toEqual(productCategories.totalElements);
      });
    });
  });

  it('should get product Category Summary', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(
      of(productcategoriesSummary)
    );
    service.getProductCategories().subscribe(x => {
      expect(x).toEqual(productcategoriesSummary.results);
    });
  });
});
