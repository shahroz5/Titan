import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import { CoToleranceConfigEffect } from './co-tolerance-config.effect';
import { CoToleranceConfigService } from '../co-tolerance-config.service';
import {
  LoadCoToleranceConfigList,
  LoadCoToleranceConfigListFailure,
  LoadCoToleranceConfigListSuccess,
  LoadCoToleranceRangeWeight,
  LoadCoToleranceRangeWeightFailure,
  LoadCoToleranceRangeWeightSuccess,
  LoadMetalTypes,
  LoadMetalTypesFailure,
  LoadMetalTypesSuccess,
  LoadRangeMappingByConfigId,
  LoadRangeMappingByConfigIdFailure,
  LoadRangeMappingByConfigIdSuccess,
  LoadSelectedConfigDetails,
  LoadSelectedConfigDetailsFailure,
  LoadSelectedConfigDetailsSuccess,
  RemoveCoToleranceConfig,
  RemoveCoToleranceConfigFailure,
  RemoveCoToleranceConfigSuccess,
  SaveCoToleranceConfig,
  SaveCoToleranceConfigFailure,
  SaveCoToleranceConfigSuccess,
  SearchCoToleranceConfigList,
  SearchCoToleranceConfigListFailure,
  SearchCoToleranceConfigListSuccess,
  UniqueConfigurationNameCheck,
  UniqueConfigurationNameCheckFailure,
  UniqueConfigurationNameCheckSuccess,
  UpdateCoToleranceConfigIsActive,
  UpdateCoToleranceConfigIsActiveFailure,
  UpdateCoToleranceConfigIsActiveSuccess,
  UpdateRangeMapping,
  UpdateRangeMappingFailure,
  UpdateRangeMappingSuccess
} from './co-tolerance-config.actions';
import {
  CoToleranceConfigDetailsReqPayload,
  CoToleranceConfigDetailsResPayload,
  CoToleranceConfigMetalType,
  CoToleranceConfigResponse,
  CoToleranceRangeMappingResponse,
  COToleranceUpdateRangeMappingPayload,
  CoToleranceWeightRange,
  CustomErrors,
  LoadCoToleranceConfigReqPayload,
  SaveCoTolerancePayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('CoToleranceConfigEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CoToleranceConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let coToleranceConfigService = jasmine.createSpyObj<CoToleranceConfigService>(
    'CoToleranceConfigService',
    [
      'getCoToleranceConfigList',
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
        CoToleranceConfigEffect,
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
          provide: CoToleranceConfigService,
          useValue: {
            getCoToleranceConfigList: jasmine.createSpy(),
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

    effect = TestBed.inject(CoToleranceConfigEffect);
    coToleranceConfigService = TestBed.inject<any>(CoToleranceConfigService);
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
      const res: CoToleranceWeightRange[] = [
        { range: '0-10', id: '851B2408', rowId: 3 }
      ];
      const action = new LoadCoToleranceRangeWeight();
      const outcome = new LoadCoToleranceRangeWeightSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      coToleranceConfigService.loadRangeWeight.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRangeWeight$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCoToleranceRangeWeight();
      const error = new Error('some error');
      const outcome = new LoadCoToleranceRangeWeightFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      coToleranceConfigService.loadRangeWeight.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRangeWeight$).toBeObservable(expected);
    });
  });
  describe('loadWeightToleranceByConfigId', () => {
    it('should return a stream with weight tolerance', () => {
      const request: CoToleranceConfigDetailsReqPayload = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        configId: '1',
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };
      const response: CoToleranceConfigDetailsResPayload = {
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
              type: 'ORDER_CO_FROZEN_TOLERANCE'
            }
          }
        ]
      };

      const action = new LoadRangeMappingByConfigId(request);
      const outcome = new LoadRangeMappingByConfigIdSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      coToleranceConfigService.getConfigMapping.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMappingByConfigId$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const request: CoToleranceConfigDetailsReqPayload = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
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
      coToleranceConfigService.getConfigMapping.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMappingByConfigId$).toBeObservable(expected);
    });
  });
  describe('updateIsActive', () => {
    it('should return a stream with UpdateIsActiveSuccess ', () => {
      const payload: CoToleranceConfigResponse = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        ruleId: 1,
        isActive: false
      };
      const res: CoToleranceConfigResponse = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: false
      };

      const action = new UpdateCoToleranceConfigIsActive(payload);
      const outcome = new UpdateCoToleranceConfigIsActiveSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      coToleranceConfigService.updateConfig.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: CoToleranceConfigResponse = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        ruleId: 1,
        isActive: false
      };
      const action = new UpdateCoToleranceConfigIsActive(payload);
      const error = new Error('some error');
      const outcome = new UpdateCoToleranceConfigIsActiveFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      coToleranceConfigService.updateConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateConfig$).toBeObservable(expected);
    });
  });

  describe('loadResidualWeightConfigList', () => {
    it('should return a stream with config  list', () => {
      const request: LoadCoToleranceConfigReqPayload = {
        pageIndex: 1,
        pageSize: 10,
        orderType: 'ORDER_CO_FROZEN_TOLERANCE'
      };
      const response: {
        data: CoToleranceConfigResponse[];
        totalElements: number;
      } = {
        totalElements: 10,
        data: [
          {
            ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
            ruleId: 1,
            description: 'testconfig',
            isActive: true
          }
        ]
      };

      const action = new LoadCoToleranceConfigList(request);
      const outcome = new LoadCoToleranceConfigListSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      coToleranceConfigService.getCoToleranceConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadResidualWeightConfigList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const request: LoadCoToleranceConfigReqPayload = {
        pageIndex: 1,
        pageSize: 10,
        orderType: 'ORDER_CO_FROZEN_TOLERANCE'
      };

      const action = new LoadCoToleranceConfigList(request);
      const error = new Error('some error');
      const outcome = new LoadCoToleranceConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      coToleranceConfigService.getCoToleranceConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadResidualWeightConfigList$).toBeObservable(expected);
    });
  });

  describe('searchCoToleranceConfigList', () => {
    it('should return a stream with config  list', () => {
      const payload: { configName: string; ruleType: string } = {
        configName: 'testconfig',
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE'
      };
      const res: {
        data: CoToleranceConfigResponse[];
        totalElements: number;
      } = {
        totalElements: 1,
        data: [
          {
            ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
            ruleId: 1,
            description: 'testconfig',
            isActive: true
          }
        ]
      };

      const action = new SearchCoToleranceConfigList(payload);
      const outcome = new SearchCoToleranceConfigListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      coToleranceConfigService.searchConfigByConfigName.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchConfigByConfigName$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: { configName: string; ruleType: string } = {
        configName: 'testconfig',
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE'
      };

      const action = new SearchCoToleranceConfigList(payload);
      const error = new Error('some error');
      const outcome = new SearchCoToleranceConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      coToleranceConfigService.searchConfigByConfigName.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchConfigByConfigName$).toBeObservable(expected);
    });
  });

  describe('loadSelectedConfigDetails', () => {
    it('should return a stream with config details', () => {
      const payload: { configId: string; ruleType: string } = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        configId: '1'
      };
      const res: CoToleranceConfigResponse = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };

      const action = new LoadSelectedConfigDetails(payload);
      const outcome = new LoadSelectedConfigDetailsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });

      coToleranceConfigService.getSelectedConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: { configId: string; ruleType: string } = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        configId: '1'
      };

      const action = new LoadSelectedConfigDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadSelectedConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      coToleranceConfigService.getSelectedConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedConfigDetails$).toBeObservable(expected);
    });
  });

  describe('saveCoToleranceConfig', () => {
    it('should return saved config details', () => {
      const payload: SaveCoTolerancePayload = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        configDetail: {
          ruleDetails: {},
          description: 'testconfig',
          isActive: true
        },
        residualTolerance: null
      };

      const res: CoToleranceConfigResponse = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        description: 'testconfig',
        isActive: true
      };

      const action = new SaveCoToleranceConfig(payload);
      const outcome = new SaveCoToleranceConfigSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });

      coToleranceConfigService.saveConfig.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.SaveResidualWeightConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SaveCoTolerancePayload = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        configDetail: {
          ruleDetails: {},
          description: 'testconfig',
          isActive: true
        },
        residualTolerance: null
      };

      const action = new SaveCoToleranceConfig(payload);
      const error = new Error('some error');
      const outcome = new SaveCoToleranceConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      coToleranceConfigService.saveConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.SaveResidualWeightConfig$).toBeObservable(expected);
    });
  });
  describe('RemoveCoToleranceConfig', () => {
    it('should return a stream with updated weight tolerance', () => {
      const payload: COToleranceUpdateRangeMappingPayload = {
        id: '55555555555',
        data: null,
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE'
      };
      const res = null;
      const action = new RemoveCoToleranceConfig(payload);
      const outcome = new RemoveCoToleranceConfigSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      coToleranceConfigService.UpdateConfigMapping.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.remove$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: COToleranceUpdateRangeMappingPayload = {
        id: '55555555555',
        data: null,
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE'
      };

      const action = new RemoveCoToleranceConfig(payload);
      const error = new Error('some error');
      const outcome = new RemoveCoToleranceConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      coToleranceConfigService.UpdateConfigMapping.and.returnValue(response$);
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
      coToleranceConfigService.uniqueConfigNameCheck.and.returnValue(response$);

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
      coToleranceConfigService.uniqueConfigNameCheck.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.UniqueNameCheck$).toBeObservable(expected);
    });
  });

  describe('LoadMetalTypes', () => {
    it('should return the stream of metal types', () => {
      const res: CoToleranceConfigMetalType[] = [
        { materialTypeCode: 'J', description: 'GOLD' }
      ];
      const action = new LoadMetalTypes();
      const outcome = new LoadMetalTypesSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      coToleranceConfigService.loadMetalTypes.and.returnValue(response$);

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
      coToleranceConfigService.loadMetalTypes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMetalTypes$).toBeObservable(expected);
    });
  });

  describe('UpdateRangeMapping', () => {
    it('should return the stream of updated rules', () => {
      const payload: COToleranceUpdateRangeMappingPayload = {
        id: '7777777777',
        data: null,
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE'
      };
      const res: CoToleranceRangeMappingResponse = {
        ruleId: 101,
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        rules: [
          {
            id: '11111',
            rangeId: '222222',
            ruleDetails: {
              data: null,
              type: 'CO_TOLERANCE'
            }
          }
        ]
      };
      const action = new UpdateRangeMapping(payload);
      const outcome = new UpdateRangeMappingSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      coToleranceConfigService.UpdateConfigMapping.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateRangeMapping$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: COToleranceUpdateRangeMappingPayload = {
        id: '7777777777',
        data: null,
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE'
      };
      const action = new UpdateRangeMapping(payload);
      const error = new Error('some error');
      const outcome = new UpdateRangeMappingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      coToleranceConfigService.UpdateConfigMapping.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateRangeMapping$).toBeObservable(expected);
    });
  });
});
