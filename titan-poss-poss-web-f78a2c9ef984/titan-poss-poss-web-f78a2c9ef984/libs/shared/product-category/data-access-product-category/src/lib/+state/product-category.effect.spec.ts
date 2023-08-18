import { Observable } from 'rxjs';
import { ProductCategoryEffect } from './product-category.effect';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from '@nrwl/angular';
import { hot, cold } from 'jasmine-marbles';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { ProductCategoryService } from '../product-category.service';
import {
  LoadProductCategoryListingPayload,
  LoadProductCategoryListingSuccessPayload,
  ProductCategory2,
  ProductCategoryDetails,
  SaveProductCategoryFormDetailsPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { PRODUCT_CATEGORY_FEATURE_KEY } from './product-category.reducer';
import {
  EditProductCategoryFormDetails,
  EditProductCategoryFormDetailsFailure,
  EditProductCategoryFormDetailsSuccess,
  LoadProductCategoryByProductCategoryCode,
  LoadProductCategoryByProductCategoryCodeFailure,
  LoadProductCategoryByProductCategoryCodeSuccess,
  LoadProductCategoryDetails,
  LoadProductCategoryDetailsFailure,
  LoadProductCategoryDetailsSuccess,
  SaveProductCategoryFormDetails,
  SaveProductCategoryFormDetailsFailure,
  SaveProductCategoryFormDetailsSuccess,
  SearchProductCategoryCode,
  SearchProductCategoryCodeFailure,
  SearchProductCategoryCodeSuccess
} from './product-category.actions';

describe('Product Category Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ProductCategoryEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  // const productCategoryServiceSpy = jasmine.createSpyObj<ProductCategoryService>([
  //   'getProductCategoryDetails',
  // ]);

  // const courierDataServiceSpy = jasmine.createSpyObj<CourierDataService>([
  //   'getCouriersSummary'
  // ]);
  // const storeUserDataServiceSpy = jasmine.createSpyObj<StoreUserDataService>([
  //   'getStoreUsers'
  // ]);
  // const inventoryValidationServiceSpy = jasmine.createSpyObj<
  //   InventoryValidationService
  // >(['validateWeightTolerance']);

  const productCategoryServiceSpy = jasmine.createSpyObj<
    ProductCategoryService
  >([
    'getProductCategoryDetails',
    'getProductCategoryByProductCategoryCode',
    'saveProductCategoryFormDetails',
    'editProductCategoryFormDetails',
    'getProductCategorySearchResult'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductCategoryEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [PRODUCT_CATEGORY_FEATURE_KEY]: initialState
          }
        }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: POSS_WEB_CACHING_STRATEGY,
          useValue: []
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: ProductCategoryService,
          useValue: productCategoryServiceSpy
        }
      ]
    });

    effect = TestBed.inject(ProductCategoryEffect);
  });

  describe('LoadProductCategory List', () => {
    it('should return a list of product category', () => {
      const list: ProductCategory2[] = [
        {
          description: 'Desc',
          productCategoryCode: 'A'
        }
      ];
      const parameters: LoadProductCategoryListingPayload = {
        pageIndex: 0,
        pageSize: 8
      };
      const action = new LoadProductCategoryDetails(parameters);
      const outcome = new LoadProductCategoryDetailsSuccess({
        productCategoryListing: list,
        totalElements: 1
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: {
          productCategoryListing: list,
          totalElements: 1
        }
      });
      productCategoryServiceSpy.getProductCategoryDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadProductCategoryDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadProductCategoryListingPayload = {
        pageIndex: 0,
        pageSize: 8
      };
      const action = new LoadProductCategoryDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadProductCategoryDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productCategoryServiceSpy.getProductCategoryDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductCategoryDetails$).toBeObservable(expected);
    });
  });

  describe('LoadProductCategory Details', () => {
    it('should return a details of product category for LoadProductCategoryByProductCategoryCode', () => {
      const param = {
        configDetails: {
          isActive: true,
          isAlddFrDmyStdASSM: true
        },
        description: 'Desc',
        orgCode: 'orgCode',
        productCategoryCode: 'A',
        isActive: true,
        isConversionEnabled: true,
        hallmarkDetails: {
          data: {
            hallmarkingCharges: '10',
            isAllowedForHallmarking: false,
            isFOCForHallmarkingCharges: false
          },
          type: 'HALLMARK_DETAILS'
        }
      };

      const action = new LoadProductCategoryByProductCategoryCode('test');
      const outcome = new LoadProductCategoryByProductCategoryCodeSuccess(
        param
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: param
      });
      productCategoryServiceSpy.getProductCategoryByProductCategoryCode.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(
        effect.loadProductCategoryDetailsByProductCategoryCode$
      ).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadProductCategoryByProductCategoryCode', () => {
      const action = new LoadProductCategoryByProductCategoryCode('test');
      const error = new Error('some error');
      const outcome = new LoadProductCategoryByProductCategoryCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productCategoryServiceSpy.getProductCategoryByProductCategoryCode.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(
        effect.loadProductCategoryDetailsByProductCategoryCode$
      ).toBeObservable(expected);
    });
  });

  describe('saveProductCategoryFormDetails Details', () => {
    it('should return a details of product category for saveProductCategoryFormDetails', () => {
      const param: SaveProductCategoryFormDetailsPayload = {
        isActive: true,
        isConversionEnabled: true,
        hallmarkQuantity: 10,
        description: 'Desc',
        orgCode: 'orgCode',
        productCategoryCode: 'A',
        hallmarkDetails: {
          data: {
            hallmarkingCharges: '10',
            isAllowedForHallmarking: false,
            isFOCForHallmarkingCharges: false
          },
          type: 'HALLMARK_DETAILS'
        }
      };

      const action = new SaveProductCategoryFormDetails(param);
      const outcome = new SaveProductCategoryFormDetailsSuccess(param);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: param
      });
      productCategoryServiceSpy.saveProductCategoryFormDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveProductCategoryFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for saveProductCategoryFormDetails', () => {
      const param: SaveProductCategoryFormDetailsPayload = {
        isActive: true,
        description: 'Desc',
        orgCode: 'orgCode',
        productCategoryCode: 'A',
        isConversionEnabled: true,
        hallmarkQuantity: 10,
        hallmarkDetails: {
          data: {
            hallmarkingCharges: '10',
            isAllowedForHallmarking: false,
            isFOCForHallmarkingCharges: false
          },
          type: 'HALLMARK_DETAILS'
        }
      };

      const action = new SaveProductCategoryFormDetails(param);
      const error = new Error('some error');
      const outcome = new SaveProductCategoryFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productCategoryServiceSpy.saveProductCategoryFormDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveProductCategoryFormDetails$).toBeObservable(expected);
    });
  });

  describe('editProductCategoryFormDetails Details', () => {
    it('should return a details of product category for editProductCategoryFormDetails', () => {
      const param: SaveProductCategoryFormDetailsPayload = {
        isActive: true,
        isConversionEnabled: true,
        hallmarkQuantity: 10,
        description: 'Desc',
        orgCode: 'orgCode',
        productCategoryCode: 'A',
        hallmarkDetails: {
          data: {
            hallmarkingCharges: '10',
            isAllowedForHallmarking: false,
            isFOCForHallmarkingCharges: false
          },
          type: 'HALLMARK_DETAILS'
        }
      };

      const action = new EditProductCategoryFormDetails(param);
      const outcome = new EditProductCategoryFormDetailsSuccess(param);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: param
      });
      productCategoryServiceSpy.editProductCategoryFormDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editProductCategoryFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for editProductCategoryFormDetails', () => {
      const param: SaveProductCategoryFormDetailsPayload = {
        isActive: true,
        isConversionEnabled: true,
        hallmarkQuantity: 10,
        description: 'Desc',
        orgCode: 'orgCode',
        productCategoryCode: 'A',
        hallmarkDetails: {
          data: {
            hallmarkingCharges: '10',
            isAllowedForHallmarking: false,
            isFOCForHallmarkingCharges: false
          },
          type: 'HALLMARK_DETAILS'
        }
      };

      const action = new EditProductCategoryFormDetails(param);
      const error = new Error('some error');
      const outcome = new EditProductCategoryFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productCategoryServiceSpy.editProductCategoryFormDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.editProductCategoryFormDetails$).toBeObservable(expected);
    });
  });

  describe('searchProductCategoryFormDetails Details', () => {
    it('should return a details of product category for searchProductCategoryFormDetails', () => {
      const param: ProductCategoryDetails[] = [
        {
          isActive: true,
          description: 'Desc',
          orgCode: 'orgCode',
          productCategoryCode: 'A',
          hallmarkQuantity: 10,
          isConversionEnabled: true,
          hallmarkDetails: {
            data: {
              hallmarkingCharges: '10',
              isAllowedForHallmarking: false,
              isFOCForHallmarkingCharges: false
            },
            type: 'HALLMARK_DETAILS'
          }
        }
      ];

      const action = new SearchProductCategoryCode('test');
      const outcome = new SearchProductCategoryCodeSuccess(param);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: param
      });
      productCategoryServiceSpy.getProductCategorySearchResult.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchProductCategoryFormDetails$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error for searchProductCategoryFormDetails', () => {
      const action = new SearchProductCategoryCode('test');
      const error = new Error('some error');
      const outcome = new SearchProductCategoryCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productCategoryServiceSpy.getProductCategorySearchResult.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchProductCategoryFormDetails$).toBeObservable(expected);
    });
  });
});
