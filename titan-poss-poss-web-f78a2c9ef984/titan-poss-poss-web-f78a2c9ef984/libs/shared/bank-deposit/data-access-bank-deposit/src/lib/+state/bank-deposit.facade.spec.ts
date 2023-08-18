import { initialState } from './bank-deposit.reducer';

import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { BankDepositFacade } from './bank-deposit.facade';
import { provideMockStore } from '@ngrx/store/testing';
import * as moment from 'moment';
import { BankDepositState } from './bank-deposit.state';
import {
  LoadBankDepositList,
  ResetError,
  ResetValues
} from './bank-deposit.actions';
import { PaginatePayload } from '@poss-web/shared/models';

describe('Bank Deposit facade Testing Suite action', () => {
  let bankDepositFacade: BankDepositFacade;

  let store: Store<BankDepositState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), BankDepositFacade]
    });

    bankDepositFacade = TestBed.inject(BankDepositFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions', () => {
    it('should call LoadBankDepositList action', () => {
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const requestBody = {
        fromDate: moment('2020-08-31T18:30:00.000Z'),
        toDate: moment('2020-11-09T18:30:00.000Z')
      };

      const action = new LoadBankDepositList(payload, requestBody);
      bankDepositFacade.loadBankDeposit(payload, requestBody);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetError action', () => {
      const action = new ResetError();
      bankDepositFacade.resetError();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetValues action', () => {
      const action = new ResetValues();
      bankDepositFacade.resetValues();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector', () => {
    it('should access Bank Deposit List selector', () => {
      expect(bankDepositFacade.getBankDepositList()).toEqual(
        bankDepositFacade['bankDepositList$']
      );
    });

    it('should access Error selector', () => {
      expect(bankDepositFacade.getError()).toEqual(bankDepositFacade['error$']);
    });

    it('should access isLoading selector', () => {
      expect(bankDepositFacade.getIsLoading()).toEqual(
        bankDepositFacade['isLoading$']
      );
    });
  });
});
