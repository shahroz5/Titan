import { RazorpayStatusCheckState } from './razorpay-status-check.state';
import { razorpayPaymentDetailsAdapter } from './razorpay-status-check.entity';
import { RazorpayStatusCheckFacade } from './razorpay-status-check.facade';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  SearchCustomerPayload,
  SEARCH_BY_ENUM,
  LoadPaymentRequestPayload,
  GenerateCnPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import * as moment from 'moment';
import {
  GenerateCNforRazorpayRequest,
  LoadRazorpayPaymentRequests,
  LoadRazorpayPaymentRequestsHistory,
  ResetRazorpayPaymentRequestsHistory,
  ResetRazorpayPaymentRequestsList,
  SearchCustomer,
  VerifyRazorpayPaymentRequest
} from './razorpay-status-check.actions';
describe('Razor Payment Requests Facade Testing Suite', () => {
  const initialState: RazorpayStatusCheckState = {
    isSearchingCustomer: false,
    hasSearchedCustomer: false,
    searchedCustomerDetails: null,

    paymentRequestList: razorpayPaymentDetailsAdapter.getInitialState(),
    isLoading: false,
    paymentRequestListCount: 0,

    paymentRequesHistory: razorpayPaymentDetailsAdapter.getInitialState(),
    paymentRequestsHistoryCount: 0,

    verificationResponse: null,

    error: null
  };

  let razorpayFacade: RazorpayStatusCheckFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), RazorpayStatusCheckFacade]
    });
    razorpayFacade = TestBed.inject(RazorpayStatusCheckFacade);
  });

  describe('Testing Value accessor methods in Razorpay Req Facade', () => {
    it('should check truthy of getIsSearchingCustomer', () => {
      expect(razorpayFacade.getIsSearchingCustomer()).toBeTruthy();
    });
    it('should check truthy of getHasSearchingCustomer', () => {
      expect(razorpayFacade.getHasSearchingCustomer()).toBeTruthy();
    });
    it('should check truthy of getSearchedCustomer', () => {
      expect(razorpayFacade.getSearchedCustomer()).toBeTruthy();
    });
    it('should check truthy of getRazorpayPaymentRequests', () => {
      expect(razorpayFacade.getRazorpayPaymentRequests()).toBeTruthy();
    });
    it('should check truthy of getIsLoading', () => {
      expect(razorpayFacade.getIsLoading()).toBeTruthy();
    });
    it('should check truthy of getRazorpayPaymentRequestsCount', () => {
      expect(razorpayFacade.getRazorpayPaymentRequestsCount()).toBeTruthy();
    });
    it('should check truthy of getRazorpayPaymentRequestsHistory', () => {
      expect(razorpayFacade.getRazorpayPaymentRequestsHistory()).toBeTruthy();
    });

    it('should check truthy of getRazorpayPaymentRequestsHistoryCount', () => {
      expect(
        razorpayFacade.getRazorpayPaymentRequestsHistoryCount()
      ).toBeTruthy();
    });
    it('should check truthy of getVerificationResponse', () => {
      expect(razorpayFacade.getVerificationResponse()).toBeTruthy();
    });
    it('should check truthy of getError', () => {
      expect(razorpayFacade.getError()).toBeTruthy();
    });
  });

  describe('Testing Action Dispatcher methods in Razorpay Request Facade', () => {
    it('should dispatch SearchCustomer action', inject([Store], store => {
      const payload: SearchCustomerPayload = {
        searchFieldValue: '9887766550',
        searchType: SEARCH_BY_ENUM.MOBILE_NO
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchCustomer(payload);
      razorpayFacade.searchCustomer(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch loadPaymentRequests action', inject([Store], store => {
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
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadRazorpayPaymentRequests(payload);
      razorpayFacade.loadPaymentRequests(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch loadPaymentRequestshistory action', inject(
      [Store],
      store => {
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
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadRazorpayPaymentRequestsHistory(payload);
        razorpayFacade.loadPaymentRequestshistory(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch VerifyRazorpayPaymentRequest action', inject(
      [Store],
      store => {
        const payload = 'A4BD525D-093E-493B-B6DB-4D7E7BEE7FA8';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new VerifyRazorpayPaymentRequest(payload);
        razorpayFacade.verifyPayment(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch ResetRazorpayPaymentRequestsList action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetRazorpayPaymentRequestsList();
        razorpayFacade.resetPaymentsList();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch ResetRazorpayPaymentRequestsHistory action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetRazorpayPaymentRequestsHistory();
        razorpayFacade.resetPaymentsHistory();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch generateCN action', inject([Store], store => {
      const payload: GenerateCnPayload = {
        id: '11111111111111'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new GenerateCNforRazorpayRequest(payload);
      razorpayFacade.generateCN(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
