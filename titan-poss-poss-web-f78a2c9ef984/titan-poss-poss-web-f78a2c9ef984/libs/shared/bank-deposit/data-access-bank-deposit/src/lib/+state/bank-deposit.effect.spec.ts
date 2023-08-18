import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { Observable } from 'rxjs';
import { BankDepositService } from '../bank-deposit.service';
import { BankDepositEffect } from './bank-deposit.effect';
import { BANK_DEPOSIT_FEATURE_KEY } from './bank-deposit.state';
import { initialState } from './bank-deposit.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { BankDepositResponse, PaginatePayload } from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  LoadBankDepositList,
  LoadBankDepositListFailure,
  LoadBankDepositListSuccess
} from './bank-deposit.actions';
import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Bank Deposit Effect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: BankDepositEffect;

  const bankDepositServiceSpy = jasmine.createSpyObj<BankDepositService>([
    'loadBankDeposit'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BankDepositEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [BANK_DEPOSIT_FEATURE_KEY]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: BankDepositService,
          useValue: bankDepositServiceSpy
        }
      ]
    });

    effect = TestBed.inject(BankDepositEffect);
  });

  describe('LoadBankDepositList', () => {
    it('should return a LoadBankDepositList', () => {
      const serviceReponse: BankDepositResponse = {
        totalElements: 10,
        results: []
      };
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const requestBody = {
        fromDate: moment('2020-08-31T18:30:00.000Z'),
        toDate: moment('2020-11-09T18:30:00.000Z')
      };
      const action = new LoadBankDepositList(payload, requestBody);
      const outcome = new LoadBankDepositListSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      bankDepositServiceSpy.loadBankDeposit.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadBankDepositList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const requestBody = {
        fromDate: moment('2020-08-31T18:30:00.000Z'),
        toDate: moment('2020-11-09T18:30:00.000Z')
      };
      const action = new LoadBankDepositList(payload, requestBody);
      const error = new Error('some error');
      const outcome = new LoadBankDepositListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      bankDepositServiceSpy.loadBankDeposit.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBankDepositList$).toBeObservable(expected);
    });
  });
});
