import { createFeatureSelector, createSelector } from '@ngrx/store';
import { cashMemoFeatureKey } from './cash-memo.reducer';
import { CashMemoState } from './cash-memo.state';
import { itemDetailsSelector } from './cash-memo.entity';

export const selectCashMemoState = createFeatureSelector<
  CashMemoState
>(cashMemoFeatureKey);

const selectHasError = createSelector(
  selectCashMemoState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  selectCashMemoState,
  state => state.isLoading
);

const selectCreateCashMemoResponse = createSelector(
  selectCashMemoState,
  state => state.createCashMemoResponse
);

const selectViewCashMemoResponse = createSelector(
  selectCashMemoState,
  state => state.viewCashMemoResponse
);

const selectTcsAmountResponse = createSelector(
  selectCashMemoState,
  state => state.tcsDetails
);

const selectUpdateCashMemoResponse = createSelector(
  selectCashMemoState,
  state => state.updateCashMemoResponse
);

const selectPartialUpdateCashMemoResponse = createSelector(
  selectCashMemoState,
  state => state.partialUpdateCashMemoResponse
);

const selectUpdatePriceDetailsResponse = createSelector(
  selectCashMemoState,
  state => state.updatePriceDetailsResponse
);

const selectDeleteCashMemoResponse = createSelector(
  selectCashMemoState,
  state => state.deleteCashMemoResponse
);

const selectInvokeOrderDetailsResponse = createSelector(
  selectCashMemoState,
  state => state.invokeOrderDetailsResponse
);

const selectCashMemoHistory = createSelector(
  selectCashMemoState,
  state => state.cashMemoHistory
);

const selectCashMemoHistoryTotalElements = createSelector(
  selectCashMemoState,
  state => state.cashMemoHistoryTotalElements
);

const selectIsHistoryDetailsLoading = createSelector(
  selectCashMemoState,
  state => state.isHistoryDetailsLoading
);
export const itemDetails = createSelector(
  selectCashMemoState,
  state => state.productDetails
);

const selectItemDetails = createSelector(
  itemDetails,
  itemDetailsSelector.selectAll
);

const selectIsABInvoked = createSelector(
  selectCashMemoState,
  state => state.isABInvoked
);

const selectHistorySearchParameter = createSelector(
  selectCashMemoState,
  state => state.historySearchParameter
);

const selectSetFocus = createSelector(
  selectCashMemoState,
  state => state.setFocus
);

const selectIsIGST = createSelector(
  selectCashMemoState,
  state => state.isIGST
);

// Manual CM
const selectMaterialPrices = createSelector(
  selectCashMemoState,
  state => state.materialPrices
);

const selectFileUploadRes = createSelector(
  selectCashMemoState,
  state => state.uploadFileResponse
);

const selectFileUploadListRes = createSelector(
  selectCashMemoState,
  state => state.uploadFileListResponse
);

const selectFileDownloadUrl = createSelector(
  selectCashMemoState,
  state => state.downloadFileUrl
);

const selectIsMetalRateValidated = createSelector(
  selectCashMemoState,
  state => state.isMetalRateValidated
);

export const cashMemoSelectors = {
  selectHasError,
  selectIsLoading,
  selectCreateCashMemoResponse,
  selectViewCashMemoResponse,
  selectUpdateCashMemoResponse,
  selectPartialUpdateCashMemoResponse,
  selectUpdatePriceDetailsResponse,
  selectDeleteCashMemoResponse,
  selectInvokeOrderDetailsResponse,
  selectCashMemoHistory,
  selectCashMemoHistoryTotalElements,
  selectIsHistoryDetailsLoading,
  selectItemDetails,
  selectIsABInvoked,
  selectHistorySearchParameter,
  selectTcsAmountResponse,
  selectMaterialPrices,
  selectFileUploadRes,
  selectFileUploadListRes,
  selectFileDownloadUrl,
  selectSetFocus,
  selectIsIGST,
  selectIsMetalRateValidated
};
