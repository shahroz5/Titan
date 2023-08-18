import * as moment from 'moment';
import {
  PaymentRequestDetails,
  SearchCustomerPayload,
  SEARCH_BY_ENUM,
  CustomerPayload,
  LoadPaymentRequestPayload,
  GenerateCnPayload
} from '@poss-web/shared/models';
import * as actions from './razorpay-status-check.actions';
import { RazorpayStatusCheckState } from './razorpay-status-check.state';
import {
  initialState,
  RazorpayStatusCheckReducer
} from './razorpay-status-check.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { razorpayPaymentDetailsAdapter } from './razorpay-status-check.entity';

describe('Razorpay Payment Requests Testing Suite', () => {
  const erroPayload = CustomErrorAdaptor.fromJson(Error('some error'));
  const testState = initialState;

  const createPayment = (
    amount: number,
    approvedBy: string,
    approvedDate: number,
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
    requestedDate: number,
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
    'ulpId123',
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
      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
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
      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
        initialState,
        action
      );

      expect(result.isSearchingCustomer).toBe(false);
      expect(result.hasSearchedCustomer).toBe(true);
      expect(result.searchedCustomerDetails).toBe(payload);
    });
    it('Failure should be called', () => {
      const action = new actions.SearchCustomerFailure(erroPayload);
      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
        initialState,
        action
      );

      expect(result.isSearchingCustomer).toBe(false);
      expect(result.hasSearchedCustomer).toBe(false);

      expect(result.error.message).toBe('some error');
    });
  });

  describe('Testing Load Razorpay Payment Requests reducers', () => {
    it('LoadRazorpayPaymentRequests should be called', () => {
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
      const action = new actions.LoadRazorpayPaymentRequests(payload);
      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
        initialState,
        action
      );

      expect(result.paymentRequestList.ids.length).toBe(0);
      expect(result.isLoading).toBe(true);
    });
    it('LoadRazorpayPaymentRequestsSuccess should be called', () => {
      const payload = { payments: paymentArray, count: 1 };
      const action = new actions.LoadRazorpayPaymentRequestsSuccess(payload);
      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.paymentRequestListCount).toBe(1);
      expect(result.paymentRequestList.ids.length).toBe(
        payload.payments.length
      );
    });
    it('Failure should be called', () => {
      const action = new actions.LoadRazorpayPaymentRequestsFailure(
        erroPayload
      );
      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toBe('some error');
    });
  });

  describe('Testing Load Razorpay Payment Requests History reducers', () => {
    it('LoadRazorpayPaymentRequestsHistory should be called', () => {
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
      const action = new actions.LoadRazorpayPaymentRequestsHistory(payload);
      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
        initialState,
        action
      );

      expect(result.paymentRequesHistory.ids.length).toBe(0);
      expect(result.isLoading).toBe(true);
    });
    it('LoadRazorpayPaymentRequestsHistorySuccess should be called', () => {
      const payload = { payments: paymentArray, count: 1 };
      const action = new actions.LoadRazorpayPaymentRequestsHistorySuccess(
        payload
      );
      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.paymentRequestsHistoryCount).toBe(1);
      expect(result.paymentRequesHistory.ids.length).toBe(
        payload.payments.length
      );
    });
    it('Failure should be called', () => {
      const action = new actions.LoadRazorpayPaymentRequestsHistoryFailure(
        erroPayload
      );
      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toBe('some error');
    });
  });
  describe('Testing Reset Razorpay Payment Requests reducers', () => {
    it('ResetRazorPaymentRequests should be called', () => {
      const action = new actions.ResetRazorpayPaymentRequestsList();
      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
        initialState,
        action
      );

      expect(result.paymentRequestList.ids.length).toBe(0);
      expect(result.paymentRequestListCount).toBe(0);
    });
  });
  describe('Testing Reset Razorpay Payment Requests History reducers', () => {
    it('ResetRazorpayPaymentRequestsHistory should be called', () => {
      const action = new actions.ResetRazorpayPaymentRequestsHistory();
      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
        initialState,
        action
      );

      expect(result.paymentRequesHistory.ids.length).toBe(0);
      expect(result.paymentRequestsHistoryCount).toBe(0);
    });
  });
  describe('Testing Generate CN reducers', () => {
    it('GENERATE_CN_FOR_RAZORPAY_PAYMENT should be called', () => {
      const payload: GenerateCnPayload = {
        id: '11111111111111'
      };
      const action = new actions.GenerateCNforRazorpayRequest(payload);
      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
        initialState,
        action
      );

      expect(result.verificationResponse).toBe(null);
      expect(result.isLoading).toBe(true);
    });
    it('GENERATE_CN_FOR_RAZORPAY_PAYMENT_SUCCESS should be called', () => {
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
      const action = new actions.GenerateCNforRazorpayRequestSuccess(payload);
      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.verificationResponse).toBeTruthy();
    });
    it('GENERATE_CN_FOR_RAZORPAY_PAYMENT_FAILURE should be called', () => {
      const action = new actions.GenerateCNforRazorpayRequestFailure(
        erroPayload
      );
      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toBe('some error');
    });
  });
  describe('Testing Verify Razorpay payment reducers', () => {
    it('VERIFY_RAZORPAY_PAYMENT should be called', () => {
      const dummyPayment: PaymentRequestDetails = {
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
      const payload = 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8';
      const action = new actions.VerifyRazorpayPaymentRequest(payload);
      const newState = {
        ...testState,
        paymentRequestList: razorpayPaymentDetailsAdapter.addOne(
          dummyPayment,
          testState.paymentRequestList
        )
      };

      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
        newState,
        action
      );
      const updatedItem = result.paymentRequestList.entities[dummyPayment.id];
      expect(updatedItem.isVerifying).toBe(true);
    });
    it('VERIFY_RAZORPAY_PAYMENT_SUCCESS should be called', () => {
      const dummyPayment: PaymentRequestDetails = {
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
        status: 'COMPLETED',
        utilizedAmount: null,
        customerName: 'TEST CUSTOMER',
        customerMobileNo: '9887766550',
        customerTitle: 'MR.',
        ulpId: 'UlpId123',
        isVerifying: false
      };
      const payload = 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8';
      const action = new actions.VerifyRazorpayPaymentRequestSuccess(
        dummyPayment
      );
      const newState = {
        ...testState,
        paymentRequestList: razorpayPaymentDetailsAdapter.addOne(
          dummyPayment,
          testState.paymentRequestList
        )
      };

      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
        newState,
        action
      );
      const updatedItem = result.paymentRequestList.entities[dummyPayment.id];
      expect(updatedItem.isVerifying).toBe(false);
      expect(updatedItem.status).toBe('COMPLETED');
    });
    it('VERIFY_RAZORPAY_PAYMENT_FAILURE should be called', () => {
      const dummyPayment: PaymentRequestDetails = {
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

      const action = new actions.VerifyRazorpayPaymentRequestFailure({
        error: erroPayload,
        paymentId: 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8'
      });
      const newState = {
        ...testState,
        paymentRequestList: razorpayPaymentDetailsAdapter.addOne(
          dummyPayment,
          testState.paymentRequestList
        )
      };

      const result: RazorpayStatusCheckState = RazorpayStatusCheckReducer(
        newState,
        action
      );
      const updatedItem = result.paymentRequestList.entities[dummyPayment.id];
      expect(updatedItem.isVerifying).toBe(false);
      expect(result.error.message).toBe('some error');
    });
  });
});
