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
  IbtConfigurationList,
  IbtConfigurationListPayload,
  IbtConfiguration,
  IbtConfigurationResponse
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { IbtConfigurationEffect } from './ibt-configuration.effects';
import { IbtConfigurationService } from '../ibt-configuration.service';
import {
  LoadIbtConfigurationList,
  LoadIbtConfigurationListSuccess,
  LoadIbtConfigurationListFailure,
  SaveIbtConfiguration,
  SaveIbtConfigurationSuccess,
  SaveIbtConfigurationFailure,
  UpdateIbtConfiguration,
  UpdateIbtConfigurationSuccess,
  UpdateIbtConfigurationFailure,
  LoadIbtConfigurationByConfigId,
  LoadIbtConfigurationByConfigIdSuccess,
  LoadIbtConfigurationByConfigIdFailure,
  SearchConfigByConfigName,
  SearchConfigByConfigNameSuccess,
  SearchConfigByConfigNameFailure,
  LoadNewIbtConfigurationByConfigId
} from './ibt-configuration.actions';

describe('IbtConfigurationEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: IbtConfigurationEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let ibtConfigurationService = jasmine.createSpyObj<IbtConfigurationService>(
    'ibtConfigurationService',
    [
      'getIbtConfiguratonList',
      'saveIbtConfiguration',
      'updateIbtConfiguration',
      'searchConfigByConfigName',
      'getIbtConfiguration',
      'getNewIbtConfigurationByConfigId'
    ]
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IbtConfigurationEffect,
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
          provide: IbtConfigurationService,
          useValue: {
            getIbtConfiguratonList: jasmine.createSpy(),
            saveIbtConfiguration: jasmine.createSpy(),
            updateIbtConfiguration: jasmine.createSpy(),
            searchConfigByConfigName: jasmine.createSpy(),
            getIbtConfiguration: jasmine.createSpy(),
            getNewIbtConfigurationByConfigId: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(IbtConfigurationEffect);
    ibtConfigurationService = TestBed.inject<any>(IbtConfigurationService);
  });

  const ibtConfigurationList: IbtConfigurationList = {
    ibtConfigList: [
      {
        configId: '1',

        description: 'ibtconfig',
        ruleDetails: {
          data: {
            maxProductsPerStn: '',
            maxReqPerMonth: '',
            maxValPerStn: '',
            validRequestTime: ''
          },
          type: 'IBT_CONIG'
        },
        isActive: true
      }
    ],
    totalElements: 1
  };

  const ibtConfiguration: IbtConfiguration = {
    configId: '1',

    description: 'ibtconfig',
    ruleDetails: {
      data: {
        maxProductsPerStn: '',
        maxReqPerMonth: '',
        maxValPerStn: '',
        validRequestTime: ''
      },
      type: 'IBT_CONIG'
    },
    isActive: true
  };

  const listPayload: IbtConfigurationListPayload = {
    pageIndex: 0,
    pageSize: 100,
    length: 0
  };

  const ibtConfigurationResponse: IbtConfigurationResponse = {
    configId: '1',
    description: 'ibtconfig',
    configType: 'IBT_CONFIG',
    maxProductsPerStn: '',
    maxReqPerMonth: '',
    maxValPerStn: '',
    validRequestTime: '',

    isActive: true
  };
  describe('ibtConfigurationList', () => {
    it('should return a stream with ibt config list', () => {
      const action = new LoadIbtConfigurationList(listPayload);
      const outcome = new LoadIbtConfigurationListSuccess(ibtConfigurationList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: ibtConfigurationList });
      ibtConfigurationService.getIbtConfiguratonList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.ibtConfigurationList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadIbtConfigurationList(listPayload);
      const error = new Error('some error');
      const outcome = new LoadIbtConfigurationListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ibtConfigurationService.getIbtConfiguratonList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.ibtConfigurationList$).toBeObservable(expected);
    });
  });

  describe('SaveIbtConfiguration', () => {
    it('should return a stream with ibt config ', () => {
      const action = new SaveIbtConfiguration(ibtConfiguration);
      const outcome = new SaveIbtConfigurationSuccess(ibtConfigurationResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: ibtConfigurationResponse });
      ibtConfigurationService.saveIbtConfiguration.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveIbtConfiguration$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SaveIbtConfiguration(ibtConfigurationResponse);
      const error = new Error('some error');
      const outcome = new SaveIbtConfigurationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ibtConfigurationService.saveIbtConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveIbtConfiguration$).toBeObservable(expected);
    });
  });

  describe('UpdateIbtConfiguration', () => {
    it('should return a stream with updated ibt config', () => {
      const action = new UpdateIbtConfiguration(ibtConfiguration);
      const outcome = new UpdateIbtConfigurationSuccess(
        ibtConfigurationResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: ibtConfigurationResponse });
      ibtConfigurationService.updateIbtConfiguration.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateIbtConfiguration$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateIbtConfiguration(ibtConfigurationResponse);
      const error = new Error('some error');
      const outcome = new UpdateIbtConfigurationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ibtConfigurationService.updateIbtConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateIbtConfiguration$).toBeObservable(expected);
    });
  });

  describe('LoadIbtConfigurationByConfigId', () => {
    it('should return a stream with  ibt config  object', () => {
      const payload = '1';

      const action = new LoadIbtConfigurationByConfigId(payload);
      const outcome = new LoadIbtConfigurationByConfigIdSuccess(
        ibtConfigurationResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: ibtConfigurationResponse });
      ibtConfigurationService.getIbtConfiguration.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadIbtConfigurationByConfigId$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'GPAY';
      const action = new LoadIbtConfigurationByConfigId(payload);
      const error = new Error('some error');
      const outcome = new LoadIbtConfigurationByConfigIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ibtConfigurationService.getIbtConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIbtConfigurationByConfigId$).toBeObservable(expected);
    });
  });

  describe('SearchConfigByConfigName', () => {
    it('should return a stream with searched ibt config', () => {
      const payload = '1';

      const action = new SearchConfigByConfigName(payload);
      const outcome = new SearchConfigByConfigNameSuccess(ibtConfigurationList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: ibtConfigurationList });
      ibtConfigurationService.searchConfigByConfigName.and.returnValue(
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
      ibtConfigurationService.searchConfigByConfigName.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchConfigByConfigName$).toBeObservable(expected);
    });
  });
});
