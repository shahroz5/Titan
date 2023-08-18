import { RazorpayStatusCheckState } from './razorpay-status-check.state';
import { initialState } from './razorpay-status-check.reducer';
import * as selectors from './razorpay-status-check.selectors';
import {
  CustomerPayload,
  PaymentRequestDetails
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  RazorpayPaymentRequestEntity,
  razorpayPaymentDetailsAdapter
} from './razorpay-status-check.entity';

describe('Razorpay Payment Requests Selector Testing Suite', () => {
  const addPaymentToEntities = <T extends PaymentRequestDetails>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.id]: element
        };
      },
      {}
    );

    return reducedEntities;
  };
  const createPayment = (
    amount: number,
    approvedBy: string,
    approvedDate: 1603899790692,
    approvedReason: string,
    customerId: number,
    id: string,
    locationCode: string,
    otherDetails: {
      data: {};
      type: string;
    },
    paymentCode: string,
    referenceId: string,
    requestedBy: string,
    requestedDate: 1603899790692,
    requestedReason: string,
    status: string,
    utilizedAmount: number,
    customerName: string,
    customerMobileNo: string,
    customerTitle: string,
    ulpId,
    isVerifying: boolean
  ): PaymentRequestDetails => {
    return {
      amount,
      approvedBy,
      approvedDate,
      approvedReason,
      customerId,
      id,
      locationCode,
      otherDetails: {
        data: otherDetails.data,
        type: otherDetails.type
      },
      paymentCode,
      referenceId,
      requestedBy,
      requestedDate,
      requestedReason,
      status,
      utilizedAmount,
      customerName,
      customerMobileNo,
      customerTitle,
      ulpId,
      isVerifying
    };
  };
  const payment1 = createPayment(
    12,
    null,
    null,
    null,
    770,
    'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8',
    'URB',
    { type: null, data: null },
    'RAZOR PAY',
    'URB520',
    'rso.urb.2',
    1603899790692,
    null,
    'IN_PROGRESS',
    null,
    'TEST CUSTOMER',
    '9887766550',
    'MR.',
    'UlpId123',
    false
  );

  const paymentArray = [payment1];
  const paymentRequests: RazorpayPaymentRequestEntity = {
    ids: [payment1.id],
    entities: addPaymentToEntities(paymentArray)
  };

  describe('should return the search customer related selector values', () => {
    const customerDetails: CustomerPayload = {
      currentTier: 'customerTier',
      custTaxNo: 'customerTaxNo',
      customerDetails: {
        data: {},
        type: ''
      },
      customerId: 770,
      customerName: 'TEST CUSTOMER',
      customerType: 'customerType',
      instiTaxNo: 'customerInstiTaxNo',
      isMemberBlocked: false,
      isPulseCustomer: false,
      mobileNumber: '9887766550',
      passportId: 'passportId',
      title: 'Mr.',
      ulpId: 'customerUlpId'
    };
    const state: RazorpayStatusCheckState = {
      ...initialState,
      isSearchingCustomer: false,
      hasSearchedCustomer: true,
      searchedCustomerDetails: customerDetails
    };
    it('should return selectIsSearchingCustomer selector', () => {
      expect(
        selectors.RazorpayPaymentStatusSelector.selectIsSearchingCustomer.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return selectHasSearchedCustomer selector', () => {
      expect(
        selectors.RazorpayPaymentStatusSelector.selectHasSearchedCustomer.projector(
          state
        )
      ).toEqual(true);
    });
    it('should return selectSearchedCustomer selector', () => {
      expect(
        selectors.RazorpayPaymentStatusSelector.selectSearchedCustomer.projector(
          state
        )
      ).toEqual(customerDetails);
    });
  });

  describe('should return the payment requests related selector values', () => {
    const payment = razorpayPaymentDetailsAdapter.setAll(paymentArray, {
      ...razorpayPaymentDetailsAdapter.getInitialState()
    });
    const state: RazorpayStatusCheckState = {
      ...initialState,
      paymentRequestList: paymentRequests,
      isLoading: false,
      paymentRequestListCount: 1
    };
    it('should return selectIsLoadingRazorpayPaymentRequests selector', () => {
      expect(
        selectors.RazorpayPaymentStatusSelector.selectIsLoading.projector(state)
      ).toEqual(false);
    });
    it('should return selectRazorpayPaymentCount selector', () => {
      expect(
        selectors.RazorpayPaymentStatusSelector.selectRazorpayPaymentCount.projector(
          state
        )
      ).toEqual(1);
    });
    it('should return the razorpayPaymentRequests entity', () => {
      expect(selectors.razorpayPaymentRequests.projector(state)).toEqual(
        payment
      );
    });
    it('should return the selectRazorpayPaymentRequests selector', () => {
      expect(
        selectors.RazorpayPaymentStatusSelector.selectRazorpayPaymentRequests.projector(
          paymentRequests
        )
      ).toEqual(paymentArray);
    });
  });

  describe('should return the payment requests history related selector values', () => {
    const payment = razorpayPaymentDetailsAdapter.setAll(paymentArray, {
      ...razorpayPaymentDetailsAdapter.getInitialState()
    });
    const state: RazorpayStatusCheckState = {
      ...initialState,
      paymentRequesHistory: paymentRequests,
      isLoading: false,
      paymentRequestsHistoryCount: 1
    };
    it('should return selectRazorpayPaymenHistorytCount selector', () => {
      expect(
        selectors.RazorpayPaymentStatusSelector.selectRazorpayPaymenHistorytCount.projector(
          state
        )
      ).toEqual(1);
    });
    it('should return the razorpayPaymentRequestsHistory entity', () => {
      expect(selectors.razorpayPaymentRequestsHistory.projector(state)).toEqual(
        payment
      );
    });
    it('should return the selectRazorpayPaymentRequestsHistory selector', () => {
      expect(
        selectors.RazorpayPaymentStatusSelector.selectRazorpayPaymentRequestsHistory.projector(
          paymentRequests
        )
      ).toEqual(paymentArray);
    });
  });

  describe('should return the verificationResponse related selector values', () => {
    const state: RazorpayStatusCheckState = {
      ...initialState,
      verificationResponse: null
    };
    it('should return selectverificationResponse selector', () => {
      expect(
        selectors.RazorpayPaymentStatusSelector.selectverificationResponse.projector(
          state
        )
      ).toEqual(null);
    });
  });

  describe('should return the error related selector values', () => {
    const state: RazorpayStatusCheckState = {
      ...initialState,
      error: null
    };
    it('should return selectError selector', () => {
      expect(
        selectors.RazorpayPaymentStatusSelector.selectError.projector(state)
      ).toEqual(null);
    });
  });
});
