import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  ClosedBodResponse,
  MetalRatesAndGoldAvailabilityResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { BodEodService } from '../bod-eod.service';
import {
  LatestBusinessDay,
  LatestBusinessDayFailure,
  LatestBusinessDaySuccess,
  LoadEodBusinessDate,
  LoadEodBusinessDateFailure,
  LoadEodBusinessDateSuccess,
  LoadMetalRatesForBusinessDay,
  LoadMetalRatesForBusinessDayFailure,
  LoadMetalRatesForBusinessDaySuccess,
  LoadOpenBusinessDate,
  LoadOpenBusinessDateFailure,
  LoadOpenBusinessDateSuccess
} from './bod-eod.actions';
import { BodEodEffects } from './bod-eod.effects';

describe('Shared BOD-EOD Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: BodEodEffects;

  const initialState = {};
  const bodEodServiceSpy: jasmine.SpyObj<BodEodService> = jasmine.createSpyObj<
    BodEodService
  >('BodEodService', [
    'getOpenBusinessDate',
    'getEodBusinessDate',
    'getLatestBusinessDay',
    'getMetalRatesAndGoldRateAvailabityForBusinessDay'
  ]);
  const loggerService = jasmine.createSpyObj<LoggerService>('LoggerService', [
    'error'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BodEodEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: BodEodService,
          useValue: bodEodServiceSpy
        },
        {
          provide: LoggerService,
          useValue: loggerService
        }
      ]
    });
    effect = TestBed.inject(BodEodEffects);
  });

  describe('LoadOpenBusinessDate Effects Testing', () => {
    it('should load User Profile', () => {
      const payload = 123456789;

      const action = new LoadOpenBusinessDate();
      const outCome = new LoadOpenBusinessDateSuccess(payload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: payload });
      bodEodServiceSpy.getOpenBusinessDate.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.currentDayBod$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadOpenBusinessDate();
      const error = new Error('some error');
      const outCome = new LoadOpenBusinessDateFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.getOpenBusinessDate.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.currentDayBod$).toBeObservable(expected$);
    });
  });

  describe('LoadMetalRatesForBusinessDay Effects Testing', () => {
    const requestPayload = 123456789;

    it('should load MetalRates For BusinessDay', () => {
      const responsePayload: MetalRatesAndGoldAvailabilityResponse = {
        availableMetalRates: {
          goldRate: 50000,
          platinumRate: null,
          silverRate: null
        },
        goldRateAvailable: true
      };

      const action = new LoadMetalRatesForBusinessDay(requestPayload);
      const outCome = new LoadMetalRatesForBusinessDaySuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.getMetalRatesAndGoldRateAvailabityForBusinessDay.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadMetalRatesForBusinessDay$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadMetalRatesForBusinessDay(requestPayload);
      const error = new Error('some error');
      const outCome = new LoadMetalRatesForBusinessDayFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.getMetalRatesAndGoldRateAvailabityForBusinessDay.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadMetalRatesForBusinessDay$).toBeObservable(expected$);
    });
  });

  describe('LoadEodBusinessDate Effects Testing', () => {
    const requestPayload = 123456789;

    it('should load EOD Business Date', () => {
      const responsePayload = 123456789;

      const action = new LoadEodBusinessDate();
      const outCome = new LoadEodBusinessDateSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: requestPayload });
      bodEodServiceSpy.getEodBusinessDate.and.returnValue(response$);
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
      bodEodServiceSpy.getEodBusinessDate.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadEodBusinessDate$).toBeObservable(expected$);
    });
  });

  describe('LatestBusinessDay Effects Testing', () => {
    const requestPayload = 123456789;

    it('should load Latest Business Day', () => {
      const responsePayload: ClosedBodResponse = {
        businessDate: 123456789,
        fiscalYear: 2020,
        status: 'OPEN'
      };

      const action = new LatestBusinessDay();
      const outCome = new LatestBusinessDaySuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      bodEodServiceSpy.getLatestBusinessDay.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.latestBusinessDay$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LatestBusinessDay();
      const error = new Error('some error');
      const outCome = new LatestBusinessDayFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bodEodServiceSpy.getLatestBusinessDay.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.latestBusinessDay$).toBeObservable(expected$);
    });
  });
});
