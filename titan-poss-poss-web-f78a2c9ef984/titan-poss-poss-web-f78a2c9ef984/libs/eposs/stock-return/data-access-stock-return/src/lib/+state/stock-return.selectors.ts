import { createSelector } from '@ngrx/store';

import { itemSelector, requestInvoiceSelector } from './stock-return.entity';
import { selectStockReturnState } from './stock-return.reducers';

/**
 * The selectors for Return-Invoice store
 */

export const selectNewRequestId = createSelector(
  selectStockReturnState,
  state => state.newRequestId
);

export const selectConfirmedReturnInvoiceCfa = createSelector(
  selectStockReturnState,
  state => state.invoiceNumber
);

export const selectTotalItemCount = createSelector(
  selectStockReturnState,
  state => state.totalItemCount
);

export const selectError = createSelector(
  selectStockReturnState,
  state => state.error
);
export const sortedItems = createSelector(
  selectStockReturnState,
  state => state.loadedItems
);
export const selectSortedItems = createSelector(
  sortedItems,
  itemSelector.selectAll
);
const selectisLoading = createSelector(
  selectStockReturnState,
  state => state.isLoading
);
export const selectHasSearchResult = createSelector(
  selectStockReturnState,
  state => state.hasSearchedItem
);

export const searchedItems = createSelector(
  selectStockReturnState,
  state => state.searchedItems
);

export const selectSearchedItems = createSelector(
  searchedItems,
  itemSelector.selectAll
);
export const selectHasSearched = createSelector(
  selectStockReturnState,
  state => state.hasSearched
);

export const selectHasIssued = createSelector(
  selectStockReturnState,
  state => state.hasIssued
);
export const selectHasLoaded = createSelector(
  selectStockReturnState,
  state => state.hasLoaded
);

export const selectCFA = createSelector(
  selectStockReturnState,
  state => state.CFAddress
);

export const loadedItems = createSelector(
  selectStockReturnState,
  state => state.loadedItems
);
export const selectCFAItems = createSelector(
  loadedItems,
  itemSelector.selectAll
);
export const selectCFAItem = createSelector(
  loadedItems,
  itemSelector.selectAll
);

export const selectHasRemovedMultipleItes = createSelector(
  selectStockReturnState,
  state => state.hasRemovedMultipleItems
);

export const selecteHasSelectedProductsSearch = createSelector(
  selectStockReturnState,
  state => state.hasSelectedProductsSearch
);
export const selectSelectedProductsSearchCount = createSelector(
  selectStockReturnState,
  state => state.selectedProductsSearchCount
);
export const selectSearchCount = createSelector(
  selectStockReturnState,
  state => state.searchCount
);

export const selectCourierDetails = createSelector(
  selectStockReturnState,
  state => state.courierDetails
);
export const selectHeaderLevelDetails = createSelector(
  selectStockReturnState,
  state => state.headerLevelDetails
);
export const selectProductCategories = createSelector(
  selectStockReturnState,
  state => state.productCategories
);

export const selectProductGroups = createSelector(
  selectStockReturnState,
  state => state.productGroups
);
export const selectEmployeeCodes = createSelector(
  selectStockReturnState,
  state => state.employeeCodes
);

export const selectEmployeeDetails = createSelector(
  selectStockReturnState,
  state => state.employeeDetails
);
export const invoiceHistory = createSelector(
  selectStockReturnState,
  state => state.invoiceHistory
);
export const selectInvoiceHistory = createSelector(
  invoiceHistory,
  requestInvoiceSelector.selectAll
);
export const selectTotalInvoiceHistoryCount = createSelector(
  selectStockReturnState,
  state => state.totalHistoryInvoiceItems
);
export const selectIsLoadingHistory = createSelector(
  selectStockReturnState,
  state => state.isLoadingHistory
);
export const selectHistoryType = createSelector(
  selectStockReturnState,
  state => state.historyType
);
export const selectAdvancedFilterData = createSelector(
  selectStockReturnState,
  state => state.advancedFilter
);

// Image
export const selectIsLoadingImage = createSelector(
  selectStockReturnState,
  state => state.isLoadingImage
);

export const StockReturnSelectors = {
  selectNewRequestId,
  selectConfirmedReturnInvoiceCfa,
  selectError,
  selectisLoading,
  selectHasSearchResult,
  selectSearchedItems,
  selectHasIssued,
  selectCFA,
  selectCFAItems,
  selectCFAItem,
  selectTotalItemCount,
  selectHasLoaded,
  selectHasRemovedMultipleItes,
  selectSortedItems,
  selecteHasSelectedProductsSearch,
  selectSelectedProductsSearchCount,
  selectSearchCount,
  selectCourierDetails,
  selectHeaderLevelDetails,
  selectProductCategories,
  selectProductGroups,
  selectEmployeeCodes,
  selectEmployeeDetails,
  selectInvoiceHistory,
  selectTotalInvoiceHistoryCount,
  selectIsLoadingHistory,
  selectHistoryType,
  selectAdvancedFilterData,
  selectHasSearched,
  selectIsLoadingImage
};
