import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { Observable } from 'rxjs';
import { ViewTcsDataService } from '../view-tcs.service';
import { ViewTcsEffect } from './view-tcs.effect';
import { viewTcsFetureKey } from './view-tcs.state';
import { initialState } from './view-tcs.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { TcsList, TcsRequestParam } from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  LoadTcsDetails,
  LoadTcsDetailsFailure,
  LoadTcsDetailsSuccess
} from './view-tcs.actions';
import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Bank Deposit Effect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ViewTcsEffect;

  const viewTcsServiceSpy = jasmine.createSpyObj<ViewTcsDataService>([
    'getTcsDetail'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ViewTcsEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [viewTcsFetureKey]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: ViewTcsDataService,
          useValue: viewTcsServiceSpy
        }
      ]
    });

    effect = TestBed.inject(ViewTcsEffect);
  });

  describe('LoadTcsDetails', () => {
    it('should return a LoadTcsDetails', () => {
      const tcsResult: TcsList[] = [
        {
          brandCode: 'Tanishq',
          ownerType: 'CPD',
          locationCode: 'CPD',
          docNo: '3453',
          transactionDate: moment(325363754757),
          fiscalYear: 2021,
          netInvoiceValue: 2345,
          tcsApplicableAmount: 10000,
          tcsPercentage: 0.01,
          tcsAmountPaid: 100,
          currentTransaction: false,
          tcsToBeCollected: 1000,
          tcsCollected: 1000
        }
      ];
      const requestBody: TcsRequestParam = {
        id: '123245',
        txnType: 'CM',
        subTxnType: 'NEW CM'
      };
      const action = new LoadTcsDetails(requestBody);
      const outcome = new LoadTcsDetailsSuccess(tcsResult);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: tcsResult });
      viewTcsServiceSpy.getTcsDetail.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadTcsDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestBody: TcsRequestParam = {
        id: '123245',
        txnType: 'CM',
        subTxnType: 'NEW CM'
      };
      const action = new LoadTcsDetails(requestBody);
      const error = new Error('some error');
      const outcome = new LoadTcsDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      viewTcsServiceSpy.getTcsDetail.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTcsDetails$).toBeObservable(expected);
    });
  });
});
