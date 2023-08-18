// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  LoadBankPriorityListingSuccessPayload,
  BankPriority
} from '@poss-web/shared/models';

import { initialState } from './bankPriority.reducer';
import * as selectors from './bankPriority.selectors';

import { BankPriorityState } from './bankPriority.state';

describe('Payment master selector Testing Suite', () => {
  const bankPriorityList: BankPriority[] = [
    {
      bankName: 'HDFC',
      priority: '1'
    }
  ];

  const paymentMaster = {
    paymentCode: 'GPAY',
    type: 'wallet',
    description: 'gogglePay',
    isActive: true,
    referenceOne: 'transactionId',
    customerDependent: true
  };
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing Bank priority related Selectors', () => {
    it('selectBankPriorityDetailsListing Should return the list of payment master list', () => {
      const state: BankPriorityState = {
        ...initialState,
        bankPriorityListing: bankPriorityList
      };
      expect(
        selectors.BankPrioritySelectors.selectBankPriorityDetailsListing.projector(
          state
        )
      ).toEqual(bankPriorityList);
    });

    it('selectIsLoading Should return the true or false', () => {
      const state: BankPriorityState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.BankPrioritySelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: BankPriorityState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(
        selectors.BankPrioritySelectors.selectError.projector(state)
      ).toEqual(error);
    });

    it('selectHasUpdated Should return the true or false', () => {
      const state: BankPriorityState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.BankPrioritySelectors.selectHasUpdated.projector(state)
      ).toEqual(true);
    });
  });
});
