import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import { ResidualWeightConfigEffect } from './residual-weight-config.effect';
import { ResidualWeightConfigService } from '../residual-weight-config.service';
import {
  LoadResidualToleranceByConfigidPayload,
  LoadResidualWeightConfigListingPayload,
  RangeMappingResponse,
  ResidualWeightConfigResponse,
  ResidualWeightRange,
  ResidualWeightToleranceResponse,
  SaveResidualTolerancePayload,
  UpdateRangeMappingPayload
} from '@poss-web/shared/models';
import {
  LoadRangeMappingByConfigid,
  LoadRangeMappingByConfigidFailure,
  LoadRangeMappingByConfigidSuccess,
  LoadResidualRangeWeight,
  LoadResidualRangeWeightFailure,
  LoadResidualRangeWeightSuccesss,
  LoadResidualWeightConfigList,
  LoadResidualWeightConfigListFailure,
  LoadResidualWeightConfigListSuccess,
  LoadSelectedConfigDetails,
  LoadSelectedConfigDetailsFailure,
  LoadSelectedConfigDetailsSuccess,
  RemoveRangeMapping,
  RemoveRangeMappingFailure,
  RemoveRangeMappingSuccess,
  SaveResidualWeightConfig,
  SaveResidualWeightConfigFailure,
  SaveResidualWeightConfigSuccess,
  SearchResidualWeightConfigList,
  SearchResidualWeightConfigListFailure,
  SearchResidualWeightConfigListSuccess,
  UpdateRangeMapping,
  UpdateRangeMappingFailure,
  UpdateRangeMappingSuccess,
  UpdateResidualWeightConfigIsActive,
  UpdateResidualWeightConfigIsActiveFailure,
  UpdateResidualWeightConfigIsActiveSuccess
} from './residual-weight-config.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('ResidualWeightConfigEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ResidualWeightConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let residualWeightConfigService = jasmine.createSpyObj<
    ResidualWeightConfigService
  >('ResidualWeightConfigService', [
    'getResidualWeightConfigList',
    'searchConfigByConfigName',
    'saveResidualWeightConfig',
    'updateResidualWeightConfig',
    'loadRangeWeight',
    'selectedConfigDetails',
    'getRangeMapping',
    'UpdateRangeMapping'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ResidualWeightConfigEffect,
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
          provide: ResidualWeightConfigService,
          useValue: {
            getResidualWeightConfigList: jasmine.createSpy(),
            searchConfigByConfigName: jasmine.createSpy(),
            saveResidualWeightConfig: jasmine.createSpy(),
            updateResidualWeightConfig: jasmine.createSpy(),
            loadRangeWeight: jasmine.createSpy(),
            selectedConfigDetails: jasmine.createSpy(),
            getRangeMapping: jasmine.createSpy(),
            UpdateRangeMapping: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(ResidualWeightConfigEffect);
    residualWeightConfigService = TestBed.inject<any>(
      ResidualWeightConfigService
    );
  });

  describe('loadRangeWeight', () => {
    it('should return a stream with weight ranges', () => {
      const res: ResidualWeightRange[] = [
        { range: '0-10', id: '851B2408', rowId: 3 }
      ];
      const action = new LoadResidualRangeWeight();
      const outcome = new LoadResidualRangeWeightSuccesss(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      residualWeightConfigService.loadRangeWeight.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRangeWeight$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadResidualRangeWeight();
      const error = new Error('some error');
      const outcome = new LoadResidualRangeWeightFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      residualWeightConfigService.loadRangeWeight.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRangeWeight$).toBeObservable(expected);
    });
  });
  describe('loadResidualWeightConfigList', () => {
    it('should return a stream with config List', () => {
      const req: LoadResidualWeightConfigListingPayload = {
        pageIndex: 1,
        pageSize: 10
      };
      const res: {
        data: ResidualWeightConfigResponse[];
        totalElements: number;
      } = {
        data: [
          {
            description: 'configtest',
            isActive: true,
            ruleDetails: null,
            ruleId: 2,
            ruleType: 'AB_RESIDUALTOLERANCE_CONFIG'
          }
        ],
        totalElements: 1
      };
      const action = new LoadResidualWeightConfigList(req);
      const outcome = new LoadResidualWeightConfigListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      residualWeightConfigService.getResidualWeightConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadResidualWeightConfigList$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const req: LoadResidualWeightConfigListingPayload = {
        pageIndex: 1,
        pageSize: 10
      };
      const action = new LoadResidualWeightConfigList(req);
      const error = new Error('some error');
      const outcome = new LoadResidualWeightConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      residualWeightConfigService.getResidualWeightConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadResidualWeightConfigList$).toBeObservable(expected);
    });
  });
  describe('searchConfigByConfigName', () => {
    it('should return a stream with config List', () => {
      const res: {
        data: ResidualWeightConfigResponse[];
        totalElements: number;
      } = {
        data: [
          {
            description: 'configtest',
            isActive: true,
            ruleDetails: null,
            ruleId: 2,
            ruleType: 'AB_RESIDUALTOLERANCE_CONFOG'
          }
        ],
        totalElements: 1
      };
      const req = 'configtest';
      const action = new SearchResidualWeightConfigList(req);
      const outcome = new SearchResidualWeightConfigListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      residualWeightConfigService.searchConfigByConfigName.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchConfigByConfigName$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const req = 'configtest';
      const action = new SearchResidualWeightConfigList(req);
      const error = new Error('some error');
      const outcome = new SearchResidualWeightConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      residualWeightConfigService.searchConfigByConfigName.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchConfigByConfigName$).toBeObservable(expected);
    });
  });
  describe('SaveResidualWeightConfig', () => {
    it('should return a stream with config List', () => {
      const res: ResidualWeightConfigResponse = {
        description: 'configtest',
        isActive: true,
        ruleDetails: null,
        ruleId: 2,
        ruleType: 'AB_RESIDUALTOLERANCE_CONFOG'
      };
      const req: SaveResidualTolerancePayload = {
        configDetail: {
          description: 'config test',
          isActive: true,
          ruleDetails: null
        },
        residualTolerance: {
          addRangeConfigs: []
        }
      };
      const action = new SaveResidualWeightConfig(req);
      const outcome = new SaveResidualWeightConfigSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      residualWeightConfigService.saveResidualWeightConfig.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.SaveResidualWeightConfig$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const req: SaveResidualTolerancePayload = {
        configDetail: {
          description: 'config test',
          isActive: true,
          ruleDetails: null
        },
        residualTolerance: {
          addRangeConfigs: []
        }
      };
      const action = new SaveResidualWeightConfig(req);
      const error = new Error('some error');
      const outcome = new SaveResidualWeightConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      residualWeightConfigService.saveResidualWeightConfig.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.SaveResidualWeightConfig$).toBeObservable(expected);
    });
  });
  describe('updateResidualWeightConfig', () => {
    it('should return a stream with config List', () => {
      const res: ResidualWeightConfigResponse = {
        description: 'configtest',
        isActive: true,
        ruleDetails: null,
        ruleId: 2,
        ruleType: 'AB_RESIDUALTOLERANCE_CONFOG'
      };
      const req: ResidualWeightConfigResponse = {
        description: 'configtest',
        isActive: true,
        ruleDetails: null,
        ruleId: 2,
        ruleType: 'AB_RESIDUALTOLERANCE_CONFOG'
      };
      const action = new UpdateResidualWeightConfigIsActive(req);
      const outcome = new UpdateResidualWeightConfigIsActiveSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      residualWeightConfigService.updateResidualWeightConfig.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateResidualWeightConfig$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const req: ResidualWeightConfigResponse = {
        description: 'configtest',
        isActive: true,
        ruleDetails: null,
        ruleId: 2,
        ruleType: 'AB_RESIDUALTOLERANCE_CONFOG'
      };
      const action = new UpdateResidualWeightConfigIsActive(req);
      const error = new Error('some error');
      const outcome = new UpdateResidualWeightConfigIsActiveFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      residualWeightConfigService.updateResidualWeightConfig.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateResidualWeightConfig$).toBeObservable(expected);
    });
  });
  describe('configDetails', () => {
    it('should return a stream with config List', () => {
      const res: ResidualWeightConfigResponse = {
        description: 'configtest',
        isActive: true,
        ruleDetails: null,
        ruleId: 2,
        ruleType: 'AB_RESIDUALTOLERANCE_CONFOG'
      };
      const req = '11111111';
      const action = new LoadSelectedConfigDetails(req);
      const outcome = new LoadSelectedConfigDetailsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      residualWeightConfigService.selectedConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.configDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const req = '11111111';
      const action = new LoadSelectedConfigDetails(req);
      const error = new Error('some error');
      const outcome = new LoadSelectedConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      residualWeightConfigService.selectedConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.configDetails$).toBeObservable(expected);
    });
  });
  describe('loadrangeMappingByConfigId', () => {
    it('should return a stream with config List', () => {
      const req: LoadResidualToleranceByConfigidPayload = {
        configId: '111111111',
        pageIndex: 0,
        pageSize: 10
      };
      const res: ResidualWeightToleranceResponse = {
        totalElements: 10,
        weightTolerance: [
          {
            ruleId: 1,
            ruleType: 'AB_RESIDUAL_TOLERANCE_CONFIG',
            rules: [
              {
                id: '123456',
                rangeId: '22222222',
                ruleDetails: {
                  data: null,
                  type: 'AB_RESIDUAL_TOLERANCE_CONFIG'
                }
              }
            ]
          }
        ]
      };
      const action = new LoadRangeMappingByConfigid(req);
      const outcome = new LoadRangeMappingByConfigidSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      residualWeightConfigService.getRangeMapping.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadrangeMappingByConfigId$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const req: LoadResidualToleranceByConfigidPayload = {
        configId: '111111111',
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadRangeMappingByConfigid(req);
      const error = new Error('some error');
      const outcome = new LoadRangeMappingByConfigidFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      residualWeightConfigService.getRangeMapping.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadrangeMappingByConfigId$).toBeObservable(expected);
    });
  });
  describe('updateRangeMapping', () => {
    it('should return a stream with config List', () => {
      const req: UpdateRangeMappingPayload = {
        data: null,
        id: '111111111'
      };
      const res: RangeMappingResponse = {
        ruleId: 1,
        ruleType: 'AB_RESIDUAL_TOLERANCE_CONFIG',
        rules: []
      };
      const action = new UpdateRangeMapping(req);
      const outcome = new UpdateRangeMappingSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      residualWeightConfigService.UpdateRangeMapping.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateRangeMapping$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const req: UpdateRangeMappingPayload = {
        data: null,
        id: '111111111'
      };
      const action = new UpdateRangeMapping(req);
      const error = new Error('some error');
      const outcome = new UpdateRangeMappingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      residualWeightConfigService.UpdateRangeMapping.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateRangeMapping$).toBeObservable(expected);
    });
  });
  describe('remove', () => {
    it('should return a stream with config List', () => {
      const req: UpdateRangeMappingPayload = {
        data: null,
        id: '111111111'
      };
      const res: RangeMappingResponse = {
        ruleId: 1,
        ruleType: 'AB_RESIDUAL_TOLERANCE_CONFIG',
        rules: []
      };
      const action = new RemoveRangeMapping(req);
      const outcome = new RemoveRangeMappingSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      residualWeightConfigService.UpdateRangeMapping.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.remove$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const req: UpdateRangeMappingPayload = {
        data: null,
        id: '111111111'
      };
      const action = new RemoveRangeMapping(req);
      const error = new Error('some error');
      const outcome = new RemoveRangeMappingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      residualWeightConfigService.UpdateRangeMapping.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.remove$).toBeObservable(expected);
    });
  });
});
