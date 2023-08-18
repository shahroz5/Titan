import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from '@nrwl/angular';
import { hot, cold } from 'jasmine-marbles';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { GrnInterboutiqueConfig } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { GrnInterboutiqueConfigService } from '../grn-interboutique-config.service';
import { GrnInterboutiqueConfigEffect } from './grn-interboutique-config.effect';
import { GRNINTERBOUTIQUECONGIG_FEATURE_KEY } from './grn-interboutique-config.reducer';
import {
  AddNewGrnInterboutiqueConfig,
  AddNewGrnInterboutiqueConfigFailure,
  AddNewGrnInterboutiqueConfigSuccess,
  EditGrnInterboutiqueConfig,
  EditGrnInterboutiqueConfigFailure,
  EditGrnInterboutiqueConfigSuccess,
  LoadGrnInterboutiqueConfig,
  LoadGrnInterboutiqueConfigFailure,
  LoadGrnInterboutiqueConfigSuccess
} from './grn-interboutique-config.actions';

describe('GRN Interboutique Config Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: GrnInterboutiqueConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const grnInterboutiqueConfigServiceSpy = jasmine.createSpyObj<
    GrnInterboutiqueConfigService
  >([
    'getGrnInterboutiqueConfigDetails',
    'addNewGrnInterboutiqueConfigDetails',
    'editGrnInterboutiqueConfigDetails'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GrnInterboutiqueConfigEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [GRNINTERBOUTIQUECONGIG_FEATURE_KEY]: initialState
          }
        }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: POSS_WEB_CACHING_STRATEGY,
          useValue: []
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: GrnInterboutiqueConfigService,
          useValue: grnInterboutiqueConfigServiceSpy
        }
      ]
    });

    effect = TestBed.inject(GrnInterboutiqueConfigEffect);
  });

  describe('LoadGrnInterboutiqueConfig', () => {
    it('should return LoadGrnInterboutiqueConfig', () => {
      const payload1 = 1;
      const action = new LoadGrnInterboutiqueConfig(payload1);

      const payload2: GrnInterboutiqueConfig = {
        description: 'Desc',
        isActive: true,
        ruleDetails: {
          type: 'Type',
          data: {
            config: {
              L1: ['1'],
              L2: ['1'],
              L3: ['1']
            },
            type: 'Type'
          }
        },
        ruleId: 1,
        ruleType: 'Type'
      };

      const outcome = new LoadGrnInterboutiqueConfigSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      grnInterboutiqueConfigServiceSpy.getGrnInterboutiqueConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadGrnInterboutiqueConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload1 = 1;
      const action = new LoadGrnInterboutiqueConfig(payload1);
      const error = new Error('some error');
      const outcome = new LoadGrnInterboutiqueConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnInterboutiqueConfigServiceSpy.getGrnInterboutiqueConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadGrnInterboutiqueConfig$).toBeObservable(expected);
    });
  });

  describe('AddNewGrnInterboutiqueConfig', () => {
    it('should return AddNewGrnInterboutiqueConfig', () => {
      const payload: GrnInterboutiqueConfig = {
        description: 'Desc',
        isActive: true,
        ruleDetails: {
          type: 'Type',
          data: {
            config: {
              L1: ['1'],
              L2: ['1'],
              L3: ['1']
            },
            type: 'Type'
          }
        },
        ruleId: 1,
        ruleType: 'Type'
      };
      const action = new AddNewGrnInterboutiqueConfig(payload);

      const outcome = new AddNewGrnInterboutiqueConfigSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      grnInterboutiqueConfigServiceSpy.addNewGrnInterboutiqueConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.addNewGrnInterboutiqueConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: GrnInterboutiqueConfig = {
        description: 'Desc',
        isActive: true,
        ruleDetails: {
          type: 'Type',
          data: {
            config: {
              L1: ['1'],
              L2: ['1'],
              L3: ['1']
            },
            type: 'Type'
          }
        },
        ruleId: 1,
        ruleType: 'Type'
      };
      const action = new AddNewGrnInterboutiqueConfig(payload);
      const error = new Error('some error');
      const outcome = new AddNewGrnInterboutiqueConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnInterboutiqueConfigServiceSpy.addNewGrnInterboutiqueConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.addNewGrnInterboutiqueConfig$).toBeObservable(expected);
    });
  });

  describe('EditGrnInterboutiqueConfig', () => {
    it('should return EditGrnInterboutiqueConfig', () => {
      const payload: {
        ruleId: number;
        grnInterboutiqueConfig: GrnInterboutiqueConfig;
      } = {
        ruleId: 1,
        grnInterboutiqueConfig: {
          description: 'Desc',
          isActive: true,
          ruleDetails: {
            type: 'Type',
            data: {
              config: {
                L1: ['1'],
                L2: ['1'],
                L3: ['1']
              },
              type: 'Type'
            }
          },
          ruleId: 1,
          ruleType: 'Type'
        }
      };
      const action = new EditGrnInterboutiqueConfig(payload);

      const outcome = new EditGrnInterboutiqueConfigSuccess(
        payload.grnInterboutiqueConfig
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload.grnInterboutiqueConfig
      });
      grnInterboutiqueConfigServiceSpy.editGrnInterboutiqueConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editGrnInterboutiqueConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: {
        ruleId: number;
        grnInterboutiqueConfig: GrnInterboutiqueConfig;
      } = {
        ruleId: 1,
        grnInterboutiqueConfig: {
          description: 'Desc',
          isActive: true,
          ruleDetails: {
            type: 'Type',
            data: {
              config: {
                L1: ['1'],
                L2: ['1'],
                L3: ['1']
              },
              type: 'Type'
            }
          },
          ruleId: 1,
          ruleType: 'Type'
        }
      };
      const action = new EditGrnInterboutiqueConfig(payload);
      const error = new Error('some error');
      const outcome = new EditGrnInterboutiqueConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnInterboutiqueConfigServiceSpy.editGrnInterboutiqueConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.editGrnInterboutiqueConfig$).toBeObservable(expected);
    });
  });
});
