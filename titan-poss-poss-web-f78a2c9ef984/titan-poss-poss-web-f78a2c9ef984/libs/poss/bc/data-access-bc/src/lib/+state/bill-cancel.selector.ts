import { createSelector } from '@ngrx/store';
import { selectBillCancelState } from './bill-cancel.reducer';
import { itemDetailsSelector } from './bill-cancel.entity';

const selectLoading = createSelector(
  selectBillCancelState,
  state => state.isLoading
);

const selecthasError = createSelector(
  selectBillCancelState,
  state => state.hasError
);

const selectViewCashMemoResponse = createSelector(
  selectBillCancelState,
  state => state.viewCashMemoResponse
);

export const itemDetails = createSelector(
  selectBillCancelState,
  state => state.productDetails
);

const cancelResponse = createSelector(
  selectBillCancelState,
  state => state.cancelResponse
);

const confirmResponse = createSelector(
  selectBillCancelState,
  state => state.confirmResponse
);

const selectItemDetails = createSelector(
  itemDetails,
  itemDetailsSelector.selectAll
);

const selectCmBillList = createSelector(
  selectBillCancelState,
  state => state.cmBillList
);

const selectRsoDetails = createSelector(
  selectBillCancelState,
  state => state.rsoDetails
);

const selectReason = createSelector(
  selectBillCancelState,
  state => state.reasonsForCancel
);

const CancelType = createSelector(
  selectBillCancelState,
  state => state.cancelType
);

const selectBcList = createSelector(
  selectBillCancelState,
  state => state.historyList
);

const selectHistorySearchParamDetails = createSelector(
  selectBillCancelState,
  state => state.bcHistoryRequestParams
);

const selectErrorWhileCancellingBill = createSelector(
  selectBillCancelState,
  state => state.errorWhileCancellingBill
);

export const BillCancelSelector = {
  selectLoading,
  selecthasError,
  selectViewCashMemoResponse,
  selectItemDetails,
  cancelResponse,
  confirmResponse,
  selectCmBillList,
  selectRsoDetails,
  selectReason,
  CancelType,
  selectBcList,
  selectHistorySearchParamDetails,
  selectErrorWhileCancellingBill
};
