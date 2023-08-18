import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import * as moment from 'moment';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { InStockEffects } from './in-stock.effect';
import { initialBoutiqueStatisticsState } from './in-stock.reducers';
import { BinCodes, CustomErrors } from '@poss-web/shared/models';

import { DataPersistence } from '@nrwl/angular';
import * as InStockActions from './in-stock.action';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { newBinRequesFeatureKey } from './in-stock.reducers';

import { InStockService } from '../in-stock.service';

describe('InStock Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: InStockEffects;

  const stockServiceSpy = jasmine.createSpyObj<InStockService>([
    'getBinCodes',
    'getBinHistory',
    'requestBin'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InStockEffects,
        DataPersistence,
        provideMockStore({
          initialState: {
            [newBinRequesFeatureKey]: initialBoutiqueStatisticsState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: InStockService,
          useValue: stockServiceSpy
        }
      ]
    });

    effect = TestBed.inject(InStockEffects);
  });

  describe('loadBinCodes$', () => {
    it('should return a stream with bins', () => {
      const serviceReponse: BinCodes[] = [
        {
          binCode: 'Test 1',
          quantity: 4
        },
        {
          binCode: 'Test 2',
          quantity: 4
        }
      ];

      const parameter = 'STN';

      const action = new InStockActions.LoadBinCodes();
      const outcome = new InStockActions.LoadBinCodesSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockServiceSpy.getBinCodes.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadBinCodes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter = 'STN';

      const action = new InStockActions.LoadBinCodes();
      const error = new Error('some error');
      const outcome = new InStockActions.LoadBinCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockServiceSpy.getBinCodes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBinCodes$).toBeObservable(expected);
    });
  });

  describe('lbinCodeCount$', () => {
    it('should return a stream with binCodeCount$', () => {
      const serviceReponse: BinCodes[] = [
        {
          binCode: 'Test 1',
          quantity: 4
        },
        {
          binCode: 'Test 2',
          quantity: 4
        }
      ];

      const action = new InStockActions.LoadCount();
      const outcome = new InStockActions.LoadCountSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockServiceSpy.getBinCodes.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.binCodeCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter = 'STN';

      const action = new InStockActions.LoadCount();
      const error = new Error('some error');
      const outcome = new InStockActions.LoadCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockServiceSpy.getBinCodes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.binCodeCount$).toBeObservable(expected);
    });
  });
  describe('requestBin$', () => {
    it('should return a stream with bins', () => {
      const serviceReponse = null;

      const payload = {
        bin: 'string',
        remarks: 'string'
      };

      const action = new InStockActions.RequestedBin(payload);
      const outcome = new InStockActions.RequestedBinSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockServiceSpy.requestBin.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.requestBin$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        bin: 'string',
        remarks: 'string'
      };

      const action = new InStockActions.RequestedBin(payload);
      const error = new Error('some error');
      const outcome = new InStockActions.RequestedBinFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockServiceSpy.requestBin.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.requestBin$).toBeObservable(expected);
    });
  });
  describe(' loadBinHistory$', () => {
    it('should return a stream with bins', () => {
      const serviceReponse = null;

      const payload = {

          historyRequestBinDto: {
            dateRangeType: 'CUSTOM', endDate:9999, reqDocNo: 99, reqFiscalYear: 2020, startDate: 4555,
            binGroupCode: 'y',
            binName: 'ii',


            statuses: ['jj']
          },

        page: 9,
        size: 10
      };

      const action = new InStockActions.LoadBinHistory(payload);
      const outcome = new InStockActions.LoadBinHistorySuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockServiceSpy.getBinHistory.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadBinHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        historyRequestBinDto: {
          dateRangeType: 'CUSTOM', endDate:9999, reqDocNo: 99, reqFiscalYear: 2020, startDate: 4555,
          binGroupCode: 'y',
          binName: 'ii',


          statuses: ['jj']
        },
        page: 9,
        size: 10
      };

      const action = new InStockActions.LoadBinHistory(payload);
      const error = new Error('some error');
      const outcome = new InStockActions.LoadBinHistorySuccess({
        count: 0,
        items: []
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockServiceSpy.getBinHistory.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBinHistory$).toBeObservable(expected);
    });
  });
});
