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
  FtepApprovalConfig,
  FtepApprovalConfigList,
  FtepApprovalConfigListPayload,
  FtepApprovalConfigResponse
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { FtepApprovalConfigEffect } from './ftep-approval-config.effects';
import { FtepApprovalConfigService } from '../ftep-approval-config.service';
import {
  LoadRoleList,
  LoadRoleListFailure,
  LoadRoleListSuccess,
  LoadFtepApprovalConfigByRuleId,
  LoadFtepApprovalConfigByRuleIdFailure,
  LoadFtepApprovalConfigByRuleIdSuccess,
  LoadFtepApprovalConfigList,
  LoadFtepApprovalConfigListFailure,
  LoadFtepApprovalConfigListSuccess,
  LoadNewFtepApprovalConfigByRuleId,
  SaveFtepApprovalConfig,
  SaveFtepApprovalConfigFailure,
  SaveFtepApprovalConfigSuccess,
  SearchFtepApprovalConfigByFtepType,
  SearchFtepApprovalConfigByFtepTypeFailure,
  SearchFtepApprovalConfigByFtepTypeSuccess,
  UpdateFtepApprovalConfig,
  UpdateFtepApprovalConfigFailure,
  UpdateFtepApprovalConfigSuccess
} from './ftep-approval-config.actions';

describe('FtepApprovalConfigEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: FtepApprovalConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let ftepApprovalConfigService = jasmine.createSpyObj<
    FtepApprovalConfigService
  >('ftepApprovalConfigService', [
    'getFtepApprovalConfigList',
    'saveFtepApprovalConfig',
    'updateFtepApprovalConfig',
    'searchFtepApprovalConfigByFtepType',
    'getFtepApprovalConfig',
    'getNewFtepApprovalConfigByRuleId',
    'getRoleList'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FtepApprovalConfigEffect,
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
          provide: FtepApprovalConfigService,
          useValue: {
            getFtepApprovalConfigList: jasmine.createSpy(),
            saveFtepApprovalConfig: jasmine.createSpy(),
            updateFtepApprovalConfig: jasmine.createSpy(),
            searchFtepApprovalConfigByFtepType: jasmine.createSpy(),
            getFtepApprovalConfig: jasmine.createSpy(),
            getNewFtepApprovalConfigByRuleId: jasmine.createSpy(),
            getRoleList: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(FtepApprovalConfigEffect);
    ftepApprovalConfigService = TestBed.inject<any>(FtepApprovalConfigService);
  });

  const ftepApprovalConfigList: FtepApprovalConfigList = {
    ftepApprovalConfigList: [
      {
        ruleId: '1',

        description: 'FTEP_APPROVAL_ACCESS_REGULAR',
        ruleDetails: {
          data: {},
          type: 'FTEP_APPROVAL_ACCESS_REGULAR'
        },
        isActive: true
      }
    ],
    totalElements: 1
  };

  const ftepApprovalConfig: FtepApprovalConfig = {
    ruleId: '1',

    description: 'FTEP_APPROVAL_ACCESS_REGULAR',
    ruleDetails: {
      data: {},
      type: 'FTEP_APPROVAL_ACCESS_REGULAR'
    },
    isActive: true
  };

  const newFtepApprovalConfig: FtepApprovalConfig = {
    ruleId: 'New',
    ruleType: '',
    description: '',
    ruleDetails: {
      data: {},
      type: ''
    },
    isActive: true
  };

  const listPayload: FtepApprovalConfigListPayload = {
    pageIndex: 0,
    pageSize: 100,
    length: 0
  };

  const ftepApprovalConfigResponse: FtepApprovalConfigResponse = {
    ruleId: '1',
    description: 'string',
    ruleType: 'FTEP_APPROVAL_ACCESS_REGULAR',
    config: [],

    isActive: true
  };

  const newFtepApprovalConfigResponse: FtepApprovalConfigResponse = {
    ruleId: 'New',
    description: '',
    ruleType: '',
    config: [],

    isActive: true
  };

  const roleList = [
    {
      roleCode: 'BOS',
      roleName: 'BOS'
    }
  ];
  describe('ftepApprovalConfigList', () => {
    it('should return a stream with FTEP Config list', () => {
      const action = new LoadFtepApprovalConfigList(listPayload);
      const outcome = new LoadFtepApprovalConfigListSuccess(
        ftepApprovalConfigList
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: ftepApprovalConfigList });
      ftepApprovalConfigService.getFtepApprovalConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.ftepApprovalConfigList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadFtepApprovalConfigList(listPayload);
      const error = new Error('some error');
      const outcome = new LoadFtepApprovalConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ftepApprovalConfigService.getFtepApprovalConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.ftepApprovalConfigList$).toBeObservable(expected);
    });
  });

  describe('SaveFtepApprovalConfig', () => {
    it('should return a stream with ibt config ', () => {
      const action = new SaveFtepApprovalConfig(ftepApprovalConfig);
      const outcome = new SaveFtepApprovalConfigSuccess(
        ftepApprovalConfigResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: ftepApprovalConfigResponse });
      ftepApprovalConfigService.saveFtepApprovalConfig.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveFtepApprovalConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SaveFtepApprovalConfig(ftepApprovalConfigResponse);
      const error = new Error('some error');
      const outcome = new SaveFtepApprovalConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ftepApprovalConfigService.saveFtepApprovalConfig.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveFtepApprovalConfig$).toBeObservable(expected);
    });
  });

  describe('UpdateFtepApprovalConfig', () => {
    it('should return a stream with updated ibt config', () => {
      const action = new UpdateFtepApprovalConfig(ftepApprovalConfig);
      const outcome = new UpdateFtepApprovalConfigSuccess(
        ftepApprovalConfigResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: ftepApprovalConfigResponse });
      ftepApprovalConfigService.updateFtepApprovalConfig.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateFtepApprovalConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateFtepApprovalConfig(ftepApprovalConfigResponse);
      const error = new Error('some error');
      const outcome = new UpdateFtepApprovalConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ftepApprovalConfigService.updateFtepApprovalConfig.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateFtepApprovalConfig$).toBeObservable(expected);
    });
  });

  describe('LoadFtepApprovalConfigByRuleId', () => {
    it('should return a stream with  ibt config  object', () => {
      const payload = '1';

      const action = new LoadFtepApprovalConfigByRuleId(
        payload,
        'FTEP_APPROVAL_ACCESS_REGULAR'
      );
      const outcome = new LoadFtepApprovalConfigByRuleIdSuccess(
        ftepApprovalConfigResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: ftepApprovalConfigResponse });
      ftepApprovalConfigService.getFtepApprovalConfig.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadFtepApprovalConfigByRuleId$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'GPAY';
      const action = new LoadFtepApprovalConfigByRuleId(
        payload,
        'FTEP_APPROVAL_ACCESS_REGULAR'
      );
      const error = new Error('some error');
      const outcome = new LoadFtepApprovalConfigByRuleIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ftepApprovalConfigService.getFtepApprovalConfig.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadFtepApprovalConfigByRuleId$).toBeObservable(expected);
    });
  });

  describe('SearchFtepApprovalConfigByFtepType', () => {
    it('should return a stream with searched ibt config', () => {
      const payload = '1';

      const action = new SearchFtepApprovalConfigByFtepType(payload);
      const outcome = new SearchFtepApprovalConfigByFtepTypeSuccess(
        ftepApprovalConfigList
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: ftepApprovalConfigList });
      ftepApprovalConfigService.searchFtepApprovalConfigByFtepType.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchFtepApprovalConfigByFtepType$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'tanishq';
      const action = new SearchFtepApprovalConfigByFtepType(parameters);
      const error = new Error('some error');
      const outcome = new SearchFtepApprovalConfigByFtepTypeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ftepApprovalConfigService.searchFtepApprovalConfigByFtepType.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchFtepApprovalConfigByFtepType$).toBeObservable(
        expected
      );
    });
  });

  describe('LoadRoleList', () => {
    it('should return a stream with searched ibt config', () => {
      const action = new LoadRoleList();
      const outcome = new LoadRoleListSuccess(roleList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: roleList });
      ftepApprovalConfigService.getRoleList.and.returnValue(response$);

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
      ftepApprovalConfigService.getRoleList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRoleList$).toBeObservable(expected);
    });
  });

  describe('LoadFtepApprovalConfigByRuleId', () => {
    it('should return a stream with  FTEP config  object', () => {
      const payload = '1';

      const action = new LoadFtepApprovalConfigByRuleId(
        payload,
        'FTEP_APPROVAL_ACCESS_REGULAR'
      );
      const outcome = new LoadFtepApprovalConfigByRuleIdSuccess(
        ftepApprovalConfigResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: ftepApprovalConfigResponse });
      ftepApprovalConfigService.getFtepApprovalConfig.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadFtepApprovalConfigByRuleId$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'GPAY';
      const action = new LoadFtepApprovalConfigByRuleId(
        payload,
        'FTEP_APPROVAL_ACCESS_REGULAR'
      );
      const error = new Error('some error');
      const outcome = new LoadFtepApprovalConfigByRuleIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ftepApprovalConfigService.getFtepApprovalConfig.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadFtepApprovalConfigByRuleId$).toBeObservable(expected);
    });
  });

  // describe('LoadNewFtepApprovalConfigByRuleId', () => {
  //   it('should return a Cn Validation with ruleId New', () => {
  //     const action = new LoadNewFtepApprovalConfigByRuleId();
  //     const outcome = new LoadFtepApprovalConfigByRuleIdSuccess(
  //       ftepApprovalConfigResponse
  //     );
  //     actions$ = hot('-a', { a: action });

  //     const response$ = cold('-a|', ftepApprovalConfigResponse);
  //     ftepApprovalConfigService.getNewFtepApprovalConfigByRuleId.and.returnValue(
  //       response$
  //     );

  //     const expected = cold('--b', { b: outcome });
  //     expect(effect.loadNewFtepApprovalConfigByRuleId$).toBeObservable(
  //       expected
  //     );
  //   });
  // });
});
