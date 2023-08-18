//you here need to assert a reactive result as well as trigger an effect.
//To assert that an effect returns the right observable stream, we can use
// Rx Marbles.
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import {
  ProductGroup,
  UpdateWeightTolerancePayload,
  WeightToleranceResponse,
  WeightToleranceList,
  WeightToleranceListPayload,
  ConfigDetails,
  SaveWeightTolerancePayload,
  LoadWeightToleranceByConfigidPayload
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { WeightToleranceEffect } from './weight-tolerance.effect';
import { WeightToleranceService } from '../weight-tolerance.service';
import { ProductGroupDataService } from '@poss-web/shared/masters/data-access-masters';
import {
  UpdateIsActive,
  UpdateIsActiveSuccess,
  UpdateIsActiveFailure,
  LoadConfigList,
  LoadConfigListSuccess,
  LoadConfigListFailure,
  LoadSelectedConfigDetails,
  LoadSelectedConfigDetailsSuccess,
  LoadSelectedConfigDetailsFailure,
  RemoveWeightTolerance,
  RemoveWeightToleranceSuccess,
  RemoveWeightToleranceFailure,
  SearchConfigDetailsByConfigNameSuccess,
  SearchConfigDetailsByConfigNameFailure,
  SearchConfigDetailsByConfigName,
  SaveWeightTolerance,
  SaveWeightToleranceSuccess,
  SaveWeightToleranceFailure,
  LoadWeightToleranceByConfigid,
  LoadWeightToleranceByConfigidSuccess,
  LoadWeightToleranceByConfigidFailure,
  UpdateWeightTolerance,
  UpdateWeightToleranceSuccess,
  UpdateWeightToleranceFailure,
  LoadRangeWeight,
  LoadRangeWeightFailure,
  LoadRangeWeightSuccesss,
  LoadProductGroupMappingSuccess,
  LoadProductGroupMapping,
  LoadProductGroupMappingFailure
} from './weight-tolerance.actions';

describe('WeightToleranceEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: WeightToleranceEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let weightToleranceService = jasmine.createSpyObj<WeightToleranceService>(
    'WeightToleranceService',
    [
      'updateIsActive',
      'getConfigDetailsList',
      'getSelectedConfigDetails',
      'searchConfigDetailsByconfigName',
      'saveWeightTolerance',
      'getWeightTolerance',
      'updateWeightTolerance',

      'loadRangeWeight'
    ]
  );
  const productGroupDataService = jasmine.createSpyObj<ProductGroupDataService>(
    ['getProductGroups']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WeightToleranceEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },

        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: ProductGroupDataService,
          useValue: productGroupDataService
        },

        {
          provide: WeightToleranceService,
          useValue: {
            searchSavedLocationPriceByLocationCode: jasmine.createSpy(),
            updateIsActive: jasmine.createSpy(),
            getConfigDetailsList: jasmine.createSpy(),
            getSelectedConfigDetails: jasmine.createSpy(),
            searchConfigDetailsByconfigName: jasmine.createSpy(),
            saveWeightTolerance: jasmine.createSpy(),
            getWeightTolerance: jasmine.createSpy(),
            updateWeightTolerance: jasmine.createSpy(),
            removeWeightTolerance: jasmine.createSpy(),
            loadRangeWeight: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(WeightToleranceEffect);
    weightToleranceService = TestBed.inject<any>(WeightToleranceService);
  });

  describe('loadProductGroups', () => {
    it('should return a stream with product group list', () => {
      const res: ProductGroup[] = [
        {
          description: 'gold coin',
          productGroupCode: '76'
        }
      ];

      const action = new LoadProductGroupMapping();
      const outcome = new LoadProductGroupMappingSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      productGroupDataService.getProductGroups.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: UpdateWeightTolerancePayload = {
        id: '1',
        data: {
          removeProducts: [],

          addProducts: [],
          isActive: true
        }
      };
      const action = new LoadProductGroupMapping();
      const error = new Error('some error');
      const outcome = new LoadProductGroupMappingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productGroupDataService.getProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected);
    });
  });

  describe('updateIsActive', () => {
    it('should return a stream with UpdateIsActiveSuccess ', () => {
      const payload: UpdateWeightTolerancePayload = {
        id: '1',
        data: {
          removeProducts: [],

          addProducts: [],
          isActive: true
        }
      };

      const res = '';

      const action = new UpdateIsActive(payload);
      const outcome = new UpdateIsActiveSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      weightToleranceService.updateIsActive.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateIsActive$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: UpdateWeightTolerancePayload = {
        id: '1',
        data: {
          removeProducts: [],

          addProducts: [],
          isActive: true
        }
      };
      const action = new UpdateIsActive(payload);
      const error = new Error('some error');
      const outcome = new UpdateIsActiveFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      weightToleranceService.updateIsActive.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateIsActive$).toBeObservable(expected);
    });
  });

  describe('loadConfigList', () => {
    it('should return a stream with config  list', () => {
      const payload: WeightToleranceListPayload = {
        pageIndex: 1,
        pageSize: 10
      };

      const res: WeightToleranceList = {
        configList: [
          {
            configId: '1',
            configName: 'weight tolerance config'
          }
        ],
        totalElements: 10
      };
      const action = new LoadConfigList(payload);
      const outcome = new LoadConfigListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      weightToleranceService.getConfigDetailsList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadConfigList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: WeightToleranceListPayload = {
        pageIndex: 1,
        pageSize: 10
      };

      const action = new LoadConfigList(payload);
      const error = new Error('some error');
      const outcome = new LoadConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      weightToleranceService.getConfigDetailsList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadConfigList$).toBeObservable(expected);
    });
  });

  describe('loadSelectedConfigDetails', () => {
    it('should return a stream with config details', () => {
      const payload = '1';
      const res: ConfigDetails = {
        configName: 'weight tolerance config'
      };

      const action = new LoadSelectedConfigDetails(payload);
      const outcome = new LoadSelectedConfigDetailsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });

      weightToleranceService.getSelectedConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';

      const action = new LoadSelectedConfigDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadSelectedConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      weightToleranceService.getSelectedConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedConfigDetails$).toBeObservable(expected);
    });
  });

  describe('removeWeightTolerance', () => {
    it('should return a stream with updated weight tolerance', () => {
      const payload: UpdateWeightTolerancePayload = {
        id: '1',
        data: {
          removeProducts: ['76'],

          addProducts: []
        }
      };
      const res: WeightToleranceResponse = {
        weightTolerance: [
          {
            rangeId: '1',
            productGroupCode: '76',
            tolerance: '1',
            id: []
          }
        ],
        totalElements: 10
      };

      const action = new RemoveWeightTolerance(payload);
      const outcome = new RemoveWeightToleranceSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      weightToleranceService.updateWeightTolerance.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.removeWeightTolerance$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: UpdateWeightTolerancePayload = {
        id: '1',
        data: {
          removeProducts: ['76'],

          addProducts: []
        }
      };

      const action = new RemoveWeightTolerance(payload);
      const error = new Error('some error');
      const outcome = new RemoveWeightToleranceFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      weightToleranceService.updateWeightTolerance.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.removeWeightTolerance$).toBeObservable(expected);
    });
  });

  describe('SearchConfigDetailsByConfigName', () => {
    it('should return a stream with config  ', () => {
      const payload = 'weight tolerance config';

      const res: WeightToleranceList = {
        configList: [
          {
            configId: '1',
            configName: 'weight tolerance config'
          }
        ],
        totalElements: 10
      };
      const action = new SearchConfigDetailsByConfigName(payload);
      const outcome = new SearchConfigDetailsByConfigNameSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      weightToleranceService.searchConfigDetailsByconfigName.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.SearchConfigDetailsByConfigName$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'weight tolerance config';

      const action = new SearchConfigDetailsByConfigName(payload);
      const error = new Error('some error');
      const outcome = new SearchConfigDetailsByConfigNameFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      weightToleranceService.searchConfigDetailsByconfigName.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.SearchConfigDetailsByConfigName$).toBeObservable(expected);
    });
  });

  describe('saveWeightTolerances', () => {
    it('should return a stream with weight tolerance', () => {
      const payload: SaveWeightTolerancePayload = {
        configDetail: {
          description: 'weight tolerance config',
          isActive: true
        },
        weightToleranceRequest: {
          removeProducts: [],

          addProducts: [
            {
              productGroupCode: '76',
              rangeId: '100-200',
              rowId: 1,
              ruleDetails: {
                type: 'WEIGHT_TOLERANCE',
                data: {
                  weightTolGrams: '0.03'
                }
              }
            }
          ]
        }
      };
      const res = '1';
      const action = new SaveWeightTolerance(payload);
      const outcome = new SaveWeightToleranceSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      weightToleranceService.saveWeightTolerance.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveWeightTolerances$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SaveWeightTolerancePayload = {
        configDetail: {
          description: 'weight tolerance config',
          isActive: true
        },
        weightToleranceRequest: {
          removeProducts: [],

          addProducts: [
            {
              productGroupCode: '76',
              rangeId: '100-200',
              rowId: 1,
              ruleDetails: {
                type: 'WEIGHT_TOLERANCE',
                data: {
                  weightTolGrams: '0.03'
                }
              }
            }
          ]
        }
      };

      const action = new SaveWeightTolerance(payload);
      const error = new Error('some error');
      const outcome = new SaveWeightToleranceFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      weightToleranceService.saveWeightTolerance.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveWeightTolerances$).toBeObservable(expected);
    });
  });

  describe('loadWeightToleranceByConfigId', () => {
    it('should return a stream with weight tolerance', () => {
      const payload: LoadWeightToleranceByConfigidPayload = {
        pageIndex: 1,
        pageSize: 2,
        configId: '1',
        productGroupCode: '71'
      };
      const res: WeightToleranceResponse = {
        weightTolerance: [
          {
            rangeId: '1',
            productGroupCode: '76',
            tolerance: '1',
            id: []
          }
        ],
        totalElements: 10
      };

      const action = new LoadWeightToleranceByConfigid(payload);
      const outcome = new LoadWeightToleranceByConfigidSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      weightToleranceService.getWeightTolerance.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadWeightToleranceByConfigId$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: LoadWeightToleranceByConfigidPayload = {
        pageIndex: 1,
        pageSize: 2,
        configId: '1',
        productGroupCode: '71'
      };
      const action = new LoadWeightToleranceByConfigid(payload);
      const error = new Error('some error');
      const outcome = new LoadWeightToleranceByConfigidFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      weightToleranceService.getWeightTolerance.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadWeightToleranceByConfigId$).toBeObservable(expected);
    });
  });

  describe('updateTolerance', () => {
    it('should return a stream with weight tolerance', () => {
      const payload: UpdateWeightTolerancePayload = {
        id: '1',
        data: {
          removeProducts: [],

          addProducts: [
            {
              productGroupCode: '76',
              rangeId: '100-200',
              ruleDetails: {
                type: 'WEIGHT_TOLERANCE',
                data: {
                  weightTolGrams: '0.03'
                }
              }
            }
          ]
        }
      };
      const res: WeightToleranceResponse = {
        weightTolerance: [
          {
            rangeId: '1',
            productGroupCode: '76',
            tolerance: '1',
            id: []
          }
        ],
        totalElements: 10
      };

      const action = new UpdateWeightTolerance(payload);
      const outcome = new UpdateWeightToleranceSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      weightToleranceService.updateWeightTolerance.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateTolerance$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: UpdateWeightTolerancePayload = {
        id: '1',
        data: {
          removeProducts: [],

          addProducts: [
            {
              productGroupCode: '76',
              rangeId: '100-200',
              ruleDetails: {
                type: 'WEIGHT_TOLERANCE',
                data: {
                  weightTolGrams: '0.03'
                }
              }
            }
          ]
        }
      };

      const action = new UpdateWeightTolerance(payload);
      const error = new Error('some error');
      const outcome = new UpdateWeightToleranceFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      weightToleranceService.updateWeightTolerance.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateTolerance$).toBeObservable(expected);
    });
  });

  describe('loadRangeWeight', () => {
    it('should return a stream with location code list', () => {
      const res = ['100-200'];

      const action = new LoadRangeWeight();
      const outcome = new LoadRangeWeightSuccesss(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      weightToleranceService.loadRangeWeight.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRangeWeight$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRangeWeight();
      const error = new Error('some error');
      const outcome = new LoadRangeWeightFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      weightToleranceService.loadRangeWeight.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRangeWeight$).toBeObservable(expected);
    });
  });
});
