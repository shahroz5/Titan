import { Injectable } from '@angular/core';
import { AirpayPaymentRequestState } from './airpay-payment-requests.state';
import { Store } from '@ngrx/store';
import { airpayPaymentRequestSelector } from './airpay-payment-requests.selectors';
import {
  GenerateCnPayload,
  LoadPaymentRequestPayload,
  SearchCustomerPayload
} from '@poss-web/shared/models';
import {
  LoadAirpayPaymentRequests,
  VerifyAirpayPaymentRequest,
  SearchCustomer,
  LoadAirpayPaymentRequestsHistory,
  ResetAirpayPaymentRequestsList,
  ResetAirpayPaymentRequestsHistory,
  GenerateCNforAirpayRequest,
  ResetAirpayPaymentRequestsError
} from './airpay-payment-requests.actions';

@Injectable()
export class AirpayPaymentReqFacade {
  private isSearchingCustomer$ = this.store.select(
    airpayPaymentRequestSelector.selectIsSearchingCustomer
  );
  private hasSearchedCustomer$ = this.store.select(
    airpayPaymentRequestSelector.selectHasSearchedCustomer
  );
  private searchedCustomer$ = this.store.select(
    airpayPaymentRequestSelector.selectSearchedCustomer
  );

  // private isLoadingAirpayPaymentRequests$ = this.store.select(
  //   airpayPaymentRequestSelector.selectIsLoadingAirpayPaymentRequests
  // );
  private airpayPaymentRequests$ = this.store.select(
    airpayPaymentRequestSelector.selectAirpayPaymentRequests
  );
  private airpayPaymentRequestCount$ = this.store.select(
    airpayPaymentRequestSelector.selectAirpayPaymentCount
  );

  // private isLoadingAirpayPaymentRequestsHistory$ = this.store.select(
  //   airpayPaymentRequestSelector.selectIsLoadingAirpayPaymentRequestsHistory
  // );
  private airpayPaymentRequestsHistory$ = this.store.select(
    airpayPaymentRequestSelector.selectAirpayPaymentRequestsHistory
  );
  private airpayPaymentRequestHistoryCount$ = this.store.select(
    airpayPaymentRequestSelector.selectAirpayPaymenHistorytCount
  );

  private verficationResponse$ = this.store.select(
    airpayPaymentRequestSelector.selectverificationResponse
  );
  private isLoading$ = this.store.select(
    airpayPaymentRequestSelector.selectIsLoading
  );
  private error$ = this.store.select(airpayPaymentRequestSelector.selectError);

  getIsSearchingCustomer() {
    return this.isSearchingCustomer$;
  }
  getHasSearchingCustomer() {
    return this.hasSearchedCustomer$;
  }
  getSearchedCustomer() {
    return this.searchedCustomer$;
  }

  getAirpayPaymentRequests() {
    return this.airpayPaymentRequests$;
  }
  // getIsLoadingAirpayPaymentRequests() {
  //   return this.isLoadingAirpayPaymentRequests$;
  // }
  getAirpayPaymentRequestsCount() {
    return this.airpayPaymentRequestCount$;
  }
  getAirpayPaymentRequestsHistory() {
    return this.airpayPaymentRequestsHistory$;
  }
  // getIsLoadingAirpayPaymentRequestsHistory() {
  //   return this.isLoadingAirpayPaymentRequestsHistory$;
  // }
  getAirpayPaymentRequestsHistoryCount() {
    return this.airpayPaymentRequestHistoryCount$;
  }

  getVerificationResponse() {
    return this.verficationResponse$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getError() {
    return this.error$;
  }

  constructor(private store: Store<AirpayPaymentRequestState>) {}
  searchCustomer(payload: SearchCustomerPayload) {
    this.store.dispatch(new SearchCustomer(payload));
  }
  loadPaymentRequests(payload: LoadPaymentRequestPayload) {
    this.store.dispatch(new LoadAirpayPaymentRequests(payload));
  }
  loadPaymentRequestshistory(payload: LoadPaymentRequestPayload) {
    this.store.dispatch(new LoadAirpayPaymentRequestsHistory(payload));
  }
  verifyPayment(payload: string) {
    this.store.dispatch(new VerifyAirpayPaymentRequest(payload));
  }
  generateCN(payload: GenerateCnPayload) {
    this.store.dispatch(new GenerateCNforAirpayRequest(payload));
  }
  resetPaymentsList() {
    this.store.dispatch(new ResetAirpayPaymentRequestsList());
  }
  resetPaymentsHistory() {
    this.store.dispatch(new ResetAirpayPaymentRequestsHistory());
  }
  resetError() {
    this.store.dispatch(new ResetAirpayPaymentRequestsError());
  }
}
