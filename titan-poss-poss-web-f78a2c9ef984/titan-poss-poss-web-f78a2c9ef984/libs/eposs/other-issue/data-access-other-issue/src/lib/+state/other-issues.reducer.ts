import {
  OtherIssuesActionTypes,
  OtherIssuesActions
} from './other-issues.actions';
import {
  otherIssueAdapter,
  otherIssuesCreateItemAdapter,
  otherIssuesHistoryItemAdapter,
  otherIssuesItemAdapter
} from './other-issues.entity';
import { OtherIssuesState } from './other-issues.state';
import { OtherReceiptsIssuesEnum } from '@poss-web/shared/models';
import { createFeatureSelector } from '@ngrx/store';
import * as moment from 'moment';

export const otherIssueFeatureKey = 'otherIssue';

export const selectStockIssueState = createFeatureSelector<OtherIssuesState>(
  otherIssueFeatureKey
);
export const initialState: OtherIssuesState = {
  isLoading: false,
  pendingOtherIssuesSTNCount: 0,
  otherIssuesList: otherIssueAdapter.getInitialState(),
  otherIssueLoanList: otherIssueAdapter.getInitialState(),
  isLoadingOtherIssuesList: false,
  isLoadingOtherIssuesLoanList: false,
  isSearchingStocks: false,
  hasSearchStockResults: null,
  searchIssueStockResults: otherIssueAdapter.getInitialState(),
  otherIssuesDropdownValues: null,
  selectedDropDownForIssues: null,
  error: null,
  selectedIssue: null,
  isItemIssued: false,
  issueItemsTotalCount: 0,
  totalElementsOtherIssues: 0,
  nonVerifiedOtherIssuesItems: otherIssuesItemAdapter.getInitialState(),
  isLoadingOtherIssueSelectedStock: false,
  isSearchingOtherIssueItems: false,
  hasSearchedOtherssueIItems: false,
  createOtherStockIssueItemsResponse: {},
  isLoadingOtherIssueDetails: false,
  confirmOtherStockIssueResponse: {},

  //create page
  createOtherIssueStockRequestResponse: null,
  isCreateOtherIssueStockRequestPending: false,
  allOtherIssueCreateItems: otherIssuesCreateItemAdapter.getInitialState(),
  selectedOtherIssueCreateItems: otherIssuesCreateItemAdapter.getInitialState(),
  isallOtherIssueCreateItemsLoading: false,
  isselectedOtherIssueCreateItemsLoading: false,

  allOtherIssueCreateItemsTotalCount: 0,
  selectedOtherIssueCreateItemsTotalCount: 0,

  isOtherIssueCreateItemTotalCountLoaded: null,
  isOtherIssueItemTotalCountLoading: false,
  isSearchingOtherIssueCreateItems: false,
  hasSearchedOtherssueCreateItems: false,
  createOtherIssueStockRequestItemsResponse: {},
  isLoadingOtherIssueRequestItemsResponse: false,

  removeOtherIssueStockRequestItemsResponse: {},
  isLoadingOtherIssueStockRequestItemsResponse: false,
  updateStockRequestCreateItemResponse: {},
  isLoadingUpdateStockRequestCreateItemResponse: false,

  updateStockRequestResponse: {},
  isLoadingUpdateStockRequestResponse: false,

  //adjustment
  isSearchingAdjustment: false,
  hasSearchedItemAdjustment: false,
  searchedAdjustmentItems: otherIssuesItemAdapter.getInitialState(),
  searchCountAdjustment: null,
  adjustmentItemsInCarts: otherIssuesItemAdapter.getInitialState(),
  createStockRequestAdjustmentResponse: {},
  isLoadingAdjustment: false,
  adjustmentItemsInCartsSearch: otherIssuesItemAdapter.getInitialState(),
  hasSearchItemInCartSearch: false,
  otherIssueADJList: otherIssueAdapter.getInitialState(),
  isLoadingOtherIssuesADJList: false,

  otherIssueLossList: otherIssueAdapter.getInitialState(),
  isLoadingOtherIssuesLossList: false,

  otherIssuePSVList: otherIssueAdapter.getInitialState(),
  isLoadingOtherIssuesPSVList: false,
  // psv
  isSearchingPSV: false,
  hasSearchedItemPSV: false,
  searchedPSVItems: otherIssuesItemAdapter.getInitialState(),
  searchCountPSV: null,
  psvItemsInCarts: otherIssuesItemAdapter.getInitialState(),
  createStockRequestPSVResponse: {},
  isLoadingPSV: false,
  psvItemsInCartsSearch: otherIssuesItemAdapter.getInitialState(),
  hasSearchItemInCartSearchPSV: false,
  //FOC
  isSearchingFOC: false,
  hasSearchedItemFOC: false,
  searchedFOCItems: otherIssuesItemAdapter.getInitialState(),
  searchCountFOC: null,
  focItemsInCarts: otherIssuesItemAdapter.getInitialState(),
  createStockRequestFOCResponse: {},
  isLoadingFOC: false,
  focItemsInCartsSearch: otherIssuesItemAdapter.getInitialState(),
  hasSearchItemInCartSearchFOC: false,
  studdedProductGroups: [],
  otherIssueFOCList: otherIssueAdapter.getInitialState(),
  isLoadingOtherIssuesFOCList: false,

  isLoadingCancelStockRequestResponse: false,
  cancelStockRequestResponse: null,
  printDataResponse: null,

  productCategories: null,
  productGroups: null,
  filterDataAllProducts: {},
  filterDataSelectedProducts: {},
  sortDataAllProducts: [],
  sortDataSelectedProducts: [],

  filterDataOtherIssue: {},
  sortDataotherIssue: [],

  //HISTORY
  otherIssueHistory: otherIssueAdapter.getInitialState(),
  isLoadingHistory: false,
  otherIssueHistoryCount: 0,
  isLoadingHistoryCount: false,

  isLoadingSelectedHistory: false,
  hasSelectedHistory: false,
  selectedHistory: null,

  historyItemsCount: 0,
  historyItems: otherIssuesHistoryItemAdapter.getInitialState(),
  isLoadingHistoryItems: false,
  isHistoryItemsLoaded: false,

  historyItemsTotalCount: 0,
  isLoadingHistoryItemsTotalCount: false,
  isHistoryItemsTotalCountLoaded: false,

  advancedfilter: {
    docFromDate: null,
    docToDate: null,
    status: null,
    docNo: null,
    fiscalYear: null
  }
};

export function otherIssuesReducer(
  state: OtherIssuesState = initialState,
  action: OtherIssuesActions
): OtherIssuesState {
  //other issues Listing
  switch (action.type) {
    case OtherIssuesActionTypes.RESET_ISSUE_LIST_DATA:
      return {
        ...state,
        pendingOtherIssuesSTNCount: 0,
        otherIssuesDropdownValues: null,
        otherIssuesList: otherIssueAdapter.getInitialState(),
        otherIssueLoanList: otherIssueAdapter.getInitialState(),
        otherIssueADJList: otherIssueAdapter.getInitialState(),
        otherIssuePSVList: otherIssueAdapter.getInitialState(),
        otherIssueLossList: otherIssueAdapter.getInitialState(),
        otherIssueFOCList: otherIssueAdapter.getInitialState(),
        totalElementsOtherIssues: 0,
        selectedDropDownForIssues: OtherReceiptsIssuesEnum.EXHIBITION_TYPE,
        error: null
      };
    case OtherIssuesActionTypes.LOAD_ISSUES_STN_COUNT:
      return {
        ...state,
        error: null
      };

    case OtherIssuesActionTypes.LOAD_ISSUES_STN_COUNT_SUCCESS:
      return {
        ...state,
        pendingOtherIssuesSTNCount: action.payload.pendingOtherIssuesSTNCount,
        otherIssuesDropdownValues: action.payload.countData
      };

    case OtherIssuesActionTypes.LOAD_ISSUE_LIST:
      return {
        ...state,
        isLoadingOtherIssuesList: true,
        error: null
      };

    case OtherIssuesActionTypes.LOAD_ISSUE_LIST_SUCCESS:
      return {
        ...state,
        otherIssuesList: otherIssueAdapter.addMany(
          action.payload.issueData,
          state.otherIssuesList
        ),
        isLoadingOtherIssuesList: false,
        error: null,
        totalElementsOtherIssues: action.payload.totalElements
      };

    case OtherIssuesActionTypes.LOAD_ISSUE_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingOtherIssuesList: false
      };
    case OtherIssuesActionTypes.LOAD_ISSUE_LOAN_LIST:
      return {
        ...state,
        isLoadingOtherIssuesLoanList: true,
        error: null
      };

    case OtherIssuesActionTypes.LOAD_ISSUE_LOAN_LIST_SUCCESS:
      return {
        ...state,
        otherIssueLoanList: otherIssueAdapter.addMany(
          action.payload.issueData,
          state.otherIssueLoanList
        ),
        isLoadingOtherIssuesLoanList: false,
        totalElementsOtherIssues: action.payload.totalElements,
        error: null
      };

    case OtherIssuesActionTypes.LOAD_ISSUE_LOAN_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingOtherIssuesLoanList: false
      };

    case OtherIssuesActionTypes.SEARCH_PENDING_ISSUE:
      return {
        ...state,
        isSearchingStocks: true,
        hasSearchStockResults: null,
        searchIssueStockResults: otherIssueAdapter.removeAll(
          state.searchIssueStockResults
        ),
        error: null
      };

    case OtherIssuesActionTypes.SEARCH_PENDING_ISSUE_SUCCESS:
      return {
        ...state,
        searchIssueStockResults: otherIssueAdapter.setAll(
          action.payload,
          state.searchIssueStockResults
        ),
        isSearchingStocks: false,
        hasSearchStockResults: true
      };

    case OtherIssuesActionTypes.SEARCH_PENDING_ISSUE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isSearchingStocks: false,
        hasSearchStockResults: false
      };

    case OtherIssuesActionTypes.DROPDOWN_SELECTED_FOR_ISSUES:
      return {
        ...state,
        selectedDropDownForIssues: action.payload
      };
    case OtherIssuesActionTypes.LOAD_ISSUE_ADJ_LIST:
      return {
        ...state,
        isLoadingOtherIssuesADJList: true,
        error: null
      };

    case OtherIssuesActionTypes.LOAD_ISSUE_ADJ_LIST_SUCCESS:
      return {
        ...state,
        otherIssueADJList: otherIssueAdapter.addMany(
          action.payload.issueData,
          state.otherIssueADJList
        ),
        isLoadingOtherIssuesADJList: false,
        totalElementsOtherIssues: action.payload.totalElements,
        error: null
      };

    case OtherIssuesActionTypes.LOAD_ISSUE_ADJ_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingOtherIssuesADJList: false
      };
    case OtherIssuesActionTypes.LOAD_ISSUE_LOSS_LIST:
      return {
        ...state,
        isLoadingOtherIssuesLossList: true,
        error: null
      };

    case OtherIssuesActionTypes.LOAD_ISSUE_LOSS_LIST_SUCCESS:
      return {
        ...state,
        otherIssueLossList: otherIssueAdapter.addMany(
          action.payload.issueData,
          state.otherIssueLossList
        ),
        isLoadingOtherIssuesLossList: false,
        totalElementsOtherIssues: action.payload.totalElements,
        error: null
      };

    case OtherIssuesActionTypes.LOAD_ISSUE_LOSS_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingOtherIssuesLossList: false
      };
    case OtherIssuesActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        studdedProductGroups: action.payload
      };

    case OtherIssuesActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case OtherIssuesActionTypes.LOAD_ISSUE_PSV_LIST:
      return {
        ...state,
        isLoadingOtherIssuesPSVList: true,
        error: null
      };

    case OtherIssuesActionTypes.LOAD_ISSUE_PSV_LIST_SUCCESS:
      return {
        ...state,
        otherIssuePSVList: otherIssueAdapter.addMany(
          action.payload.issueData,
          state.otherIssuePSVList
        ),
        isLoadingOtherIssuesPSVList: false,
        totalElementsOtherIssues: action.payload.totalElements,
        error: null
      };

    case OtherIssuesActionTypes.LOAD_ISSUE_PSV_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingOtherIssuesPSVList: false
      };
    case OtherIssuesActionTypes.LOAD_ISSUE_FOC_LIST:
      return {
        ...state,
        isLoadingOtherIssuesFOCList: true,
        error: null
      };

    case OtherIssuesActionTypes.LOAD_ISSUE_FOC_LIST_SUCCESS:
      return {
        ...state,
        otherIssueFOCList: otherIssueAdapter.addMany(
          action.payload.issueData,
          state.otherIssueFOCList
        ),
        isLoadingOtherIssuesFOCList: false,
        totalElementsOtherIssues: action.payload.totalElements,
        error: null
      };

    case OtherIssuesActionTypes.LOAD_ISSUE_FOC_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingOtherIssuesFOCList: false
      };
    case OtherIssuesActionTypes.CLEAR_SEARCH_INVENTORY_FOC:
      return {
        ...state,
        isSearchingFOC: false,
        hasSearchedItemFOC: false,
        searchedFOCItems: otherIssuesCreateItemAdapter.getInitialState(),
        searchCountFOC: null
      };
  }

  // other issue confirm issue
  switch (action.type) {
    case OtherIssuesActionTypes.LOAD_SELECTED_ISSUE:
      return {
        ...state,
        isLoadingOtherIssueSelectedStock: true,
        selectedIssue: null,
        hasError: null,
        isItemIssued: null
      };
    case OtherIssuesActionTypes.LOAD_SELECTED_ISSUE_SUCCESS:
      return {
        ...state,
        selectedIssue: action.payload,
        isLoadingOtherIssueSelectedStock: false
      };
    case OtherIssuesActionTypes.LOAD_SELECTED_ISSUE_FAILURE:
      return {
        ...state,
        isLoadingOtherIssueSelectedStock: false,
        error: action.payload
      };

    case OtherIssuesActionTypes.LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS_SUCCESS:
      return {
        ...state,
        nonVerifiedOtherIssuesItems: otherIssuesItemAdapter.setAll(
          action.payload,
          state.nonVerifiedOtherIssuesItems
        ),
        isLoadingOtherIssueDetails: false
      };

    case OtherIssuesActionTypes.CLEAR_ITEMS:
      return {
        ...state,
        nonVerifiedOtherIssuesItems: otherIssuesItemAdapter.removeAll(
          state.nonVerifiedOtherIssuesItems
        ),
        allOtherIssueCreateItems: otherIssuesItemAdapter.removeAll(
          state.allOtherIssueCreateItems
        ),
        selectedOtherIssueCreateItems: otherIssuesItemAdapter.removeAll(
          state.selectedOtherIssueCreateItems
        )
      };

    case OtherIssuesActionTypes.SEARCH_CLEAR_ISSUE:
      return {
        ...state,
        searchIssueStockResults: otherIssueAdapter.removeAll(
          state.searchIssueStockResults
        ),
        error: null,
        isSearchingStocks: false,
        hasSearchStockResults: null
      };
    case OtherIssuesActionTypes.CREATE_OTHER_STOCK_ISSUE_ITEMS:
      return {
        ...state,
        isLoadingOtherIssueDetails: true,
        error: null,
        createOtherStockIssueItemsResponse: {}
      };
    case OtherIssuesActionTypes.CREATE_OTHER_STOCK_ISSUE_ITEMS_SUCCESS:
      return {
        ...state,
        createOtherStockIssueItemsResponse: action.payload,
        isLoadingOtherIssueDetails: false,
        error: null
      };
    case OtherIssuesActionTypes.REMOVE_INITIAL_LOAD_OTHER_ISSUE:
      return {
        ...state,
        nonVerifiedOtherIssuesItems: otherIssuesItemAdapter.getInitialState()
      };
    case OtherIssuesActionTypes.CONFIRM_OTHER_STOCK_ISSUE:
    case OtherIssuesActionTypes.LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS:
      return {
        ...state,
        isLoadingOtherIssueDetails: true,
        error: null
      };
    case OtherIssuesActionTypes.CONFIRM_OTHER_STOCK_ISSUE_SUCCESS:
      return {
        ...state,
        confirmOtherStockIssueResponse: action.payload,
        isLoadingOtherIssueDetails: false,
        error: null
      };
    case OtherIssuesActionTypes.CONFIRM_OTHER_STOCK_ISSUE_FAILURE:
    case OtherIssuesActionTypes.LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS_FAILURE:
    case OtherIssuesActionTypes.CREATE_OTHER_STOCK_ISSUE_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingOtherIssueDetails: false
      };
    case OtherIssuesActionTypes.RESET_CONFIRM_OTHER_STOCK_ISSUE_RESPONSE:
      return {
        ...state,
        confirmOtherStockIssueResponse: {},
        printDataResponse: null,
        filterDataOtherIssue: {},
        sortDataotherIssue: [],
        error: null
      };
    case OtherIssuesActionTypes.CANCEL_STOCK_REQUEST:
      return {
        ...state,
        isLoadingCancelStockRequestResponse: true,
        hasError: null
      };
    case OtherIssuesActionTypes.CANCEL_STOCK_REQUEST_SUCCESS:
      return {
        ...state,
        cancelStockRequestResponse: action.payload,
        isLoadingCancelStockRequestResponse: false,
        hasError: null
      };
    case OtherIssuesActionTypes.CANCEL_STOCK_REQUEST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingCancelStockRequestResponse: false
      };

    case OtherIssuesActionTypes.PRINT_OTHER_ISSUES:
      return {
        ...state,
        printDataResponse: null,
        error: null
      };
    case OtherIssuesActionTypes.PRINT_OTHER_ISSUES_SUCCESS:
      return {
        ...state,
        printDataResponse: action.payload,
        error: null
      };

    case OtherIssuesActionTypes.PRINT_OTHER_ISSUES_FAILURE:
    case OtherIssuesActionTypes.LOAD_ISSUES_STN_COUNT_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case OtherIssuesActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS:
      return {
        ...state,
        productCategories: action.payload,
        isLoading: false,
        error: null
      };
    case OtherIssuesActionTypes.LOAD_PROUDCT_GROUPS:
    case OtherIssuesActionTypes.LOAD_PRODUCT_CATEGORIES:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case OtherIssuesActionTypes.LOAD_PROUDCT_GROUPS_SUCCESS:
      return {
        ...state,
        productGroups: action.payload,
        isLoading: false,
        error: null
      };
    case OtherIssuesActionTypes.LOAD_PROUDCT_GROUPS_FAILURE:
    case OtherIssuesActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
  }
  // other issues request creation
  switch (action.type) {
    case OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST:
      return {
        ...state,
        createOtherIssueStockRequestResponse: null,
        isCreateOtherIssueStockRequestPending: true
      };

    case OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST_SUCCESS:
      return {
        ...state,
        createOtherIssueStockRequestResponse: action.payload,
        isCreateOtherIssueStockRequestPending: false
      };

    case OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isCreateOtherIssueStockRequestPending: false
      };

    case OtherIssuesActionTypes.LOAD_ALL_OTHER_ISSUE_CREATE_ITEMS:
      return {
        ...state,
        isallOtherIssueCreateItemsLoading: true,
        error: null
      };

    case OtherIssuesActionTypes.LOAD_ALL_OTHER_ISSUE_CREATE_ITEMS_SUCCESS:
      return {
        ...state,
        allOtherIssueCreateItems: otherIssuesCreateItemAdapter.setAll(
          action.payload,
          state.allOtherIssueCreateItems
        ),
        isallOtherIssueCreateItemsLoading: false
      };

    case OtherIssuesActionTypes.LOAD_ALL_OTHER_ISSUE_CREATE_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isallOtherIssueCreateItemsLoading: false
      };

    case OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_ITEMS:
      return {
        ...state,
        isselectedOtherIssueCreateItemsLoading: true,
        error: null
      };

    case OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_ITEMS_SUCCESS:
      return {
        ...state,
        selectedOtherIssueCreateItems: otherIssuesCreateItemAdapter.setAll(
          action.payload,
          state.selectedOtherIssueCreateItems
        ),
        isselectedOtherIssueCreateItemsLoading: false
      };

    case OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isselectedOtherIssueCreateItemsLoading: false
      };

    case OtherIssuesActionTypes.LOAD_ISSUE_ITEMS_CREATE_COUNT:
      return {
        ...state,
        isOtherIssueCreateItemTotalCountLoaded: null,
        isOtherIssueItemTotalCountLoading: true,
        allOtherIssueCreateItemsTotalCount: 0,
        selectedOtherIssueCreateItemsTotalCount: 0,
        hasError: null
      };
    case OtherIssuesActionTypes.LOAD_ISSUE_ITEMS_CREATE_COUNT_SUCCESS:
      return {
        ...state,
        allOtherIssueCreateItemsTotalCount:
          action.payload.allOtherIssueCreateItemsTotalCount,

        isOtherIssueCreateItemTotalCountLoaded: true,

        selectedOtherIssueCreateItemsTotalCount:
          action.payload.selectedOtherIssueCreateItemsTotalCount,

        isOtherIssueItemTotalCountLoading: false
      };

    case OtherIssuesActionTypes.LOAD_ISSUE_ITEMS_CREATE_COUNT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isOtherIssueCreateItemTotalCountLoaded: false,
        isOtherIssueItemTotalCountLoading: false
      };

    case OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST_ITEMS:
      return {
        ...state,
        isLoadingOtherIssueRequestItemsResponse: true,
        error: null,
        createOtherIssueStockRequestItemsResponse: {}
      };
    case OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST_ITEMS_SUCCESS:
      return {
        ...state,
        createOtherIssueStockRequestItemsResponse: action.payload,
        isLoadingOtherIssueRequestItemsResponse: false,
        error: null
      };
    case OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingOtherIssueRequestItemsResponse: false
      };

    case OtherIssuesActionTypes.REMOVE_OTHER_ISSUE_STOCK_REQUEST_ITEMS:
      return {
        ...state,
        isLoadingOtherIssueStockRequestItemsResponse: true,
        error: null,
        removeOtherIssueStockRequestItemsResponse: {}
      };
    case OtherIssuesActionTypes.REMOVE_OTHER_ISSUE_STOCK_REQUEST_ITEMS_SUCCESS:
      return {
        ...state,
        removeOtherIssueStockRequestItemsResponse: action.payload,
        isLoadingOtherIssueStockRequestItemsResponse: false,
        error: null
      };
    case OtherIssuesActionTypes.REMOVE_OTHER_ISSUE_STOCK_REQUEST_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingOtherIssueStockRequestItemsResponse: false
      };

    case OtherIssuesActionTypes.UPDATE_STOCK_REQUEST_CREATE_ITEM:
      return {
        ...state,
        isLoadingUpdateStockRequestCreateItemResponse: true,
        hasError: null
      };
    case OtherIssuesActionTypes.UPDATE_STOCK_REQUEST_CREATE_ITEM_SUCCESS:
      return {
        ...state,
        updateStockRequestCreateItemResponse: action.payload,
        isLoadingUpdateStockRequestCreateItemResponse: false,
        hasError: null
      };
    case OtherIssuesActionTypes.UPDATE_STOCK_REQUEST_CREATE_ITEM_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingUpdateStockRequestCreateItemResponse: false
      };

    case OtherIssuesActionTypes.RESET_OTHER_ISSUE_CREATE_LIST_ITEMS:
      return {
        ...state,
        allOtherIssueCreateItems: otherIssuesCreateItemAdapter.removeAll(
          state.allOtherIssueCreateItems
        ),
        selectedOtherIssueCreateItems: otherIssuesCreateItemAdapter.removeAll(
          state.selectedOtherIssueCreateItems
        ),
        error: null
      };
    case OtherIssuesActionTypes.RESET_OTHER_ISSUE_CREATE_RESPONSE:
      return {
        ...state,
        createOtherIssueStockRequestItemsResponse: {},
        removeOtherIssueStockRequestItemsResponse: {},
        updateStockRequestResponse: {},
        allOtherIssueCreateItemsTotalCount: 0,
        selectedOtherIssueCreateItemsTotalCount: 0,
        filterDataAllProducts: {},
        filterDataSelectedProducts: {},
        sortDataAllProducts: [],
        sortDataSelectedProducts: [],
        error: null
      };

    case OtherIssuesActionTypes.UPDATE_STOCK_REQUEST:
      return {
        ...state,
        isLoadingUpdateStockRequestResponse: true,
        error: null
      };
    case OtherIssuesActionTypes.UPDATE_STOCK_REQUEST_SUCCESS:
      return {
        ...state,
        updateStockRequestResponse: action.payload,
        isLoadingUpdateStockRequestResponse: false,
        error: null
      };
    case OtherIssuesActionTypes.UPDATE_STOCK_REQUEST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingUpdateStockRequestResponse: false
      };
  }
  // other issues request creation filter and sort
  switch (action.type) {
    case OtherIssuesActionTypes.SET_FILTER_DATA_ALL_PRODUCTS:
      return {
        ...state,
        filterDataAllProducts: action.payload
      };
    case OtherIssuesActionTypes.SET_FILTER_DATA_SELECTED_PRODUCTS:
      return {
        ...state,
        filterDataSelectedProducts: action.payload
      };
    case OtherIssuesActionTypes.SET_SORT_DATA_ALL_PRODUCTS:
      return {
        ...state,
        sortDataAllProducts: action.payload
      };
    case OtherIssuesActionTypes.SET_SORT_DATA_SELECTED_PRODUCTS:
      return {
        ...state,
        sortDataSelectedProducts: action.payload
      };
    case OtherIssuesActionTypes.SET_FILTER_DATA_OTHER_ISSUE:
      return {
        ...state,
        filterDataOtherIssue: action.payload
      };
    case OtherIssuesActionTypes.SET_SORT_DATA_OTHER_ISSUE:
      return {
        ...state,
        sortDataotherIssue: action.payload
      };
  }

  // other issues adjsutment
  switch (action.type) {
    case OtherIssuesActionTypes.ADJUSTMENT_SEARCH:
      return {
        ...state,
        isSearchingAdjustment: true,
        hasSearchedItemAdjustment: false,
        hasError: null
      };
    case OtherIssuesActionTypes.ADJUSTMENT_SEARCH_SUCCESS:
      return {
        ...state,
        isSearchingAdjustment: false,
        hasSearchedItemAdjustment: true,
        searchedAdjustmentItems: otherIssuesItemAdapter.setAll(
          action.payload.items,
          state.searchedAdjustmentItems
        ),
        searchCountAdjustment: action.payload.count
      };

    case OtherIssuesActionTypes.ADJUSTMENT_SEARCH_FAILURE:
      return {
        ...state,
        isSearchingAdjustment: false,
        hasSearchedItemAdjustment: false,
        error: action.payload
      };
    case OtherIssuesActionTypes.ADD_ADJUSTMENT_ITEMS_TO_CART:
      return {
        ...state,
        searchedAdjustmentItems: otherIssuesItemAdapter.removeAll(
          state.searchedAdjustmentItems
        ),
        adjustmentItemsInCarts: otherIssuesItemAdapter.addMany(
          action.payload,
          state.adjustmentItemsInCarts
        )
      };
    case OtherIssuesActionTypes.CREATE_STOCK_REQUEST_ADJUSTMENT:
      return {
        ...state,
        isLoadingAdjustment: true,
        error: null
      };
    case OtherIssuesActionTypes.CREATE_STOCK_REQUEST_ADJUSTMENT_SUCCESS:
      return {
        ...state,
        createStockRequestAdjustmentResponse: action.payload,
        isLoadingAdjustment: false,
        error: null
      };
    case OtherIssuesActionTypes.CREATE_STOCK_REQUEST_ADJUSTMENT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingAdjustment: false
      };
    case OtherIssuesActionTypes.UPDATE_CART_ITEM_ADJUSTMENT:
      return {
        ...state,
        adjustmentItemsInCarts: otherIssuesItemAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              measuredQuantity: action.payload.quantity,
              measuredWeight: action.payload.weight
            }
          },
          state.adjustmentItemsInCarts
        )
      };
    case OtherIssuesActionTypes.REMOVE_CART_ITEM_ADJUSTMENT:
      return {
        ...state,
        adjustmentItemsInCarts: otherIssuesItemAdapter.removeMany(
          action.payload.ids,
          state.adjustmentItemsInCarts
        ),
        adjustmentItemsInCartsSearch: otherIssuesItemAdapter.removeMany(
          action.payload.ids,
          state.adjustmentItemsInCartsSearch
        ),
        hasSearchItemInCartSearch: false
      };
    case OtherIssuesActionTypes.SEARCH_CART_ITEM_ADJUSTMENT:
      return {
        ...state,
        adjustmentItemsInCartsSearch: state.adjustmentItemsInCarts,
        hasSearchItemInCartSearch: true
      };
    case OtherIssuesActionTypes.RESET_ADJUSTMENT_ISSUE_DATA:
      return {
        ...state,
        adjustmentItemsInCarts: otherIssuesCreateItemAdapter.removeAll(
          state.adjustmentItemsInCarts
        ),
        adjustmentItemsInCartsSearch: otherIssuesCreateItemAdapter.getInitialState(),
        createStockRequestAdjustmentResponse: {},
        error: null,
        isSearchingAdjustment: false,
        hasSearchedItemAdjustment: false,
        hasSearchItemInCartSearch: false,
        searchedAdjustmentItems: otherIssuesCreateItemAdapter.getInitialState()
      };
    case OtherIssuesActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT:
      return {
        ...state,
        adjustmentItemsInCartsSearch: otherIssuesCreateItemAdapter.getInitialState(),
        hasSearchItemInCartSearch: false
      };
    case OtherIssuesActionTypes.CLEAR_SEARCH_INVENTORY_ADJUSTMENT:
      return {
        ...state,
        isSearchingAdjustment: false,
        hasSearchedItemAdjustment: false,
        searchedAdjustmentItems: otherIssuesCreateItemAdapter.getInitialState(),
        searchCountAdjustment: null
      };
  }

  // other issues psv
  switch (action.type) {
    case OtherIssuesActionTypes.PSV_SEARCH:
      return {
        ...state,
        isSearchingPSV: true,
        hasSearchedItemPSV: false,
        hasError: null
      };
    case OtherIssuesActionTypes.PSV_SEARCH_SUCCESS:
      return {
        ...state,
        isSearchingPSV: false,
        hasSearchedItemPSV: true,
        searchedPSVItems: otherIssuesItemAdapter.setAll(
          action.payload.items,
          state.searchedPSVItems
        ),
        searchCountPSV: action.payload.count
      };

    case OtherIssuesActionTypes.PSV_SEARCH_FAILURE:
      return {
        ...state,
        isSearchingPSV: false,
        hasSearchedItemPSV: false,
        error: action.payload
      };
    case OtherIssuesActionTypes.ADD_PSV_ITEMS_TO_CART:
      return {
        ...state,
        searchedPSVItems: otherIssuesItemAdapter.removeAll(
          state.searchedPSVItems
        ),
        psvItemsInCarts: otherIssuesItemAdapter.addMany(
          action.payload,
          state.psvItemsInCarts
        )
      };
    case OtherIssuesActionTypes.CREATE_STOCK_REQUEST_PSV:
      return {
        ...state,
        isLoadingPSV: true,
        error: null
      };
    case OtherIssuesActionTypes.CREATE_STOCK_REQUEST_PSV_SUCCESS:
      return {
        ...state,
        createStockRequestPSVResponse: action.payload,
        isLoadingPSV: false,
        error: null
      };
    case OtherIssuesActionTypes.CREATE_STOCK_REQUEST_PSV_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingPSV: false
      };

    case OtherIssuesActionTypes.UPDATE_CART_ITEM_PSV:
      return {
        ...state,
        psvItemsInCarts: otherIssuesItemAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              measuredQuantity: action.payload.quantity,
              measuredWeight: action.payload.weight
            }
          },
          state.psvItemsInCarts
        )
      };
    case OtherIssuesActionTypes.REMOVE_CART_ITEM_PSV:
      return {
        ...state,
        psvItemsInCarts: otherIssuesItemAdapter.removeMany(
          action.payload.ids,
          state.psvItemsInCarts
        ),
        psvItemsInCartsSearch: otherIssuesItemAdapter.removeMany(
          action.payload.ids,
          state.psvItemsInCartsSearch
        )
      };
    case OtherIssuesActionTypes.SEARCH_CART_ITEM_PSV:
      return {
        ...state,
        psvItemsInCartsSearch: state.psvItemsInCarts,
        hasSearchItemInCartSearchPSV: true
      };

    case OtherIssuesActionTypes.RESET_PSV_ISSUE_DATA:
      return {
        ...state,
        psvItemsInCarts: otherIssuesCreateItemAdapter.removeAll(
          state.psvItemsInCarts
        ),
        psvItemsInCartsSearch: otherIssuesCreateItemAdapter.getInitialState(),
        createStockRequestPSVResponse: {},
        error: null,
        hasSearchItemInCartSearchPSV: false,
        isSearchingPSV: false,
        hasSearchedItemPSV: false,
        searchedPSVItems: otherIssuesItemAdapter.getInitialState()
      };
    case OtherIssuesActionTypes.CLEAR_SEARCH_CART_ITEM_PSV:
      return {
        ...state,
        psvItemsInCartsSearch: otherIssuesCreateItemAdapter.getInitialState(),
        hasSearchItemInCartSearchPSV: false
      };
    case OtherIssuesActionTypes.CLEAR_SEARCH_INVENTORY_PSV:
      return {
        ...state,
        isSearchingPSV: false,
        hasSearchedItemPSV: false,
        searchedPSVItems: otherIssuesCreateItemAdapter.getInitialState(),
        searchCountPSV: null
      };
  }
  //other issue foc
  switch (action.type) {
    case OtherIssuesActionTypes.FOC_SEARCH:
      return {
        ...state,
        isSearchingFOC: true,
        hasSearchedItemFOC: false,
        hasError: null
      };
    case OtherIssuesActionTypes.FOC_SEARCH_SUCCESS:
      return {
        ...state,
        isSearchingFOC: false,
        hasSearchedItemFOC: true,
        searchedFOCItems: otherIssuesItemAdapter.setAll(
          action.payload.items,
          state.searchedFOCItems
        ),
        searchCountFOC: action.payload.count
      };

    case OtherIssuesActionTypes.FOC_SEARCH_FAILURE:
      return {
        ...state,
        isSearchingFOC: false,
        hasSearchedItemFOC: false,
        error: action.payload
      };
    case OtherIssuesActionTypes.ADD_FOC_ITEMS_TO_CART:
      return {
        ...state,
        searchedFOCItems: otherIssuesItemAdapter.removeAll(
          state.searchedFOCItems
        ),
        focItemsInCarts: otherIssuesItemAdapter.addMany(
          action.payload,
          state.focItemsInCarts
        )
      };
    case OtherIssuesActionTypes.CREATE_STOCK_REQUEST_FOC:
      return {
        ...state,
        isLoadingFOC: true,
        error: null
      };
    case OtherIssuesActionTypes.CREATE_STOCK_REQUEST_FOC_SUCCESS:
      return {
        ...state,
        createStockRequestFOCResponse: action.payload,
        isLoadingFOC: false,
        error: null
      };
    case OtherIssuesActionTypes.CREATE_STOCK_REQUEST_FOC_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingFOC: false
      };

    case OtherIssuesActionTypes.UPDATE_CART_ITEM_FOC:
      return {
        ...state,
        focItemsInCarts: otherIssuesItemAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              measuredQuantity: action.payload.quantity,
              measuredWeight: action.payload.weight
            }
          },
          state.focItemsInCarts
        )
      };
    case OtherIssuesActionTypes.REMOVE_CART_ITEM_FOC:
      return {
        ...state,
        focItemsInCarts: otherIssuesItemAdapter.removeMany(
          action.payload.ids,
          state.focItemsInCarts
        ),
        focItemsInCartsSearch: otherIssuesItemAdapter.removeMany(
          action.payload.ids,
          state.focItemsInCartsSearch
        ),
        hasSearchItemInCartSearchFOC: false
      };
    case OtherIssuesActionTypes.SEARCH_CART_ITEM_FOC:
      return {
        ...state,
        focItemsInCartsSearch: state.focItemsInCarts,
        hasSearchItemInCartSearchFOC: true
      };

    case OtherIssuesActionTypes.RESET_FOC_ISSUE_DATA:
      return {
        ...state,
        focItemsInCarts: otherIssuesCreateItemAdapter.removeAll(
          state.focItemsInCarts
        ),
        focItemsInCartsSearch: otherIssuesCreateItemAdapter.getInitialState(),
        createStockRequestFOCResponse: {},
        error: null,
        hasSearchItemInCartSearchFOC: false,
        searchedFOCItems: otherIssuesCreateItemAdapter.getInitialState(),
        isSearchingFOC: false,
        hasSearchedItemFOC: false
      };
    case OtherIssuesActionTypes.CLEAR_SEARCH_CART_ITEM_FOC:
      return {
        ...state,
        focItemsInCartsSearch: otherIssuesCreateItemAdapter.getInitialState(),
        hasSearchItemInCartSearchFOC: false
      };
  }
  // OTHER ISSUE HISTORY
  switch (action.type) {
    case OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY:
      return {
        ...state,
        isLoadingHistory: true,
        error: null
      };
    case OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_SUCCESS:
      return {
        ...state,
        otherIssueHistory: otherIssueAdapter.addMany(
          action.payload.issueData,
          state.otherIssueHistory
        ),
        otherIssueHistoryCount: action.payload.totalElements,
        isLoadingHistory: false
      };
    case OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingHistory: false
      };
    case OtherIssuesActionTypes.RESET_OTHER_ISSUE_HISTORY:
      return {
        ...state,
        otherIssueHistory: otherIssueAdapter.removeAll(state.otherIssueHistory)
      };
    case OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_HISTORY:
      return {
        ...state,
        isLoadingSelectedHistory: true,
        hasSelectedHistory: false,
        selectedHistory: null,
        historyItemsCount: 0,
        historyItems: otherIssuesHistoryItemAdapter.getInitialState(),
        isLoadingHistoryItems: false,
        isHistoryItemsLoaded: false,
        error: null
      };
    case OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_HISTORY_SUCCESS:
      return {
        ...state,
        selectedHistory: action.payload,
        isLoadingSelectedHistory: false,
        hasSelectedHistory: true
      };
    case OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_HISTORY_FAILURE:
      return {
        ...state,
        isLoadingSelectedHistory: false,
        hasSelectedHistory: true,
        error: action.payload
      };
    case OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS:
      return {
        ...state,
        historyItems: otherIssuesHistoryItemAdapter.removeAll(
          state.historyItems
        ),
        isLoadingHistoryItems: true,
        isHistoryItemsLoaded: false,
        error: null
      };
    case OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS_SUCCESS:
      return {
        ...state,
        historyItemsCount: action.payload.count,
        historyItems: otherIssuesHistoryItemAdapter.setAll(
          action.payload.items,
          state.historyItems
        ),
        isHistoryItemsLoaded: true,
        isLoadingHistoryItems: false
      };
    case OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS_FAILURE:
      return {
        ...state,
        isHistoryItemsLoaded: false,
        isLoadingHistoryItems: false,
        error: action.payload
      };
    case OtherIssuesActionTypes.CLEAR_OTHER_ISSUE_HISTORY_ITEMS:
      return {
        ...state,
        historyItems: otherIssuesHistoryItemAdapter.removeAll(
          state.historyItems
        )
      };
    case OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS_TOTAL_COUNT:
      return {
        ...state,
        isLoadingHistoryItemsTotalCount: true,
        error: null
      };
    case OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS_TOTAL_COUNT_SUCCESS:
      return {
        ...state,
        historyItemsTotalCount: action.payload,
        isLoadingHistoryItemsTotalCount: false,
        isHistoryItemsTotalCountLoaded: true
      };
    case OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS_TOTAL_COUNT_FAILURE:
      return {
        ...state,
        isLoadingHistoryItemsTotalCount: false,
        error: action.payload
      };
    case OtherIssuesActionTypes.SET_OTHER_RECEIPTS_ISSUE_FILTER_DATA:
      return {
        ...state,
        advancedfilter: action.payload
      };
    case OtherIssuesActionTypes.CLEAR_OTHER_RECEIPTS_ISSUE_FILTER_DATA:
      return {
        ...state,
        advancedfilter: {
          docFromDate: moment(action.payload).startOf('day').valueOf(),
          docToDate: moment(action.payload).endOf('day').valueOf(),
          status: null,
          docNo: null,
          fiscalYear: null
        }
      };
  }

  return state;
}
