import { state } from '@angular/animations';
import { BankDepositDetails } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './boutique-bank-deposit.actions';
import {
  BoutiqueBankDepositReducer,
  initialState
} from './boutique-bank-deposit.reducer';
import { BoutiqueBankDepositState } from './boutique-bank-deposit.state';
describe('Boutique Bank Deposit Reducer Testing Suite', () => {
  const boutiqueBankDepositDetails: BankDepositDetails[] = [
    {
      collectionDate: '2020-10-09',
      paymentCode: 'CASH',
      locationCode: 'URB',
      payerBankName: 'AXIS',
      payeeBankName: ['AXIS', 'ICICI'],
      instrumentDate: '2020-10-09',
      depositDate: '2020-10-09',
      businessDate: '2020-10-09',
      instrumentNo: 12,
      amount: 12222,
      openingBalance: 12222,
      depositAmount: 12222,
      pifNo: 12222,
      midCode: 1222,
      depositDetails: {},
      isGhsIncluded: true,
      depositSlipNo: 123,
      password: 'Welcome@123',
      approvalDetails: {},
      isBankingCompleted: true,
      id: 'abc',
      depositedSlipDate: '2020-10-19'
    }
  ];
  describe('Testing LoadBankDepositDetails', () => {
    it('LoadBankDepositDetails Should return proper state', () => {
      const payload: string[] = ['CC', 'DD'];
      const action = new actions.LoadBankDepositDetails(payload);
      const result: BoutiqueBankDepositState = BoutiqueBankDepositReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadBankDepositDetailsSuccess should return success response', () => {
      const action = new actions.LoadBankDepositDetailsSuccess(
        boutiqueBankDepositDetails
      );

      const result: BoutiqueBankDepositState = BoutiqueBankDepositReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.depositDetails).toBe(boutiqueBankDepositDetails);
      expect(result.error).toBe(null);
    });
    it('LoadBankDepositDetailsFailure should return error', () => {
      const action = new actions.LoadBankDepositDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: BoutiqueBankDepositState = BoutiqueBankDepositReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing SaveBankDepositDetails', () => {
    it('SaveBankDepositDetails Should return proper state', () => {
      const payload: any = {
        bankDeposit: [
          {
            amount: 0,
            approvalDetails: {
              data: {},
              type: 'Approve'
            },
            bankName: 'Axis',
            businessDate: '2020-10-16T16:28:13.029Z',
            collectionDate: '2020-10-16T16:28:13.029Z',
            depositAmount: 0,
            depositDate: '2020-10-16T16:28:13.029Z',
            depositDetails: {
              data: {},
              type: 'string'
            },
            id: 'ABC'
          }
        ]
      };
      const action = new actions.SaveBankDepositDetails(payload);
      const result: BoutiqueBankDepositState = BoutiqueBankDepositReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
    });
    it('SaveBankDepositDetailsSuccess should return success response', () => {
      const bankDepositDetails: BankDepositDetails[] = [
        {
          collectionDate: '2020-10-09',
          paymentCode: 'CASH',
          locationCode: 'URB',
          payerBankName: 'AXIS',
          payeeBankName: ['AXIS', 'ICICI'],
          instrumentDate: '2020-10-09',
          depositDate: '2020-10-09',
          businessDate: '2020-10-09',
          instrumentNo: 12,
          amount: 12222,
          openingBalance: 12222,
          depositAmount: 12222,
          pifNo: 12222,
          midCode: 1222,
          depositDetails: {},
          isGhsIncluded: true,
          depositSlipNo: 123,
          password: 'Welcome@123',
          approvalDetails: {},
          isBankingCompleted: true,
          id: 'abc',
          depositedSlipDate: '2020-10-19'
        }
      ];
      const action = new actions.SaveBankDepositDetailsSuccess({
        data: bankDepositDetails,
        totalDepositAmount: 100
      });

      const result: BoutiqueBankDepositState = BoutiqueBankDepositReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(true);
      expect(result.depositedAmount).toBe(100);
    });
    it('SaveBankDepositDetailsFailure should return error', () => {
      const action = new actions.SaveBankDepositDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: BoutiqueBankDepositState = BoutiqueBankDepositReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSaved).toEqual(false);
    });
  });
});
