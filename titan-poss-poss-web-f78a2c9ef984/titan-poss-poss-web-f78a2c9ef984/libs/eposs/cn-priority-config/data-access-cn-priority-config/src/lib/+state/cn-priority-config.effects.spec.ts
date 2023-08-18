import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import {
  CnPriorityConfigList,
  CnPriorityConfigListPayload,
  CnPriorityConfig,
  CnPriorityConfigResponse
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CnPriorityConfigEffect } from './cn-priority-config.effects';
import { CnPriorityConfigService } from '../cn-priority-config.service';
import {
  LoadCnPriorityConfigList,
  LoadCnPriorityConfigListSuccess,
  LoadCnPriorityConfigListFailure,
  SaveCnPriorityConfig,
  SaveCnPriorityConfigSuccess,
  SaveCnPriorityConfigFailure,
  UpdateCnPriorityConfig,
  UpdateCnPriorityConfigSuccess,
  UpdateCnPriorityConfigFailure,
  LoadCnPriorityConfigByConfigId,
  LoadCnPriorityConfigByConfigIdSuccess,
  LoadCnPriorityConfigByConfigIdFailure,
  SearchConfigByConfigName,
  SearchConfigByConfigNameSuccess,
  SearchConfigByConfigNameFailure,
  LoadNewCnPriorityConfigByConfigId,
  LoadCnTypeList,
  LoadCnTypeListSuccess,
  LoadCnTypeListFailure
} from './cn-priority-config.actions';

describe('CnPriorityConfigEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CnPriorityConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let cnPriorityConfigService = jasmine.createSpyObj<CnPriorityConfigService>(
    'cnPriorityConfigService',
    [
      'getCnPriorityConfigList',
      'saveCnPriorityConfig',
      'updateCnPriorityConfig',
      'searchConfigByConfigName',
      'getCnPriorityConfig',
      'getNewCnPriorityConfigByConfigId',
      'getCreditNoteType'
    ]
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CnPriorityConfigEffect,
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
          provide: CnPriorityConfigService,
          useValue: {
            getCnPriorityConfigList: jasmine.createSpy(),
            saveCnPriorityConfig: jasmine.createSpy(),
            updateCnPriorityConfig: jasmine.createSpy(),
            searchConfigByConfigName: jasmine.createSpy(),
            getCnPriorityConfig: jasmine.createSpy(),
            getNewCnPriorityConfigByConfigId: jasmine.createSpy(),
            getCreditNoteType: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(CnPriorityConfigEffect);
    cnPriorityConfigService = TestBed.inject<any>(CnPriorityConfigService);
  });

  const cnPriorityConfigList: CnPriorityConfigList = {
    cnPriorityConfigList: [
      {
        configId: '1',

        description: 'gep',
        ruleDetails: {
          data: {},
          type: 'GEP'
        },
        isActive: true
      }
    ],
    totalElements: 1
  };

  const cnPriorityConfig: CnPriorityConfig = {
    configId: '1',

    description: 'gep',
    ruleDetails: {
      data: {},
      type: 'GEP'
    },
    isActive: true
  };

  const listPayload: CnPriorityConfigListPayload = {
    pageIndex: 0,
    pageSize: 100,
    length: 0
  };

  const cnPriorityConfigResponse: CnPriorityConfigResponse = {
    configId: '1',
    description: 'ibtconfig',
    configType: 'IBT_CONFIG',
    priorityDetails: [],

    isActive: true
  };

  const cnTypeList = [
    {
      id: 'GEP',
      description: 'Gold Exchange Policy'
    }
  ];
  describe('cnPriorityConfigList', () => {
    it('should return a stream with CN Priority config list', () => {
      const action = new LoadCnPriorityConfigList(listPayload);
      const outcome = new LoadCnPriorityConfigListSuccess(cnPriorityConfigList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: cnPriorityConfigList });
      cnPriorityConfigService.getCnPriorityConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.cnPriorityConfigList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCnPriorityConfigList(listPayload);
      const error = new Error('some error');
      const outcome = new LoadCnPriorityConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnPriorityConfigService.getCnPriorityConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.cnPriorityConfigList$).toBeObservable(expected);
    });
  });

  describe('SaveCnPriorityConfig', () => {
    it('should return a stream with ibt config ', () => {
      const action = new SaveCnPriorityConfig(cnPriorityConfig);
      const outcome = new SaveCnPriorityConfigSuccess(cnPriorityConfigResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: cnPriorityConfigResponse });
      cnPriorityConfigService.saveCnPriorityConfig.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveCnPriorityConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SaveCnPriorityConfig(cnPriorityConfigResponse);
      const error = new Error('some error');
      const outcome = new SaveCnPriorityConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnPriorityConfigService.saveCnPriorityConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveCnPriorityConfig$).toBeObservable(expected);
    });
  });

  describe('UpdateCnPriorityConfig', () => {
    it('should return a stream with updated ibt config', () => {
      const action = new UpdateCnPriorityConfig(cnPriorityConfig);
      const outcome = new UpdateCnPriorityConfigSuccess(
        cnPriorityConfigResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: cnPriorityConfigResponse });
      cnPriorityConfigService.updateCnPriorityConfig.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateCnPriorityConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateCnPriorityConfig(cnPriorityConfigResponse);
      const error = new Error('some error');
      const outcome = new UpdateCnPriorityConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnPriorityConfigService.updateCnPriorityConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateCnPriorityConfig$).toBeObservable(expected);
    });
  });

  describe('LoadCnPriorityConfigByConfigId', () => {
    it('should return a stream with  ibt config  object', () => {
      const payload = '1';

      const action = new LoadCnPriorityConfigByConfigId(payload);
      const outcome = new LoadCnPriorityConfigByConfigIdSuccess(
        cnPriorityConfigResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: cnPriorityConfigResponse });
      cnPriorityConfigService.getCnPriorityConfig.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCnPriorityConfigByConfigId$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'GPAY';
      const action = new LoadCnPriorityConfigByConfigId(payload);
      const error = new Error('some error');
      const outcome = new LoadCnPriorityConfigByConfigIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnPriorityConfigService.getCnPriorityConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCnPriorityConfigByConfigId$).toBeObservable(expected);
    });
  });

  describe('LoadCnTypeList', () => {
    it('should return a stream with searched ibt config', () => {
      const action = new LoadCnTypeList();
      const outcome = new LoadCnTypeListSuccess(cnTypeList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: cnTypeList });
      cnPriorityConfigService.getCreditNoteType.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCnTypeList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCnTypeList();
      const error = new Error('some error');
      const outcome = new LoadCnTypeListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnPriorityConfigService.getCreditNoteType.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCnTypeList$).toBeObservable(expected);
    });
  });

  describe('SearchConfigByConfigName', () => {
    it('should return a stream with searched ibt config', () => {
      const payload = '1';

      const action = new SearchConfigByConfigName(payload);
      const outcome = new SearchConfigByConfigNameSuccess(cnPriorityConfigList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: cnPriorityConfigList });
      cnPriorityConfigService.searchConfigByConfigName.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchConfigByConfigName$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'tanishq';
      const action = new SearchConfigByConfigName(parameters);
      const error = new Error('some error');
      const outcome = new SearchConfigByConfigNameFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnPriorityConfigService.searchConfigByConfigName.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchConfigByConfigName$).toBeObservable(expected);
    });
  });
});
