import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import { hot, cold } from 'jasmine-marbles';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { Observable } from 'rxjs';
import { CfaProductCodeService } from '../cfa-product-code.service';
import { CFAProductCodeEffects } from './cfa-product-code.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  CFAProducts,
  ItemTypesResponse,
  LoadCFAProductCodeListingPayload,
  LoadCFAProductCodeListingSuccessPayload,
  Lov,
  ProductGroupDetails,
  ProductType
} from '@poss-web/shared/models';
import {
  LoadCFAProducts,
  LoadCFAProductsBasedOnProductGroupCode,
  LoadCFAProductsBasedOnProductGroupCodeFailure,
  LoadCFAProductsBasedOnProductGroupCodeSuccess,
  LoadCFAProductsFailure,
  LoadCFAProductsSuccess,
  LoadItemTypes,
  LoadItemTypesFailure,
  LoadItemTypesSuccess,
  LoadPlainStuddedType,
  LoadPlainStuddedTypeFailure,
  LoadPlainStuddedTypeSuccess,
  LoadPricingType,
  LoadPricingTypeFailure,
  LoadPricingTypeSuccess,
  LoadProductTypes,
  LoadProductTypesFailure,
  LoadProductTypesSuccess,
  SaveCFAProducts,
  SaveCFAProductsFailure,
  SaveCFAProductsSuccess,
  SearchCFAproduct,
  SearchCFAProductFailure,
  SearchCFAProductSuccess,
  UpdateCFAProducts,
  UpdateCFAProductsFailure,
  UpdateCFAProductsSuccess
} from './cfa-product-code.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';

describe('CFAProductCode Effects Testing Suite', () => {
  const dummyCFAProductCodeListing: LoadCFAProductCodeListingSuccessPayload = {
    CFAProductCodeListing: [
      {
        productGroupCode: 'ProductGroupCode1',
        description: 'ProductGroupCode is ProductGroupCode1',
        isActive: true
      },
      {
        productGroupCode: 'ProductGroupCode2',
        description: 'ProductGroupCode is ProductGroupCode2',
        isActive: true
      }
    ],
    totalElements: 2
  };
  const dummyCFAProductCodeBasedOnCode: CFAProducts = {
    productGroupCode: 'ProductGroupCode1',
    productType: 'ProductType1',
    description: 'ProductGroupCode is ProductGroupCode1',
    itemTypeCode: 'materialTypeCode1',
    orgCode: '12',
    isActive: true,
    configDetails: {}
  };
  const dummyCFAProductCodes: ProductGroupDetails = {
    productGroupCode: 'CFA',
    description: 'CFA',
    itemTypeCode: 'MIA',
    orgCode: 'ORG',
    isEligibleForLoyaltyPoints: true,
    printGuranteeCard: true,
    isGRNEnabled: true,
    isConversionEnabled: true,
    isBestGoldRateEnabled: true,
    isGoldPriceMandatory: true,
    isMakingChargeMandatory: true,
    isPlatinumPriceMandatory: true,
    isSilverPriceMandatory: true,
    isStonePriceMandatory: true,
    isActive: true,
    isMia: true,
    plainStudded: 'Plian',
    plainStuddedTep: 'Studded',
    plainStuddedGrn: 'Grn',
    plainStuddedGrf: 'Grf',
    pricingType: 'Price',
    isAllowedForDigiGoldMandatory: true
  };
  const dummySearchResultCFAProductCode: CFAProducts[] = [
    {
      productGroupCode: 'ProductGroupCode1',
      productType: 'ProductType1',
      description: 'ProductGroupCode is ProductGroupCode1',
      itemTypeCode: 'materialTypeCode1',
      orgCode: '12',
      isActive: true,
      configDetails: {}
    }
  ];

  let actions$: Observable<any>;
  let effect: CFAProductCodeEffects;

  const initialState = {};
  const cfaProductCodeServiceSpy = jasmine.createSpyObj<CfaProductCodeService>([
    'getCFAProducts',
    'getCFAProductsBasedProductGroupCode',
    'getCFASearchResult',
    'saveCFAProducts',
    'updateCFAProducts',
    'loadProductTypes',
    'loadItemTypes'
  ]);
  const lovDataServiceSpy = jasmine.createSpyObj<LovDataService>([
    'getProductLovs'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CFAProductCodeEffects,
        DataPersistence,
        provideMockStore({ initialState }),
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
          provide: CfaProductCodeService,
          useValue: cfaProductCodeServiceSpy
        },
        {
          provide: LovDataService,
          useValue: lovDataServiceSpy
        }
      ]
    });
    effect = TestBed.inject(CFAProductCodeEffects);
  });

  describe('loadCFAProductCodeListing', () => {
    it('should return a stream with cfaProductCodeListing', () => {
      const parameters: LoadCFAProductCodeListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadCFAProducts(parameters);
      const outcome = new LoadCFAProductsSuccess(dummyCFAProductCodeListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: dummyCFAProductCodeListing });
      cfaProductCodeServiceSpy.getCFAProducts.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCFAProduct$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadCFAProductCodeListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadCFAProducts(parameters);
      const error = new Error('some error');
      const outcome = new LoadCFAProductsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cfaProductCodeServiceSpy.getCFAProducts.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCFAProduct$).toBeObservable(expected);
    });
  });
  describe('loadCFAProductsBasedOnCode', () => {
    it('should return a stream with cfaProductBasedOnCode ', () => {
      const action = new LoadCFAProductsBasedOnProductGroupCode('Pro123');
      const outcome = new LoadCFAProductsBasedOnProductGroupCodeSuccess(
        dummyCFAProductCodes
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: dummyCFAProductCodes });
      cfaProductCodeServiceSpy.getCFAProductsBasedProductGroupCode.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCFAProductsBasedOnProductGroupCode$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCFAProductsBasedOnProductGroupCode('Pro123');
      const error = new Error('some error');
      const outcome = new LoadCFAProductsBasedOnProductGroupCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cfaProductCodeServiceSpy.getCFAProductsBasedProductGroupCode.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCFAProductsBasedOnProductGroupCode$).toBeObservable(
        expected
      );
    });
  });
  describe('searchCFAProductCodes', () => {
    it('should return a stream with searchResult ', () => {
      const action = new SearchCFAproduct('Pro123');
      const outcome = new SearchCFAProductSuccess(
        dummySearchResultCFAProductCode
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: dummySearchResultCFAProductCode });
      cfaProductCodeServiceSpy.getCFASearchResult.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchCFAProduct$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SearchCFAproduct('Pro123');
      const error = new Error('some error');
      const outcome = new SearchCFAProductFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cfaProductCodeServiceSpy.getCFASearchResult.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchCFAProduct$).toBeObservable(expected);
    });
  });
  describe('saveCFAProductCode', () => {
    it('should return a stream with saveCFAProductCode ', () => {
      const action = new SaveCFAProducts(dummyCFAProductCodeBasedOnCode);
      const outcome = new SaveCFAProductsSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: dummyCFAProductCodeBasedOnCode });
      cfaProductCodeServiceSpy.saveCFAProducts.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveCFAProducts$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SaveCFAProducts(dummyCFAProductCodeBasedOnCode);
      const error = new Error('some error');
      const outcome = new SaveCFAProductsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cfaProductCodeServiceSpy.saveCFAProducts.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveCFAProducts$).toBeObservable(expected);
    });
  });
  describe('updateCFAProductCode', () => {
    it('should return a stream with updateCFAProductCode ', () => {
      const action = new UpdateCFAProducts({
        productGroupCode: 'Pro123',
        data: dummyCFAProductCodeBasedOnCode
      });
      const outcome = new UpdateCFAProductsSuccess(
        dummyCFAProductCodeBasedOnCode
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: dummyCFAProductCodeBasedOnCode });
      cfaProductCodeServiceSpy.updateCFAProducts.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateCFAProducts$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateCFAProducts({
        productGroupCode: 'Pro123',
        data: dummyCFAProductCodeBasedOnCode
      });
      const error = new Error('some error');
      const outcome = new UpdateCFAProductsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cfaProductCodeServiceSpy.updateCFAProducts.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateCFAProducts$).toBeObservable(expected);
    });
  });
  // describe('loadProductTypes', () => {
  //   it('should return a stream with loadProductTypes ', () => {
  //     const productTypeResponse: ProductType[] = [
  //       { id: '123', name: 'Neckale', isActive: true },
  //       { id: '456', name: 'Chain', isActive: true }
  //     ];
  //     const action = new LoadProductTypes();
  //     const outcome = new LoadProductTypesSuccess(productTypeResponse);
  //     actions$ = hot('-a', { a: action });

  //     const response$ = cold('-a|', { a: productTypeResponse });
  //     cfaProductCodeServiceSpy.loadProductTypes.and.returnValue(response$);

  //     const expected$ = cold('--b', { b: outcome });
  //     expect(effect.loadProductTypes$).toBeObservable(expected$);
  //   });

  //   it('should fail and return an action with the error', () => {
  //     const action = new LoadProductTypes();
  //     const error = new Error('some error');
  //     const outcome = new LoadProductTypesFailure(
  //       CustomErrorAdaptor.fromJson(error)
  //     );
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-#|', {}, error);
  //     cfaProductCodeServiceSpy.loadProductTypes.and.returnValue(response$);
  //     const expected = cold('--b', { b: outcome });
  //     expect(effect.loadProductTypes$).toBeObservable(expected);
  //   });
  // });
  describe('loadItemTypes', () => {
    it('should return a stream with loadItemTypes ', () => {
      const materialTypeResponse: ItemTypesResponse[] = [
        {
          id: 'M',
          name: 'metal'
        },
        {
          id: 'M1',
          name: 'metal'
        }
      ];
      const action = new LoadItemTypes();
      const outcome = new LoadItemTypesSuccess(materialTypeResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: materialTypeResponse });
      cfaProductCodeServiceSpy.loadItemTypes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadItemTypes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadItemTypes();
      const error = new Error('some error');
      const outcome = new LoadItemTypesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cfaProductCodeServiceSpy.loadItemTypes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadItemTypes$).toBeObservable(expected);
    });
  });

  describe('LoadPlainStuddedType', () => {
    const response = [{ id: 'abc123', name: 'abc123' }];
    const res: Lov[] = [
      {
        code: 'abc123',
        value: 'abc123',
        isActive: true
      }
    ];
    it('should return a stream with LoadPlainStuddedType ', () => {
      const action = new LoadPlainStuddedType('PRO');
      const outcome = new LoadPlainStuddedTypeSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      lovDataServiceSpy.getProductLovs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPlainStuddedTypes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadPlainStuddedType('PRO');
      const error = new Error('some error');
      const outcome = new LoadPlainStuddedTypeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataServiceSpy.getProductLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPlainStuddedTypes$).toBeObservable(expected);
    });
  });

  describe('LoadPricingType', () => {
    const response = [{ id: 'abc123', name: 'abc123' }];
    const res: Lov[] = [
      {
        code: 'abc123',
        value: 'abc123',
        isActive: true
      }
    ];
    it('should return a stream with LoadPricingType ', () => {
      const action = new LoadPricingType('PRO');
      const outcome = new LoadPricingTypeSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      lovDataServiceSpy.getProductLovs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPricingType$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadPricingType('PRO');
      const error = new Error('some error');
      const outcome = new LoadPricingTypeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataServiceSpy.getProductLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPricingType$).toBeObservable(expected);
    });
  });
});
