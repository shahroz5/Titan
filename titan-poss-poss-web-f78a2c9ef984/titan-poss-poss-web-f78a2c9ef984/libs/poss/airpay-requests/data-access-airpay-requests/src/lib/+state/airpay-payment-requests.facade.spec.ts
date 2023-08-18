import { AirpayPaymentRequestState } from './airpay-payment-requests.state';
import { airpayPaymentDetailsAdapter } from './airpay-payment-requests.entity';
import { AirpayPaymentReqFacade } from './airpay-payment-requests.facade';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  SearchCustomerPayload,
  SEARCH_BY_ENUM,
  LoadPaymentRequestPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';
import {
  SearchCustomer,
  LoadAirpayPaymentRequests,
  LoadAirpayPaymentRequestsHistory,
  VerifyAirpayPaymentRequest,
  ResetAirpayPaymentRequestsList,
  ResetAirpayPaymentRequestsHistory
} from './airpay-payment-requests.actions';
import * as moment from 'moment';
describe('Airpay Payment Requests Facade Testing Suite', () => {
  const initialState: AirpayPaymentRequestState = {
    isSearchingCustomer: false,
    hasSearchedCustomer: false,
    searchedCustomerDetails: null,

    paymentRequestList: airpayPaymentDetailsAdapter.getInitialState(),
    isLoadingPaymentRequestList: false,
    paymentRequestListCount: 0,

    paymentRequesHistory: airpayPaymentDetailsAdapter.getInitialState(),
    isLoadingPaymentRequestHistory: false,
    paymentRequestsHistoryCount: 0,

    verificationResponse: null,

    error: null
  };

  let airpayFacade: AirpayPaymentReqFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), AirpayPaymentReqFacade]
    });
    airpayFacade = TestBed.inject(AirpayPaymentReqFacade);
  });

  describe('Testing Value accessor methods in Airpay Req Facade', () => {
    it('should check truthy of getIsSearchingCustomer', () => {
      expect(airpayFacade.getIsSearchingCustomer()).toBeTruthy();
    });
    it('should check truthy of getHasSearchingCustomer', () => {
      expect(airpayFacade.getHasSearchingCustomer()).toBeTruthy();
    });
    it('should check truthy of getSearchedCustomer', () => {
      expect(airpayFacade.getSearchedCustomer()).toBeTruthy();
    });
    it('should check truthy of getAirpayPaymentRequests', () => {
      expect(airpayFacade.getAirpayPaymentRequests()).toBeTruthy();
    });
    it('should check truthy of getIsLoadingAirpayPaymentRequests', () => {
      expect(airpayFacade.getIsLoadingAirpayPaymentRequests()).toBeTruthy();
    });
    it('should check truthy of getAirpayPaymentRequestsCount', () => {
      expect(airpayFacade.getAirpayPaymentRequestsCount()).toBeTruthy();
    });
    it('should check truthy of getAirpayPaymentRequestsHistory', () => {
      expect(airpayFacade.getAirpayPaymentRequestsHistory()).toBeTruthy();
    });
    it('should check truthy of getIsLoadingAirpayPaymentRequestsHistory', () => {
      expect(
        airpayFacade.getIsLoadingAirpayPaymentRequestsHistory()
      ).toBeTruthy();
    });
    it('should check truthy of getAirpayPaymentRequestsHistoryCount', () => {
      expect(airpayFacade.getAirpayPaymentRequestsHistoryCount()).toBeTruthy();
    });
    it('should check truthy of getVerificationResponse', () => {
      expect(airpayFacade.getVerificationResponse()).toBeTruthy();
    });
    it('should check truthy of getError', () => {
      expect(airpayFacade.getError()).toBeTruthy();
    });
  });

  describe('Testing Action Dispatcher methods in Airpay Request Facade', () => {
    it('should dispatch SearchCustomer action', inject([Store], store => {
      const payload: SearchCustomerPayload = {
        searchFieldValue: '9887766550',
        searchType: SEARCH_BY_ENUM.MOBILE_NO
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchCustomer(payload);
      airpayFacade.searchCustomer(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch loadPaymentRequests action', inject([Store], store => {
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
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadAirpayPaymentRequests(payload);
      airpayFacade.loadPaymentRequests(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch loadPaymentRequestshistory action', inject(
      [Store],
      store => {
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
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadAirpayPaymentRequestsHistory(payload);
        airpayFacade.loadPaymentRequestshistory(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch VerifyAirpayPaymentRequest action', inject(
      [Store],
      store => {
        const payload = 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new VerifyAirpayPaymentRequest(payload);
        airpayFacade.verifyPayment(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch ResetAirpayPaymentRequestsList action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetAirpayPaymentRequestsList();
        airpayFacade.resetPaymentsList();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch ResetAirpayPaymentRequestsHistory action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetAirpayPaymentRequestsHistory();
        airpayFacade.resetPaymentsHistory();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
});
