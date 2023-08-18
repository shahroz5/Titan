import * as moment from 'moment';
import {
  PaymentRequestDetails,
  SearchCustomerPayload,
  SEARCH_BY_ENUM,
  CustomerPayload,
  LoadPaymentRequestPayload
} from '@poss-web/shared/models';
import * as actions from './airpay-payment-requests.actions';
import { AirpayPaymentRequestState } from './airpay-payment-requests.state';
import {
  initialState,
  AirpayPaymentRequestReducer
} from './airpay-payment-requests.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { airpayPaymentDetailsAdapter } from './airpay-payment-requests.entity';

describe('Airpay Payment Requests Testing Suite', () => {
  const erroPayload = CustomErrorAdaptor.fromJson(Error('some error'));

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

  describe('Testing Search Customer reducers', () => {
    it('SearchCustomer should be called', () => {
      const payload: SearchCustomerPayload = {
        searchFieldValue: '9887766550',
        searchType: SEARCH_BY_ENUM.MOBILE_NO
      };
      const action = new actions.SearchCustomer(payload);
      const result: AirpayPaymentRequestState = AirpayPaymentRequestReducer(
        initialState,
        action
      );

      expect(result.isSearchingCustomer).toBe(true);
      expect(result.hasSearchedCustomer).toBe(false);
      expect(result.searchedCustomerDetails).toBe(null);
      expect(result.error).toBe(null);
    });
    it('SearchCustomerSuccess should be called', () => {
      const payload: CustomerPayload = {
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
      const action = new actions.SearchCustomerSuccess(payload);
      const result: AirpayPaymentRequestState = AirpayPaymentRequestReducer(
        initialState,
        action
      );

      expect(result.isSearchingCustomer).toBe(false);
      expect(result.hasSearchedCustomer).toBe(true);
      expect(result.searchedCustomerDetails).toBe(payload);
    });
    it('Failure should be called', () => {
      const action = new actions.SearchCustomerFailure(erroPayload);
      const result: AirpayPaymentRequestState = AirpayPaymentRequestReducer(
        initialState,
        action
      );

      expect(result.isSearchingCustomer).toBe(false);
      expect(result.hasSearchedCustomer).toBe(false);

      expect(result.error.message).toBe('some error');
    });
  });

  describe('Testing Load Airpay Payment Requests reducers', () => {
    it('LoadAirpayPaymentRequests should be called', () => {
      const payload: LoadPaymentRequestPayload = {
        page: 0,
        paymentCode: 'AIRPAY',
        payload: {
          customerId: 770,
          dateRangeType: 'CUSTOM',
          endDate: moment().format('DD-MMM-YYY').valueOf(),
          fiscalYear: null,
          isWorkFlowApproval: false,
          referenceId: null,
          startDate: moment().format('DD-MMM-YYY').valueOf(),
          status: null
        },
        size: 10,
        sort: null
      };
      const action = new actions.LoadAirpayPaymentRequests(payload);
      const result: AirpayPaymentRequestState = AirpayPaymentRequestReducer(
        initialState,
        action
      );

      expect(result.paymentRequestList.ids.length).toBe(0);
      expect(result.isLoadingPaymentRequestList).toBe(true);
    });
    it('LoadAirpayPaymentRequestsSuccess should be called', () => {
      const payload = { payments: paymentArray, count: 1 };
      const action = new actions.LoadAirpayPaymentRequestsSuccess(payload);
      const result: AirpayPaymentRequestState = AirpayPaymentRequestReducer(
        initialState,
        action
      );
      expect(result.isLoadingPaymentRequestList).toBe(false);
      expect(result.paymentRequestListCount).toBe(1);
      expect(result.paymentRequestList.ids.length).toBe(
        payload.payments.length
      );
    });
    it('Failure should be called', () => {
      const action = new actions.LoadAirpayPaymentRequestsFailure(erroPayload);
      const result: AirpayPaymentRequestState = AirpayPaymentRequestReducer(
        initialState,
        action
      );
      expect(result.isLoadingPaymentRequestList).toBe(false);
      expect(result.error.message).toBe('some error');
    });
  });

  describe('Testing Load Airpay Payment Requests History reducers', () => {
    it('LoadAirpayPaymentRequestsHistory should be called', () => {
      const payload: LoadPaymentRequestPayload = {
        page: 0,
        paymentCode: 'AIRPAY',
        payload: {
          customerId: 770,
          dateRangeType: 'CUSTOM',
          endDate: moment().format('DD-MMM-YYY').valueOf(),
          fiscalYear: null,
          isWorkFlowApproval: false,
          referenceId: null,
          startDate: moment().format('DD-MMM-YYY').valueOf(),
          status: null
        },
        size: 10,
        sort: null
      };
      const action = new actions.LoadAirpayPaymentRequestsHistory(payload);
      const result: AirpayPaymentRequestState = AirpayPaymentRequestReducer(
        initialState,
        action
      );

      expect(result.paymentRequesHistory.ids.length).toBe(0);
      expect(result.isLoadingPaymentRequestHistory).toBe(true);
    });
    it('LoadAirpayPaymentRequestsHistorySuccess should be called', () => {
      const payload = { payments: paymentArray, count: 1 };
      const action = new actions.LoadAirpayPaymentRequestsHistorySuccess(
        payload
      );
      const result: AirpayPaymentRequestState = AirpayPaymentRequestReducer(
        initialState,
        action
      );
      expect(result.isLoadingPaymentRequestHistory).toBe(false);
      expect(result.paymentRequestsHistoryCount).toBe(1);
      expect(result.paymentRequesHistory.ids.length).toBe(
        payload.payments.length
      );
    });
    it('Failure should be called', () => {
      const action = new actions.LoadAirpayPaymentRequestsHistoryFailure(
        erroPayload
      );
      const result: AirpayPaymentRequestState = AirpayPaymentRequestReducer(
        initialState,
        action
      );
      expect(result.isLoadingPaymentRequestHistory).toBe(false);
      expect(result.error.message).toBe('some error');
    });
  });
  describe('Testing Reset Airpay Payment Requests reducers', () => {
    it('ResetAirpayPaymentRequests should be called', () => {
      const action = new actions.ResetAirpayPaymentRequestsList();
      const result: AirpayPaymentRequestState = AirpayPaymentRequestReducer(
        initialState,
        action
      );

      expect(result.paymentRequestList.ids.length).toBe(0);
      expect(result.paymentRequestListCount).toBe(0);
    });
  });
  describe('Testing Reset Airpay Payment Requests History reducers', () => {
    it('ResetAirpayPaymentRequestsHistory should be called', () => {
      const action = new actions.ResetAirpayPaymentRequestsHistory();
      const result: AirpayPaymentRequestState = AirpayPaymentRequestReducer(
        initialState,
        action
      );

      expect(result.paymentRequesHistory.ids.length).toBe(0);
      expect(result.paymentRequestsHistoryCount).toBe(0);
    });
  });
});
