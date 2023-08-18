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
  InvglobalConfiguration,
  InvglobalConfigurationFiledValue,
  UpdateFieldValuePayload
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { InventoryGlobalConfigEffect } from './inventory-global-config.effect';
import { InventoryGlobalConfigService } from '../inventory-global-config.service';
import {
  LoadInvGlobalConfigurationList,
  UpdateInvGlobalConfigurationFieldValue,
  UpdateInvGlobalConfigurationFieldValueSuccess,
  UpdateInvGlobalConfigurationFieldValueFailure,
  LoadInvGlobalConfigurationFiledValueSuccess,
  LoadInvGlobalConfigurationFiledValueFailure,
  LoadInvGlobalConfigurationFiledValue,
  LoadInvGlobalConfigurationListSuccess,
  LoadInvGlobalConfigurationListFailure,
  SaveInvGlobalConfiguration,
  SaveInvGlobalConfigurationSuccess,
  SaveInvGlobalConfigurationFailure
} from './inventory-global-config.actions';

describe('InventoryGlobalConfigEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: InventoryGlobalConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let inventoryGlobalConfigService = jasmine.createSpyObj<
    InventoryGlobalConfigService
  >('inventoryGlobalConfigService', [
    'getInvGlobalConfigurationList',
    'getInvGlobalConfigurationFiledValue',
    'saveInvGlobalConfiguration',
    'updateInvGlobalonfigurationFieldValue'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InventoryGlobalConfigEffect,
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
          provide: InventoryGlobalConfigService,
          useValue: {
            getInvGlobalConfigurationList: jasmine.createSpy(),
            getInvGlobalConfigurationFiledValue: jasmine.createSpy(),
            saveInvGlobalConfiguration: jasmine.createSpy(),
            updateInvGlobalonfigurationFieldValue: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(InventoryGlobalConfigEffect);
    inventoryGlobalConfigService = TestBed.inject<any>(
      InventoryGlobalConfigService
    );
  });

  describe('loadGlobalConfigurationList', () => {
    it('should return a stream with inv global config list', () => {
      const res: InvglobalConfiguration[] = [
        {
          configId: '1',
          description: 'testConfig',
          isActive: true,
          configType: 'HISTORY_TIME_CONFIG',
          ruleDetails: {
            data: {
              maxTimeToMoveTranscToHistory: '1'
            },
            type: 'HISTORY_TIME_CONFIG'
          }
        }
      ];
      const action = new LoadInvGlobalConfigurationList();
      const outcome = new LoadInvGlobalConfigurationListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      inventoryGlobalConfigService.getInvGlobalConfigurationList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadGlobalConfigurationList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadInvGlobalConfigurationList();
      const error = new Error('some error');
      const outcome = new LoadInvGlobalConfigurationListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      inventoryGlobalConfigService.getInvGlobalConfigurationList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadGlobalConfigurationList$).toBeObservable(expected);
    });
  });

  describe('saveGlobalConfiguration', () => {
    it('should return a stream with updated inv global field values', () => {
      const invglobalConfiguration: InvglobalConfiguration[] = [
        {
          configId: '1',
          description: 'testConfig',
          isActive: true,
          configType: 'HISTORY_TIME_CONFIG',
          ruleDetails: {
            data: {
              maxTimeToMoveTranscToHistory: '1'
            },
            type: 'HISTORY_TIME_CONFIG'
          }
        }
      ];
      const action = new SaveInvGlobalConfiguration();
      const outcome = new SaveInvGlobalConfigurationSuccess(
        invglobalConfiguration
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: invglobalConfiguration });
      inventoryGlobalConfigService.saveInvGlobalConfiguration.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveGlobalConfiguration$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SaveInvGlobalConfiguration();
      const error = new Error('some error');
      const outcome = new SaveInvGlobalConfigurationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      inventoryGlobalConfigService.saveInvGlobalConfiguration.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveGlobalConfiguration$).toBeObservable(expected);
    });
  });

  describe('updateInvGlobalConfigurationFieldValue', () => {
    it('should return a stream with updated inv global field values', () => {
      const payload: UpdateFieldValuePayload = {
        configId: '1',
        ruleDetails: {
          data: {
            maxTimeToMoveTranscToHistory: '250'
          },
          type: 'HISTROY_TIME_CONFIG'
        }
      };

      const res: InvglobalConfigurationFiledValue = {
        maxTimeToMoveTranscToHistory: '250'
      };
      const action = new UpdateInvGlobalConfigurationFieldValue(payload);
      const outcome = new UpdateInvGlobalConfigurationFieldValueSuccess(res);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: res });
      inventoryGlobalConfigService.updateInvGlobalonfigurationFieldValue.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateInvGlobalConfigurationFieldValue$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload: UpdateFieldValuePayload = {
        configId: '1',
        ruleDetails: {
          data: {
            maxTimeToMoveTranscToHistory: '250'
          },
          type: 'HISTROY_TIME_CONFIG'
        }
      };
      const action = new UpdateInvGlobalConfigurationFieldValue(payload);
      const error = new Error('some error');
      const outcome = new UpdateInvGlobalConfigurationFieldValueFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      inventoryGlobalConfigService.updateInvGlobalonfigurationFieldValue.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateInvGlobalConfigurationFieldValue$).toBeObservable(
        expected
      );
    });
  });

  describe('loadGlobalConfigurationFiledValue', () => {
    it('should return a stream with  payment master  object', () => {
      const payload = '1';
      const res: InvglobalConfigurationFiledValue = {
        maxTimeToMoveTranscToHistory: '250'
      };
      const action = new LoadInvGlobalConfigurationFiledValue(payload);
      const outcome = new LoadInvGlobalConfigurationFiledValueSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      inventoryGlobalConfigService.getInvGlobalConfigurationFiledValue.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadGlobalConfigurationFiledValue$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload = 'GPAY';
      const action = new LoadInvGlobalConfigurationFiledValue(payload);
      const error = new Error('some error');
      const outcome = new LoadInvGlobalConfigurationFiledValueFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      inventoryGlobalConfigService.getInvGlobalConfigurationFiledValue.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadGlobalConfigurationFiledValue$).toBeObservable(
        expected
      );
    });
  });
});
