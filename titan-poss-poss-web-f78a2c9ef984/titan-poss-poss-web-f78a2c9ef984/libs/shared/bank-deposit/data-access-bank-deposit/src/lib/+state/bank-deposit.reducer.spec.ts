import {
  BankDepositResponse,
  CustomErrors,
  PaginatePayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import { initialState, BankDepositReducer } from './bank-deposit.reducer';
import * as actions from './bank-deposit.actions';
import { BankDepositState } from './bank-deposit.state';

describe('Bank Deposit Reducer Testing Suite', () => {
  let testState = initialState;

  describe('Actions should update state properly', () => {
    it('should return the initial state', () => {
      const action: any = {};
      const state: BankDepositState = BankDepositReducer(undefined, action);

      expect(state).toBe(testState);
    });

    it('LOAD_BANK_DEPOSIT_LIST action', () => {
      testState = {
        ...testState,
        isLoading: false
      };
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const requestBody = {
        fromDate: moment('2020-08-31T18:30:00.000Z'),
        toDate: moment('2020-11-09T18:30:00.000Z')
      };

      const action = new actions.LoadBankDepositList(payload, requestBody);

      const result: BankDepositState = BankDepositReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_BANK_DEPOSIT_LIST_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        bankDepositData: null
      };

      const payload: BankDepositResponse = {
        results: [],
        totalElements: 10
      };

      const action = new actions.LoadBankDepositListSuccess(payload);

      const result: BankDepositState = BankDepositReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.bankDepositData).toBe(payload);
    });

    it('LOAD_BANK_DEPOSIT_LIST_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadBankDepositListFailure(payload);

      const result: BankDepositState = BankDepositReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('RESET_ERROR action', () => {
      testState = {
        ...testState,
        error: CustomErrorAdaptor.fromJson(Error('Some new Error'))
      };

      const action = new actions.ResetError();

      const result: BankDepositState = BankDepositReducer(testState, action);

      expect(result.error).toBeNull();
    });

    it('RESET_VALUES action', () => {
      testState = {
        ...testState,
        bankDepositData: null
      };

      const action = new actions.ResetValues();

      const result: BankDepositState = BankDepositReducer(testState, action);

      expect(result.bankDepositData).toBeNull();
    });
  });
});
