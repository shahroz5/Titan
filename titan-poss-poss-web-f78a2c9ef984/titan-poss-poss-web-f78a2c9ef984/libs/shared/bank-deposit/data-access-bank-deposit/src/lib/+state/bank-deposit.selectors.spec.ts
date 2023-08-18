import {
  BankDepositPaymentModeWiseResponse,
  BankDepositResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { initialState } from './bank-deposit.reducer';
import * as selectors from './bank-deposit.selectors';
import { BankDepositState } from './bank-deposit.state';

describe('Testing Bank Deposit related Selectors', () => {
  const depositResult: BankDepositPaymentModeWiseResponse[] = [
    {
      cashPayment: 1000,
      cardPayment: 1000,
      ddPayment: 1000
    }
  ];

  const result: BankDepositResponse = {
    results: [
      {
        date: moment(1604860200000),
        deposits: depositResult
      }
    ],
    totalElements: 10
  };

  it('Should return  Bank Deposit List ', () => {
    const state: BankDepositState = {
      ...initialState,
      bankDepositData: result
    };
    expect(
      selectors.BankDepositSelectors.selectBankDepositList.projector(state)
    ).toEqual(result);
  });

  it('Should return  isLoading status ', () => {
    const state: BankDepositState = {
      ...initialState,
      isLoading: false
    };
    expect(
      selectors.BankDepositSelectors.selectIsLoading.projector(state)
    ).toEqual(false);
  });

  it('Should return  error ', () => {
    const state: BankDepositState = {
      ...initialState,
      error: null
    };
    expect(selectors.BankDepositSelectors.selectError.projector(state)).toEqual(
      null
    );
  });
});
