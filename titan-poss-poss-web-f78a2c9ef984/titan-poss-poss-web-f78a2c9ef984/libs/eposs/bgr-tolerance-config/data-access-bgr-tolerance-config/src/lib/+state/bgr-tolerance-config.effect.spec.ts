import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import { BgrToleranceConfigEffect } from './bgr-tolerance-config.effect';
import { BgrToleranceConfigService } from '../bgr-tolerance-config.service';
import {
  LoadBgrToleranceConfigList,
  LoadBgrToleranceConfigListFailure,
  LoadBgrToleranceConfigListSuccess,
  LoadBgrToleranceRangeWeight,
  LoadBgrToleranceRangeWeightFailure,
  LoadBgrToleranceRangeWeightSuccess,
  LoadMetalTypes,
  LoadMetalTypesFailure,
  LoadMetalTypesSuccess,
  LoadRangeMappingByConfigId,
  LoadRangeMappingByConfigIdFailure,
  LoadRangeMappingByConfigIdSuccess,
  LoadSelectedConfigDetails,
  LoadSelectedConfigDetailsFailure,
  LoadSelectedConfigDetailsSuccess,
  RemoveBgrToleranceConfig,
  RemoveBgrToleranceConfigFailure,
  RemoveBgrToleranceConfigSuccess,
  SaveBgrToleranceConfig,
  SaveBgrToleranceConfigFailure,
  SaveBgrToleranceConfigSuccess,
  SearchBgrToleranceConfigList,
  SearchBgrToleranceConfigListFailure,
  SearchBgrToleranceConfigListSuccess,
  UpdateBgrToleranceConfigIsActive,
  UpdateBgrToleranceConfigIsActiveFailure,
  UpdateBgrToleranceConfigIsActiveSuccess,
  UpdateRangeMapping,
  UpdateRangeMappingFailure,
  UpdateRangeMappingSuccess
} from './bgr-tolerance-config.actions';
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
import { BgrToleranceConfigFacade } from './bgr-tolerance-config.facade';

describe('BgrToleranceConfigEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: BgrToleranceConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let bgrToleranceConfigFacade = jasmine.createSpyObj<BgrToleranceConfigFacade>(
    'BgrToleranceConfigFacade',
    ['updateConfigId']
  );
  let bgrToleranceConfigService = jasmine.createSpyObj<
    BgrToleranceConfigService
  >('BgrToleranceConfigService', [
    'getBgrToleranceConfigList',
    'searchConfigByConfigName',
    'getSelectedConfigDetails',
    'updateConfig',
    'saveConfig',
    'getConfigMapping',
    'UpdateConfigMapping',
    'loadMetalTypes',
    'loadRangeWeight'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BgrToleranceConfigEffect,
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
          provide: BgrToleranceConfigService,
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
        },
        {
          provide: BgrToleranceConfigFacade,
          useValue: bgrToleranceConfigFacade
        }
      ]
    });

    effect = TestBed.inject(BgrToleranceConfigEffect);
    bgrToleranceConfigService = TestBed.inject<any>(BgrToleranceConfigService);
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
      const action = new LoadBgrToleranceRangeWeight();
      const outcome = new LoadBgrToleranceRangeWeightSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      bgrToleranceConfigService.loadRangeWeight.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRangeWeight$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadBgrToleranceRangeWeight();
      const error = new Error('some error');
      const outcome = new LoadBgrToleranceRangeWeightFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bgrToleranceConfigService.loadRangeWeight.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRangeWeight$).toBeObservable(expected);
    });
  });
  describe('loadWeightToleranceByConfigId', () => {
    it('should return a stream with weight tolerance', () => {
      const request: AbToleranceConfigDetailsReqPayload = {
        ruleType: 'ORDER_BGR_TOLERANCE',
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
              type: 'ORDER_BGR_TOLERANCE'
            }
          }
        ]
      };

      const action = new LoadRangeMappingByConfigId('');
      const outcome = new LoadRangeMappingByConfigIdSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      bgrToleranceConfigService.getConfigMapping.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMappingByConfigId$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const request: AbToleranceConfigDetailsReqPayload = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        configId: '1',
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };
      const action = new LoadRangeMappingByConfigId('');
      const error = new Error('some error');
      const outcome = new LoadRangeMappingByConfigIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bgrToleranceConfigService.getConfigMapping.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMappingByConfigId$).toBeObservable(expected);
    });
  });
  describe('updateIsActive', () => {
    it('should return a stream with UpdateIsActiveSuccess ', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        ruleId: 1,
        isActive: false
      };
      const res: AbToleranceConfigResponse = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: false
      };

      const action = new UpdateBgrToleranceConfigIsActive(payload);
      const outcome = new UpdateBgrToleranceConfigIsActiveSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      bgrToleranceConfigService.updateConfig.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        ruleId: 1,
        isActive: false
      };
      const action = new UpdateBgrToleranceConfigIsActive(payload);
      const error = new Error('some error');
      const outcome = new UpdateBgrToleranceConfigIsActiveFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bgrToleranceConfigService.updateConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateConfig$).toBeObservable(expected);
    });
  });

  describe('searchBgrToleranceConfigList', () => {
    it('should return a stream with config  list', () => {
      const payload: { configName: string; ruleType: string } = {
        configName: 'testconfig',
        ruleType: 'ORDER_BGR_TOLERANCE'
      };
      const res: {
        data: AbToleranceConfigResponse[];
        totalElements: number;
      } = {
        totalElements: 1,
        data: [
          {
            ruleType: 'ORDER_BGR_TOLERANCE',
            ruleId: 1,
            description: 'testconfig',
            isActive: true
          }
        ]
      };

      const action = new SearchBgrToleranceConfigList('');
      const outcome = new SearchBgrToleranceConfigListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      bgrToleranceConfigService.searchConfigByConfigName.and.returnValue(
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

      const action = new SearchBgrToleranceConfigList('');
      const error = new Error('some error');
      const outcome = new SearchBgrToleranceConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bgrToleranceConfigService.searchConfigByConfigName.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchConfigByConfigName$).toBeObservable(expected);
    });
  });

  describe('loadSelectedConfigDetails', () => {
    it('should return a stream with config details', () => {
      const payload: { configId: string; ruleType: string } = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        configId: '1'
      };
      const res: AbToleranceConfigResponse = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };

      const action = new LoadSelectedConfigDetails('');
      const outcome = new LoadSelectedConfigDetailsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });

      bgrToleranceConfigService.getSelectedConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: { configId: string; ruleType: string } = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        configId: '1'
      };

      const action = new LoadSelectedConfigDetails('');
      const error = new Error('some error');
      const outcome = new LoadSelectedConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bgrToleranceConfigService.getSelectedConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedConfigDetails$).toBeObservable(expected);
    });
  });

  describe('saveBgrToleranceConfig', () => {
    it('should return saved config details', () => {
      const payload: SaveAbTolerancePayload = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        configDetail: {
          ruleDetails: {},
          description: 'testconfig',
          isActive: true
        },
        residualTolerance: null
      };
      const res: AbToleranceConfigResponse = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };

      const action = new SaveBgrToleranceConfig(payload);
      const outcome = new SaveBgrToleranceConfigSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });

      bgrToleranceConfigService.saveConfig.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.SaveResidualWeightConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SaveAbTolerancePayload = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        configDetail: {
          ruleDetails: {},
          description: 'testconfig',
          isActive: true
        },
        residualTolerance: null
      };

      const action = new SaveBgrToleranceConfig(payload);
      const error = new Error('some error');
      const outcome = new SaveBgrToleranceConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bgrToleranceConfigService.saveConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.SaveResidualWeightConfig$).toBeObservable(expected);
    });
  });
  describe('RemoveAbToleranceConfig', () => {
    it('should return a stream with updated weight tolerance', () => {
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '55555555555',
        data: null,
        ruleType: 'ORDER_BGR_TOLERANCE'
      };
      const res = null;
      const action = new RemoveBgrToleranceConfig(payload);
      const outcome = new RemoveBgrToleranceConfigSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      bgrToleranceConfigService.UpdateConfigMapping.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.remove$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '55555555555',
        data: null,
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };

      const action = new RemoveBgrToleranceConfig(payload);
      const error = new Error('some error');
      const outcome = new RemoveBgrToleranceConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bgrToleranceConfigService.UpdateConfigMapping.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.remove$).toBeObservable(expected);
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
      bgrToleranceConfigService.loadMetalTypes.and.returnValue(response$);

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
      bgrToleranceConfigService.loadMetalTypes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMetalTypes$).toBeObservable(expected);
    });
  });

  describe('UpdateRangeMapping', () => {
    it('should return the stream of updated rules', () => {
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '7777777777',
        data: null,
        ruleType: 'ORDER_BGR_TOLERANCE'
      };
      const res: AbToleranceRangeMappingResponse = {
        ruleId: 101,
        ruleType: 'ORDER_BGR_TOLERANCE',
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
      bgrToleranceConfigService.UpdateConfigMapping.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateRangeMapping$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '7777777777',
        data: null,
        ruleType: 'ORDER_BGR_TOLERANCE'
      };
      const action = new UpdateRangeMapping(payload);
      const error = new Error('some error');
      const outcome = new UpdateRangeMappingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bgrToleranceConfigService.UpdateConfigMapping.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateRangeMapping$).toBeObservable(expected);
    });
  });
});
