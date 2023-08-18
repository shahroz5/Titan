import { createSelector } from '@ngrx/store';
import {
  otheReceiptSelector,
  itemSelector,
  adjustementSelector
} from './other-receipts.entity';
import { selectStockIssueState } from './other-receipts.reducer';

const selectHasError = createSelector(
  selectStockIssueState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  selectStockIssueState,
  state => state.isLoading
);

const selectOtherReceiptsSTNCount = createSelector(
  selectStockIssueState,
  state => state.pendingOtherReceiptsSTNCount
);

const selectprintDataResponse = createSelector(selectStockIssueState, state => {
  return state.printDataResponse;
});

const pendingReceiptList = createSelector(
  selectStockIssueState,
  state => state.otherReceiptList
);

const selectPendingReceiptList = createSelector(
  pendingReceiptList,
  otheReceiptSelector.selectAll
);
const pendingReceiptLoanList = createSelector(
  selectStockIssueState,
  state => state.otherReceiptLoanList
);

const selectPendingReceiptLoanList = createSelector(
  pendingReceiptLoanList,
  otheReceiptSelector.selectAll
);

const selectIsLoadingOtherReceiptsSTN = createSelector(
  selectStockIssueState,
  state => state.isLoadingOtherReceiptList
);

const selectIsSearchingStocks = createSelector(
  selectStockIssueState,
  state => state.isSearchingStocks
);

const selectHasSearchStockResults = createSelector(
  selectStockIssueState,
  state => state.hasSearchStockResults
);

const searchStockResults = createSelector(
  selectStockIssueState,
  state => state.searchStockResults
);

const selectSearchStockResults = createSelector(
  searchStockResults,
  otheReceiptSelector.selectAll
);

const nonVerifiedItems = createSelector(
  selectStockIssueState,
  state => state.nonVerifiedItems
);

const selectNonVerifiedItems = createSelector(
  nonVerifiedItems,
  itemSelector.selectAll
);

const verifiedItems = createSelector(
  selectStockIssueState,
  state => state.verifiedItems
);

const selectVerifiedItems = createSelector(
  verifiedItems,
  itemSelector.selectAll
);

const selectIsNonVerifiedItemsLoading = createSelector(
  selectStockIssueState,
  state => state.isNonVerifiedItemsLoading
);

const selectIsVerifiedItemsLoading = createSelector(
  selectStockIssueState,
  state => state.isVerifiedItemsLoading
);

const selectIsItemsTotalCountLoaded = createSelector(
  selectStockIssueState,
  state => state.isItemsTotalCountLoaded
);

const selectIsItemsTotalCountLoading = createSelector(
  selectStockIssueState,
  state => state.isItemsTotalCountLoading
);

const selectIsSearchingItems = createSelector(
  selectStockIssueState,
  state => state.isSearchingItems
);

const selectHasSearchedItems = createSelector(
  selectStockIssueState,
  state => state.hasSearchedItems
);

const selectBinCodes = createSelector(
  selectStockIssueState,
  state => state.binCodes
);
const selectRemarks = createSelector(
  selectStockIssueState,
  state => state.remarks
);

const selectSelectedStock = createSelector(
  selectStockIssueState,
  state => state.selectedStock
);

const selectNonVerifiedItemsTotalCount = createSelector(
  selectStockIssueState,
  state => state.nonVerifiedItemsTotalCount
);

const selectVerifiedItemsTotalCount = createSelector(
  selectStockIssueState,
  state => state.verifiedItemsTotalCount
);

const selectIsVerifyingAllItemSuccess = createSelector(
  selectStockIssueState,
  state => state.isVerifyingAllItemSuccess
);

const selectIsAssigningBinToAllItemsSuccess = createSelector(
  selectStockIssueState,
  state => state.isAssigningBinToAllItemsSuccess
);

const selectConfirmedStock = createSelector(
  selectStockIssueState,
  state => state.confirmedStock
);

const selectConfirmStockReceiveErrors = createSelector(
  selectStockIssueState,
  state => state.confirmStockReceiveErrors
);

const selectSelectedStockLoadError = createSelector(
  selectStockIssueState,
  state => state.selectedStockLoadError
);

const selectIsAssigningBinToAllItems = createSelector(
  selectStockIssueState,
  state => state.isAssigningBinToAllItems
);
const selectOtherReceiptsDropDown = createSelector(
  selectStockIssueState,
  state => state.otherReceiptsDropdownValues
);

const selectOtherReceiptsSelectedDropDown = createSelector(
  selectStockIssueState,
  state => state.selectedDropDownForReceipts
);

const selectTotalReceiptsCount = createSelector(
  selectStockIssueState,
  state => state.totalElementsOtherReceipts
);

const selectError = createSelector(selectStockIssueState, state => state.error);

const selectIsLoadingBinGroups = createSelector(
  selectStockIssueState,
  state => state.isLoadingBinGroups
);

const selectIsLoadingRemarks = createSelector(
  selectStockIssueState,
  state => state.isLoadingRemarks
);

const selectIsLoadingSelectedStock = createSelector(
  selectStockIssueState,
  state => state.isLoadingSelectedStock
);

const selectUpdateItemSuccess = createSelector(
  selectStockIssueState,
  state => state.updateItemSuccess
);

const selectAdjustmentSearchedItems = createSelector(
  selectStockIssueState,
  state => state.adjustmentSearchedItems
);
const itemsInCarts = createSelector(
  selectStockIssueState,
  state => state.itemsInCarts
);
const selectItemsInCart = createSelector(
  itemsInCarts,
  adjustementSelector.selectAll
);
const selectCartItemIds = createSelector(
  selectStockIssueState,
  state => state.itemsInCarts.ids
);
const selectAdjustmentItemsSearchCount = createSelector(
  selectStockIssueState,
  state => state.adjustmentSearchedItemsCount
);
const selectConfirmAdjustementItemsResponse = createSelector(
  selectStockIssueState,
  state => state.confirmAdjustementItemResponse
);

const PendingReceiptADJList = createSelector(
  selectStockIssueState,
  state => state.otherReceiptADJList
);

const selectPendingReceiptADJList = createSelector(
  PendingReceiptADJList,
  otheReceiptSelector.selectAll
);
const selectIsSearchingAdjustment = createSelector(
  selectStockIssueState,
  state => state.isSearchingAdjustmentItems
);
const selectHasSearchedItemAdjustment = createSelector(
  selectStockIssueState,
  state => state.hasSearchedAdjustmentItems
);
const selectIsLoadingAdjustment = createSelector(
  selectStockIssueState,
  state => state.isLoadingAdjustment
);
const selectHasSearchItemInCartSearch = createSelector(
  selectStockIssueState,
  state => state.hasSearchItemInCartSearchAdjustment
);
//psv

const selectPSVSearchedItems = createSelector(
  selectStockIssueState,
  state => state.psvSearchedItems
);
const itemsInCartsPSV = createSelector(
  selectStockIssueState,
  state => state.itemsInCartsPSV
);
const selectItemsInCartPSV = createSelector(
  itemsInCartsPSV,
  adjustementSelector.selectAll
);

const selectPSVItemsSearchCount = createSelector(
  selectStockIssueState,
  state => state.psvSearchedItemsCount
);
const selectConfirmPSVItemsResponse = createSelector(
  selectStockIssueState,
  state => state.confirmPSVItemResponse
);

const selectIsSearchingPSV = createSelector(
  selectStockIssueState,
  state => state.isSearchingPSVItems
);
const selectHasSearchedItemPSV = createSelector(
  selectStockIssueState,
  state => state.hasSearchedItemPSV
);
const selectIsLoadingPSV = createSelector(
  selectStockIssueState,
  state => state.IsLoadingPSV
);
const selectHasSearchItemInCartSearchPSV = createSelector(
  selectStockIssueState,
  state => state.hasSearchItemInCartSearchPSV
);
const selectProductCategories = createSelector(
  selectStockIssueState,
  state => state.productCategories
);

const selectProductGroups = createSelector(
  selectStockIssueState,
  state => state.productGroups
);

const selectFilterDataNonVerifiedProducts = createSelector(
  selectStockIssueState,
  state => state.filterDataNonVerifiedProducts
);

const selectFilterDataVerifiedProducts = createSelector(
  selectStockIssueState,
  state => state.filterDataVerifiedProducts
);
const selectSortNonVerifiedProducts = createSelector(
  selectStockIssueState,
  state => state.sortDataNonVerifiedProducts
);

const selectSortDataVerifiedProducts = createSelector(
  selectStockIssueState,
  state => state.sortDataVerifiedProducts
);
const selectItemsCountNonVerified = createSelector(
  selectStockIssueState,
  state => state.itemsCountNonVerified
);
const selectItemsCountVerified = createSelector(
  selectStockIssueState,
  state => state.itemsCountVerified
);
const selectIsNonVerifiedItemsLoaded = createSelector(
  selectStockIssueState,
  state => state.isNonVerifiedItemsLoaded
);
const selectIsVerifiedItemsLoaded = createSelector(
  selectStockIssueState,
  state => state.isVerifiedItemsLoaded
);
const selectVerifyItemSuccess = createSelector(
  selectStockIssueState,
  state => state.verifyItemSuccess
);
//HISTORY
const otherReceiptsHistory = createSelector(
  selectStockIssueState,
  state => state.otherReceiptsHistory
);
const selectOtherReceiptsHistory = createSelector(
  otherReceiptsHistory,
  otheReceiptSelector.selectAll
);
const selectIsLoadingOtherReceiptsHistory = createSelector(
  selectStockIssueState,
  state => state.isLoadingHistory
);
const selectOtherReceiptsHistoryCount = createSelector(
  selectStockIssueState,
  state => state.otherReceiptsHistoryCount
);
const selectIsLoadingSelectedHistory = createSelector(
  selectStockIssueState,
  state => state.isLoadingSelectedHistory
);
const selectHasSelectedHistory = createSelector(
  selectStockIssueState,
  state => state.hasSelectedHistory
);
const selectSelectedHistory = createSelector(
  selectStockIssueState,
  state => state.selectedHistory
);
const selectIsLoadingHistoryItems = createSelector(
  selectStockIssueState,
  state => state.isLoadingHistoryItems
);
const selectHistoryItemsCount = createSelector(
  selectStockIssueState,
  state => state.historyItemsCount
);
const historyItems = createSelector(
  selectStockIssueState,
  state => state.historyItems
);
const selectHistoryItems = createSelector(historyItems, itemSelector.selectAll);
const selectIsHistoryItemsLoaded = createSelector(
  selectStockIssueState,
  state => state.isHistoryItemsLoaded
);
const selectIsHistoryItemsTotalCountLoaded = createSelector(
  selectStockIssueState,
  state => state.isHistoryItemsTotalCountLoaded
);
const selectIsLoadingHistoryItemsTotalCount = createSelector(
  selectStockIssueState,
  state => state.isLoadingHistoryItemsTotalCount
);
const selectHistoryItemsTotalCount = createSelector(
  selectStockIssueState,
  state => state.historyItemsTotalCount
);
// Image
export const selectIsLoadingImage = createSelector(
  selectStockIssueState,
  state => state.isLoadingImage
);

export const OtherReceiptsSelector = {
  selectHasError,
  selectIsLoading,
  selectOtherReceiptsSTNCount,
  selectPendingReceiptList,
  selectIsLoadingOtherReceiptsSTN,
  selectIsSearchingStocks,
  selectHasSearchStockResults,
  selectSearchStockResults,
  selectNonVerifiedItems,
  selectVerifiedItems,
  selectIsNonVerifiedItemsLoading,
  selectIsVerifiedItemsLoading,
  selectIsItemsTotalCountLoaded,
  selectIsItemsTotalCountLoading,
  selectIsSearchingItems,
  selectHasSearchedItems,
  selectBinCodes,
  selectRemarks,
  selectSelectedStock,
  selectNonVerifiedItemsTotalCount,
  selectVerifiedItemsTotalCount,
  selectIsVerifyingAllItemSuccess,
  selectIsAssigningBinToAllItemsSuccess,
  selectConfirmedStock,
  selectConfirmStockReceiveErrors,
  selectSelectedStockLoadError,
  selectIsAssigningBinToAllItems,
  selectOtherReceiptsDropDown,
  selectPendingReceiptLoanList,
  selectOtherReceiptsSelectedDropDown,
  selectTotalReceiptsCount,
  selectError,
  selectIsLoadingBinGroups,
  selectIsLoadingRemarks,
  selectIsLoadingSelectedStock,
  selectUpdateItemSuccess,
  selectAdjustmentSearchedItems,
  selectItemsInCart,
  selectAdjustmentItemsSearchCount,
  selectCartItemIds,
  selectConfirmAdjustementItemsResponse,
  selectPendingReceiptADJList,
  selectHasSearchItemInCartSearch,
  selectIsSearchingAdjustment,
  selectHasSearchedItemAdjustment,
  selectIsLoadingAdjustment,
  selectprintDataResponse,
  //psv
  selectPSVSearchedItems,
  selectItemsInCartPSV,
  selectPSVItemsSearchCount,
  selectConfirmPSVItemsResponse,
  selectIsSearchingPSV,
  selectHasSearchedItemPSV,
  selectIsLoadingPSV,
  selectHasSearchItemInCartSearchPSV,

  selectProductCategories,
  selectProductGroups,
  selectFilterDataNonVerifiedProducts,
  selectFilterDataVerifiedProducts,
  selectSortNonVerifiedProducts,
  selectSortDataVerifiedProducts,
  selectItemsCountNonVerified,
  selectItemsCountVerified,
  selectIsNonVerifiedItemsLoaded,
  selectIsVerifiedItemsLoaded,
  selectVerifyItemSuccess,

  // HISTORY
  selectOtherReceiptsHistory,
  selectIsLoadingOtherReceiptsHistory,
  selectOtherReceiptsHistoryCount,
  selectIsLoadingSelectedHistory,
  selectHasSelectedHistory,
  selectSelectedHistory,
  selectIsLoadingHistoryItems,
  selectHistoryItemsCount,
  selectHistoryItems,
  selectIsHistoryItemsLoaded,
  selectIsHistoryItemsTotalCountLoaded,
  selectIsLoadingHistoryItemsTotalCount,
  selectHistoryItemsTotalCount,
  selectIsLoadingImage
};
