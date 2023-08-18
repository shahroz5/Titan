import { createSelector } from '@ngrx/store';
import {
  conversionRequestHistorySelector,
  conversionRequestSelector,
  itemSelector
} from './conversion.entity';
import { selectConversionState } from './conversion.reducer';

const selectSearchedItemsList = createSelector(
  selectConversionState,
  state => state.searchedItemsList
);
const selectIsSearchingItems = createSelector(
  selectConversionState,
  state => state.isSearchingItems
);
const selectHasSearchedItems = createSelector(
  selectConversionState,
  state => state.hasSearchedItems
);

const selectedVarient = createSelector(
  selectConversionState,
  state => state.selectedVarient
);
const selectSelectedVarient = createSelector(
  selectedVarient,
  itemSelector.selectAll
);
const selectHasSelectedVarient = createSelector(
  selectConversionState,
  state => state.hasselectedVarient
);

const selectisLoadingConversionItems = createSelector(
  selectConversionState,
  state => state.isLoadingConversionItems
);
const selectHasConversionItems = createSelector(
  selectConversionState,
  state => state.hasConversionItems
);
const selectConversionItems = createSelector(
  selectConversionState,
  state => state.conversionItems
);

const selectItemSplitResponse = createSelector(
  selectConversionState,
  state => state.ItemSplitResponse
);
const selectIsSplitting = createSelector(
  selectConversionState,
  state => state.isSplitting
);
const selectIsSplitted = createSelector(
  selectConversionState,
  state => state.isSplitted
);

const selectConversionRequestResponse = createSelector(
  selectConversionState,
  state => state.conversionRequestResponse
);
const selectIsSendingRequest = createSelector(
  selectConversionState,
  state => state.isSendingRequest
);
const selectHasRequestResponse = createSelector(
  selectConversionState,
  state => state.hasRequestResponse
);

const selectConversionRequestCount = createSelector(
  selectConversionState,
  state => state.conversionRequestsCount
);
const selectIsLoadingCount = createSelector(
  selectConversionState,
  state => state.isLoadingCount
);

const conversionRequests = createSelector(
  selectConversionState,
  state => state.conversionRequests
);
const selectConversionRequests = createSelector(
  conversionRequests,
  conversionRequestSelector.selectAll
);
const selectIsLoadingRequests = createSelector(
  selectConversionState,
  state => state.isLoadingRequests
);

const searchedConversionRequests = createSelector(
  selectConversionState,
  state => state.searchedConversionRequests
);
const selectSearchedConversionRequests = createSelector(
  searchedConversionRequests,
  conversionRequestSelector.selectAll
);
const selectIsSearchingRequests = createSelector(
  selectConversionState,
  state => state.isSearchingRequests
);
const selectHasSearchedRequests = createSelector(
  selectConversionState,
  state => state.hasSearchedConversionRequests
);

const selectIsLoadingSelectedRequest = createSelector(
  selectConversionState,
  state => state.isLoadingSelectedRequest
);
const selectSelectedRequest = createSelector(
  selectConversionState,
  state => state.selectedRequest
);

const selectIsLoadingSelectedRequestData = createSelector(
  selectConversionState,
  state => state.isLoadingSelectedRequestData
);
const selectSelectedRequestData = createSelector(
  selectConversionState,
  state => state.selectedRequestData
);

const selectRsoDetails = createSelector(
  selectConversionState,
  state => state.rsoDetails
);
const selectIsLoadingRsoDetails = createSelector(
  selectConversionState,
  state => state.isLoadingRsoDetails
);
const selectHasRsoDetails = createSelector(
  selectConversionState,
  state => state.hasRsoDetails
);

const selectBincodes = createSelector(
  selectConversionState,
  state => state.binCodes
);
const selectIsLoading = createSelector(
  selectConversionState,
  state => state.isLoading
);
const selectHasBinCodes = createSelector(
  selectConversionState,
  state => state.hasBinCodes
);
const selectError = createSelector(selectConversionState, state => state.error);
const selectedRequestSentHistory = createSelector(
  selectConversionState,
  state => state.conversionHistory
);
const selectConversionHistory = createSelector(
  selectedRequestSentHistory,
  conversionRequestHistorySelector.selectAll
);
const selectConversionHistoryCount = createSelector(
  selectConversionState,
  state => state.totalElements
);
const selectIsLoadingHistory = createSelector(
  selectConversionState,
  state => state.isLoadingHistory
);
const selectSelectedRequestHistory = createSelector(
  selectConversionState,
  state => state.selectedRequestHistory
);
const selectConversionHistoryItems = createSelector(
  selectConversionState,
  state => state.conversionHistoryItems
);
const selectConversionHistoryItemsCount = createSelector(
  selectConversionState,
  state => state.historyItemsCount
);
const selectRequestType = createSelector(
  selectConversionState,
  state => state.requestType
);
const selectAdvancedFilterData = createSelector(
  selectConversionState,
  state => state.advancedFilter
);

// Image
export const selectIsLoadingImage = createSelector(
  selectConversionState,
  state => state.isLoadingImage
);

const selectStandardMetalPriceDetails = createSelector(
  selectConversionState,
  state => state.standardMetalPriceDetails
);

const selectPriceDetails = createSelector(
  selectConversionState,
  state => state.priceDetails
);

export const conversionSelectors = {
  selectSearchedItemsList,
  selectIsSearchingItems,
  selectHasSearchedItems,

  selectSelectedVarient,
  selectHasSelectedVarient,

  selectConversionItems,
  selectHasConversionItems,
  selectisLoadingConversionItems,

  selectItemSplitResponse,
  selectIsSplitting,
  selectIsSplitted,

  selectConversionRequestResponse,
  selectIsSendingRequest,
  selectHasRequestResponse,

  selectIsLoadingCount,
  selectConversionRequestCount,

  selectConversionRequests,
  selectIsLoadingRequests,

  selectSearchedConversionRequests,
  selectIsSearchingRequests,
  selectHasSearchedRequests,

  selectIsLoadingSelectedRequest,
  selectSelectedRequest,

  selectIsLoadingSelectedRequestData,
  selectSelectedRequestData,

  selectRsoDetails,
  selectIsLoadingRsoDetails,
  selectHasRsoDetails,

  selectBincodes,
  selectIsLoading,
  selectHasBinCodes,

  selectError,
  selectConversionHistory,
  selectConversionHistoryCount,

  selectIsLoadingHistory,
  selectSelectedRequestHistory,
  selectConversionHistoryItems,
  selectConversionHistoryItemsCount,
  selectRequestType,
  selectAdvancedFilterData,
  selectIsLoadingImage,
  selectStandardMetalPriceDetails,
  selectPriceDetails
};
