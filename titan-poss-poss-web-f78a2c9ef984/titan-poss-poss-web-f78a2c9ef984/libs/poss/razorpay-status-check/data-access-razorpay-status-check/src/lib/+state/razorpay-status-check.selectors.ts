import { createSelector } from '@ngrx/store';
import { selectRazorpayStatusCheckState } from './razorpay-status-check.reducer';
import { razorPaymentRequestEntitySelector } from './razorpay-status-check.entity';
const selectIsSearchingCustomer = createSelector(
  selectRazorpayStatusCheckState,
  state => state.isSearchingCustomer
);
const selectHasSearchedCustomer = createSelector(
  selectRazorpayStatusCheckState,
  state => state.hasSearchedCustomer
);
const selectSearchedCustomer = createSelector(
  selectRazorpayStatusCheckState,
  state => state.searchedCustomerDetails
);

export const razorpayPaymentRequests = createSelector(
  selectRazorpayStatusCheckState,
  state => state.paymentRequestList
);

const selectRazorpayPaymentRequests = createSelector(
  razorpayPaymentRequests,
  razorPaymentRequestEntitySelector.selectAll
);

// const selectIsLoadingAirpayPaymentRequests = createSelector(
//   selectAirpayPaymentRequestState,
//   state => state.isLoadingPaymentRequestList
// );

const selectRazorpayPaymentCount = createSelector(
  selectRazorpayStatusCheckState,
  state => state.paymentRequestListCount
);

export const razorpayPaymentRequestsHistory = createSelector(
  selectRazorpayStatusCheckState,
  state => state.paymentRequesHistory
);

const selectRazorpayPaymentRequestsHistory = createSelector(
  razorpayPaymentRequestsHistory,
  razorPaymentRequestEntitySelector.selectAll
);

// const selectIsLoadingAirpayPaymentRequestsHistory = createSelector(
//   selectAirpayPaymentRequestState,
//   state => state.isLoadingPaymentRequestHistory
// );

const selectRazorpayPaymenHistorytCount = createSelector(
  selectRazorpayStatusCheckState,
  state => state.paymentRequestsHistoryCount
);

const selectverificationResponse = createSelector(
  selectRazorpayStatusCheckState,
  state => state.verificationResponse
);
const selectIsLoading = createSelector(
  selectRazorpayStatusCheckState,
  state => state.isLoading
);
const selectError = createSelector(
  selectRazorpayStatusCheckState,
  state => state.error
);

export const RazorpayPaymentStatusSelector = {
  selectIsSearchingCustomer,
  selectHasSearchedCustomer,
  selectSearchedCustomer,

  selectRazorpayPaymentRequests,

  selectRazorpayPaymentCount,

  selectRazorpayPaymentRequestsHistory,

  selectRazorpayPaymenHistorytCount,

  selectverificationResponse,
  selectIsLoading,
  selectError
};
