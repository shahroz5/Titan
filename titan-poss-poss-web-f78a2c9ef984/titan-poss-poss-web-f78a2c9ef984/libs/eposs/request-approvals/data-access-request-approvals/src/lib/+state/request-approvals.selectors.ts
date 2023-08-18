import { createSelector } from '@ngrx/store';

import {
  itemSelector,
  ibtRequestSelector,
  ibtRequestItemSelector
} from './request-approvals.entity';
import { selectRequestApprovalsState } from './request-approval.reducer';

const selectError = createSelector(
  selectRequestApprovalsState,
  state => state.error
);

const selectIsLoading = createSelector(
  selectRequestApprovalsState,
  state => state.isLoading
);

const selectBinRequestItemsCount = createSelector(
  selectRequestApprovalsState,
  state => state.binRequestItemsCount
);

const selectIbtRequestApprovalItemsCount = createSelector(
  selectRequestApprovalsState,
  state => state.ibtRequestItemsCount
);

const selectfocRequestCount = createSelector(
  selectRequestApprovalsState,
  state => state.focRequestItemsCount
);

const selectpsvRequestCount = createSelector(
  selectRequestApprovalsState,
  state => state.psvRequestItemsCount
);

const selectexhRequestCount = createSelector(
  selectRequestApprovalsState,
  state => state.exhRequestItemsCount
);

const selectCancelRequestCount = createSelector(
  selectRequestApprovalsState,
  state => state.ibtCancelRequestItemsCount
);

const selectlossRequestItemsCount = createSelector(
  selectRequestApprovalsState,
  state => state.lossRequestItemsCount
);
const selectloanRequestCount = createSelector(
  selectRequestApprovalsState,
  state => state.loanRequestItemsCount
);
const selectadjRequestCount = createSelector(
  selectRequestApprovalsState,
  state => state.adjRequestItemsCount
);
const selectIbtRequestItemsCount = createSelector(
  selectRequestApprovalsState,
  state => state.ibtRequestApprovalsItemsCount
);

const selectLocationCount = createSelector(
  selectRequestApprovalsState,
  state => state.locationCount
);
const selectIsBinRequestItemsReset = createSelector(
  selectRequestApprovalsState,
  state => state.isBinRequestItemsReset
);

const selectIsBinRequestItemsCountReset = createSelector(
  selectRequestApprovalsState,
  state => state.isBinRequestItemsCountReset
);

const selectIsIbtRequestItemsReset = createSelector(
  selectRequestApprovalsState,
  state => state.isIbtRequestItemsReset
);

const selectIsIbtRequestItemsCountReset = createSelector(
  selectRequestApprovalsState,
  state => state.isIbtRequestItemsCountReset
);

const selectIsFocRequestItemsReset = createSelector(
  selectRequestApprovalsState,
  state => state.isfocRequestItemsReset
);

const selectIsFocRequestItemsCountReset = createSelector(
  selectRequestApprovalsState,
  state => state.isfocRequestItemsCountReset
);

const selectIsPsvRequestItemsReset = createSelector(
  selectRequestApprovalsState,
  state => state.ispsvRequestItemsReset
);

const selectIsPsvRequestItemsCountReset = createSelector(
  selectRequestApprovalsState,
  state => state.ispsvRequestItemsCountReset
);
const selectIslossRequestItemsReset = createSelector(
  selectRequestApprovalsState,
  state => state.islossRequestItemsReset
);

const selectIslossRequestItemsCountReset = createSelector(
  selectRequestApprovalsState,
  state => state.islossRequestItemsCountReset
);
const selectIsloanRequestItemsReset = createSelector(
  selectRequestApprovalsState,
  state => state.isloanRequestItemsReset
);

const selectIsadjRequestItemsCountReset = createSelector(
  selectRequestApprovalsState,
  state => state.isadjRequestItemsCountReset
);
const selectIsadjRequestItemsReset = createSelector(
  selectRequestApprovalsState,
  state => state.isadjRequestItemsReset
);

const selectIsloanRequestItemsCountReset = createSelector(
  selectRequestApprovalsState,
  state => state.isloanRequestItemsCountReset
);
const selectIsexhRequestItemsReset = createSelector(
  selectRequestApprovalsState,
  state => state.isexhRequestItemsReset
);

const selectIsexhRequestItemsCountReset = createSelector(
  selectRequestApprovalsState,
  state => state.isexhRequestItemsCountReset
);

const binRequestApprovalsItems = createSelector(
  selectRequestApprovalsState,
  state => state.binRequestApprovalsItem
);

const selectIsbinRequestItemsLoading = createSelector(
  selectRequestApprovalsState,
  state => state.isbinRequestItemsLoading
);

const selectIsIbtRequestItemsLoading = createSelector(
  selectRequestApprovalsState,
  state => state.isibtRequestItemsLoading
);

const selectIsLocationLoading = createSelector(
  selectRequestApprovalsState,
  state => state.isLocationLoading
);

const selectIsIbtLoading = createSelector(
  selectRequestApprovalsState,
  state => state.isLoadingIbtRequest
);

const selectIsIbtCancellationLoading = createSelector(
  selectRequestApprovalsState,
  state => state.isLoadingIbtCancellationRequest
);

const selectIsExhLoading = createSelector(
  selectRequestApprovalsState,
  state => state.isLoadingexhRequest
);

const selectIsadjLoading = createSelector(
  selectRequestApprovalsState,
  state => state.isLoadingadjRequest
);

const selectIslossLoading = createSelector(
  selectRequestApprovalsState,
  state => state.isLoadinglossequest
);

const selectIsloanLoading = createSelector(
  selectRequestApprovalsState,
  state => state.isLoadingloanRequest
);

const selectIspsvLoading = createSelector(
  selectRequestApprovalsState,
  state => state.isLoadingpsvRequest
);

const selectIsfocLoading = createSelector(
  selectRequestApprovalsState,
  state => state.isLoadingfocRequest
);

const selectLocation = createSelector(
  selectRequestApprovalsState,
  state => state.location
);

const selectBinItems = createSelector(
  binRequestApprovalsItems,
  itemSelector.selectAll
);

const selectHasUpdatingFailure = createSelector(
  selectRequestApprovalsState,
  state => state.hasUpdatingFailure
);
const selectIsUpdatingItem = createSelector(
  selectRequestApprovalsState,
  state => state.isUpdatingItemSuccess
);

const updateItemSuccess = createSelector(
  selectRequestApprovalsState,
  state => state.binRequestApproval
);

const selectHasUpdatingIbtFailure = createSelector(
  selectRequestApprovalsState,
  state => state.hasUpdatingIbtFailure
);
const selectIsUpdatingIbt = createSelector(
  selectRequestApprovalsState,
  state => state.isUpdatingIbtSuccess
);

const IbtApprovalsSuccess = createSelector(
  selectRequestApprovalsState,
  state => state.ibtUpdateRequest
);

const selectHasUpdatingApprovalsFailure = createSelector(
  selectRequestApprovalsState,
  state => state.hasUpadatingApprovalsFailure
);
const selectIsUpdatingSuccess = createSelector(
  selectRequestApprovalsState,
  state => state.isUpdatingSuccess
);

const updateIbtSuccess = createSelector(
  selectRequestApprovalsState,
  state => state.ibtRequestApproval
);

const ibtRequest = createSelector(
  selectRequestApprovalsState,
  state => state.ibtRequest
);

const selectIbtRequest = createSelector(
  ibtRequest,
  ibtRequestSelector.selectAll
);

const ibtCancellationRequest = createSelector(
  selectRequestApprovalsState,
  state => state.ibtCancellationRequest
);

const selectIbtCancellationRequest = createSelector(
  ibtCancellationRequest,
  ibtRequestSelector.selectAll
);

const adjRequest = createSelector(
  selectRequestApprovalsState,
  state => state.adjRequest
);

const selectadjRequest = createSelector(
  adjRequest,
  ibtRequestSelector.selectAll
);

const psvRequest = createSelector(
  selectRequestApprovalsState,
  state => state.psvRequest
);

const selectpsvRequest = createSelector(
  psvRequest,
  ibtRequestSelector.selectAll
);
const lossRequest = createSelector(
  selectRequestApprovalsState,
  state => state.lossRequest
);

const selectlossRequest = createSelector(
  lossRequest,
  ibtRequestSelector.selectAll
);
const loanRequest = createSelector(
  selectRequestApprovalsState,
  state => state.loanRequest
);

const selectloanRequest = createSelector(
  loanRequest,
  ibtRequestSelector.selectAll
);
const exhRequest = createSelector(
  selectRequestApprovalsState,
  state => state.exhRequest
);

const selectexhRequest = createSelector(
  exhRequest,
  ibtRequestSelector.selectAll
);
const focRequest = createSelector(
  selectRequestApprovalsState,
  state => state.focRequest
);

const selectfocRequest = createSelector(
  focRequest,
  ibtRequestSelector.selectAll
);

const ibtRequestApprovalsItems = createSelector(
  selectRequestApprovalsState,
  state => state.ibtRequestApprovalsItem
);

const ibtCancelItems = createSelector(
  selectRequestApprovalsState,
  state => state.ibtCancelItems
);

const selectIbtCancelItems = createSelector(
  ibtCancelItems,
  ibtRequestItemSelector.selectAll
);

const selectIsIbtCancelItemsLoading = createSelector(
  selectRequestApprovalsState,
  state => state.isibtRequestCancelItemsLoading
);



const selectIbtCancelItemCount = createSelector(
  selectRequestApprovalsState,
  state => state.ibtRequestApprovalsItemsCount
);

const selecthasUpadatingCancelApprovalsFailure = createSelector(
  selectRequestApprovalsState,
  state => state.hasUpadatingCancelApprovalsFailure
);

const selectisCancelUpdatingSuccess = createSelector(
  selectRequestApprovalsState,
  state => state.isCancelUpdatingSuccess
);

const selectibtCancelUpdateRequest = createSelector(
  selectRequestApprovalsState,
  state => state.ibtCancelUpdateRequest
);

const selectIbtRequestItems = createSelector(
  ibtRequestApprovalsItems,
  ibtRequestItemSelector.selectAll
);

const selectSelectedRequest = createSelector(
  selectRequestApprovalsState,
  state => state.selectedRequest
);

const selectSelectedCancelRequest = createSelector(
  selectRequestApprovalsState,
  state => state.selectedCancelRequest
);

// Image
export const selectIsLoadingImage = createSelector(
  selectRequestApprovalsState,
  state => state.isLoadingImage
);

export const RequestApprovalsSelectors = {
  selectError,
  selectIsLoading,
  selectBinRequestItemsCount,
  selectIsBinRequestItemsReset,
  selectIsBinRequestItemsCountReset,
  binRequestApprovalsItems,
  selectIsbinRequestItemsLoading,
  selectBinItems,
  updateItemSuccess,
  selectIsUpdatingItem,
  selectHasUpdatingFailure,
  selectIsLocationLoading,
  selectLocation,
  selectLocationCount,
  ibtRequest,
  selectIbtRequest,
  selectIsIbtLoading,
  selectIbtRequestItemsCount,
  selectIsIbtRequestItemsCountReset,
  selectIsIbtRequestItemsReset,
  selectSelectedRequest,
  selectIbtRequestItems,
  ibtRequestApprovalsItems,
  selectIbtRequestApprovalItemsCount,
  selectIsIbtRequestItemsLoading,
  selectHasUpdatingIbtFailure,
  selectIsUpdatingIbt,
  updateIbtSuccess,
  IbtApprovalsSuccess,
  selectHasUpdatingApprovalsFailure,
  selectIsUpdatingSuccess,
  selectIsFocRequestItemsReset,
  selectfocRequestCount,
  selectpsvRequestCount,
  selectexhRequestCount,
  selectlossRequestItemsCount,
  selectloanRequestCount,
  selectadjRequestCount,
  selectIsFocRequestItemsCountReset,
  selectIsPsvRequestItemsReset,
  selectIsPsvRequestItemsCountReset,
  selectIslossRequestItemsReset,
  selectIslossRequestItemsCountReset,
  selectIsloanRequestItemsReset,
  selectIsadjRequestItemsCountReset,
  selectIsadjRequestItemsReset,
  selectIsloanRequestItemsCountReset,
  selectIsexhRequestItemsReset,
  selectIsexhRequestItemsCountReset,
  selectadjRequest,
  selectpsvRequest,
  selectlossRequest,
  selectloanRequest,
  selectexhRequest,
  selectfocRequest,
  selectIsfocLoading,
  selectIspsvLoading,
  selectIslossLoading,
  selectIsloanLoading,
  selectIsadjLoading,
  selectIsExhLoading,
  selectIbtCancellationRequest,
  selectIsIbtCancellationLoading,
  selectCancelRequestCount,
  selectSelectedCancelRequest,
  ibtCancelItems,
  selectIbtCancelItems,
  selectIsIbtCancelItemsLoading,
  selectIbtCancelItemCount,
  selecthasUpadatingCancelApprovalsFailure,
  selectisCancelUpdatingSuccess,
  selectibtCancelUpdateRequest,
  ibtCancellationRequest,
  focRequest,

  exhRequest,
  loanRequest,
  lossRequest,
  psvRequest,
  adjRequest,
  selectIsLoadingImage
};
