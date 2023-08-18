import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  EncircleProductGroupMappingSavePayload,
  ProductGroup,
  ProductGroupMappingOption,
  ProductGroupMappingResponse
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { EncircleProductGroupMappingService } from '../encircle-product-group-mapping.service';
import { EncircleProductGroupMappingEffects } from './encircle-product-group-mapping.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { hot, cold } from 'jasmine-marbles';
import {
  LoadAllSelectedProductGroups,
  LoadAllSelectedProductGroupsFailure,
  LoadAllSelectedProductGroupsSuccess,
  LoadProductGroups,
  LoadProductGroupsFailure,
  LoadProductGroupsSuccess,
  LoadSelectedProductGroups,
  LoadSelectedProductGroupsFailure,
  LoadSelectedProductGroupsSuccess,
  RemoveEncircleProdcutGroups,
  RemoveEncircleProdcutGroupsFailure,
  RemoveEncircleProdcutGroupsSuccess,
  SaveEncircleProdcutGroups,
  SaveEncircleProdcutGroupsFailure,
  SaveEncircleProdcutGroupsSuccess,
  SearchProductGroupCode,
  SearchProductGroupCodeFailure,
  SearchProductGroupCodeSuccess
} from './encircle-product-group-mapping.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { ProductGroupDataService } from '@poss-web/shared/masters/data-access-masters';
describe('EncircleProductGroupMapping Testing Suite', () => {
  const payload = {
    paymentMode: 'Encircle',
    pageIndex: 0,
    pageSize: 10
  };
  const savePayload: EncircleProductGroupMappingSavePayload = {
    savePayload: {
      addProductGroupCode: ['71', '72'],
      removeProductMappingIds: []
    },
    paymentCategoryName: 'Encircle'
  };
  const selectedProductGroups: ProductGroupMappingOption[] = [
    {
      id: '123',
      uuid: '123',
      description: 'Metal'
    }
  ];
  const selectedProductGroupsResponse: ProductGroupMappingResponse = {
    response: selectedProductGroups,
    totalElements: 1
  };
  const productGroups: ProductGroup[] = [
    {
      description: 'Metal',
      productGroupCode: '71'
    }
  ];

  const encircleProductGroupMappingServiceSpy = jasmine.createSpyObj<
    EncircleProductGroupMappingService
  >([
    'saveEncircleProductGroups',
    'loadSelectedProductGroups',
    'searchProductGroupCode'
  ]);
  const productGroupDataServiceSpy = jasmine.createSpyObj<
    ProductGroupDataService
  >(['getProductGroups']);
  let actions$: Observable<any>;
  let effect: EncircleProductGroupMappingEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get']
  );
  const initialState = {};
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EncircleProductGroupMappingEffects,
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
          provide: HttpClient,
          useValue: httpClientSpy
        },

        {
          provide: EncircleProductGroupMappingService,
          useValue: encircleProductGroupMappingServiceSpy
        },
        {
          provide: ProductGroupDataService,
          useValue: productGroupDataServiceSpy
        }
      ]
    });

    effect = TestBed.inject(EncircleProductGroupMappingEffects);
  });
  describe('loadSelectedProductGroups', () => {
    it('should return a stream with loadSelectedProductGroups', () => {
      const action = new LoadSelectedProductGroups(payload);
      const outcome = new LoadSelectedProductGroupsSuccess(
        selectedProductGroupsResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: selectedProductGroupsResponse });
      encircleProductGroupMappingServiceSpy.loadSelectedProductGroups.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedProductGroups$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadSelectedProductGroups(payload);
      const error = new Error('some error');
      const outcome = new LoadSelectedProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      encircleProductGroupMappingServiceSpy.loadSelectedProductGroups.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedProductGroups$).toBeObservable(expected);
    });
  });
  describe('loadAllSelectedProductGroups', () => {
    it('should return a stream with loadAllSelectedProductGroups', () => {
      const action = new LoadAllSelectedProductGroups(payload);
      const outcome = new LoadAllSelectedProductGroupsSuccess(
        selectedProductGroupsResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: selectedProductGroupsResponse });
      encircleProductGroupMappingServiceSpy.loadSelectedProductGroups.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadAllSelectedProductGroups$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadAllSelectedProductGroups(payload);
      const error = new Error('some error');
      const outcome = new LoadAllSelectedProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      encircleProductGroupMappingServiceSpy.loadSelectedProductGroups.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAllSelectedProductGroups$).toBeObservable(expected);
    });
  });
  describe('SearchEncircleProductGroup', () => {
    it('should return a stream with searchProductGroup', () => {
      const action = new SearchProductGroupCode('71');
      const outcome = new SearchProductGroupCodeSuccess(
        selectedProductGroupsResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: selectedProductGroupsResponse });
      encircleProductGroupMappingServiceSpy.searchProductGroupCode.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchProductGroup$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SearchProductGroupCode('71');
      const error = new Error('some error');
      const outcome = new SearchProductGroupCodeSuccess({
        response: [],
        totalElements: 0
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      encircleProductGroupMappingServiceSpy.searchProductGroupCode.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchProductGroup$).toBeObservable(expected);
    });
  });
  describe('LoadProductGroups', () => {
    it('should return a stream with loadproductgroups', () => {
      const action = new LoadProductGroups();
      const outcome = new LoadProductGroupsSuccess(productGroups);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: productGroups });
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadProductGroups();
      const error = new Error('some error');
      const outcome = new LoadProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected);
    });
  });
  describe('SaveEncircleProdcutGroups', () => {
    it('should return a stream with saveEncircleProdcutGroups', () => {
      const action = new SaveEncircleProdcutGroups(savePayload);
      const outcome = new SaveEncircleProdcutGroupsSuccess();
      actions$ = hot('-a', { a: action });

      //const response$ = cold('-a|', { a: productGroups });
      //encircleProductGroupMappingServiceSpy.saveEncircleProductGroups.and.returnValue();

      //const expected$ = cold('--b', { b: outcome });
      //expect(effect.loadProductGroups$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SaveEncircleProdcutGroups(savePayload);
      const error = new Error('some error');
      const outcome = new SaveEncircleProdcutGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      encircleProductGroupMappingServiceSpy.saveEncircleProductGroups.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveEncircleProductGroups$).toBeObservable(expected);
    });
  });
  describe('RemoveEncircleProdcutGroups', () => {
    it('should return a stream with saveEncircleProdcutGroups', () => {
      const action = new RemoveEncircleProdcutGroups(savePayload);
      const outcome = new RemoveEncircleProdcutGroupsSuccess();
      actions$ = hot('-a', { a: action });

      //const response$ = cold('-a|', { a: productGroups });
      //encircleProductGroupMappingServiceSpy.saveEncircleProductGroups.and.returnValue();

      //const expected$ = cold('--b', { b: outcome });
      //expect(effect.loadProductGroups$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new RemoveEncircleProdcutGroups(savePayload);
      const error = new Error('some error');
      const outcome = new RemoveEncircleProdcutGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      encircleProductGroupMappingServiceSpy.saveEncircleProductGroups.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.removeEncircleProductGroups$).toBeObservable(expected);
    });
  });
});
