import { createSelector } from '@ngrx/store';
import { selectGrnState } from './grn.reducer';
import { grnReqItemSelector } from './grn.entity';

const grnReqStatus = createSelector(
  selectGrnState,
  state => state.grnReqStatus
);

const selectGrnReqStatus = createSelector(
  grnReqStatus,
  grnReqItemSelector.selectAll
);
const selectError = createSelector(selectGrnState, state => state.error);
const selectIsLoading = createSelector(
  selectGrnState,
  state => state.isLoading
);
const selectHassaved = createSelector(selectGrnState, state => state.hasSaved);
const selectHasUpdated = createSelector(
  selectGrnState,
  state => state.hasUpdated
);

const selectTotalElement = createSelector(
  selectGrnState,
  state => state.totalElements
);

const selectTcsCollectedAmount = createSelector(
  selectGrnState,
  state => state.tcsAmountCollected
);

const selectGrnDetails = createSelector(
  selectGrnState,
  state => state.grnDetails
);
const selectReqId = createSelector(
  selectGrnState,
  state => state.sendForApprovalResponse?.requestNo
);

const selectstatus = createSelector(selectGrnState, state => state.status);

const selectTotalReturnGrn = createSelector(
  selectGrnState,
  state => state.totalReturnGrn
);

const selectTotalReturnProduct = createSelector(
  selectGrnState,
  state => state.totalReturnProduct
);

const selectCustomerId = createSelector(
  selectGrnState,
  state => state.customerId
);

const selectGrnConfirmResponse = createSelector(
  selectGrnState,
  state => state.grnConfirmResponse
);
const selectGrnInitResponse = createSelector(
  selectGrnState,
  state => state.grnInitiateResponse
);
const selectItemDetails = createSelector(
  selectGrnState,
  state => state.itemDetails
);
const selectLocationCodes = createSelector(
  selectGrnState,
  state => state.locationCodes
);
const selectApprovers = createSelector(
  selectGrnState,
  state => state.approvers
);

const selectGrnHistoryDetails = createSelector(
  selectGrnState,
  state => state.grnHistory
);
const selectTotalGrnHistoryReq = createSelector(
  selectGrnState,
  state => state.totalGrnHistoryReq
);
const selectGrnReasons = createSelector(
  selectGrnState,
  state => state.grnReasons
);
const selectGrnFinalPriceDetails = createSelector(
  selectGrnState,
  state => state.finalPriceDetails
);

const selectFocDeductionValue = createSelector(
  selectGrnState,
  state => state.focDeductionAmount
);
const selectHistorySearchParamDetails = createSelector(
  selectGrnState,
  state => state.historySearchParamDetails
);
export const grnSelectors = {
  selectTotalReturnProduct,
  selectTotalReturnGrn,
  selectstatus,
  selectCustomerId,
  selectGrnDetails,
  selectGrnReqStatus,
  selectError,
  selectHasUpdated,
  selectHassaved,
  selectIsLoading,
  selectTotalElement,
  selectGrnConfirmResponse,
  selectGrnInitResponse,
  selectItemDetails,
  selectReqId,
  selectLocationCodes,
  selectApprovers,
  selectGrnHistoryDetails,
  selectTotalGrnHistoryReq,
  selectGrnReasons,
  selectGrnFinalPriceDetails,
  selectTcsCollectedAmount,
  selectFocDeductionValue,
  selectHistorySearchParamDetails
};
