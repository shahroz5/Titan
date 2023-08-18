import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import {
  GrnApprovalConfig,
  GrnApprovalConfigList,
  GrnApprovalConfigListPayload,
  GrnApprovalConfigResponse
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { GrnApprovalConfigEffect } from './grn-approval-config.effects';
import { GrnApprovalConfigService } from '../grn-approval-config.service';
import {
  LoadRoleList,
  LoadRoleListFailure,
  LoadRoleListSuccess,
  LoadGrnApprovalConfigByRuleId,
  LoadGrnApprovalConfigByRuleIdFailure,
  LoadGrnApprovalConfigByRuleIdSuccess,
  LoadGrnApprovalConfigList,
  LoadGrnApprovalConfigListFailure,
  LoadGrnApprovalConfigListSuccess,
  SaveGrnApprovalConfig,
  SaveGrnApprovalConfigFailure,
  SaveGrnApprovalConfigSuccess,
  SearchGrnApprovalConfigByGrnType,
  SearchGrnApprovalConfigByGrnTypeFailure,
  SearchGrnApprovalConfigByGrnTypeSuccess,
  UpdateGrnApprovalConfig,
  UpdateGrnApprovalConfigFailure,
  UpdateGrnApprovalConfigSuccess
} from './grn-approval-config.actions';

describe('GrnApprovalConfigEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: GrnApprovalConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let grnApprovalConfigService = jasmine.createSpyObj<GrnApprovalConfigService>(
    'grnApprovalConfigService',
    [
      'getGrnApprovalConfigList',
      'saveGrnApprovalConfig',
      'updateGrnApprovalConfig',
      'searchGrnApprovalConfigByGrnType',
      'getGrnApprovalConfig',
      'getNewGrnApprovalConfigByRuleId',
      'getRoleList'
    ]
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GrnApprovalConfigEffect,
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
          provide: GrnApprovalConfigService,
          useValue: {
            getGrnApprovalConfigList: jasmine.createSpy(),
            saveGrnApprovalConfig: jasmine.createSpy(),
            updateGrnApprovalConfig: jasmine.createSpy(),
            searchGrnApprovalConfigByGrnType: jasmine.createSpy(),
            getGrnApprovalConfig: jasmine.createSpy(),
            getNewGrnApprovalConfigByRuleId: jasmine.createSpy(),
            getRoleList: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(GrnApprovalConfigEffect);
    grnApprovalConfigService = TestBed.inject<any>(GrnApprovalConfigService);
  });

  const grnApprovalConfigList: GrnApprovalConfigList = {
    grnApprovalConfigList: [
      {
        ruleId: '1',

        description: 'GRN_APPROVAL_ACCESS_REGULAR',
        ruleDetails: {
          data: {},
          type: 'GRN_APPROVAL_ACCESS_REGULAR'
        },
        isActive: true
      }
    ],
    totalElements: 1
  };

  const grnApprovalConfig: GrnApprovalConfig = {
    ruleId: '1',

    description: 'GRN_APPROVAL_ACCESS_REGULAR',
    ruleDetails: {
      data: {},
      type: 'GRN_APPROVAL_ACCESS_REGULAR'
    },
    isActive: true
  };

  const listPayload: GrnApprovalConfigListPayload = {
    pageIndex: 0,
    pageSize: 100,
    length: 0
  };

  const grnApprovalConfigResponse: GrnApprovalConfigResponse = {
    ruleId: '1',
    description: 'string',
    ruleType: 'GRN_APPROVAL_ACCESS_REGULAR',
    config: [],

    isActive: true
  };

  const roleList = [
    {
      roleCode: 'BOS',
      roleName: 'BOS'
    }
  ];
  describe('grnApprovalConfigList', () => {
    it('should return a stream with GRN Config list', () => {
      const action = new LoadGrnApprovalConfigList(listPayload);
      const outcome = new LoadGrnApprovalConfigListSuccess(
        grnApprovalConfigList
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: grnApprovalConfigList });
      grnApprovalConfigService.getGrnApprovalConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.grnApprovalConfigList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadGrnApprovalConfigList(listPayload);
      const error = new Error('some error');
      const outcome = new LoadGrnApprovalConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnApprovalConfigService.getGrnApprovalConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.grnApprovalConfigList$).toBeObservable(expected);
    });
  });

  describe('SaveGrnApprovalConfig', () => {
    it('should return a stream with ibt config ', () => {
      const action = new SaveGrnApprovalConfig(grnApprovalConfig);
      const outcome = new SaveGrnApprovalConfigSuccess(
        grnApprovalConfigResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: grnApprovalConfigResponse });
      grnApprovalConfigService.saveGrnApprovalConfig.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveGrnApprovalConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SaveGrnApprovalConfig(grnApprovalConfigResponse);
      const error = new Error('some error');
      const outcome = new SaveGrnApprovalConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnApprovalConfigService.saveGrnApprovalConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveGrnApprovalConfig$).toBeObservable(expected);
    });
  });

  describe('UpdateGrnApprovalConfig', () => {
    it('should return a stream with updated ibt config', () => {
      const action = new UpdateGrnApprovalConfig(grnApprovalConfig);
      const outcome = new UpdateGrnApprovalConfigSuccess(
        grnApprovalConfigResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: grnApprovalConfigResponse });
      grnApprovalConfigService.updateGrnApprovalConfig.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateGrnApprovalConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateGrnApprovalConfig(grnApprovalConfigResponse);
      const error = new Error('some error');
      const outcome = new UpdateGrnApprovalConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnApprovalConfigService.updateGrnApprovalConfig.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateGrnApprovalConfig$).toBeObservable(expected);
    });
  });

  describe('LoadGrnApprovalConfigByRuleId', () => {
    it('should return a stream with  ibt config  object', () => {
      const payload = '1';

      const action = new LoadGrnApprovalConfigByRuleId(
        payload,
        'GRN_APPROVAL_ACCESS_REGULAR'
      );
      const outcome = new LoadGrnApprovalConfigByRuleIdSuccess(
        grnApprovalConfigResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: grnApprovalConfigResponse });
      grnApprovalConfigService.getGrnApprovalConfig.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadGrnApprovalConfigByRuleId$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'GPAY';
      const action = new LoadGrnApprovalConfigByRuleId(
        payload,
        'GRN_APPROVAL_ACCESS_REGULAR'
      );
      const error = new Error('some error');
      const outcome = new LoadGrnApprovalConfigByRuleIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnApprovalConfigService.getGrnApprovalConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadGrnApprovalConfigByRuleId$).toBeObservable(expected);
    });
  });

  describe('SearchGrnApprovalConfigByGrnType', () => {
    it('should return a stream with searched ibt config', () => {
      const payload = '1';

      const action = new SearchGrnApprovalConfigByGrnType(payload);
      const outcome = new SearchGrnApprovalConfigByGrnTypeSuccess(
        grnApprovalConfigList
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: grnApprovalConfigList });
      grnApprovalConfigService.searchGrnApprovalConfigByGrnType.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchGrnApprovalConfigByGrnType$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'tanishq';
      const action = new SearchGrnApprovalConfigByGrnType(parameters);
      const error = new Error('some error');
      const outcome = new SearchGrnApprovalConfigByGrnTypeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnApprovalConfigService.searchGrnApprovalConfigByGrnType.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchGrnApprovalConfigByGrnType$).toBeObservable(expected);
    });
  });

  describe('LoadRoleList', () => {
    it('should return a stream with searched ibt config', () => {
      const action = new LoadRoleList();
      const outcome = new LoadRoleListSuccess(roleList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: roleList });
      grnApprovalConfigService.getRoleList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRoleList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRoleList();
      const error = new Error('some error');
      const outcome = new LoadRoleListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnApprovalConfigService.getRoleList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRoleList$).toBeObservable(expected);
    });
  });

  describe('LoadGrnApprovalConfigByRuleId', () => {
    it('should return a stream with  GRN config  object', () => {
      const payload = '1';

      const action = new LoadGrnApprovalConfigByRuleId(
        payload,
        'GRN_APPROVAL_ACCESS_REGULAR'
      );
      const outcome = new LoadGrnApprovalConfigByRuleIdSuccess(
        grnApprovalConfigResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: grnApprovalConfigResponse });
      grnApprovalConfigService.getGrnApprovalConfig.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadGrnApprovalConfigByRuleId$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'GPAY';
      const action = new LoadGrnApprovalConfigByRuleId(
        payload,
        'GRN_APPROVAL_ACCESS_REGULAR'
      );
      const error = new Error('some error');
      const outcome = new LoadGrnApprovalConfigByRuleIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnApprovalConfigService.getGrnApprovalConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadGrnApprovalConfigByRuleId$).toBeObservable(expected);
    });
  });

  //   describe('LoadNewGrnApprovalConfigByRuleId', () => {
  //     it('should return a Cn Validation with ruleId New', () => {
  //       const action = new LoadNewGrnApprovalConfigByRuleId();
  //       const outcome = new LoadGrnApprovalConfigByRuleIdSuccess(grnApprovalConfigResponse);
  //       actions$ = hot('-a', { a: action });

  //       const response$ = cold('-a|', grnApprovalConfigResponse);
  //       grnApprovalConfigService.getNewGrnApprovalConfigByRuleId.and.returnValue(response$);

  //       const expected = cold('--b', { b: outcome });
  //       expect(effect.loadNewGrnApprovalConfigByRuleId$).toBeObservable(expected);
  //     });
  //   });
});
