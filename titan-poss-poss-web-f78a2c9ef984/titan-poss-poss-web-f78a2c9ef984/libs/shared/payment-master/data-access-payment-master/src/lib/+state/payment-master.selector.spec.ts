// you will need to assert that the store is calling the right selector function.

import { CustomErrors } from '@poss-web/shared/models';

import { initialState } from './payment-master.reducers';
import * as selectors from './payment-master.selector';

import { PaymentMasterState } from './payment-master.state';

describe('Payment master selector Testing Suite', () => {
  const paymentMasterList = [
    {
      paymentCode: 'GPAY',
      type: 'wallet',
      description: 'gogglePay',
      isActive: true,
      referenceOne: 'transactionId',
      customerDependent: true,
      isEditable: false
    }
  ];
  const paymentMaster = {
    paymentCode: 'GPAY',
    type: 'wallet',
    description: 'gogglePay',
    isActive: true,
    referenceOne: 'transactionId',
    customerDependent: true,
    isEditable: false
  };
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing Payment master related Selectors', () => {
    it('selectPaymentMasterList Should return the list of payment master list', () => {
      const state: PaymentMasterState = {
        ...initialState,
        paymentMasterList: paymentMasterList
      };
      expect(
        selectors.PaymentMasterSelectors.selectPaymentMasterList.projector(
          state
        )
      ).toEqual(paymentMasterList);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: PaymentMasterState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.PaymentMasterSelectors.selectIsloading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: PaymentMasterState = {
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
        selectors.PaymentMasterSelectors.selectError.projector(state)
      ).toEqual(error);
    });
    it('selectPaymentMaster Should return the Payment master object', () => {
      const state: PaymentMasterState = {
        ...initialState,
        paymentMaster: paymentMaster
      };
      expect(
        selectors.PaymentMasterSelectors.selectPaymentMaster.projector(state)
      ).toEqual(paymentMaster);
    });

    it('selectHasSaved Should return the true or false', () => {
      const state: PaymentMasterState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.PaymentMasterSelectors.selectHasSaved.projector(state)
      ).toEqual(true);
    });
    it('selectHasUpdated Should return the true or false', () => {
      const state: PaymentMasterState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.PaymentMasterSelectors.selectHasUpdated.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return the true or false', () => {
      const state: PaymentMasterState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.PaymentMasterSelectors.selectTotalElements.projector(state)
      ).toEqual(10);
    });
  });
});
