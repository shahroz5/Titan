import { createSelector } from '@ngrx/store';
import {
  otheIssueSelector,
  otherIssueHistoryItemSelector,
  otherIssueCreateItemSelector,
  otherIssueItemSelector
} from './other-issues.entity';
import { selectStockIssueState } from './other-issues.reducer';

const selectHasError = createSelector(
  selectStockIssueState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  selectStockIssueState,
  state => state.isLoading
);

const selectOtherIssuesSTNCount = createSelector(
  selectStockIssueState,
  state => state.pendingOtherIssuesSTNCount
);

const pendingIssuesList = createSelector(
  selectStockIssueState,
  state => state.otherIssuesList
);

const selectPendingIssuesList = createSelector(
  pendingIssuesList,
  otheIssueSelector.selectAll
);

const pendingIssuesLoanList = createSelector(
  selectStockIssueState,
  state => state.otherIssueLoanList
);

const selectPendingIssuesLoanList = createSelector(
  pendingIssuesLoanList,
  otheIssueSelector.selectAll
);

const selectIsLoadingOtherIssuesSTN = createSelector(
  selectStockIssueState,
  state => state.isLoadingOtherIssuesList
);

const selectIsSearchingStocks = createSelector(
  selectStockIssueState,
  state => state.isSearchingStocks
);

const selectHasSearchStockResults = createSelector(
  selectStockIssueState,
  state => state.hasSearchStockResults
);

const searchOtherIssueStockResults = createSelector(
  selectStockIssueState,
  state => state.searchIssueStockResults
);

const selectOtherIssueStockResults = createSelector(
  searchOtherIssueStockResults,
  otheIssueSelector.selectAll
);

const selectOtherIssuesDropDown = createSelector(
  selectStockIssueState,
  state => state.otherIssuesDropdownValues
);
const selectOtherissuesSelectedDropDown = createSelector(
  selectStockIssueState,
  state => state.selectedDropDownForIssues
);
const selectSelectedIssue = createSelector(
  selectStockIssueState,
  state => state.selectedIssue
);
const selectIssueItemsTotalCount = createSelector(
  selectStockIssueState,
  state => state.issueItemsTotalCount
);
const selectTotalIssueCount = createSelector(
  selectStockIssueState,
  state => state.totalElementsOtherIssues
);
const nonVerifiedOtherIssuesItems = createSelector(
  selectStockIssueState,
  state => state.nonVerifiedOtherIssuesItems
);
const selectNonVerifiedOtherIssueItems = createSelector(
  nonVerifiedOtherIssuesItems,
  otherIssueItemSelector.selectAll
);
const selectIsLoadingSelectedIssueStock = createSelector(
  selectStockIssueState,
  state => state.isLoadingOtherIssueSelectedStock
);

const selectIsSearchingOtherIssueItems = createSelector(
  selectStockIssueState,
  state => state.isSearchingOtherIssueItems
);
const selectHasSearchedOtherIssueItems = createSelector(
  selectStockIssueState,
  state => state.hasSearchedOtherssueIItems
);
const createOtherIssueStockRequestResponse = createSelector(
  selectStockIssueState,
  state => state.createOtherIssueStockRequestResponse
);

const allOtherIssuesCreateItems = createSelector(
  selectStockIssueState,
  state => state.allOtherIssueCreateItems
);
const selectAllOtherIssuesCreateItems = createSelector(
  allOtherIssuesCreateItems,
  otherIssueCreateItemSelector.selectAll
);
const selectedOtherIssuesCreateItems = createSelector(
  selectStockIssueState,
  state => state.selectedOtherIssueCreateItems
);
const selectSelectedOtherIssuesCreateItems = createSelector(
  selectedOtherIssuesCreateItems,
  otherIssueCreateItemSelector.selectAll
);
const selectAllOtherIssueCreateItemsTotalCount = createSelector(
  selectStockIssueState,
  state => state.allOtherIssueCreateItemsTotalCount
);

const selectSelectedOtherIssueCreateTotalCount = createSelector(
  selectStockIssueState,
  state => state.selectedOtherIssueCreateItemsTotalCount
);

const selectIsAllOtherIssueCreateItemsLoading = createSelector(
  selectStockIssueState,
  state => state.isallOtherIssueCreateItemsLoading
);
const selectIsSelectedOtherIssueItemsLoading = createSelector(
  selectStockIssueState,
  state => state.isselectedOtherIssueCreateItemsLoading
);
const selectIsOtherIssueCreateTotalCountLoaded = createSelector(
  selectStockIssueState,
  state => state.isOtherIssueCreateItemTotalCountLoaded
);
const selectIsOtherIssueCreateTotalCountLoading = createSelector(
  selectStockIssueState,
  state => state.isOtherIssueItemTotalCountLoading
);

const selectIsSearchingOtherIssueCreateItems = createSelector(
  selectStockIssueState,
  state => state.isSearchingOtherIssueCreateItems
);
const selectHasSearchedOtherIssueCreateItems = createSelector(
  selectStockIssueState,
  state => state.hasSearchedOtherssueCreateItems
);
const selectCreateStockRequestItemsResponse = createSelector(
  selectStockIssueState,
  state => state.createOtherIssueStockRequestItemsResponse
);
const selectRemoveOtherIssueStockRequestItemsResponse = createSelector(
  selectStockIssueState,
  state => state.removeOtherIssueStockRequestItemsResponse
);
const selectupdateStockRequestResponse = createSelector(
  selectStockIssueState,
  state => state.updateStockRequestResponse
);
const selectCreateOtherStockIssueItemsResponse = createSelector(
  selectStockIssueState,
  state => state.createOtherStockIssueItemsResponse
);
const selectConfirmOtherStockIssueResponse = createSelector(
  selectStockIssueState,
  state => state.confirmOtherStockIssueResponse
);
const selectisLoadingOtherIssueDetails = createSelector(
  selectStockIssueState,
  state => state.isLoadingOtherIssueDetails
);

// loan & PSV
const searchedAdjustmentItems = createSelector(
  selectStockIssueState,
  state => state.searchedAdjustmentItems
);

const selectSearchedAdjustmentItems = createSelector(
  searchedAdjustmentItems,
  otherIssueCreateItemSelector.selectAll
);
const adjustmentItemsInCarts = createSelector(
  selectStockIssueState,
  state => state.adjustmentItemsInCarts
);
const selectAdjustmentItemsInCart = createSelector(
  adjustmentItemsInCarts,
  otherIssueCreateItemSelector.selectAll
);
const pendingIssuesADJList = createSelector(
  selectStockIssueState,
  state => state.otherIssueADJList
);

const selectPendingIssuesADJList = createSelector(
  pendingIssuesADJList,
  otheIssueSelector.selectAll
);
const pendingIssuesLossList = createSelector(
  selectStockIssueState,
  state => state.otherIssueLossList
);

const selectPendingIssuesLossList = createSelector(
  pendingIssuesLossList,
  otheIssueSelector.selectAll
);
const pendingIssuesPSVList = createSelector(
  selectStockIssueState,
  state => state.otherIssuePSVList
);

const selectPendingIssuesPSVList = createSelector(
  pendingIssuesPSVList,
  otheIssueSelector.selectAll
);
const selectcreateStockRequestAdjustmentResponse = createSelector(
  selectStockIssueState,
  state => state.createStockRequestAdjustmentResponse
);

const adjustmentItemsInCartsSearch = createSelector(
  selectStockIssueState,
  state => state.adjustmentItemsInCartsSearch
);

const selectAdjustmentItemsInCartsSearch = createSelector(
  adjustmentItemsInCartsSearch,
  otherIssueCreateItemSelector.selectAll
);

const selectIsSearchingAdjustment = createSelector(
  selectStockIssueState,
  state => state.isSearchingAdjustment
);
const selectHasSearchedItemAdjustment = createSelector(
  selectStockIssueState,
  state => state.hasSearchedItemAdjustment
);
const selectIsLoadingAdjustment = createSelector(
  selectStockIssueState,
  state => state.isLoadingAdjustment
);
const selectHasSearchItemInCartSearch = createSelector(
  selectStockIssueState,
  state => state.hasSearchItemInCartSearch
);
//psv
const searchedPSVtItems = createSelector(
  selectStockIssueState,
  state => state.searchedPSVItems
);

const selectSearchedPSVItems = createSelector(
  searchedPSVtItems,
  otherIssueCreateItemSelector.selectAll
);
const psvItemsInCarts = createSelector(
  selectStockIssueState,
  state => state.psvItemsInCarts
);
const selectPSVItemsInCart = createSelector(
  psvItemsInCarts,
  otherIssueCreateItemSelector.selectAll
);

const selectcreateStockRequestPSVResponse = createSelector(
  selectStockIssueState,
  state => state.createStockRequestPSVResponse
);

const psvItemsInCartsSearch = createSelector(
  selectStockIssueState,
  state => state.psvItemsInCartsSearch
);

const selectPSVItemsInCartsSearch = createSelector(
  psvItemsInCartsSearch,
  otherIssueCreateItemSelector.selectAll
);
const selectError = createSelector(
  selectStockIssueState,
  state => state.error
);

const selectIsSearchingPSV = createSelector(
  selectStockIssueState,
  state => state.isSearchingPSV
);
const selectHasSearchedItemPSV = createSelector(
  selectStockIssueState,
  state => state.hasSearchedItemPSV
);
const selectIsLoadingPSV = createSelector(
  selectStockIssueState,
  state => state.isLoadingPSV
);
const selectHasSearchItemInCartSearchPSV = createSelector(
  selectStockIssueState,
  state => state.hasSearchItemInCartSearchPSV
);
//FOC
const searchedFOCItems = createSelector(
  selectStockIssueState,
  state => state.searchedFOCItems
);

const selectSearchedFOCItems = createSelector(
  searchedFOCItems,
  otherIssueCreateItemSelector.selectAll
);
const focItemsInCarts = createSelector(
  selectStockIssueState,
  state => state.focItemsInCarts
);
const selectFOCItemsInCart = createSelector(
  focItemsInCarts,
  otherIssueCreateItemSelector.selectAll
);

const selectcreateStockRequestFOCResponse = createSelector(
  selectStockIssueState,
  state => state.createStockRequestFOCResponse
);

const focItemsInCartsSearch = createSelector(
  selectStockIssueState,
  state => state.focItemsInCartsSearch
);

const selectFOCItemsInCartsSearch = createSelector(
  focItemsInCartsSearch,
  otherIssueCreateItemSelector.selectAll
);

const pendingIssuesFOCList = createSelector(
  selectStockIssueState,
  state => state.otherIssueFOCList
);

const selectPendingIssuesFOCList = createSelector(
  pendingIssuesFOCList,
  otheIssueSelector.selectAll
);
const selectIsSearchingFOC = createSelector(
  selectStockIssueState,
  state => state.isSearchingFOC
);
const selectHasSearchedItemFOC = createSelector(
  selectStockIssueState,
  state => state.hasSearchedItemFOC
);
const selectIsLoadingFOC = createSelector(
  selectStockIssueState,
  state => state.isLoadingFOC
);
const selectHasSearchItemInCartSearchFOC = createSelector(
  selectStockIssueState,
  state => state.hasSearchItemInCartSearchFOC
);
const selectIsLoadingCancelStockRequestResponse = createSelector(
  selectStockIssueState,
  state => state.isLoadingCancelStockRequestResponse
);
const selectCancelOtherStockRequestResponse = createSelector(
  selectStockIssueState,
  state => state.cancelStockRequestResponse
);
const selectprintDataResponse = createSelector(
  selectStockIssueState,
  state => {
    return state.printDataResponse;
  }
);
const selectProductCategories = createSelector(
  selectStockIssueState,
  state => state.productCategories
);

const selectProductGroups = createSelector(
  selectStockIssueState,
  state => state.productGroups
);
const selectfilterDataAllProducts = createSelector(
  selectStockIssueState,
  state => state.filterDataAllProducts
);

const selectfilterDataSelectedProducts = createSelector(
  selectStockIssueState,
  state => state.filterDataSelectedProducts
);
const selectSortDataAllProducts = createSelector(
  selectStockIssueState,
  state => state.sortDataAllProducts
);

const selectSortDataSelectedProducts = createSelector(
  selectStockIssueState,
  state => state.sortDataSelectedProducts
);

const selectfilterDataOtherIssue = createSelector(
  selectStockIssueState,
  state => state.filterDataOtherIssue
);
const selectSortDataOtherIssue = createSelector(
  selectStockIssueState,
  state => state.sortDataotherIssue
);

//HISTORY
const otherIssueHistory = createSelector(
  selectStockIssueState,
  state => state.otherIssueHistory
);
const selectOtherIssueHistory = createSelector(
  otherIssueHistory,
  otheIssueSelector.selectAll
);
const selectIsLoadingOtherIssueHistory = createSelector(
  selectStockIssueState,
  state => state.isLoadingHistory
);
const selectOtherIssueHistoryCount = createSelector(
  selectStockIssueState,
  state => state.otherIssueHistoryCount
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
const selectHistoryItems = createSelector(
  historyItems,
  otherIssueHistoryItemSelector.selectAll
);
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
const selectAdvancedFilterData = createSelector(
  selectStockIssueState,
  state => state.advancedfilter
);

export const otherIssuesSelector = {
  selectHasError,
  selectIsLoading,
  selectOtherIssuesSTNCount,
  selectPendingIssuesList,
  selectIsLoadingOtherIssuesSTN,
  selectIsSearchingStocks,
  selectHasSearchStockResults,
  selectOtherIssueStockResults,
  selectOtherIssuesDropDown,
  selectPendingIssuesLoanList,
  selectOtherissuesSelectedDropDown,
  selectSelectedIssue,
  selectIssueItemsTotalCount,
  selectTotalIssueCount,
  selectNonVerifiedOtherIssueItems,
  selectIsLoadingSelectedIssueStock,
  selectIsSearchingOtherIssueItems,
  selectHasSearchedOtherIssueItems,
  createOtherIssueStockRequestResponse,
  selectAllOtherIssuesCreateItems,
  selectSelectedOtherIssuesCreateItems,
  selectAllOtherIssueCreateItemsTotalCount,
  selectSelectedOtherIssueCreateTotalCount,
  selectIsAllOtherIssueCreateItemsLoading,
  selectIsSelectedOtherIssueItemsLoading,
  selectIsOtherIssueCreateTotalCountLoaded,
  selectIsOtherIssueCreateTotalCountLoading,
  selectIsSearchingOtherIssueCreateItems,
  selectHasSearchedOtherIssueCreateItems,
  selectCreateStockRequestItemsResponse,
  selectRemoveOtherIssueStockRequestItemsResponse,
  selectupdateStockRequestResponse,
  selectCreateOtherStockIssueItemsResponse,
  selectConfirmOtherStockIssueResponse,
  selectisLoadingOtherIssueDetails,
  selectSearchedAdjustmentItems,
  selectAdjustmentItemsInCart,
  selectPendingIssuesADJList,
  selectcreateStockRequestAdjustmentResponse,
  selectIsSearchingAdjustment,
  selectPendingIssuesLossList,
  selectPendingIssuesPSVList,
  selectAdjustmentItemsInCartsSearch,
  selectHasSearchedItemAdjustment,
  selectIsLoadingAdjustment,
  selectHasSearchItemInCartSearch,
  //psv
  selectSearchedPSVItems,
  selectPSVItemsInCart,
  selectcreateStockRequestPSVResponse,
  selectPSVItemsInCartsSearch,
  selectIsSearchingPSV,
  selectHasSearchedItemPSV,
  selectIsLoadingPSV,
  selectHasSearchItemInCartSearchPSV,
  selectError,
  //FOC
  selectSearchedFOCItems,
  selectFOCItemsInCart,
  selectcreateStockRequestFOCResponse,
  selectFOCItemsInCartsSearch,
  selectPendingIssuesFOCList,
  selectIsSearchingFOC,
  selectHasSearchedItemFOC,
  selectIsLoadingFOC,
  selectHasSearchItemInCartSearchFOC,
  selectIsLoadingCancelStockRequestResponse,
  selectCancelOtherStockRequestResponse,
  selectprintDataResponse,
  selectProductCategories,
  selectProductGroups,
  selectfilterDataAllProducts,
  selectfilterDataSelectedProducts,
  selectSortDataAllProducts,
  selectSortDataSelectedProducts,
  selectfilterDataOtherIssue,
  selectSortDataOtherIssue,
  //  HISTORY
  selectOtherIssueHistory,
  selectIsLoadingOtherIssueHistory,
  selectOtherIssueHistoryCount,
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
  selectAdvancedFilterData
};
