import { createSelector } from '@ngrx/store';
import { selectAirpayPaymentRequestState } from './airpay-payment-requests.reducer';
import { airpayPaymentRequestEntitySelector } from './airpay-payment-requests.entity';

const selectIsSearchingCustomer = createSelector(
  selectAirpayPaymentRequestState,
  state => state.isSearchingCustomer
);
const selectHasSearchedCustomer = createSelector(
  selectAirpayPaymentRequestState,
  state => state.hasSearchedCustomer
);
const selectSearchedCustomer = createSelector(
  selectAirpayPaymentRequestState,
  state => state.searchedCustomerDetails
);

export const airpayPaymentRequests = createSelector(
  selectAirpayPaymentRequestState,
  state => state.paymentRequestList
);

const selectAirpayPaymentRequests = createSelector(
  airpayPaymentRequests,
  airpayPaymentRequestEntitySelector.selectAll
);



const selectAirpayPaymentCount = createSelector(
  selectAirpayPaymentRequestState,
  state => state.paymentRequestListCount
);

export const airpayPaymentRequestsHistory = createSelector(
  selectAirpayPaymentRequestState,
  state => state.paymentRequesHistory
);

const selectAirpayPaymentRequestsHistory = createSelector(
  airpayPaymentRequestsHistory,
  airpayPaymentRequestEntitySelector.selectAll
);



const selectAirpayPaymenHistorytCount = createSelector(
  selectAirpayPaymentRequestState,
  state => state.paymentRequestsHistoryCount
);

const selectverificationResponse = createSelector(
  selectAirpayPaymentRequestState,
  state => state.verificationResponse
);
const selectIsLoading = createSelector(
  selectAirpayPaymentRequestState,
  state => state.isLoading
);
const selectError = createSelector(
  selectAirpayPaymentRequestState,
  state => state.error
);

export const airpayPaymentRequestSelector = {
  selectIsSearchingCustomer,
  selectHasSearchedCustomer,
  selectSearchedCustomer,

  selectAirpayPaymentRequests,

  selectAirpayPaymentCount,

  selectAirpayPaymentRequestsHistory,

  selectAirpayPaymenHistorytCount,

  selectverificationResponse,
  selectIsLoading,
  selectError
};
