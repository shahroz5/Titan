import { createSelector, createFeatureSelector } from '@ngrx/store';
import { itemSelector, stockSelector } from './stock-receive.entity';
import {
  StockReceiveState,
  stockReceiveFeatureKey
} from './stock-receive.state';

/**
 * The selectors for Stock-Receive store
 */
export const selectStockReceiveState = createFeatureSelector<StockReceiveState>(
  stockReceiveFeatureKey
);

export const pendingFactorySTN = createSelector(
  selectStockReceiveState,
  state => state.pendingFactorySTN
);

export const selectPendingFactorySTN = createSelector(
  pendingFactorySTN,
  stockSelector.selectAll
);

export const pendingBoutiqueSTN = createSelector(
  selectStockReceiveState,
  state => state.pendingBoutiqueSTN
);

export const selectPendingBoutiqueSTN = createSelector(
  pendingBoutiqueSTN,
  stockSelector.selectAll
);

export const pendingMerchandiseSTN = createSelector(
  selectStockReceiveState,
  state => state.pendingMerchandiseSTN
);

export const selectPendingMerchandiseSTN = createSelector(
  pendingMerchandiseSTN,
  stockSelector.selectAll
);

export const pendingCFAInvoice = createSelector(
  selectStockReceiveState,
  state => state.pendingCFAInvoice
);

export const selectPendingCFAInvoice = createSelector(
  pendingCFAInvoice,
  stockSelector.selectAll
);

export const selectError = createSelector(
  selectStockReceiveState,
  state => state.error
);

export const selectIsLoadingBinGroups = createSelector(
  selectStockReceiveState,
  state => state.isLoadingBinGroups
);

export const selectIsLoadingRemarks = createSelector(
  selectStockReceiveState,
  state => state.isLoadingRemarks
);

export const searchStockResults = createSelector(
  selectStockReceiveState,
  state => state.searchStockResults
);
export const selectSearchStockResults = createSelector(
  searchStockResults,
  stockSelector.selectAll
);

export const searchInvoiceResults = createSelector(
  selectStockReceiveState,
  state => state.searchInvoiceResults
);

export const selectSearchInvoiceResults = createSelector(
  searchInvoiceResults,
  stockSelector.selectAll
);

export const selectIsLoadingPendingFactorySTN = createSelector(
  selectStockReceiveState,
  state => state.isLoadingPendingFactorySTN
);

export const selectIsLoadingPendingBoutiqueSTN = createSelector(
  selectStockReceiveState,
  state => state.isLoadingPendingBoutiqueSTN
);
export const selectIsLoadingPendingMerchandiseSTN = createSelector(
  selectStockReceiveState,
  state => state.isLoadingPendingMerchandiseSTN
);

export const selectIsLoadingPendingCFAInvoice = createSelector(
  selectStockReceiveState,
  state => state.isLoadingPendingCFAInvoice
);

export const selectIsSearchingStocks = createSelector(
  selectStockReceiveState,
  state => state.isSearchingStocks
);

export const selectHasSearchStockResults = createSelector(
  selectStockReceiveState,
  state => state.hasSearchStockResults
);

export const selectIsSearchingInvoices = createSelector(
  selectStockReceiveState,
  state => state.isSearchingInvoices
);

export const selectHasSearchInvoiceResults = createSelector(
  selectStockReceiveState,
  state => state.hasSearchInvoiceResults
);

export const selectSelectedStock = createSelector(
  selectStockReceiveState,
  state => state.selectedStock
);

export const selectSelectedInvoice = createSelector(
  selectStockReceiveState,
  state => state.selectedInvoice
);

export const selectIsLoadingSelectedStock = createSelector(
  selectStockReceiveState,
  state => state.isLoadingSelectedStock
);

export const selectItemsCount = createSelector(
  selectStockReceiveState,
  state => state.itemsCount
);

export const items = createSelector(
  selectStockReceiveState,
  state => state.items
);

export const selectIsItemsLoading = createSelector(
  selectStockReceiveState,
  state => state.isItemsLoading
);

export const selectIsItemsLoaded = createSelector(
  selectStockReceiveState,
  state => state.isItemsLoaded
);

export const selectItems = createSelector(items, itemSelector.selectAll);

export const selectTotalCounts = createSelector(
  selectStockReceiveState,
  state => state.totalCounts
);

export const selectIsItemsTotalCountLoading = createSelector(
  selectStockReceiveState,
  state => state.isItemsTotalCountLoading
);

export const selectisItemsTotalCountLoaded = createSelector(
  selectStockReceiveState,
  state => state.isItemsTotalCountLoaded
);

export const selectConfirmedStock = createSelector(
  selectStockReceiveState,
  state => state.confirmedStock
);

export const selectIsConfirmStockReceiveSuccess = createSelector(
  selectStockReceiveState,
  state => state.isConfirmStockReceiveSuccess
);

export const selectIsConfirmingStockReceive = createSelector(
  selectStockReceiveState,
  state => state.isConfirmingStockReceive
);

export const selectIsVerifyingAllItem = createSelector(
  selectStockReceiveState,
  state => state.isVerifyingAllItem
);

export const selectIsVerifyingAllItemSuccess = createSelector(
  selectStockReceiveState,
  state => state.isVerifyingAllItemSuccess
);

export const selectIsAssigningBinToAllItems = createSelector(
  selectStockReceiveState,
  state => state.isAssigningBinToAllItems
);

export const selectIsAssigningBinToAllItemsSuccess = createSelector(
  selectStockReceiveState,
  state => state.isAssigningBinToAllItemsSuccess
);

export const selectBinCodes = createSelector(
  selectStockReceiveState,
  state => state.binCodes
);

export const selectRemarks = createSelector(
  selectStockReceiveState,
  state => state.remarks
);

export const selectVerifyItemSuccess = createSelector(
  selectStockReceiveState,
  state => state.verifyItemSuccess
);

export const selectUpdateItemSuccess = createSelector(
  selectStockReceiveState,
  state => state.updateItemSuccess
);

export const selectProductGroups = createSelector(
  selectStockReceiveState,
  state => state.productGroups
);

export const selectIsLoadingProductGroups = createSelector(
  selectStockReceiveState,
  state => state.isLoadingProductGroups
);

export const selectProductCategories = createSelector(
  selectStockReceiveState,
  state => state.productCategories
);

export const selectIsLoadingProductCategories = createSelector(
  selectStockReceiveState,
  state => state.isLoadingProductCategories
);

export const selectSearchReset = createSelector(
  selectStockReceiveState,
  state => state.searchReset
);

export const stockReceiveHistory = createSelector(
  selectStockReceiveState,
  state => state.stockReceiveHistory
);

export const selectStockReceiveHistory = createSelector(
  stockReceiveHistory,
  stockSelector.selectAll
);
export const selectIsLoadingStockReceiveHistory = createSelector(
  selectStockReceiveState,
  state => state.isLoadingHistory
);
export const selectHistoryTotalElements = createSelector(
  selectStockReceiveState,
  state => state.totalElements
);

export const selectHistoryType = createSelector(
  selectStockReceiveState,
  state => state.historyType
);
export const selectAdvancedFilterData = createSelector(
  selectStockReceiveState,
  state => state.advancedFilter
);

export const selectOracleFetchInfo = createSelector(
  selectStockReceiveState,
  state => state.oracleFetchInfo
);

export const selectTotalMeasuredWeight = createSelector(
  selectStockReceiveState,
  state => state.totalMeasuredWeight
);

// Image
export const selectIsLoadingImage = createSelector(
  selectStockReceiveState,
  state => state.isLoadingImage
);

export const StockReceiveSelectors = {
  selectPendingFactorySTN,
  selectError,
  selectPendingBoutiqueSTN,
  selectPendingMerchandiseSTN,
  selectPendingCFAInvoice,
  selectIsLoadingPendingFactorySTN,
  selectIsLoadingPendingBoutiqueSTN,
  selectIsLoadingPendingMerchandiseSTN,
  selectIsLoadingPendingCFAInvoice,
  selectIsSearchingStocks,
  selectHasSearchStockResults,
  selectIsSearchingInvoices,
  selectHasSearchInvoiceResults,
  selectSelectedStock,
  selectIsLoadingSelectedStock,
  selectSearchStockResults,
  selectSearchInvoiceResults,
  selectSelectedInvoice,
  selectItems,
  selectItemsCount,
  selectIsItemsLoading,
  selectVerifyItemSuccess,
  selectUpdateItemSuccess,
  selectBinCodes,
  selectRemarks,
  selectIsLoadingBinGroups,
  selectIsLoadingRemarks,
  selectTotalCounts,
  selectIsItemsTotalCountLoading,
  selectisItemsTotalCountLoaded,
  selectIsVerifyingAllItem,
  selectIsVerifyingAllItemSuccess,
  selectIsAssigningBinToAllItems,
  selectIsAssigningBinToAllItemsSuccess,
  selectConfirmedStock,
  selectIsConfirmStockReceiveSuccess,
  selectIsConfirmingStockReceive,
  selectProductGroups,
  selectIsLoadingProductGroups,
  selectIsItemsLoaded,
  selectProductCategories,
  selectIsLoadingProductCategories,
  selectSearchReset,
  selectStockReceiveHistory,
  selectIsLoadingStockReceiveHistory,
  selectHistoryTotalElements,
  selectHistoryType,
  selectAdvancedFilterData,
  selectOracleFetchInfo,
  selectTotalMeasuredWeight,
  selectIsLoadingImage
};
