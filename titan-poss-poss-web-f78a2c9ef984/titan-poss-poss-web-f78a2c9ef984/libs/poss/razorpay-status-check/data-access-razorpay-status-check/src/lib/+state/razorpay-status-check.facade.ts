import { Injectable } from '@angular/core';
import { RazorpayStatusCheckState } from './razorpay-status-check.state';
import { Store } from '@ngrx/store';
import { RazorpayPaymentStatusSelector } from './razorpay-status-check.selectors';
import {
  GenerateCnPayload,
  LoadPaymentRequestPayload,
  SearchCustomerPayload
} from '@poss-web/shared/models';
import {
  GenerateCNforRazorpayRequest,
  LoadRazorpayPaymentRequests,
  LoadRazorpayPaymentRequestsHistory,
  ResetRazorpayPaymentERROR,
  ResetRazorpayPaymentRequestsHistory,
  ResetRazorpayPaymentRequestsList,
  SearchCustomer,
  VerifyRazorpayPaymentRequest
} from './razorpay-status-check.actions';

@Injectable()
export class RazorpayStatusCheckFacade {
  private isSearchingCustomer$ = this.store.select(
    RazorpayPaymentStatusSelector.selectIsSearchingCustomer
  );
  private hasSearchedCustomer$ = this.store.select(
    RazorpayPaymentStatusSelector.selectHasSearchedCustomer
  );
  private searchedCustomer$ = this.store.select(
    RazorpayPaymentStatusSelector.selectSearchedCustomer
  );
  private razorpayPaymentRequests$ = this.store.select(
    RazorpayPaymentStatusSelector.selectRazorpayPaymentRequests
  );
  private razorpayPaymentRequestCount$ = this.store.select(
    RazorpayPaymentStatusSelector.selectRazorpayPaymentCount
  );
  private razorpayPaymentRequestsHistory$ = this.store.select(
    RazorpayPaymentStatusSelector.selectRazorpayPaymentRequestsHistory
  );
  private razorpayPaymentRequestHistoryCount$ = this.store.select(
    RazorpayPaymentStatusSelector.selectRazorpayPaymenHistorytCount
  );
  private verficationResponse$ = this.store.select(
    RazorpayPaymentStatusSelector.selectverificationResponse
  );
  private isLoading$ = this.store.select(
    RazorpayPaymentStatusSelector.selectIsLoading
  );
  private error$ = this.store.select(RazorpayPaymentStatusSelector.selectError);

  getIsSearchingCustomer() {
    return this.isSearchingCustomer$;
  }
  getHasSearchingCustomer() {
    return this.hasSearchedCustomer$;
  }
  getSearchedCustomer() {
    return this.searchedCustomer$;
  }

  getRazorpayPaymentRequests() {
    return this.razorpayPaymentRequests$;
  }
  getRazorpayPaymentRequestsCount() {
    return this.razorpayPaymentRequestCount$;
  }
  getRazorpayPaymentRequestsHistory() {
    return this.razorpayPaymentRequestsHistory$;
  }

  getRazorpayPaymentRequestsHistoryCount() {
    return this.razorpayPaymentRequestHistoryCount$;
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

  constructor(private store: Store<RazorpayStatusCheckState>) {}
  searchCustomer(payload: SearchCustomerPayload) {
    this.store.dispatch(new SearchCustomer(payload));
  }
  loadPaymentRequests(payload: LoadPaymentRequestPayload) {
    this.store.dispatch(new LoadRazorpayPaymentRequests(payload));
  }
  loadPaymentRequestshistory(payload: LoadPaymentRequestPayload) {
    this.store.dispatch(new LoadRazorpayPaymentRequestsHistory(payload));
  }
  verifyPayment(payload: string) {
    this.store.dispatch(new VerifyRazorpayPaymentRequest(payload));
  }
  generateCN(payload: GenerateCnPayload) {
    this.store.dispatch(new GenerateCNforRazorpayRequest(payload));
  }
  resetPaymentsList() {
    this.store.dispatch(new ResetRazorpayPaymentRequestsList());
  }
  resetPaymentsHistory() {
    this.store.dispatch(new ResetRazorpayPaymentRequestsHistory());
  }
  resetError() {
    this.store.dispatch(new ResetRazorpayPaymentERROR());
  }
}
