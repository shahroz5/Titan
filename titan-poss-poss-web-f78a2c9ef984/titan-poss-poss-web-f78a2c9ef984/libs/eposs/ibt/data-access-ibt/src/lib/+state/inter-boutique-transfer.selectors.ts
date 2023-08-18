import { createSelector } from '@ngrx/store';

import {
  requestListSelector,
  itemListSelector,
  boutiqueListSelector,
  ibtHistorySelector
} from './inter-boutique-transfer.entity';
import { selectInterBoutiqueTransferState } from './inter-boutique-transfer.reducer';

export const requestSentList = createSelector(
  selectInterBoutiqueTransferState,
  state => state.requestSentList
);

const selectRequestSentList = createSelector(
  requestSentList,
  requestListSelector.selectAll
);

export const requestReceivedList = createSelector(
  selectInterBoutiqueTransferState,
  state => state.requestReceivedList
);

const selectRequestReceivedList = createSelector(
  requestReceivedList,
  requestListSelector.selectAll
);

const selectRequestSentListCount = createSelector(
  selectInterBoutiqueTransferState,
  state => state.requestSentListCount
);

const selectRequestReceivedListCount = createSelector(
  selectInterBoutiqueTransferState,
  state => state.requestReceivedListCount
);

export const boutiqueList = createSelector(
  selectInterBoutiqueTransferState,
  state => state.boutiqueList
);

const selectBoutiqueList = createSelector(
  boutiqueList,
  boutiqueListSelector.selectAll
);

const selectBoutiqueListCount = createSelector(
  selectInterBoutiqueTransferState,
  state => state.boutiqueListCount
);

const selectCreateRequestResponse = createSelector(
  selectInterBoutiqueTransferState,
  state => state.createRequestResponse
);

const selectRequest = createSelector(
  selectInterBoutiqueTransferState,
  state => state.request
);

export const itemList = createSelector(
  selectInterBoutiqueTransferState,
  state => state.itemList
);

const selectItemList = createSelector(itemList, itemListSelector.selectAll);

const selectUpdateItemListResponse = createSelector(
  selectInterBoutiqueTransferState,
  state => state.updateItemListResponse
);

const selectUpdateItemListStatusResponse = createSelector(
  selectInterBoutiqueTransferState,
  state => state.updateItemListStatusResponse
);

const selectSearchItemResponse = createSelector(
  selectInterBoutiqueTransferState,
  state => state.searchItemResponse
);

const selectHasError = createSelector(
  selectInterBoutiqueTransferState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  selectInterBoutiqueTransferState,
  state => state.isLoading
);

export const IBThistory = createSelector(
  selectInterBoutiqueTransferState,
  state => state.IBThistory
);

const selectIBTHistory = createSelector(
  IBThistory,
  ibtHistorySelector.selectAll
);
const selectIsLoadingIBTHistory = createSelector(
  selectInterBoutiqueTransferState,
  state => state.isLoadingHistory
);
const selectHistoryFilterData = createSelector(
  selectInterBoutiqueTransferState,
  state => state.advancedFilter
);
const selectIBTHistoryCount = createSelector(
  selectInterBoutiqueTransferState,
  state => state.ibtHistoryCount
);

const selectSelectedHistory = createSelector(
  selectInterBoutiqueTransferState,
  state => state.selectedHistory
);
const selectIsLoadingSelectedHistory = createSelector(
  selectInterBoutiqueTransferState,
  state => state.isLoadingSelectedHistory
);
const selectHasSelectedHistory = createSelector(
  selectInterBoutiqueTransferState,
  state => state.hasSelectedHistory
);
const selectRadioHistoryType = createSelector(
  selectInterBoutiqueTransferState,
  state => state.historyType
);
const selectAdvancedFilterData = createSelector(
  selectInterBoutiqueTransferState,
  state => state.advancedFilter
);
// Image
export const selectIsLoadingImage = createSelector(
  selectInterBoutiqueTransferState,
  state => state.isLoadingImage
);
export const interBoutiqueTransferSelectors = {
  selectRequestSentList,
  selectRequestReceivedList,
  selectRequestSentListCount,
  selectRequestReceivedListCount,
  selectBoutiqueList,
  selectBoutiqueListCount,
  selectCreateRequestResponse,
  selectRequest,
  selectItemList,
  selectUpdateItemListResponse,
  selectUpdateItemListStatusResponse,
  selectSearchItemResponse,
  selectHasError,
  selectIsLoading,
  selectIBTHistory,
  selectIsLoadingIBTHistory,
  selectIBTHistoryCount,
  selectSelectedHistory,
  selectIsLoadingSelectedHistory,
  selectHasSelectedHistory,
  selectHistoryFilterData,
  selectRadioHistoryType,
  selectAdvancedFilterData,
  selectIsLoadingImage
};
