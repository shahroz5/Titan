import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { WalkInsRecordEffects } from './walk-ins-record.effects';
import { WalkInsRecordService } from '../walk-ins-record.service';

import {
  LoadSaveWalkInDetails,
  LoadSaveWalkInDetailsSuccess,
  LoadSaveWalkInDetailsFailure,
  LoadWalkInDetailsForBusinessDay,
  LoadWalkInDetailsForBusinessDaySuccess,
  LoadWalkInDetailsForBusinessDayFailure,
  LoadWalkInsHistoryData,
  LoadWalkInsHistoryDataSuccess,
  LoadWalkInsHistoryDataFailure
} from './walk-ins-record.actions';
import {
  SaveWalkInDetailsRequestPayload,
  WalkInsCountRequestPayload,
  WalkInsDetails,
  WalkInsDetailsHistoryResponse
} from '@poss-web/shared/models';

describe('Walk ins record Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: WalkInsRecordEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const walkInsRecordServiceSpy = jasmine.createSpyObj<WalkInsRecordService>(
    'WalkInsRecordService',
    [
      'loadWalkInsHistoryData',
      'saveWalkInsDetails',
      'getWalkInsCustomerVisitDetails'
    ]
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WalkInsRecordEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: WalkInsRecordService,
          useValue: walkInsRecordServiceSpy
        }
      ]
    });
    effect = TestBed.inject(WalkInsRecordEffects);
  });

  describe('loadSaveWalkInDetails', () => {
    it('should Save walk in Details', () => {
      const saveWalkInsDetailsRequestPayload: SaveWalkInDetailsRequestPayload = {
        businessDate: 123456789,
        walkins: 10,
        noOfInvoice: 10,
        nonPurchaserCount: 2,
        purchaserCount: 8
      };
      const saveWalkInsDetailsResponse: WalkInsDetails = {
        businessDate: 123456789,
        walkins: 10,
        noOfInvoice: 10,
        nonPurchaserCount: 2,
        purchaserCount: 8
      };
      const action = new LoadSaveWalkInDetails(
        saveWalkInsDetailsRequestPayload
      );
      const outCome = new LoadSaveWalkInDetailsSuccess(
        saveWalkInsDetailsResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: saveWalkInsDetailsResponse });
      walkInsRecordServiceSpy.saveWalkInsDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadSaveWalkInDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const saveWalkInsDetailsRequestPayload: SaveWalkInDetailsRequestPayload = {
        businessDate: 123456789,
        walkins: 10,
        noOfInvoice: 10,
        nonPurchaserCount: 2,
        purchaserCount: 8
      };
      const action = new LoadSaveWalkInDetails(
        saveWalkInsDetailsRequestPayload
      );
      const error = new Error('some error');
      const outCome = new LoadSaveWalkInDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      walkInsRecordServiceSpy.saveWalkInsDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.loadSaveWalkInDetails$).toBeObservable(expected);
    });
  });

  describe('LoadWalkInDetailsForBusinessDay', () => {
    const payload: WalkInsCountRequestPayload = {
      businessDate: 123456789
    };

    it('should load walk in details for business date', () => {
      const responsePayload = {
        date: 123456789,
        invoices: 10,
        purchasers: 8
      };
      const action = new LoadWalkInDetailsForBusinessDay(payload);
      const outCome = new LoadWalkInDetailsForBusinessDaySuccess(
        responsePayload
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      walkInsRecordServiceSpy.getWalkInsCustomerVisitDetails.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadWalkInConversionCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadWalkInDetailsForBusinessDay(payload);

      const error = new Error('some error');
      const outCome = new LoadWalkInDetailsForBusinessDayFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      walkInsRecordServiceSpy.getWalkInsCustomerVisitDetails.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadWalkInConversionCount$).toBeObservable(expected$);
    });
  });

  describe('LoadWalkInsHistoryData', () => {
    it('should load walk in history data', () => {
      const responsePayload: WalkInsDetailsHistoryResponse[] = [
        {
          businessDate: 123456789,
          noOfInvoice: 10,
          nonPurchaserCount: 9,
          purchaserCount: 1,
          walkins: 10
        }
      ];

      const action = new LoadWalkInsHistoryData();
      const outCome = new LoadWalkInsHistoryDataSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      walkInsRecordServiceSpy.loadWalkInsHistoryData.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadWalkInsHistoryData$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadWalkInsHistoryData();

      const error = new Error('some error');
      const outCome = new LoadWalkInsHistoryDataFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      walkInsRecordServiceSpy.loadWalkInsHistoryData.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadWalkInsHistoryData$).toBeObservable(expected$);
    });
  });
});
