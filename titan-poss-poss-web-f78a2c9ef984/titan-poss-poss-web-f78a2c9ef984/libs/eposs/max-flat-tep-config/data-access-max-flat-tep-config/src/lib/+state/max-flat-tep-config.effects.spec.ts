import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { MaxFlatTepConfigEffects } from './max-flat-tep-config.effects';
import { MaxFlatTepConfigService } from '../max-flat-tep-config.service';
import { StoreUserDataService } from '@poss-web/shared/masters/data-access-masters';
import {
  LoadMaxFlatTepConfig,
  LoadMaxFlatTepConfigFailure,
  LoadMaxFlatTepConfigSuccess,
  UpdateMaxFlatTepConfig,
  UpdateMaxFlatTepConfigFailure,
  UpdateMaxFlatTepConfigSuccess
} from './max-flat-tep-config.actions';
import { MaxFlatTepConfigDetails } from '@poss-web/shared/models';

describe('GRF Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: MaxFlatTepConfigEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const maxFlatTepConfigServiceSpy = jasmine.createSpyObj<
    MaxFlatTepConfigService
  >('MaxFlatTepConfigService', [
    'getMaxFlatTepConfig',
    'updateMaxFlatTepConfig'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MaxFlatTepConfigEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: MaxFlatTepConfigService,
          useValue: maxFlatTepConfigServiceSpy
        }
      ]
    });
    effect = TestBed.inject(MaxFlatTepConfigEffects);
  });

  describe('loadMaxFlatTepConfig effects', () => {
    it('should load max flat tep config effects', () => {
      const action = new LoadMaxFlatTepConfig();
      const maxFlatTepConfigDetailsResponse: MaxFlatTepConfigDetails = {
        type: 'MAX_FLAT_CONFIG',
        data: {
          maxFlatTepExchangeValue: '1200'
        },
        configId: '1234-abcd'
      };
      const outCome = new LoadMaxFlatTepConfigSuccess(
        maxFlatTepConfigDetailsResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: maxFlatTepConfigDetailsResponse });
      maxFlatTepConfigServiceSpy.getMaxFlatTepConfig.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadMaxFlatTepConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadMaxFlatTepConfig();
      const error = new Error('some error');
      const outCome = new LoadMaxFlatTepConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      maxFlatTepConfigServiceSpy.getMaxFlatTepConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.loadMaxFlatTepConfig$).toBeObservable(expected);
    });
  });

  describe('updateMaxFlatTepConfig effects', () => {
    it('should update max flat tep config effects', () => {
      const payload = {
        configDetails: {
          type: 'MAX_FLAT_CONFIG',
          data: {
            maxFlatTepExchangeValue: '1200'
          },
          configId: '1234-abcd'
        }
      };
      const action = new UpdateMaxFlatTepConfig('1234-abcd', payload);
      const maxFlatTepConfigDetailsResponse: MaxFlatTepConfigDetails = {
        type: 'MAX_FLAT_CONFIG',
        data: {
          maxFlatTepExchangeValue: '1200'
        },
        configId: '1234-abcd'
      };
      const outCome = new UpdateMaxFlatTepConfigSuccess(
        maxFlatTepConfigDetailsResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: maxFlatTepConfigDetailsResponse });
      maxFlatTepConfigServiceSpy.updateMaxFlatTepConfig.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.updateMaxFlatTepConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        configDetails: {
          type: 'MAX_FLAT_CONFIG',
          data: {
            maxFlatTepExchangeValue: '1200'
          },
          configId: '1234-abcd'
        }
      };
      const action = new UpdateMaxFlatTepConfig('1234-abcd', payload);
      const error = new Error('some error');
      const outCome = new UpdateMaxFlatTepConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      maxFlatTepConfigServiceSpy.updateMaxFlatTepConfig.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outCome });
      expect(effect.updateMaxFlatTepConfig$).toBeObservable(expected);
    });
  });
});
