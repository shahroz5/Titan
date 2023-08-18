import { Observable } from 'rxjs';
import { RazorpayPaymentRequestEffects } from './razorpay-status-check.effects';
import { HttpClient } from '@angular/common/http';
import { RazorpayStatusCheckService } from '../razorpay-status-check.service';
import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { RAZORPPAY_STATUS_CHECK_FEATURE_KEY } from './razorpay-status-check.reducer';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import {
  SEARCH_BY_ENUM,
  SearchCustomerPayload,
  LoadPaymentRequestPayload,
  CustomerPayload,
  PaymentRequestDetails,
  GenerateCnPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  GenerateCNforRazorpayRequest,
  GenerateCNforRazorpayRequestFailure,
  GenerateCNforRazorpayRequestSuccess,
  LoadRazorpayPaymentRequests,
  LoadRazorpayPaymentRequestsFailure,
  LoadRazorpayPaymentRequestsHistory,
  LoadRazorpayPaymentRequestsHistoryFailure,
  LoadRazorpayPaymentRequestsHistorySuccess,
  LoadRazorpayPaymentRequestsSuccess,
  SearchCustomer,
  SearchCustomerFailure,
  SearchCustomerSuccess,
  VerifyRazorpayPaymentRequest,
  VerifyRazorpayPaymentRequestFailure,
  VerifyRazorpayPaymentRequestSuccess
} from './razorpay-status-check.actions';
import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Razorpay payment Requests Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: RazorpayPaymentRequestEffects;

  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const razorpayPaymentRequestsServiceSpy = jasmine.createSpyObj<
    RazorpayStatusCheckService
  >(['searchCustomer', 'getPaymentDetails', 'validatePayment', 'generateCN']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RazorpayPaymentRequestEffects,
        DataPersistence,
        provideMockStore({
          initialState: {
            [RAZORPPAY_STATUS_CHECK_FEATURE_KEY]: initialState
          }
        }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: POSS_WEB_CACHING_STRATEGY,
          useValue: []
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: RazorpayStatusCheckService,
          useValue: razorpayPaymentRequestsServiceSpy
        }
      ]
    });

    effect = TestBed.inject(RazorpayPaymentRequestEffects);
  });
  describe('searchCustomer', () => {
    it('should return data of selected Customer', () => {
      const reqPayload: SearchCustomerPayload = {
        searchFieldValue: '9887766550',
        searchType: SEARCH_BY_ENUM.MOBILE_NO
      };
      const resPayload: CustomerPayload = {
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
      const action = new SearchCustomer(reqPayload);
      const outcome = new SearchCustomerSuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      razorpayPaymentRequestsServiceSpy.searchCustomer.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchCustomer$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const reqPayload: SearchCustomerPayload = {
        searchFieldValue: '9887766550',
        searchType: SEARCH_BY_ENUM.MOBILE_NO
      };
      const action = new SearchCustomer(reqPayload);
      const error = new Error('some error');
      const outcome = new SearchCustomerFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      razorpayPaymentRequestsServiceSpy.searchCustomer.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchCustomer$).toBeObservable(expected);
    });
  });

  describe('loadPayments', () => {
    it('should return stream of Razorpay payments', () => {
      const reqPayload: LoadPaymentRequestPayload = {
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
      const resPayload: { payments: PaymentRequestDetails[]; count: number } = {
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
            paymentCode: 'RAZOR PAT',
            referenceId: 'URB520',
            requestedBy: 'rso.urb.2',
            requestedDate: 1603899790692,
            requestedReason: null,
            status: 'IN_PROGRESS',
            utilizedAmount: null,
            customerName: 'TEST CUSTOMER',
            customerMobileNo: '9887766550',
            customerTitle: 'MR.',
            ulpId: 'ulpId123',
            isVerifying: false
          }
        ],
        count: 1
      };
      const action = new LoadRazorpayPaymentRequests(reqPayload);
      const outcome = new LoadRazorpayPaymentRequestsSuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      razorpayPaymentRequestsServiceSpy.getPaymentDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPayments$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const reqPayload: LoadPaymentRequestPayload = {
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
      const action = new LoadRazorpayPaymentRequests(reqPayload);
      const error = new Error('some error');
      const outcome = new LoadRazorpayPaymentRequestsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      razorpayPaymentRequestsServiceSpy.getPaymentDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPayments$).toBeObservable(expected);
    });
  });

  describe('loadPaymentsHistory', () => {
    it('should return stream of razorpay payments history', () => {
      const reqPayload: LoadPaymentRequestPayload = {
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
      const resPayload: {
        payments: PaymentRequestDetails[];
        count: number;
      } = {
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
            ulpId: 'ulpId123',
            isVerifying: false
          }
        ],
        count: 1
      };
      const action = new LoadRazorpayPaymentRequestsHistory(reqPayload);
      const outcome = new LoadRazorpayPaymentRequestsHistorySuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      razorpayPaymentRequestsServiceSpy.getPaymentDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPaymentsHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const reqPayload: LoadPaymentRequestPayload = {
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
      const action = new LoadRazorpayPaymentRequestsHistory(reqPayload);
      const error = new Error('some error');
      const outcome = new LoadRazorpayPaymentRequestsHistoryFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      razorpayPaymentRequestsServiceSpy.getPaymentDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPaymentsHistory$).toBeObservable(expected);
    });
  });

  describe('ValidateRazorpayPayment', () => {
    it('should return data of payment validation', () => {
      const reqPayload = 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8';
      const resPayload: PaymentRequestDetails = {
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
        ulpId: 'ulpId123',
        isVerifying: false
      };
      const action = new VerifyRazorpayPaymentRequest(reqPayload);
      const outcome = new VerifyRazorpayPaymentRequestSuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      razorpayPaymentRequestsServiceSpy.validatePayment.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.ValidateRazorpayPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error and id', () => {
      const reqPayload = 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8';
      const action = new VerifyRazorpayPaymentRequest(reqPayload);
      const error = new Error('some error');
      const outcome = new VerifyRazorpayPaymentRequestFailure({
        paymentId: reqPayload,
        error: CustomErrorAdaptor.fromJson(error)
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      razorpayPaymentRequestsServiceSpy.validatePayment.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.ValidateRazorpayPayment$).toBeObservable(expected);
    });
  });

  describe('Generate CN', () => {
    it('should return generated CN Details', () => {
      const reqPayload: GenerateCnPayload = {
        id: 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8'
      };
      const resPayload: PaymentRequestDetails = {
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
        ulpId: 'ulpId123',
        isVerifying: false
      };
      const action = new GenerateCNforRazorpayRequest(reqPayload);
      const outcome = new GenerateCNforRazorpayRequestSuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      razorpayPaymentRequestsServiceSpy.generateCN.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.generateCn$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const reqPayload: GenerateCnPayload = {
        id: 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8'
      };
      const action = new GenerateCNforRazorpayRequest(reqPayload);
      const error = new Error('some error');
      const outcome = new GenerateCNforRazorpayRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      razorpayPaymentRequestsServiceSpy.generateCN.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.generateCn$).toBeObservable(expected);
    });
  });
});
