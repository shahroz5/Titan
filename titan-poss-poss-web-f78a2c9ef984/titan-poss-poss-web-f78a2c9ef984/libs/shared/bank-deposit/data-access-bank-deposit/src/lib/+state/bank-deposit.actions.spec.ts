import {
  BankDepositResponse,
  CustomErrors,
  PaginatePayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  BankDepositActionTypes,
  LoadBankDepositList,
  LoadBankDepositListFailure,
  LoadBankDepositListSuccess,
  ResetError,
  ResetValues
} from './bank-deposit.actions';

import * as moment from 'moment';

describe('Bank Deposit Action Testing suit', () => {
  describe('Load Bank Deposit Action Test Cases', () => {
    it('should check correct type is used for  LoadBankDepositList action ', () => {
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const requestBody = {
        fromDate: moment('2020-08-31T18:30:00.000Z'),
        toDate: moment('2020-11-09T18:30:00.000Z')
      };

      const action = new LoadBankDepositList(payload, requestBody);

      expect(action.type).toEqual(
        BankDepositActionTypes.LOAD_BANK_DEPOSIT_LIST
      );
      expect(action.payload).toEqual(requestBody);
    });

    it('should check correct type is used for  LoadBankDepositListSuccess action ', () => {
      const payload: BankDepositResponse = {
        results: [],
        totalElements: 10
      };
      const action = new LoadBankDepositListSuccess(payload);

      expect(action.type).toEqual(
        BankDepositActionTypes.LOAD_BANK_DEPOSIT_LIST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadBankDepositListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBankDepositListFailure(payload);

      expect(action.type).toEqual(
        BankDepositActionTypes.LOAD_BANK_DEPOSIT_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Other Action Test Cases', () => {
    it('should check correct type is used for ResetError action ', () => {
      const action = new ResetError();
      expect({ ...action }).toEqual({
        type: BankDepositActionTypes.RESET_ERROR
      });
    });

    it('should check correct type is used for ResetValues action ', () => {
      const action = new ResetValues();
      expect({ ...action }).toEqual({
        type: BankDepositActionTypes.RESET_VALUES
      });
    });
  });
});
