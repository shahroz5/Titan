import { createSelector } from '@ngrx/store';
import { selectBillCancellationRequestsState } from './bill-cancellation-requests.reducer';
import {
  BillDetailsSelector,
  billSelector,
  itemDetailsSelector
} from './bill-cancellation-requests.entity';

const billRequests = createSelector(
  selectBillCancellationRequestsState,
  state => state.billCancellationRequests
);

const selectbillRequests = createSelector(
  billRequests,
  BillDetailsSelector.selectAll
);

const selectbillRequestDetails = createSelector(
  selectBillCancellationRequestsState,
  state => state.billancellationRequestsDetail
);

const selectbillRequestCount = createSelector(
  selectBillCancellationRequestsState,
  state => state.billCancellationRequestsCount
);

const selectLoading = createSelector(
  selectBillCancellationRequestsState,
  state => state.isLoading
);

const selecthasError = createSelector(
  selectBillCancellationRequestsState,
  state => state.hasError
);
const selectApprovedDetail = createSelector(
  selectBillCancellationRequestsState,
  state => state.billancellationRequestsDetail
);

const selectLocation = createSelector(
  selectBillCancellationRequestsState,
  state => state.locations
);

const billStatus = createSelector(
  selectBillCancellationRequestsState,
  state => state.billCancelStatus
);
const selectbillStatus = createSelector(billStatus, billSelector.selectAll);

const selectHistoryFilterData = createSelector(
  selectBillCancellationRequestsState,
  state => state.advancedFilter
);

const selectViewCashMemoResponse = createSelector(
  selectBillCancellationRequestsState,
  state => state.viewCashMemoResponse
);

const itemDetails = createSelector(
  selectBillCancellationRequestsState,
  state => state.productDetails
);

const cancelResponse = createSelector(
  selectBillCancellationRequestsState,
  state => state.cancelResponse
);

const confirmResponse = createSelector(
  selectBillCancellationRequestsState,
  state => state.confirmResponse
);

const deleteResponse = createSelector(
  selectBillCancellationRequestsState,
  state => state.deleteResponse
);

const countResponse = createSelector(
  selectBillCancellationRequestsState,
  state => state.billStatusCount
);

const CancelType = createSelector(
  selectBillCancellationRequestsState,
  state => state.cancelType
);

const selectedData = createSelector(
  selectBillCancellationRequestsState,
  state => state.selectedData
);

const selectItemDetails = createSelector(
  itemDetails,
  itemDetailsSelector.selectAll
);

const selectErrorWhileCancellingBill = createSelector(
  selectBillCancellationRequestsState,
  state => state.errorWhileCancellingBill
);

export const BillCancellationRequestsSelector = {
  selectbillRequests,
  selectbillRequestDetails,
  selectbillRequestCount,
  selectLoading,
  selecthasError,
  selectApprovedDetail,
  selectLocation,
  selectbillStatus,
  selectHistoryFilterData,
  selectViewCashMemoResponse,
  selectItemDetails,
  selectedData,
  itemDetails,
  cancelResponse,
  confirmResponse,
  deleteResponse,
  countResponse,
  CancelType,
  selectErrorWhileCancellingBill
};
