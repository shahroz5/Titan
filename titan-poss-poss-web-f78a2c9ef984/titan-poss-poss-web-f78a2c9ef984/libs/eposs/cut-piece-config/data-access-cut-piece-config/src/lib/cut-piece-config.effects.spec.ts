import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import { Observable } from 'rxjs';
import { CutPieceConfigService } from '../cut-piece-config.service';
import { CutPieceConfigEffects } from './cut-piece-config.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import {
  LoadCutPieceConfigs,
  LoadCutPieceConfigsFailure,
  LoadCutPieceConfigsSuccess,
  LoadProductCategories,
  LoadProductCategoriesFailure,
  LoadProductCategoriesSuccess,
  LoadProductCategoryMapping,
  LoadProductCategoryMappingFailure,
  LoadProductCategoryMappingSuccess,
  SaveCutPieceConfig,
  SaveCutPieceConfigFailure,
  SaveCutPieceConfigSuccess,
  SearchProductCategoryCode,
  SearchProductCategoryCodeFailure,
  SearchProductCategroyCodeSuccess
} from './cut-piece-config.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ProductCategoryMapping,
  ProductCategoryMappingList
} from '@poss-web/shared/models';
import { HttpClient } from '@angular/common/http';
import { ProductCategoryDataService } from '@poss-web/shared/masters/data-access-masters';
describe('CutPieceConfig Effects Testing Suite', () => {
  const searchResponse: ProductCategoryMappingList[] = [
    {
      cutPieceTepPercent: 12,
      productCategoryCode: 'A',
      id: 'abc123',
      description: 'abc123'
    }
  ];
  const savePayload: ProductCategoryMapping = {
    payload: {
      addProductCategories: ['I'],
      updateProductCategories: [],
      removeProductCategories: []
    },
    configId: 'abc123'
  };

  const productCategories = [
    {
      productCategoryCode: 'I',
      description: 'Product Category',
      isActive: true
    }
  ];
  const listPaload = { configId: 'abc123', pageIndex: 0, pageSize: 20 };
  let actions$: Observable<any>;
  let effect: CutPieceConfigEffects;

  const initialState = {};

  const cutPieceConfigServiceSpy = jasmine.createSpyObj<CutPieceConfigService>([
    'loadCutPieceConfig',
    'searchProductCategoryCode',
    'saveCutPieceConfig',
    'loadProductCategoryMapping'
  ]);
  const productCategoryDataServiceSpy = jasmine.createSpyObj<
    ProductCategoryDataService
  >(['getProductCategories']);
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CutPieceConfigEffects,
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
          provide: CutPieceConfigService,
          useValue: cutPieceConfigServiceSpy
        },
        {
          provide: ProductCategoryDataService,
          useValue: productCategoryDataServiceSpy
        }
      ]
    });
    effect = TestBed.inject(CutPieceConfigEffects);
  });

  describe('SearchProductCategoryCode', () => {
    const searchPayload = {
      productCategoryCode: 'I',
      configId: 'abc123'
    };
    it('should return a stream with SearchProductCategoryCode', () => {
      const action = new SearchProductCategoryCode(searchPayload);
      const outcome = new SearchProductCategroyCodeSuccess(searchResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: searchResponse });
      cutPieceConfigServiceSpy.searchProductCategoryCode.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchProductCategoryCode$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SearchProductCategoryCode(searchPayload);
      const error = new Error('some error');
      const outcome = new SearchProductCategoryCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cutPieceConfigServiceSpy.searchProductCategoryCode.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchProductCategoryCode$).toBeObservable(expected);
    });
  });

  describe('LoadCutPieceConfigs', () => {
    it('should return a stream with LoadCutPieceConfigs', () => {
      const action = new LoadCutPieceConfigs();
      const outcome = new LoadCutPieceConfigsSuccess('abc123');
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: 'abc123' });
      cutPieceConfigServiceSpy.loadCutPieceConfig.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCutPieceConfigs$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadCutPieceConfigs();
      const error = new Error('some error');
      const outcome = new LoadCutPieceConfigsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cutPieceConfigServiceSpy.loadCutPieceConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCutPieceConfigs$).toBeObservable(expected);
    });
  });

  describe('SaveCutPieceConfig', () => {
    it('should return a stream with SaveCutPieceConfig', () => {
      const action = new SaveCutPieceConfig(savePayload);
      const outcome = new SaveCutPieceConfigSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: null });
      cutPieceConfigServiceSpy.saveCutPieceConfig.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveCutPieceConfig$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SaveCutPieceConfig(savePayload);
      const error = new Error('some error');
      const outcome = new SaveCutPieceConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cutPieceConfigServiceSpy.saveCutPieceConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveCutPieceConfig$).toBeObservable(expected);
    });
  });

  describe('LoadProductCategoryMapping', () => {
    it('should return a stream with LoadProductCategoryMapping', () => {
      const action = new LoadProductCategoryMapping(listPaload);
      const outcome = new LoadProductCategoryMappingSuccess({
        response: searchResponse,
        totalElements: 1
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: { response: searchResponse, totalElements: 1 }
      });
      cutPieceConfigServiceSpy.loadProductCategoryMapping.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadProductCategoriesMapping$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadProductCategoryMapping(listPaload);
      const error = new Error('some error');
      const outcome = new LoadProductCategoryMappingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cutPieceConfigServiceSpy.loadProductCategoryMapping.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductCategoriesMapping$).toBeObservable(expected);
    });
  });

  describe('LoadProductCategories', () => {
    it('should return a stream with LoadProductCategories', () => {
      const action = new LoadProductCategories();
      const outcome = new LoadProductCategoriesSuccess(productCategories);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: productCategories });
      productCategoryDataServiceSpy.getProductCategories.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadProductCategories$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadProductCategories();
      const error = new Error('some error');
      const outcome = new LoadProductCategoriesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productCategoryDataServiceSpy.getProductCategories.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductCategories$).toBeObservable(expected);
    });
  });
});
