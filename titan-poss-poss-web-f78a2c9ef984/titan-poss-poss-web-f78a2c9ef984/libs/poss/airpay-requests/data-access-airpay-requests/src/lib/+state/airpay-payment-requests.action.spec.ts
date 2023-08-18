import {
  SearchCustomerPayload,
  SEARCH_BY_ENUM,
  CustomerPayload,
  CustomErrors,
  LoadPaymentRequestPayload,
  PaymentRequestDetails
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  SearchCustomer,
  AirpayPaymentRequestActionTypes,
  SearchCustomerSuccess,
  SearchCustomerFailure,
  LoadAirpayPaymentRequests,
  LoadAirpayPaymentRequestsSuccess,
  LoadAirpayPaymentRequestsFailure,
  LoadAirpayPaymentRequestsHistory,
  LoadAirpayPaymentRequestsHistorySuccess,
  LoadAirpayPaymentRequestsHistoryFailure,
  VerifyAirpayPaymentRequest,
  VerifyAirpayPaymentRequestSuccess,
  VerifyAirpayPaymentRequestFailure,
  ResetAirpayPaymentRequestsList,
  ResetAirpayPaymentRequestsHistory
} from './airpay-payment-requests.actions';
import * as moment from 'moment';
describe('Airpay Payment Requests Action Tetsing Suite', () => {
  describe('SearchCustomer Action Test Cases', () => {
    it('should check correct type is used for SearchCustomer action', () => {
      const payload: SearchCustomerPayload = {
        searchFieldValue: '9887766550',
        searchType: SEARCH_BY_ENUM.MOBILE_NO
      };
      const action = new SearchCustomer(payload);
      expect({ ...action }).toEqual({
        type: AirpayPaymentRequestActionTypes.SEARCH_CUSTOMER,
        payload
      });
    });
    it('should check correct type is used for SearchCustomerSuccess action', () => {
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
      const action = new SearchCustomerSuccess(payload);
      expect({ ...action }).toEqual({
        type: AirpayPaymentRequestActionTypes.SEARCH_CUSTOMER_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchCustomerFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchCustomerFailure(payload);
      expect({ ...action }).toEqual({
        type: AirpayPaymentRequestActionTypes.SEARCH_CUSTOMER_FAILURE,
        payload
      });
    });
  });

  describe('LoadAirpayPaymentRequests Action Test Cases', () => {
    it('should check correct type is used for LoadAirpayPaymentRequests action', () => {
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
      const action = new LoadAirpayPaymentRequests(payload);
      expect({ ...action }).toEqual({
        type: AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS,
        payload
      });
    });
    it('should check correct type is used for LoadAirpayPaymentRequestsSuccess action', () => {
      const payload: { payments: PaymentRequestDetails[]; count: number } = {
        payments: [
          {
            amount: 12,
            approvedBy: null,
            approvedDate: null,
            approvedReason: null,
            customerId: 770,
            id: 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8',
            locationCode: 'URB',
            otherDetails: { type: null, data: null },
            paymentCode: 'AIRPAY',
            referenceId: 'URB520',
            requestedBy: 'rso.urb.2',
            requestedDate: 1603899790692,
            ulpId: 'test',
            requestedReason: null,
            status: 'IN_PROGRESS',
            utilizedAmount: null,
            customerName: 'TEST CUSTOMER',
            customerMobileNo: '9887766550',
            customerTitle: 'MR.',
            isVerifying: false
          }
        ],
        count: 1
      };
      const action = new LoadAirpayPaymentRequestsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadAirpayPaymentRequestsFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAirpayPaymentRequestsFailure(payload);
      expect({ ...action }).toEqual({
        type:
          AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS_FAILURE,
        payload
      });
    });
  });
  describe('LoadAirpayPaymentRequestsHistory Action Test Cases', () => {
    it('should check correct type is used for LoadAirpayPaymentRequestsHistory action', () => {
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
      const action = new LoadAirpayPaymentRequestsHistory(payload);
      expect({ ...action }).toEqual({
        type:
          AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS_HISTORY,
        payload
      });
    });
    it('should check correct type is used for LoadAirpayPaymentRequestsHistorySuccess action', () => {
      const payload: { payments: PaymentRequestDetails[]; count: number } = {
        payments: [
          {
            amount: 12,
            approvedBy: null,
            approvedDate: null,
            approvedReason: null,
            customerId: 770,
            id: 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8',
            locationCode: 'URB',
            otherDetails: { type: null, data: null },
            paymentCode: 'AIRPAY',
            referenceId: 'URB520',
            requestedBy: 'rso.urb.2',
            requestedDate: 1603899790692,
            ulpId: 'test',
            requestedReason: null,
            status: 'IN_PROGRESS',
            utilizedAmount: null,
            customerName: 'TEST CUSTOMER',
            customerMobileNo: '9887766550',
            customerTitle: 'MR.',
            isVerifying: false
          }
        ],
        count: 1
      };
      const action = new LoadAirpayPaymentRequestsHistorySuccess(payload);
      expect({ ...action }).toEqual({
        type:
          AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS_HISTORY_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadAirpayPaymentRequestsHistoryFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAirpayPaymentRequestsHistoryFailure(payload);
      expect({ ...action }).toEqual({
        type:
          AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS_HISTORY_FAILURE,
        payload
      });
    });
  });

  describe('VerifyAirpayPaymentRequest Action Test Cases', () => {
    it('should check correct type is used for VerifyAirpayPaymentRequest action', () => {
      const payload = 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8';
      const action = new VerifyAirpayPaymentRequest(payload);
      expect({ ...action }).toEqual({
        type: AirpayPaymentRequestActionTypes.VERIFY_AIRPAY_PAYMENT,
        payload
      });
    });
    it('should check correct type is used for VerifyAirpayPaymentRequestSuccess action', () => {
      const payload: PaymentRequestDetails = {
        amount: 12,
        approvedBy: null,
        approvedDate: null,
        approvedReason: null,
        customerId: 770,
        id: 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8',
        locationCode: 'URB',
        otherDetails: { type: null, data: null },
        paymentCode: 'AIRPAY',
        referenceId: 'URB520',
        requestedBy: 'rso.urb.2',
        requestedDate: 1603899790692,
        ulpId: 'test',
        requestedReason: null,
        status: 'IN_PROGRESS',
        utilizedAmount: null,
        customerName: 'TEST CUSTOMER',
        customerMobileNo: '9887766550',
        customerTitle: 'MR.',
        isVerifying: false
      };
      const action = new VerifyAirpayPaymentRequestSuccess(payload);
      expect({ ...action }).toEqual({
        type: AirpayPaymentRequestActionTypes.VERIFY_AIRPAY_PAYMENT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for VerifyAirpayPaymentRequestFailure action', () => {
      const payload: {
        paymentId: string;
        error: CustomErrors;
      } = {
        paymentId: 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8',
        error: CustomErrorAdaptor.fromJson(Error('Some Error'))
      };
      const action = new VerifyAirpayPaymentRequestFailure(payload);
      expect({ ...action }).toEqual({
        type: AirpayPaymentRequestActionTypes.VERIFY_AIRPAY_PAYMENT_FAILURE,
        payload
      });
    });
  });

  describe('ResetAirpayPaymentRequestsList Action Test Cases', () => {
    it('should check correct type is used for ResetAirpayPaymentRequestsList', () => {
      const action = new ResetAirpayPaymentRequestsList();
      expect({ ...action }).toEqual({
        type: AirpayPaymentRequestActionTypes.RESET_AIRPAY_PAYMENT_REQUESTS
      });
    });
  });
  describe('ResetAirpayPaymentRequestHistoryt Action Test Cases', () => {
    it('should check correct type is used for ResetAirpayPaymentRequestsHistory', () => {
      const action = new ResetAirpayPaymentRequestsHistory();
      expect({ ...action }).toEqual({
        type:
          AirpayPaymentRequestActionTypes.RESET_AIRPAY_PAYMENT_REQUESTS_HISTORY
      });
    });
  });
});
