import { Observable } from 'rxjs';
import { AirpayPaymentRequestEffects } from './airpay-payment-requests.effects';
import { HttpClient } from '@angular/common/http';
import { AirpayPaymentRequestService } from '../airpay-payment-request.service';
import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { AIRPAY_PAYMENT_REQUEST_FEATURE_KEY } from './airpay-payment-requests.reducer';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import {
  SEARCH_BY_ENUM,
  SearchCustomerPayload,
  LoadPaymentRequestPayload,
  CustomerPayload,
  PaymentRequestDetails
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  SearchCustomer,
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
  VerifyAirpayPaymentRequestFailure
} from './airpay-payment-requests.actions';
import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Airpay payment Requests Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: AirpayPaymentRequestEffects;

  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const airpayPaymentRequestsServiceSpy = jasmine.createSpyObj<
    AirpayPaymentRequestService
  >(['searchCustomer', 'getPaymentDetails', 'validatePayment']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AirpayPaymentRequestEffects,
        DataPersistence,
        provideMockStore({
          initialState: {
            [AIRPAY_PAYMENT_REQUEST_FEATURE_KEY]: initialState
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
          provide: AirpayPaymentRequestService,
          useValue: airpayPaymentRequestsServiceSpy
        }
      ]
    });

    effect = TestBed.inject(AirpayPaymentRequestEffects);
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
      airpayPaymentRequestsServiceSpy.searchCustomer.and.returnValue(response$);

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
      airpayPaymentRequestsServiceSpy.searchCustomer.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchCustomer$).toBeObservable(expected);
    });
  });

  describe('loadPayments', () => {
    it('should return stream of airpay payments', () => {
      const reqPayload: LoadPaymentRequestPayload = {
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
            paymentCode: 'AIRPAY',
            referenceId: 'URB520',
            requestedBy: 'rso.urb.2',
            requestedDate: 1603899790692,
            ulpId:"test",
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
      const action = new LoadAirpayPaymentRequests(reqPayload);
      const outcome = new LoadAirpayPaymentRequestsSuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      airpayPaymentRequestsServiceSpy.getPaymentDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPayments$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const reqPayload: LoadPaymentRequestPayload = {
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
      const action = new LoadAirpayPaymentRequests(reqPayload);
      const error = new Error('some error');
      const outcome = new LoadAirpayPaymentRequestsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      airpayPaymentRequestsServiceSpy.getPaymentDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPayments$).toBeObservable(expected);
    });
  });

  describe('loadPaymentsHistory', () => {
    it('should return stream of airpay payments history', () => {
      const reqPayload: LoadPaymentRequestPayload = {
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
            paymentCode: 'AIRPAY',
            referenceId: 'URB520',
            requestedBy: 'rso.urb.2',
            requestedDate: 1603899790692,
            ulpId:"test",
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
      const action = new LoadAirpayPaymentRequestsHistory(reqPayload);
      const outcome = new LoadAirpayPaymentRequestsHistorySuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      airpayPaymentRequestsServiceSpy.getPaymentDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPaymentsHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const reqPayload: LoadPaymentRequestPayload = {
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
      const action = new LoadAirpayPaymentRequestsHistory(reqPayload);
      const error = new Error('some error');
      const outcome = new LoadAirpayPaymentRequestsHistoryFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      airpayPaymentRequestsServiceSpy.getPaymentDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPaymentsHistory$).toBeObservable(expected);
    });
  });

  describe('ValidateAirpayPayment', () => {
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
        paymentCode: 'AIRPAY',
        referenceId: 'URB520',
        requestedBy: 'rso.urb.2',
        requestedDate: 1603899790692,
        ulpId:"test",
        requestedReason: null,
        status: 'IN_PROGRESS',
        utilizedAmount: null,
        customerName: 'TEST CUSTOMER',
        customerMobileNo: '9887766550',
        customerTitle: 'MR.',
        isVerifying: false
      };
      const action = new VerifyAirpayPaymentRequest(reqPayload);
      const outcome = new VerifyAirpayPaymentRequestSuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: resPayload
      });
      airpayPaymentRequestsServiceSpy.validatePayment.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.ValidateAirpayPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error and id', () => {
      const reqPayload = 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8';
      const action = new VerifyAirpayPaymentRequest(reqPayload);
      const error = new Error('some error');
      const outcome = new VerifyAirpayPaymentRequestFailure({
        paymentId: reqPayload,
        error: CustomErrorAdaptor.fromJson(error)
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      airpayPaymentRequestsServiceSpy.validatePayment.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.ValidateAirpayPayment$).toBeObservable(expected);
    });
  });
});
