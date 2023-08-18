import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import { AbToleranceConfigEffect } from './ab-tolerance-config.effect';
import { AbToleranceConfigService } from '../ab-tolerance-config.service';
import {
  LoadAbToleranceConfigList,
  LoadAbToleranceConfigListFailure,
  LoadAbToleranceConfigListSuccess,
  LoadAbToleranceRangeWeight,
  LoadAbToleranceRangeWeightFailure,
  LoadAbToleranceRangeWeightSuccess,
  LoadMetalTypes,
  LoadMetalTypesFailure,
  LoadMetalTypesSuccess,
  LoadRangeMappingByConfigId,
  LoadRangeMappingByConfigIdFailure,
  LoadRangeMappingByConfigIdSuccess,
  LoadSelectedConfigDetails,
  LoadSelectedConfigDetailsFailure,
  LoadSelectedConfigDetailsSuccess,
  RemoveAbToleranceConfig,
  RemoveAbToleranceConfigFailure,
  RemoveAbToleranceConfigSuccess,
  SaveAbToleranceConfig,
  SaveAbToleranceConfigFailure,
  SaveAbToleranceConfigSuccess,
  SearchAbToleranceConfigList,
  SearchAbToleranceConfigListFailure,
  SearchAbToleranceConfigListSuccess,
  UniqueConfigurationNameCheck,
  UniqueConfigurationNameCheckFailure,
  UniqueConfigurationNameCheckSuccess,
  UpdateAbToleranceConfigIsActive,
  UpdateAbToleranceConfigIsActiveFailure,
  UpdateAbToleranceConfigIsActiveSuccess,
  UpdateRangeMapping,
  UpdateRangeMappingFailure,
  UpdateRangeMappingSuccess
} from './ab-tolerance-config.actions';
import {
  AbToleranceConfigDetailsReqPayload,
  AbToleranceConfigDetailsResPayload,
  AbToleranceConfigMetalType,
  AbToleranceConfigResponse,
  AbToleranceRangeMappingResponse,
  ABToleranceUpdateRangeMappingPayload,
  AbToleranceWeightRange,
  CustomErrors,
  LoadAbToleranceConfigReqPayload,
  SaveAbTolerancePayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('AbToleranceConfigEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: AbToleranceConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let abToleranceConfigService = jasmine.createSpyObj<AbToleranceConfigService>(
    'AbToleranceConfigService',
    [
      'getAbToleranceConfigList',
      'searchConfigByConfigName',
      'uniqueConfigNameCheck',
      'getSelectedConfigDetails',
      'updateConfig',
      'saveConfig',
      'getConfigMapping',
      'UpdateConfigMapping',
      'loadMetalTypes',
      'loadRangeWeight'
    ]
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AbToleranceConfigEffect,
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
          provide: AbToleranceConfigService,
          useValue: {
            getAbToleranceConfigList: jasmine.createSpy(),
            searchConfigByConfigName: jasmine.createSpy(),
            uniqueConfigNameCheck: jasmine.createSpy(),
            getSelectedConfigDetails: jasmine.createSpy(),
            updateConfig: jasmine.createSpy(),
            saveConfig: jasmine.createSpy(),
            getConfigMapping: jasmine.createSpy(),
            UpdateConfigMapping: jasmine.createSpy(),
            loadMetalTypes: jasmine.createSpy(),
            loadRangeWeight: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(AbToleranceConfigEffect);
    abToleranceConfigService = TestBed.inject<any>(AbToleranceConfigService);
  });

  // describe('loadProductGroups', () => {
  //   it('should return a stream with product group list', () => {
  //     const res: ProductGroup[] = [
  //       {
  //         description: 'gold coin',
  //         productGroupCode: '76'
  //       }
  //     ];

  //     const action = new LoadProductGroupMapping();
  //     const outcome = new LoadProductGroupMappingSuccess(res);
  //     actions$ = hot('-a', { a: action });

  //     const response$ = cold('-a|', { a: res });
  //     productGroupDataService.getProductGroups.and.returnValue(response$);

  //     const expected$ = cold('--b', { b: outcome });
  //     expect(effect.loadProductGroups$).toBeObservable(expected$);
  //   });

  //   it('should fail and return an action with the error', () => {
  //     const payload: UpdateWeightTolerancePayload = {
  //       id: '1',
  //       data: {
  //         removeProducts: [],

  //         addProducts: [],
  //         isActive: true
  //       }
  //     };
  //     const action = new LoadProductGroupMapping();
  //     const error = new Error('some error');
  //     const outcome = new LoadProductGroupMappingFailure(
  //       CustomErrorAdaptor.fromJson(error)
  //     );
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-#|', {}, error);
  //     productGroupDataService.getProductGroups.and.returnValue(response$);
  //     const expected = cold('--b', { b: outcome });
  //     expect(effect.loadProductGroups$).toBeObservable(expected);
  //   });
  // });

  describe('loadRangeWeight', () => {
    it('should return a stream with weight ranges', () => {
      // const res = ['100-200'];
      const res: AbToleranceWeightRange[] = [
        { range: '0-10', id: '851B2408', rowId: 3 }
      ];
      const action = new LoadAbToleranceRangeWeight();
      const outcome = new LoadAbToleranceRangeWeightSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      abToleranceConfigService.loadRangeWeight.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRangeWeight$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadAbToleranceRangeWeight();
      const error = new Error('some error');
      const outcome = new LoadAbToleranceRangeWeightFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      abToleranceConfigService.loadRangeWeight.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRangeWeight$).toBeObservable(expected);
    });
  });
  describe('loadWeightToleranceByConfigId', () => {
    it('should return a stream with weight tolerance', () => {
      const request: AbToleranceConfigDetailsReqPayload = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        configId: '1',
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };
      const response: AbToleranceConfigDetailsResPayload = {
        totalElements: 1,
        ruleDetails: [
          {
            id: '8888888888',
            rangeId: '3333333333333',
            ruleDetails: {
              data: {
                id: '5251B218-19D4-4DCD-AE68-A6E73B0A8FA2',
                metalType: 'J',
                rangeId: '851B2408-985D-49CB-86EC-0CA112333173'
              },
              type: 'ORDER_AB_FROZEN_TOLERANCE'
            }
          }
        ]
      };

      const action = new LoadRangeMappingByConfigId(request);
      const outcome = new LoadRangeMappingByConfigIdSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      abToleranceConfigService.getConfigMapping.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMappingByConfigId$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const request: AbToleranceConfigDetailsReqPayload = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        configId: '1',
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };
      const action = new LoadRangeMappingByConfigId(request);
      const error = new Error('some error');
      const outcome = new LoadRangeMappingByConfigIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      abToleranceConfigService.getConfigMapping.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMappingByConfigId$).toBeObservable(expected);
    });
  });
  describe('updateIsActive', () => {
    it('should return a stream with UpdateIsActiveSuccess ', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        ruleId: 1,
        isActive: false
      };
      const res: AbToleranceConfigResponse = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: false
      };

      const action = new UpdateAbToleranceConfigIsActive(payload);
      const outcome = new UpdateAbToleranceConfigIsActiveSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      abToleranceConfigService.updateConfig.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        ruleId: 1,
        isActive: false
      };
      const action = new UpdateAbToleranceConfigIsActive(payload);
      const error = new Error('some error');
      const outcome = new UpdateAbToleranceConfigIsActiveFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      abToleranceConfigService.updateConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateConfig$).toBeObservable(expected);
    });
  });

  describe('loadResidualWeightConfigList', () => {
    it('should return a stream with config  list', () => {
      const request: LoadAbToleranceConfigReqPayload = {
        pageIndex: 1,
        pageSize: 10,
        orderType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const response: {
        data: AbToleranceConfigResponse[];
        totalElements: number;
      } = {
        totalElements: 10,
        data: [
          {
            ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
            ruleId: 1,
            description: 'testconfig',
            isActive: true
          }
        ]
      };

      const action = new LoadAbToleranceConfigList(request);
      const outcome = new LoadAbToleranceConfigListSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      abToleranceConfigService.getAbToleranceConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadResidualWeightConfigList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const request: LoadAbToleranceConfigReqPayload = {
        pageIndex: 1,
        pageSize: 10,
        orderType: 'ORDER_AB_FROZEN_TOLERANCE'
      };

      const action = new LoadAbToleranceConfigList(request);
      const error = new Error('some error');
      const outcome = new LoadAbToleranceConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      abToleranceConfigService.getAbToleranceConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadResidualWeightConfigList$).toBeObservable(expected);
    });
  });

  describe('searchAbToleranceConfigList', () => {
    it('should return a stream with config  list', () => {
      const payload: { configName: string; ruleType: string } = {
        configName: 'testconfig',
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const res: {
        data: AbToleranceConfigResponse[];
        totalElements: number;
      } = {
        totalElements: 1,
        data: [
          {
            ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
            ruleId: 1,
            description: 'testconfig',
            isActive: true
          }
        ]
      };

      const action = new SearchAbToleranceConfigList(payload);
      const outcome = new SearchAbToleranceConfigListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      abToleranceConfigService.searchConfigByConfigName.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchConfigByConfigName$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: { configName: string; ruleType: string } = {
        configName: 'testconfig',
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };

      const action = new SearchAbToleranceConfigList(payload);
      const error = new Error('some error');
      const outcome = new SearchAbToleranceConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      abToleranceConfigService.searchConfigByConfigName.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchConfigByConfigName$).toBeObservable(expected);
    });
  });

  describe('loadSelectedConfigDetails', () => {
    it('should return a stream with config details', () => {
      const payload: { configId: string; ruleType: string } = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        configId: '1'
      };
      const res: AbToleranceConfigResponse = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };

      const action = new LoadSelectedConfigDetails(payload);
      const outcome = new LoadSelectedConfigDetailsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });

      abToleranceConfigService.getSelectedConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: { configId: string; ruleType: string } = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        configId: '1'
      };

      const action = new LoadSelectedConfigDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadSelectedConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      abToleranceConfigService.getSelectedConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedConfigDetails$).toBeObservable(expected);
    });
  });

  describe('saveAbToleranceConfig', () => {
    it('should return saved config details', () => {
      const payload: SaveAbTolerancePayload = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        configDetail: {
          ruleDetails: {},
          description: 'testconfig',
          isActive: true
        },
        residualTolerance: null
      };

      const res: AbToleranceConfigResponse =
      {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        description: 'testconfig',
        isActive: true
      }

      const action = new SaveAbToleranceConfig(payload);
      const outcome = new SaveAbToleranceConfigSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });

      abToleranceConfigService.saveConfig.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.SaveResidualWeightConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SaveAbTolerancePayload = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        configDetail: {
          ruleDetails: {},
          description: 'testconfig',
          isActive: true
        },
        residualTolerance: null
      };

      const action = new SaveAbToleranceConfig(payload);
      const error = new Error('some error');
      const outcome = new SaveAbToleranceConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      abToleranceConfigService.saveConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.SaveResidualWeightConfig$).toBeObservable(expected);
    });
  });
  describe('RemoveAbToleranceConfig', () => {
    it('should return a stream with updated weight tolerance', () => {
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '55555555555',
        data: null,
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const res = null;
      const action = new RemoveAbToleranceConfig(payload);
      const outcome = new RemoveAbToleranceConfigSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      abToleranceConfigService.UpdateConfigMapping.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.remove$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '55555555555',
        data: null,
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };

      const action = new RemoveAbToleranceConfig(payload);
      const error = new Error('some error');
      const outcome = new RemoveAbToleranceConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      abToleranceConfigService.UpdateConfigMapping.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.remove$).toBeObservable(expected);
    });
  });

  describe('UniqueConfigurationNameCheck', () => {
    it('should return the count', () => {
      const payload = 'configtest';
      const res = 1;
      const action = new UniqueConfigurationNameCheck(payload);
      const outcome = new UniqueConfigurationNameCheckSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      abToleranceConfigService.uniqueConfigNameCheck.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.UniqueNameCheck$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'configtest';

      const action = new UniqueConfigurationNameCheck(payload);
      const error = new Error('some error');
      const outcome = new UniqueConfigurationNameCheckFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      abToleranceConfigService.uniqueConfigNameCheck.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.UniqueNameCheck$).toBeObservable(expected);
    });
  });

  describe('LoadMetalTypes', () => {
    it('should return the stream of metal types', () => {
      const res: AbToleranceConfigMetalType[] = [
        { materialTypeCode: 'J', description: 'GOLD' }
      ];
      const action = new LoadMetalTypes();
      const outcome = new LoadMetalTypesSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      abToleranceConfigService.loadMetalTypes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMetalTypes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadMetalTypes();
      const error = new Error('some error');
      const outcome = new LoadMetalTypesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      abToleranceConfigService.loadMetalTypes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMetalTypes$).toBeObservable(expected);
    });
  });

  describe('UpdateRangeMapping', () => {
    it('should return the stream of updated rules', () => {
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '7777777777',
        data: null,
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const res: AbToleranceRangeMappingResponse = {
        ruleId: 101,
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        rules: [
          {
            id: '11111',
            rangeId: '222222',
            ruleDetails: {
              data: null,
              type: 'AB_TOLERANCE'
            }
          }
        ]
      };
      const action = new UpdateRangeMapping(payload);
      const outcome = new UpdateRangeMappingSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      abToleranceConfigService.UpdateConfigMapping.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateRangeMapping$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '7777777777',
        data: null,
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const action = new UpdateRangeMapping(payload);
      const error = new Error('some error');
      const outcome = new UpdateRangeMappingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      abToleranceConfigService.UpdateConfigMapping.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateRangeMapping$).toBeObservable(expected);
    });
  });
});
