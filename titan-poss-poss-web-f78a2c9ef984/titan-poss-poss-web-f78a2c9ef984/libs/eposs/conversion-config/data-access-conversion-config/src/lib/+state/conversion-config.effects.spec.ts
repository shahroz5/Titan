import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  ProductCategoryDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { Observable } from 'rxjs';
import { ConversionConfigService } from '../conversion-config.service';
import { ConversionConfigEffect } from './conversion-config.effects';
import { ConversionConfigSelectors } from './conversion-config.selectors';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import {
  CheckBoxHeader,
  ConversionConfigByIdPayload,
  ConversionConfigList,
  ConversionConfigListPayload,
  ProductCategory,
  ProductGroup,
  SaveConversionConfigValuesPayload,
  UpdateToggleButtonPayload
} from '@poss-web/shared/models';
import * as ConversionConfigActions from './conversion-config.actions';
import {
  ConversionConfigDetailsById,
  ConversionConfigDetailsByIdFailure,
  ConversionConfigDetailsByIdSuccess,
  LoadConversionConfigList,
  LoadConversionConfigListFailure,
  LoadConversionConfigListSuccess,
  SaveConversionConfigValues,
  SaveConversionConfigValuesFailure,
  SaveConversionConfigValuesSuccess,
  SearchConfigName,
  SearchConfigNameFailure,
  SearchConfigNameSuccess,
  UpdateConversionConfigDetails,
  UpdateConversionConfigDetailsFailure,
  UpdateConversionConfigDetailsSuccess,
  UpdateToggleButton,
  UpdateToggleButtonFailure
} from './conversion-config.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
describe('ConversionConfig Effects Testing Suite', () => {
  const conversionConfigServiceSpy = jasmine.createSpyObj<
    ConversionConfigService
  >([
    'getConversionConfiguratonList',
    'getConversionConfigDetaildById',
    'search',
    'saveConversionConfigValues',
    'updateConversionConfigDetails',
    'updateToggleButton',
    'loadProductGroups',
    'loadProductCategories'
  ]);
  const productGroupDataServiceSpy = jasmine.createSpyObj<
    ProductGroupDataService
  >(['getProductGroups']);

  const productCategoryDataServiceSpy = jasmine.createSpyObj<
    ProductCategoryDataService
  >(['getProductCategories']);
  let actions$: Observable<any>;
  let effect: ConversionConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get']
  );
  const initialState = {};
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConversionConfigEffect,
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
          provide: ConversionConfigService,
          useValue: conversionConfigServiceSpy
        },
        {
          provide: ProductGroupDataService,
          useValue: productGroupDataServiceSpy
        },
        {
          provide: ProductCategoryDataService,
          useValue: productCategoryDataServiceSpy
        }
      ]
    });
    effect = TestBed.inject(ConversionConfigEffect);
  });
  const savePayload: SaveConversionConfigValuesPayload = {
    configId: 1,
    createConfig: {
      description: 'Configuration',
      isActive: true,
      ruleDetails: {}
    },
    configValues: {
      addProducts: [
        {
          productCategoryCode: '71',
          productGroupCode: '72',
          ruleDetails: {
            allowedLimitValue: 123,
            allowedLimitWeight: 13,
            autoApprovalLimitValue: 13,
            autoApprovalLimitWeight: 13
          }
        }
      ],
      removeProducts: [],
      updateProducts: []
    }
  };
  const conversionConfigDetails: ConversionConfigByIdPayload = {
    createConfig: {
      description: 'Configuration',
      isActive: true,
      ruleId: 123,
      ruleType: 'Config'
    },
    productGroups: [
      {
        id: '123',
        productGroupCode: '71',
        productCategoryCode: '72',
        productGroupDescription: 'ProductGroup',
        productCategoryDescription: 'ProductCategory',
        allowedLimitWeight: '10',
        allowedLimitValue: '11',
        autoApprovalLimitWeight: '12',
        autoApprovalLimitValue: '13'
      }
    ]
  };
  const productGroups: CheckBoxHeader[] = [
    {
      title: 'pro',
      key: 'p'
    }
  ];
  const productCategories: CheckBoxHeader[] = [
    {
      title: 'proCategory',
      key: 'p'
    }
  ];
  const updateStatusPayload: UpdateToggleButtonPayload = {
    id: 1,
    toggleButton: {
      isActive: true,
      ruleDetails: {}
    }
  };
  const listResponse: ConversionConfigList = {
    conversionConfigList: [
      {
        description: 'Configuration',
        isActive: true
      }
    ],
    totalElements: 1
  };

  describe('LoadConversionConfigList', () => {
    const parameters: ConversionConfigListPayload = {
      pageIndex: 0,
      pageSize: 100,
      length: 0
    };
    it('should return a stream with LoadConversionConfigList', () => {
      const action = new LoadConversionConfigList(parameters);
      const outcome = new LoadConversionConfigListSuccess(listResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: listResponse });
      conversionConfigServiceSpy.getConversionConfiguratonList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.ConversionConfigList$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadConversionConfigList(parameters);
      const error = new Error('some error');
      const outcome = new LoadConversionConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      conversionConfigServiceSpy.getConversionConfiguratonList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.ConversionConfigList$).toBeObservable(expected);
    });
  });

  describe('SearchConfigName', () => {
    it('should return a stream with SearchConfigName', () => {
      const action = new SearchConfigName('ConfigName');
      const outcome = new SearchConfigNameSuccess(listResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: listResponse });
      conversionConfigServiceSpy.search.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchByConfigName$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SearchConfigName('ConfigName');
      const error = new Error('some error');
      const outcome = new SearchConfigNameFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      conversionConfigServiceSpy.search.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchByConfigName$).toBeObservable(expected);
    });
  });

  describe('ConversionConfigDetailsById', () => {
    it('should return a stream with ConversionConfigDetailsById', () => {
      const action = new ConversionConfigDetailsById(123);
      const outcome = new ConversionConfigDetailsByIdSuccess(
        conversionConfigDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: conversionConfigDetails });
      conversionConfigServiceSpy.getConversionConfigDetaildById.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.getConversionConfigDetailsById$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new ConversionConfigDetailsById(123);
      const error = new Error('some error');
      const outcome = new ConversionConfigDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      conversionConfigServiceSpy.getConversionConfigDetaildById.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.getConversionConfigDetailsById$).toBeObservable(expected);
    });
  });

  describe('UpdateConversionConfigDetails', () => {
    it('should return a stream with UpdateConversionConfigDetails', () => {
      const action = new UpdateConversionConfigDetails(savePayload);
      const outcome = new UpdateConversionConfigDetailsSuccess();
      actions$ = hot('-a', { a: action });
      //const expected$ = cold('--b', { b: outcome });
      //expect(effect.updateConversionConfigDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new UpdateConversionConfigDetails(savePayload);
      const error = new Error('some error');
      const outcome = new UpdateConversionConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      conversionConfigServiceSpy.updateConversionConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateConversionConfigDetails$).toBeObservable(expected);
    });
  });
  describe('SaveConversionConfigValues', () => {
    it('should return a stream with SaveConversionConfigValues', () => {
      const action = new SaveConversionConfigValues(savePayload);
      const outcome = new SaveConversionConfigValuesSuccess(
        conversionConfigDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: conversionConfigDetails });
      conversionConfigServiceSpy.saveConversionConfigValues.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveConversionConfigValues$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SaveConversionConfigValues(savePayload);
      const error = new Error('some error');
      const outcome = new SaveConversionConfigValuesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      conversionConfigServiceSpy.saveConversionConfigValues.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveConversionConfigValues$).toBeObservable(expected);
    });
  });

  describe('UpdateToggleButton', () => {
    it('should return a stream with UpdateToggleButton', () => {
      const action = new UpdateToggleButton(updateStatusPayload);
      const outcome = new ConversionConfigActions.UpdateToggleButtonSuccess();
      actions$ = hot('-a', { a: action });

      //const expected$ = cold('--b', { b: outcome });
      //expect(effect.updateToggleButton$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new UpdateToggleButton(updateStatusPayload);
      const error = new Error('some error');
      const outcome = new UpdateToggleButtonFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      conversionConfigServiceSpy.updateToggleButton.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateToggleButton$).toBeObservable(expected);
    });
  });

  describe('LoadProductCategories', () => {
    it('should return a stream with Product Category Options', () => {
      const action = new ConversionConfigActions.LoadProductCategories();
      const outcome = new ConversionConfigActions.LoadProductCategoriesSuccess(
        productCategories
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: productCategories });
      conversionConfigServiceSpy.loadProductCategories.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.getProductCategories$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ConversionConfigActions.LoadProductCategories();
      const error = new Error('some error');
      const outcome = new ConversionConfigActions.LoadProductCategoriesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      conversionConfigServiceSpy.loadProductCategories.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.getProductCategories$).toBeObservable(expected);
    });
  });
  describe('LoadProductGroups', () => {
    it('should return a stream with Product group Options', () => {
      const action = new ConversionConfigActions.LoadProductGroups();
      const outcome = new ConversionConfigActions.LoadProductGroupsSuccess(
        productGroups
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: productGroups });
      conversionConfigServiceSpy.loadProductGroups.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.getProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ConversionConfigActions.LoadProductGroups();
      const error = new Error('some error');
      const outcome = new ConversionConfigActions.LoadProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      conversionConfigServiceSpy.loadProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getProductGroups$).toBeObservable(expected);
    });
  });
});
