import { createSelector } from '@ngrx/store';
import { selectStockIssueState } from './stock-issue.reducer';
import {
  issueItemSelector,
  requestStockTransferNoteSelector,
} from './stock-issue.entity';

export const pendingIssuetoFactorySTN = createSelector(
  selectStockIssueState,
  state => state.issueFactorySTN
);
const selectIssueToFactorySTN = createSelector(
  pendingIssuetoFactorySTN,
  requestStockTransferNoteSelector.selectAll
);

export const pendingIssuetoBoutiqueSTN = createSelector(
  selectStockIssueState,
  state => state.issueBoutiqueSTN
);
const selectIssueToBoutiqueSTN = createSelector(
  pendingIssuetoBoutiqueSTN,
  requestStockTransferNoteSelector.selectAll
);

export const pendingIssuetoMerchantSTN = createSelector(
  selectStockIssueState,
  state => state.issueMerchantSTN
);
const selectIssuetoMerchantSTN = createSelector(
  pendingIssuetoMerchantSTN,
  requestStockTransferNoteSelector.selectAll
);

const selectIsStockIssueListReset = createSelector(
  selectStockIssueState,
  state => state.isStockIssueListReset
);

const selectError = createSelector(selectStockIssueState, state => state.error);

export const searchIssueResults = createSelector(
  selectStockIssueState,
  state => state.searchIssueResults
);
const selectSearchIssueResult = createSelector(
  searchIssueResults,
  requestStockTransferNoteSelector.selectAll
);

const selectIsLoadingIssueFactorySTN = createSelector(
  selectStockIssueState,
  state => state.isLoadingIssueFactorySTN
);
const selectIsLoadingIssueBoutiqueSTN = createSelector(
  selectStockIssueState,
  state => state.isLoadingIssueBoutiqueSTN
);
const selectIsLoadingIssueMerchantSTN = createSelector(
  selectStockIssueState,
  state => state.isLoadingIssueMerchantSTN
);

const selectIsSearchingIssues = createSelector(
  selectStockIssueState,
  state => state.isSearchingIssues
);
const selectHasSearchIssueResults = createSelector(
  selectStockIssueState,
  state => state.hasSearchIssueResults
);

const selectSelectedIssue = createSelector(
  selectStockIssueState,
  state => state.selectedIssue
);
const selectIsLoadingSelectedIssue = createSelector(
  selectStockIssueState,
  state => state.isLoadingSelectedIssue
);
const selectHasSelectedIssue = createSelector(
  selectStockIssueState,
  state => state.hasSelectedIssue
);

export const approvedItems = createSelector(
  selectStockIssueState,
  state => state.approvedItems
);
const selectIsApprovedItemsLoading = createSelector(
  selectStockIssueState,
  state => state.isApprovedItemsLoading
);
export const selectedItems = createSelector(
  selectStockIssueState,
  state => state.selectedItems
);
const selectIsSelectedItemsLoading = createSelector(
  selectStockIssueState,
  state => state.isSelectedItemsLoading
);
const selectApprovedItems = createSelector(
  approvedItems,
  issueItemSelector.selectAll
);
const selectSelectedItems = createSelector(
  selectedItems,
  issueItemSelector.selectAll
);

const selectApprovedItemsTotalCount = createSelector(
  selectStockIssueState,
  state => state.approvedItemsTotalCount
);
const selectSelectedItemsTotalCount = createSelector(
  selectStockIssueState,
  state => state.selectedItemsTotalCount
);
const selectIsItemsTotalCountLoading = createSelector(
  selectStockIssueState,
  state => state.isItemsTotalCountLoading
);

const selectIsItemsTotalCountLoaded = createSelector(
  selectStockIssueState,
  state => state.isItemsTotalCountLoaded
);

// ///////////////////////////////////////////////////
export const issueItems = createSelector(
  selectStockIssueState,
  state => state.issueItems
);
const selectIssueItems = createSelector(
  issueItems,
  issueItemSelector.selectAll
);
const selectIsIssueItemsLoading = createSelector(
  selectStockIssueState,
  state => state.isIssueItemsLoading
);
const selectIssueItemsTotalCount = createSelector(
  selectStockIssueState,
  state => state.issueItemsTotalCount
);
const selectIssueItemsTotalCountLoaded = createSelector(
  selectStockIssueState,
  state => state.isItemsTotalCountLoaded
);

const selectConfirmIssue = createSelector(
  selectStockIssueState,
  state => state.confirmIssue
);
const selectConfirmIssueStatus = createSelector(
  selectStockIssueState,
  state => state.isItemIssued
);
const selectConfirmationSrcDocNo = createSelector(
  selectStockIssueState,
  state => state.confirmIssue.srcDocNo
);

export const searchedItems = createSelector(
  selectStockIssueState,
  state => state.searchedItems
);
const selectSearchedItems = createSelector(
  searchedItems,
  issueItemSelector.selectAll
);
const selectIsSearchingItems = createSelector(
  selectStockIssueState,
  state => state.isSearchingItems
);
const selectHasSearchedItems = createSelector(
  selectStockIssueState,
  state => state.hasSearchedItems
);

const selectIsItemUpdateStatus = createSelector(
  selectStockIssueState,
  state => state.isItemUpdated
);
const selectIsItemUpdating = createSelector(
  selectStockIssueState,
  state => state.isitemUpdating
);
const selectSearchedIssueItemsCount = createSelector(
  selectStockIssueState,
  state => state.searchedIssueItemsCount
);
const selectSearchedissueItemsCountLoaded = createSelector(
  selectStockIssueState,
  state => state.isSearchIssueItemsCountLoaded
);

const selectIsUpdatingAll = createSelector(
  selectStockIssueState,
  state => state.isUpdatingAllItems
);
const selectIsUpdatingAllSuccess = createSelector(
  selectStockIssueState,
  state => state.isUpdatingAllItemsSuccess
);

// REQUEST COUNT
const selectPendingBTQ_FAC_STNCount = createSelector(
  selectStockIssueState,
  state => state.pendingBTQ_FAC_STNCount
);

const selectPendingBTQ_BTQ_STNCount = createSelector(
  selectStockIssueState,
  state => state.pendingBTQ_BTQ_STNCount
);
const selectPendingBTQ_MER_STNCount = createSelector(
  selectStockIssueState,
  state => state.pendingBTQ_MER_STNCount
);

const selectIsLoadingIssueCount = createSelector(
  selectStockIssueState,
  state => state.isLoadingIssueCount
);
const selectCourierDetails = createSelector(
  selectStockIssueState,
  state => state.courierDetails
);
const selectIsLoadingCourierDetails = createSelector(
  selectStockIssueState,
  state => state.isLoadingCourierDetails
);
const selectHasCourierDetails = createSelector(
  selectStockIssueState,
  state => state.hasCourierDetails
);

const selectfilterDataApprovedProducts = createSelector(
  selectStockIssueState,
  state => state.filterDataAllProducts
);

const selectfilterDataSelectedProducts = createSelector(
  selectStockIssueState,
  state => state.filterDataSelectedProducts
);
const selectSortDataApprovedProducts = createSelector(
  selectStockIssueState,
  state => state.sortDataAllProducts
);

const selectSortDataSelectedProducts = createSelector(
  selectStockIssueState,
  state => state.sortDataSelectedProducts
);

const selectEmployeeCodes = createSelector(
  selectStockIssueState,
  state => state.employeeCodes
);

const selectEmployeeDetails = createSelector(
  selectStockIssueState,
  state => state.employeeDetails
);

const selectItemsCount = createSelector(
  selectStockIssueState,
  state => state.itemsCount
);

export const items = createSelector(
  selectStockIssueState,
  state => state.items
);

const selectIsItemsLoading = createSelector(
  selectStockIssueState,
  state => state.isItemsLoading
);

const selectIsItemsLoaded = createSelector(
  selectStockIssueState,
  state => state.isItemsLoaded
);

const selectItems = createSelector(items, issueItemSelector.selectAll);
const selectProductCategories = createSelector(
  selectStockIssueState,
  state => state.productCategories
);

const selectProductGroups = createSelector(
  selectStockIssueState,
  state => state.productGroups
);

const selectUpdateItemListStatusResponse = createSelector(
  selectStockIssueState,
  state => state.updateItemListStatusResponse
);

const selectTotalMeasuredWeight = createSelector(
  selectStockIssueState,
  state => state.totalMeasuredWeight
);
const selectTotalMeasuredValue = createSelector(
  selectStockIssueState,
  state => state.totalMeasuredValue
);
const selectIsLoading = createSelector(
  selectStockIssueState,
  state => state.isLoading
);

export const issueHistory = createSelector(
  selectStockIssueState,
  state => state.issueHistory
);
const selectIssueHistory = createSelector(
  issueHistory,
  requestStockTransferNoteSelector.selectAll
);
const selectIsLoadingIssueHistory = createSelector(
  selectStockIssueState,
  state => state.isLoadingHistory
);
const selectIssueHistoryCount = createSelector(
  selectStockIssueState,
  state => state.issueHistoryCount
);

const selectSelectedHistory = createSelector(
  selectStockIssueState,
  state => state.selectedHistory
);
const selectIsLoadingSelectedHistory = createSelector(
  selectStockIssueState,
  state => state.isLoadingSelectedHistory
);
const selectHasSelectedHistory = createSelector(
  selectStockIssueState,
  state => state.hasSelectedHistory
);
const selectIsLoadingHistoryItems = createSelector(
  selectStockIssueState,
  state => state.isLoadingHistoryItems
);
const selectIsHistoryItemsLoaded = createSelector(
  selectStockIssueState,
  state => state.isHistoryItemsLoaded
);

export const historyItems = createSelector(
  selectStockIssueState,
  state => state.historyItems
);
const selectHistoryItems = createSelector(
  historyItems,
  issueItemSelector.selectAll
);

const selectHistoryItemsTotalCount = createSelector(
  selectStockIssueState,
  state => state.historyItemsTotalCount
);

const selectIsLoadingHistoryItemsTotalCount = createSelector(
  selectStockIssueState,
  state => state.isLoadingHistoryItemsTotalCount
);

const selectHistoryCount = createSelector(
  selectStockIssueState,
  state => state.historyItemsCount
);
const selectAdvancedFilterData = createSelector(
  selectStockIssueState,
  state => state.advancedFilterData
);

// cancel STN

export const pendingIssuetoBoutiqueCancelSTN = createSelector(
  selectStockIssueState,
  state => state.issueCancelSTN
);
const selectIssuetoBoutiqueCancelSTN = createSelector(
  pendingIssuetoBoutiqueCancelSTN,
  requestStockTransferNoteSelector.selectAll
);
const selectTotalIssueCancelSTNCount = createSelector(
  selectStockIssueState,
  state => state.totalIssueCancelSTNCount
);
const selectIsLoadingIssueBoutiqueCancelSTN = createSelector(
  selectStockIssueState,
  state => state.isLoadingIssueCancelSTN
);
const selectPendingBTQ_BTQ_STNCancelCount = createSelector(
  selectStockIssueState,
  state => state.pendingBTQ_BTQ_STNCancelCount
);
export const cancelIssueItems = createSelector(
  selectStockIssueState,
  state => state.cancelIssueItems
);
const selectCancelIssueItems = createSelector(
  cancelIssueItems,
  issueItemSelector.selectAll
);

const selectCancelIssueItemsCount = createSelector(
  selectStockIssueState,
  state => state.cancelIssueItemsCount
);

const selectCancelIssueSTNDetails = createSelector(
  selectStockIssueState,
  state => state.cancelIssueSTNDetails
);

const selectCancelIssueSTNRes = createSelector(
  selectStockIssueState,
  state => state.cancelIssuesSTNRes
);

const selectRegenerateFileRes = createSelector(
  selectStockIssueState,
  state => state.regenerateFile
);

const selectIsFileLoading = createSelector(
  selectStockIssueState,
  state => state.isFileLoading
);

// Image
export const selectIsLoadingImage = createSelector(
  selectStockIssueState,
  state => state.isLoadingImage
);

export const stockIssueSelectors = {
  selectIssueToFactorySTN,
  selectIssueToBoutiqueSTN,
  selectIssuetoMerchantSTN,

  selectSearchIssueResult,
  selectHasSearchIssueResults,
  selectIsSearchingIssues,

  selectIsLoadingIssueFactorySTN,
  selectIsLoadingIssueBoutiqueSTN,
  selectIsLoadingIssueMerchantSTN,

  selectPendingBTQ_BTQ_STNCount,
  selectPendingBTQ_FAC_STNCount,
  selectPendingBTQ_MER_STNCount,
  selectIsLoadingIssueCount,

  selectSelectedIssue,
  selectIsLoadingSelectedIssue,
  selectHasSelectedIssue,

  selectIsStockIssueListReset,

  selectError,

  selectApprovedItems,
  selectIsApprovedItemsLoading,
  selectApprovedItemsTotalCount,

  selectSelectedItems,
  selectSelectedItemsTotalCount,
  selectIsSelectedItemsLoading,

  selectIssueItems,
  selectIsIssueItemsLoading,
  selectIssueItemsTotalCount,
  selectIssueItemsTotalCountLoaded,
  selectIsItemsTotalCountLoaded,
  selectIsItemsTotalCountLoading,

  selectIsSearchingItems,
  selectHasSearchedItems,
  selectSearchedItems,
  selectSearchedIssueItemsCount,
  selectSearchedissueItemsCountLoaded,

  selectIsItemUpdateStatus,
  selectIsItemUpdating,

  selectIsUpdatingAll,
  selectIsUpdatingAllSuccess,

  selectConfirmIssue,
  selectConfirmIssueStatus,
  selectConfirmationSrcDocNo,

  selectCourierDetails,
  selectHasCourierDetails,
  selectIsLoadingCourierDetails,

  selectEmployeeCodes,
  selectEmployeeDetails,

  selectProductCategories,
  selectProductGroups,

  selectfilterDataApprovedProducts,
  selectfilterDataSelectedProducts,
  selectSortDataApprovedProducts,
  selectSortDataSelectedProducts,

  selectItemsCount,
  selectIsItemsLoading,
  selectIsItemsLoaded,
  selectItems,

  selectUpdateItemListStatusResponse,

  selectTotalMeasuredWeight,
  selectTotalMeasuredValue,

  selectIssueHistory,
  selectIsLoadingIssueHistory,
  selectIssueHistoryCount,

  selectIsLoading,

  selectSelectedHistory,
  selectIsLoadingSelectedHistory,
  selectHasSelectedHistory,

  selectIsLoadingHistoryItems,
  selectIsHistoryItemsLoaded,
  // selectHistoryItemsCount,
  selectHistoryItems,

  selectHistoryItemsTotalCount,
  selectIsLoadingHistoryItemsTotalCount,

  selectHistoryCount,

  selectAdvancedFilterData,

  // cancel STN

  selectIssuetoBoutiqueCancelSTN,
  selectTotalIssueCancelSTNCount,
  selectPendingBTQ_BTQ_STNCancelCount,
  selectIsLoadingIssueBoutiqueCancelSTN,
  selectCancelIssueItems,
  selectCancelIssueSTNDetails,
  selectCancelIssueSTNRes,
  selectCancelIssueItemsCount,
  selectRegenerateFileRes,
  selectIsFileLoading,
  selectIsLoadingImage
};
