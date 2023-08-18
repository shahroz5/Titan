import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';

import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { MetalRatesService } from '../metal-rates.service';
import { MetalRatesEffects } from './metal-rates.effects';
import {
  LoadAvailableMetalRates,
  LoadAvailableMetalRatesFailure,
  LoadAvailableMetalRatesSuccess,
  LoadBodBusinessDate,
  LoadBodBusinessDateFailure,
  LoadBodBusinessDateSuccess,
  LoadEodBusinessDate,
  LoadEodBusinessDateFailure,
  LoadEodBusinessDateSuccess,
  SaveMetalRates,
  SaveMetalRatesFailure,
  SaveMetalRatesSuccess
} from './metal-rates.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { MetalRateUpdateRequestPayload } from '@poss-web/shared/models';

describe('Metal Rates Update Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: MetalRatesEffects;

  const initialState = {};
  const metalRatesServiceSpy: jasmine.SpyObj<MetalRatesService> = jasmine.createSpyObj<
    MetalRatesService
  >('MetalRatesService', [
    'getBodBusinessDay',
    'getEodBusinessDay',
    'getGoldRateAvailabilityStatus',
    'getAvailableMetalRatesForBusinessDay',
    'saveMetalRates'
  ]);
  const loggerService = jasmine.createSpyObj<LoggerService>('LoggerService', [
    'error'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MetalRatesEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: MetalRatesService,
          useValue: metalRatesServiceSpy
        },
        {
          provide: LoggerService,
          useValue: loggerService
        }
      ]
    });
    effect = TestBed.inject(MetalRatesEffects);
  });

  describe('LoadBodBusinessDate Effects Testing', () => {
    it('should load Bod Business Date', () => {
      const payload = 123456789;

      const action = new LoadBodBusinessDate();
      const outCome = new LoadBodBusinessDateSuccess(payload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: payload });
      metalRatesServiceSpy.getBodBusinessDay.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadBodBusinessDate$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadBodBusinessDate();
      const error = new Error('some error');
      const outCome = new LoadBodBusinessDateFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalRatesServiceSpy.getBodBusinessDay.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadBodBusinessDate$).toBeObservable(expected$);
    });
  });

  describe('LoadEodBusinessDate Effects Testing', () => {
    it('should load Eod Business Date', () => {
      const payload = 123456789;

      const action = new LoadEodBusinessDate();
      const outCome = new LoadEodBusinessDateSuccess(payload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: payload });
      metalRatesServiceSpy.getEodBusinessDay.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadEodBusinessDate$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadEodBusinessDate();
      const error = new Error('some error');
      const outCome = new LoadEodBusinessDateFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalRatesServiceSpy.getEodBusinessDay.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadEodBusinessDate$).toBeObservable(expected$);
    });
  });

  describe('LoadAvailableMetalRates Effects Testing', () => {
    const requestPayload = 123456789;

    it('should Load Available MetalRates & return true of gold rate is available', () => {
      const action = new LoadAvailableMetalRates(requestPayload);
      const outCome = new LoadAvailableMetalRatesSuccess(true);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: true });
      metalRatesServiceSpy.getGoldRateAvailabilityStatus.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadAvailableMetalRates$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadAvailableMetalRates(requestPayload);
      const error = new Error('some error');
      const outCome = new LoadAvailableMetalRatesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalRatesServiceSpy.getGoldRateAvailabilityStatus.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadAvailableMetalRates$).toBeObservable(expected$);
    });
  });

  describe('SaveMetalRates Effects Testing', () => {
    const payload: MetalRateUpdateRequestPayload = {
      applicableDate: '123456789',
      metalRates: {
        additionalProp1: {
          metalTypeCode: 'J',
          ratePerUnit: 5000
        },
        additionalProp2: {
          metalTypeCode: 'L',
          ratePerUnit: 4500
        },
        additionalProp3: {
          metalTypeCode: 'P',
          ratePerUnit: 899
        }
      },
      password: 'password'
    };

    it('should Save Metal Rates', () => {
      const action = new SaveMetalRates(payload);
      const outCome = new SaveMetalRatesSuccess(payload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: payload });
      metalRatesServiceSpy.saveMetalRates.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.saveMetalRates$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SaveMetalRates(payload);
      const error = new Error('some error');
      const outCome = new SaveMetalRatesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalRatesServiceSpy.saveMetalRates.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.saveMetalRates$).toBeObservable(expected$);
    });
  });
});
