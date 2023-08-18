import { AirpayPaymentRequestState } from './airpay-payment-requests.state';
import { initialState } from './airpay-payment-requests.reducer';
import * as selectors from './airpay-payment-requests.selectors';
import {
  CustomerPayload,
  PaymentRequestDetails
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  AirpayPaymentRequestEntity,
  airpayPaymentDetailsAdapter
} from './airpay-payment-requests.entity';

describe('Airpay Payment Requests Selector Testing Suite', () => {
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
    approvedDate: moment.Moment,
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
    requestedDate: moment.Moment,
    requestedReason: string,
    status: string,
    utilizedAmount: number,
    customerName: string,
    customerMobileNo: string,
    customerTitle: string,
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
    'AIRPAY',
    'URB520',
    'rso.urb.2',
    moment(),
    null,
    'IN_PROGRESS',
    null,
    'TEST CUSTOMER',
    '9887766550',
    'MR.',
    false
  );

  const paymentArray = [payment1];
  const paymentRequests: AirpayPaymentRequestEntity = {
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
    const state: AirpayPaymentRequestState = {
      ...initialState,
      isSearchingCustomer: false,
      hasSearchedCustomer: true,
      searchedCustomerDetails: customerDetails
    };
    it('should return selectIsSearchingCustomer selector', () => {
      expect(
        selectors.airpayPaymentRequestSelector.selectIsSearchingCustomer.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return selectHasSearchedCustomer selector', () => {
      expect(
        selectors.airpayPaymentRequestSelector.selectHasSearchedCustomer.projector(
          state
        )
      ).toEqual(true);
    });
    it('should return selectSearchedCustomer selector', () => {
      expect(
        selectors.airpayPaymentRequestSelector.selectSearchedCustomer.projector(
          state
        )
      ).toEqual(customerDetails);
    });
  });

  describe('should return the payment requests related selector values', () => {
    const payment = airpayPaymentDetailsAdapter.setAll(paymentArray, {
      ...airpayPaymentDetailsAdapter.getInitialState()
    });
    const state: AirpayPaymentRequestState = {
      ...initialState,
      paymentRequestList: paymentRequests,
      isLoadingPaymentRequestList: false,
      paymentRequestListCount: 1
    };
    it('should return selectIsLoadingAirpayPaymentRequests selector', () => {
      expect(
        selectors.airpayPaymentRequestSelector.selectIsLoadingAirpayPaymentRequests.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return selectAirpayPaymentCount selector', () => {
      expect(
        selectors.airpayPaymentRequestSelector.selectAirpayPaymentCount.projector(
          state
        )
      ).toEqual(1);
    });
    it('should return the airpayPaymentRequests entity', () => {
      expect(selectors.airpayPaymentRequests.projector(state)).toEqual(payment);
    });
    it('should return the selectAirpayPaymentRequests selector', () => {
      expect(
        selectors.airpayPaymentRequestSelector.selectAirpayPaymentRequests.projector(
          paymentRequests
        )
      ).toEqual(paymentArray);
    });
  });

  describe('should return the payment requests history related selector values', () => {
    const payment = airpayPaymentDetailsAdapter.setAll(paymentArray, {
      ...airpayPaymentDetailsAdapter.getInitialState()
    });
    const state: AirpayPaymentRequestState = {
      ...initialState,
      paymentRequesHistory: paymentRequests,
      isLoadingPaymentRequestHistory: false,
      paymentRequestsHistoryCount: 1
    };
    it('should return selectIsLoadingAirpayPaymentRequestsHistory selector', () => {
      expect(
        selectors.airpayPaymentRequestSelector.selectIsLoadingAirpayPaymentRequestsHistory.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return selectAirpayPaymenHistorytCount selector', () => {
      expect(
        selectors.airpayPaymentRequestSelector.selectAirpayPaymenHistorytCount.projector(
          state
        )
      ).toEqual(1);
    });
    it('should return the airpayPaymentRequestsHistory entity', () => {
      expect(selectors.airpayPaymentRequestsHistory.projector(state)).toEqual(
        payment
      );
    });
    it('should return the selectAirpayPaymentRequestsHistory selector', () => {
      expect(
        selectors.airpayPaymentRequestSelector.selectAirpayPaymentRequestsHistory.projector(
          paymentRequests
        )
      ).toEqual(paymentArray);
    });
  });

  describe('should return the verificationResponse related selector values', () => {
    const state: AirpayPaymentRequestState = {
      ...initialState,
      verificationResponse: null
    };
    it('should return selectverificationResponse selector', () => {
      expect(
        selectors.airpayPaymentRequestSelector.selectverificationResponse.projector(
          state
        )
      ).toEqual(null);
    });
  });

  describe('should return the error related selector values', () => {
    const state: AirpayPaymentRequestState = {
      ...initialState,
      error: null
    };
    it('should return selectError selector', () => {
      expect(
        selectors.airpayPaymentRequestSelector.selectError.projector(state)
      ).toEqual(null);
    });
  });
});
