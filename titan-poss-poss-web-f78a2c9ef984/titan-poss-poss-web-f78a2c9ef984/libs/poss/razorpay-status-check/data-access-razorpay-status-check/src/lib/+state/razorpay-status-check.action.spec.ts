import {
  SearchCustomerPayload,
  SEARCH_BY_ENUM,
  CustomerPayload,
  CustomErrors,
  LoadPaymentRequestPayload,
  PaymentRequestDetails,
  GenerateCnPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  SearchCustomer,
  RazorpayStatusCheckActionTypes,
  SearchCustomerSuccess,
  SearchCustomerFailure,
  LoadRazorpayPaymentRequests,
  LoadRazorpayPaymentRequestsSuccess,
  LoadRazorpayPaymentRequestsFailure,
  LoadRazorpayPaymentRequestsHistory,
  LoadRazorpayPaymentRequestsHistorySuccess,
  LoadRazorpayPaymentRequestsHistoryFailure,
  VerifyRazorpayPaymentRequest,
  VerifyRazorpayPaymentRequestSuccess,
  VerifyRazorpayPaymentRequestFailure,
  ResetRazorpayPaymentRequestsList,
  ResetRazorpayPaymentRequestsHistory,
  GenerateCNforRazorpayRequest,
  GenerateCNforRazorpayRequestSuccess,
  GenerateCNforRazorpayRequestFailure
} from './razorpay-status-check.actions';
import * as moment from 'moment';
describe('Razorpay Payment Requests Action Tetsing Suite', () => {
  describe('SearchCustomer Action Test Cases', () => {
    it('should check correct type is used for SearchCustomer action', () => {
      const payload: SearchCustomerPayload = {
        searchFieldValue: '9887766550',
        searchType: SEARCH_BY_ENUM.MOBILE_NO
      };

      const action = new SearchCustomer(payload);
      expect({ ...action }).toEqual({
        type: RazorpayStatusCheckActionTypes.SEARCH_CUSTOMER,
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
        type: RazorpayStatusCheckActionTypes.SEARCH_CUSTOMER_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchCustomerFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchCustomerFailure(payload);
      expect({ ...action }).toEqual({
        type: RazorpayStatusCheckActionTypes.SEARCH_CUSTOMER_FAILURE,
        payload
      });
    });
  });

  describe('LoadRazorpayPaymentRequests Action Test Cases', () => {
    it('should check correct type is used for LoadRazorpayPaymentRequests action', () => {
      const payload: LoadPaymentRequestPayload = {
        page: 0,
        paymentCode: 'RAZOR PAY',
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
      const action = new LoadRazorpayPaymentRequests(payload);
      expect({ ...action }).toEqual({
        type: RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS,
        payload
      });
    });
    it('should check correct type is used for LoadRazorpayPaymentRequestsSuccess action', () => {
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
            paymentCode: 'RAZOR PAY',
            referenceId: 'URB520',
            requestedBy: 'rso.urb.2',
            requestedDate: 1603899790692,
            requestedReason: null,
            status: 'IN_PROGRESS',
            utilizedAmount: null,
            customerName: 'TEST CUSTOMER',
            customerMobileNo: '9887766550',
            customerTitle: 'MR.',
            ulpId: 'UlpId123',
            isVerifying: false
          }
        ],
        count: 1
      };
      const action = new LoadRazorpayPaymentRequestsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadRazorpayPaymentRequestsFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRazorpayPaymentRequestsFailure(payload);
      expect({ ...action }).toEqual({
        type:
          RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS_FAILURE,
        payload
      });
    });
  });
  describe('LoadRazorpayPaymentRequestsHistory Action Test Cases', () => {
    it('should check correct type is used for LoadRazorpayPaymentRequestsHistory action', () => {
      const payload: LoadPaymentRequestPayload = {
        page: 0,
        paymentCode: 'RAZOR PAY',
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
      const action = new LoadRazorpayPaymentRequestsHistory(payload);
      expect({ ...action }).toEqual({
        type:
          RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS_HISTORY,
        payload
      });
    });
    it('should check correct type is used for LoadRazorpayPaymentRequestsHistorySuccess action', () => {
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
            paymentCode: 'RAZOR PAY',
            referenceId: 'URB520',
            requestedBy: 'rso.urb.2',
            requestedDate: 1603899790692,
            requestedReason: null,
            status: 'IN_PROGRESS',
            utilizedAmount: null,
            customerName: 'TEST CUSTOMER',
            customerMobileNo: '9887766550',
            customerTitle: 'MR.',
            ulpId: 'UlpId123',
            isVerifying: false
          }
        ],
        count: 1
      };
      const action = new LoadRazorpayPaymentRequestsHistorySuccess(payload);
      expect({ ...action }).toEqual({
        type:
          RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS_HISTORY_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadRazorpayPaymentRequestsHistoryFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRazorpayPaymentRequestsHistoryFailure(payload);
      expect({ ...action }).toEqual({
        type:
          RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS_HISTORY_FAILURE,
        payload
      });
    });
  });

  describe('VerifyRazorpayPaymentRequest Action Test Cases', () => {
    it('should check correct type is used for VerifyRazorpayPaymentRequest action', () => {
      const payload = 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8';
      const action = new VerifyRazorpayPaymentRequest(payload);
      expect({ ...action }).toEqual({
        type: RazorpayStatusCheckActionTypes.VERIFY_RAZORPAY_PAYMENT,
        payload
      });
    });
    it('should check correct type is used for VerifyRazorpayPaymentRequestSuccess action', () => {
      const payload: PaymentRequestDetails = {
        amount: 12,
        approvedBy: null,
        approvedDate: null,
        approvedReason: null,
        customerId: 770,
        id: 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8',
        locationCode: 'URB',
        otherDetails: { type: null, data: null },
        paymentCode: 'RAZOR PAY',
        referenceId: 'URB520',
        requestedBy: 'rso.urb.2',
        requestedDate: 1603899790692,
        requestedReason: null,
        status: 'IN_PROGRESS',
        utilizedAmount: null,
        customerName: 'TEST CUSTOMER',
        customerMobileNo: '9887766550',
        customerTitle: 'MR.',
        ulpId: 'UlpId123',
        isVerifying: false
      };
      const action = new VerifyRazorpayPaymentRequestSuccess(payload);
      expect({ ...action }).toEqual({
        type: RazorpayStatusCheckActionTypes.VERIFY_RAZORPAY_PAYMENT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for VerifyRazorpayPaymentRequestFailure action', () => {
      const payload: {
        paymentId: string;
        error: CustomErrors;
      } = {
        paymentId: 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8',
        error: CustomErrorAdaptor.fromJson(Error('Some Error'))
      };
      const action = new VerifyRazorpayPaymentRequestFailure(payload);
      expect({ ...action }).toEqual({
        type: RazorpayStatusCheckActionTypes.VERIFY_RAZORPAY_PAYMENT_FAILURE,
        payload
      });
    });
  });

  describe('ResetRazorpayPaymentRequestsList Action Test Cases', () => {
    it('should check correct type is used for ResetRazorpayPaymentRequestsList', () => {
      const action = new ResetRazorpayPaymentRequestsList();
      expect({ ...action }).toEqual({
        type: RazorpayStatusCheckActionTypes.RESET_RAZORPAY_PAYMENT_REQUESTS
      });
    });
  });
  describe('ResetRazorpayPaymentRequestHistoryt Action Test Cases', () => {
    it('should check correct type is used for ResetRazorpayPaymentRequestsHistory', () => {
      const action = new ResetRazorpayPaymentRequestsHistory();
      expect({ ...action }).toEqual({
        type:
          RazorpayStatusCheckActionTypes.RESET_RAZORPAY_PAYMENT_REQUESTS_HISTORY
      });
    });
  });

  describe('GenerateCN Action Test Cases', () => {
    it('should check correct type is used for Generate CN action', () => {
      const payload: GenerateCnPayload = {
        id: '11111111111'
      };

      const action = new GenerateCNforRazorpayRequest(payload);
      expect({ ...action }).toEqual({
        type: RazorpayStatusCheckActionTypes.GENERATE_CN_FOR_RAZORPAY_PAYMENT,
        payload
      });
    });
    it('should check correct type is used for Generate CN Success action', () => {
      const payload: PaymentRequestDetails = {
        amount: 12,
        approvedBy: null,
        approvedDate: null,
        approvedReason: null,
        customerId: 770,
        id: 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8',
        locationCode: 'URB',
        otherDetails: { type: null, data: null },
        paymentCode: 'RAZOR PAY',
        referenceId: 'URB520',
        requestedBy: 'rso.urb.2',
        requestedDate: 1603899790692,
        requestedReason: null,
        status: 'IN_PROGRESS',
        utilizedAmount: null,
        customerName: 'TEST CUSTOMER',
        customerMobileNo: '9887766550',
        customerTitle: 'MR.',
        ulpId: 'UlpId123',
        isVerifying: false
      };
      const action = new GenerateCNforRazorpayRequestSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          RazorpayStatusCheckActionTypes.GENERATE_CN_FOR_RAZORPAY_PAYMENT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for Generate CN Failure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GenerateCNforRazorpayRequestFailure(payload);
      expect({ ...action }).toEqual({
        type:
          RazorpayStatusCheckActionTypes.GENERATE_CN_FOR_RAZORPAY_PAYMENT_FAILURE,
        payload
      });
    });
  });
});
