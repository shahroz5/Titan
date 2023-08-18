import {
  StockIssueActions,
  StockIssueActionTypes
} from './stock-issue.actions';
import { StockIssueState } from './stock-issue.state';
import {
  issueItemAdaptor,
  requestStockTransferNoteAdaptor
} from './stock-issue.entity';
import { createFeatureSelector } from '@ngrx/store';
import { RequestList } from '@poss-web/shared/models';
import * as moment from 'moment';

export const stockIssueFeatureKey = 'stockIssue';

export const selectStockIssueState = createFeatureSelector<StockIssueState>(
  stockIssueFeatureKey
);

export const initialState: StockIssueState = {
  issueFactorySTN: requestStockTransferNoteAdaptor.getInitialState(),
  issueBoutiqueSTN: requestStockTransferNoteAdaptor.getInitialState(),
  issueMerchantSTN: requestStockTransferNoteAdaptor.getInitialState(),

  isLoadingIssueFactorySTN: false,
  isLoadingIssueBoutiqueSTN: false,
  isLoadingIssueMerchantSTN: false,

  pendingBTQ_FAC_STNCount: 0,
  pendingBTQ_BTQ_STNCount: 0,
  pendingBTQ_MER_STNCount: 0,

  isLoadingIssueCount: false,

  searchIssueResults: requestStockTransferNoteAdaptor.getInitialState(),
  isSearchingIssues: false,
  hasSearchIssueResults: false,

  isStockIssueListReset: false,

  //DETAILS PAGE
  selectedIssue: null,
  isLoadingSelectedIssue: false,
  hasSelectedIssue: false,

  regenerateFile: null,
  isFileLoading: false,

  isItemsTotalCountLoading: false,
  isItemsTotalCountLoaded: null,

  issueItems: issueItemAdaptor.getInitialState(),
  isIssueItemsLoading: false,
  issueItemsTotalCount: 0,

  approvedItems: issueItemAdaptor.getInitialState(),
  isApprovedItemsLoading: false,
  approvedItemsTotalCount: 0,

  selectedItems: issueItemAdaptor.getInitialState(),
  isSelectedItemsLoading: false,
  selectedItemsTotalCount: 0,

  searchedItems: issueItemAdaptor.getInitialState(),
  isSearchingItems: false,
  hasSearchedItems: false,
  items: issueItemAdaptor.getInitialState(),
  isItemsLoading: false,
  isItemsLoaded: null,
  itemsCount: 0,

  isSearchIssueItemsCountLoaded: false,
  searchedIssueItemsCount: 0,

  isUpdatingAllItems: false,
  isUpdatingAllItemsSuccess: null,

  updateItemSuccess: null,
  isupdateItemLoading: false,
  isitemUpdating: false,
  isItemUpdated: false,

  confirmIssue: null,
  isItemIssued: null,

  courierDetails: null,
  isLoadingCourierDetails: false,
  hasCourierDetails: false,

  employeeCodes: [],
  employeeDetails: null,

  productCategories: [],
  productGroups: [],
  isLoading: false,

  filterDataAllProducts: {},
  filterDataSelectedProducts: {},
  sortDataAllProducts: [],
  sortDataSelectedProducts: [],

  error: null,

  updateItemListStatusResponse: {} as RequestList,

  totalMeasuredValue: 0,
  totalMeasuredWeight: 0,

  issueHistory: requestStockTransferNoteAdaptor.getInitialState(),
  isLoadingHistory: false,
  issueHistoryCount: 0,

  isLoadingSelectedHistory: false,
  hasSelectedHistory: false,
  selectedHistory: null,

  historyItemsTotalCount: 0,
  isLoadingHistoryItemsTotalCount: false,

  isLoadingHistoryItems: false,
  isHistoryItemsLoaded: false,
  historyItems: issueItemAdaptor.getInitialState(),
  historyItemsCount: 0,
  advancedFilterData: {
    docFromDate: moment().startOf('day').valueOf(),
    docToDate: moment().endOf('day').valueOf(),
    locationCode: null,
    fiscalYear: null,
    docNo: null
  },
  studdedProductGroups: [],

  issueCancelSTN: requestStockTransferNoteAdaptor.getInitialState(),
  totalIssueCancelSTNCount: 0,
  isLoadingIssueCancelSTN: false,
  pendingBTQ_BTQ_STNCancelCount: 0,
  cancelIssueItems: issueItemAdaptor.getInitialState(),
  cancelIssueItemsCount: 0,
  cancelIssuesSTNRes: null,
  cancelIssueSTNDetails: null,
  isLoadingImage: false
};
export function StockIssueReducer(
  state: StockIssueState = initialState,
  action: StockIssueActions
): StockIssueState {
  switch (action.type) {
    case StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_FACTORY_STN:
      return {
        ...state,
        isLoadingIssueFactorySTN: true,
        error: null
      };
    case StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_FACTORY_STN_SUCCESS:
      return {
        ...state,
        issueFactorySTN: requestStockTransferNoteAdaptor.addMany(
          action.payload.response,
          state.issueFactorySTN
        ),
        isLoadingIssueFactorySTN: false
      };
    case StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_FACTORY_STN_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingIssueFactorySTN: false
      };

    case StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_BOUTIQUE_STN:
      return {
        ...state,
        isLoadingIssueBoutiqueSTN: true,
        error: null
      };
    case StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_BOUTIQUE_STN_SUCCESS:
      return {
        ...state,
        issueBoutiqueSTN: requestStockTransferNoteAdaptor.addMany(
          action.payload.response,
          state.issueBoutiqueSTN
        ),
        isLoadingIssueBoutiqueSTN: false
      };
    case StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_BOUTIQUE_STN_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingIssueBoutiqueSTN: false
      };

    case StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_MERCHANT_STN:
      return {
        ...state,
        isLoadingIssueMerchantSTN: true,
        error: null
      };
    case StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_MERCHANT_STN_SUCCESS:
      return {
        ...state,
        issueMerchantSTN: requestStockTransferNoteAdaptor.addMany(
          action.payload.response,
          state.issueMerchantSTN
        ),
        isLoadingIssueMerchantSTN: false
      };
    case StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_MERCHANT_STN_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingIssueMerchantSTN: false
      };

    case StockIssueActionTypes.SEARCH_PENDING_ISSUES:
      return {
        ...state,
        isSearchingIssues: true,
        hasSearchIssueResults: false,
        searchIssueResults: requestStockTransferNoteAdaptor.removeAll(
          state.searchIssueResults
        ),
        error: null
      };
    case StockIssueActionTypes.SEARCH_PENDING_ISSUES_SUCCESS:
      return {
        ...state,
        isSearchingIssues: false,
        hasSearchIssueResults: true,
        searchIssueResults: requestStockTransferNoteAdaptor.setAll(
          action.payload,
          state.searchIssueResults
        )
      };
    case StockIssueActionTypes.SEARCH_PENDING_ISSUES_FAILURE:
      return {
        ...state,
        isSearchingIssues: false,
        hasSearchIssueResults: false,
        error: action.payload
      };

    case StockIssueActionTypes.RESET_STOCK_ISSUE_LIST:
      return {
        ...state,
        issueBoutiqueSTN: requestStockTransferNoteAdaptor.getInitialState(),
        issueFactorySTN: requestStockTransferNoteAdaptor.getInitialState(),
        issueMerchantSTN: requestStockTransferNoteAdaptor.getInitialState(),
        issueCancelSTN: requestStockTransferNoteAdaptor.getInitialState(),
        // TODO make as clear search results
        // searchIssueResult: requestStockTransferNoteAdaptor.getInitialState(),
        isStockIssueListReset: true,
        cancelIssueSTNDetails: null,
        error: null
      };
    case StockIssueActionTypes.SEARCH_CLEAR:
      return {
        ...state,
        searchIssueResults: requestStockTransferNoteAdaptor.removeAll(
          state.searchIssueResults
        ),

        error: null,
        isSearchingIssues: false,
        hasSearchIssueResults: false
      };
    case StockIssueActionTypes.LOAD_ISSUES_COUNT:
      return {
        ...state,
        isLoadingIssueCount: true,
        error: null
      };
    case StockIssueActionTypes.LOAD_ISSUES_COUNT_SUCCESS:
      return {
        ...state,
        pendingBTQ_BTQ_STNCount: action.payload.pendingIssueBTQ_BTQ_STNCount,
        pendingBTQ_FAC_STNCount: action.payload.pendingIssueBTQ_FAC_STNCount,
        pendingBTQ_MER_STNCount: action.payload.pendingIssueBTQ_MER_STNCount,
        isLoadingIssueCount: false
      };
    case StockIssueActionTypes.LOAD_ISSUES_COUNT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingIssueCount: false
      };
  }
  switch (action.type) {
    case StockIssueActionTypes.LOAD_SELECTED_ISSUE:
      return {
        ...state,
        isLoadingSelectedIssue: true,
        selectedIssue: null,
        hasSelectedIssue: false,

        isItemsTotalCountLoaded: null,
        isItemsTotalCountLoading: false,

        approvedItems: issueItemAdaptor.removeAll(state.approvedItems),
        isApprovedItemsLoading: false,
        approvedItemsTotalCount: 0,

        selectedItems: issueItemAdaptor.removeAll(state.selectedItems),
        isSelectedItemsLoading: false,
        selectedItemsTotalCount: 0,

        searchedItems: issueItemAdaptor.removeAll(state.searchedItems),
        isSearchingItems: false,
        hasSearchedItems: false,

        items: issueItemAdaptor.removeAll(state.items),
        itemsCount: 0,
        isItemsLoading: false,
        isItemsLoaded: false,

        isItemIssued: null,

        error: null
      };
    case StockIssueActionTypes.LOAD_SELECTED_ISSUE_SUCCESS:
      return {
        ...state,
        selectedIssue: action.payload,
        isLoadingSelectedIssue: false,
        hasSelectedIssue: true
      };
    case StockIssueActionTypes.LOAD_SELECTED_ISSUE_FAILURE:
      return {
        ...state,
        isLoadingSelectedIssue: false,
        hasSelectedIssue: false,
        error: action.payload
      };
    case StockIssueActionTypes.LOAD_ISSUE_ITEMS_COUNT:
      return {
        ...state,
        isItemsTotalCountLoading: true,
        isItemsTotalCountLoaded: null,
        // approvedItemsTotalCount: 0,
        // selectedItemsTotalCount: 0,
        error: null
      };
    case StockIssueActionTypes.LOAD_ISSUE_ITEMS_COUNT_SUCCESS:
      return {
        ...state,
        approvedItemsTotalCount: action.payload.approvedItemsTotalCount,
        selectedItemsTotalCount: action.payload.selectedItemsTotalCount,
        isItemsTotalCountLoading: false,
        isItemsTotalCountLoaded: true
      };

    case StockIssueActionTypes.LOAD_ISSUE_ITEMS_COUNT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isItemsTotalCountLoading: false,
        isItemsTotalCountLoaded: false
      };

    case StockIssueActionTypes.LOAD_ITEMS:
      return {
        ...state,
        isItemsLoading: true,
        isItemsLoaded: false,
        error: null
      };

    case StockIssueActionTypes.LOAD_ITEMS_SUCCESS:
      return {
        ...state,
        items: issueItemAdaptor.setAll(action.payload.items, state.items),
        itemsCount: action.payload.count,
        isItemsLoading: false,
        isItemsLoaded: true
      };
    case StockIssueActionTypes.LOAD_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isItemsLoading: false,
        isItemsLoaded: false
      };
    case StockIssueActionTypes.CLEAR_ITEMS:
      return {
        ...state,
        items: issueItemAdaptor.removeAll(state.items)
      };
    case StockIssueActionTypes.UPDATE_ALL_ITEM:
      return {
        ...state,
        isUpdatingAllItems: true,
        isUpdatingAllItemsSuccess: null,
        error: null
      };
    case StockIssueActionTypes.UPDATE_ALL_ITEM_SUCCESS:
      return {
        ...state,
        isUpdatingAllItems: false,
        isUpdatingAllItemsSuccess: true
      };
    case StockIssueActionTypes.UPDATE_ALL_ITEM_FAILURE:
      return {
        ...state,
        error: action.payload,
        isUpdatingAllItems: false,
        isUpdatingAllItemsSuccess: false
      };
    case StockIssueActionTypes.VALIDATE_ITEM:
      return {
        ...state,
        items: issueItemAdaptor.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              isValidating: true,
              isValidatingSuccess: null,
              isValidatingError: false
            }
          },
          state.items
        ),
        error: null
      };

    case StockIssueActionTypes.VALIDATE_ITEM_SUCCESS:
      return {
        ...state,
        items: issueItemAdaptor.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              isValidating: false,
              isValidatingSuccess: action.payload.isSuccess,
              isValidatingError: !action.payload.isSuccess
            }
          },
          state.items
        )
      };

    case StockIssueActionTypes.VALIDATE_ITEM_FAILURE:
      return {
        ...state,
        items: issueItemAdaptor.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              isValidatingError: true,
              isValidating: false
            }
          },
          state.items
        ),
        error: action.payload.error
      };

    case StockIssueActionTypes.UPDATE_ITEM:
      return {
        ...state,
        isItemUpdated: false,
        isitemUpdating: true,
        items: issueItemAdaptor.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              measuredQuantity: action.payload.newUpdate.measuredQuantity,
              status: action.payload.newUpdate.status,
              measuredWeight: action.payload.newUpdate.measuredWeight,
              inventoryId: action.payload.newUpdate.inventoryId,
              isUpdating: true,
              isUpdatingSuccess: null,
              isValidatingSuccess: null
            }
          },
          state.items
        ),
        updateItemSuccess: null,
        error: null
      };
    case StockIssueActionTypes.UPDATE_ITEM_SUCCESS:
      return {
        ...state,
        isItemUpdated: true,
        isitemUpdating: false,
        items: issueItemAdaptor.updateOne(
          {
            id: action.payload.id,
            changes: {
              ...action.payload,
              isUpdating: false,
              isUpdatingSuccess: true
            }
          },
          state.items
        ),
        updateItemSuccess: true
      };
    case StockIssueActionTypes.UPDATE_ITEM_FAILURE:
      return {
        ...state,
        isItemUpdated: false,
        isitemUpdating: false,
        items: issueItemAdaptor.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              measuredQuantity: action.payload.actualDetails.measuredQuantity,
              status: action.payload.actualDetails.status,
              measuredWeight: action.payload.actualDetails.measuredWeight,
              inventoryId: action.payload.actualDetails.inventoryId,
              isUpdating: false,
              isUpdatingSuccess: false
            }
          },
          state.items
        ),
        updateItemSuccess: false,
        error: action.payload.error
      };

    case StockIssueActionTypes.CONFIRM_ISSUE:
      return {
        ...state,
        isItemIssued: null,
        error: null
      };
    case StockIssueActionTypes.CONFIRM_ISSUE_SUCCESS:
      return {
        ...state,
        isItemIssued: true,
        confirmIssue: action.payload
      };
    case StockIssueActionTypes.CONFIRM_ISSUE_FAILURE:
      return {
        ...state,
        isItemIssued: false,
        error: action.payload
      };
  }
  switch (action.type) {
    case StockIssueActionTypes.LOAD_COURIER_DETAILS:
      return {
        ...state,
        isLoadingCourierDetails: true,
        error: null
      };
    case StockIssueActionTypes.LOAD_COURIER_DETAILS_SUCCESS:
      return {
        ...state,
        courierDetails: action.payload,
        isLoadingCourierDetails: false,
        hasCourierDetails: true
      };
    case StockIssueActionTypes.LOAD_COURIER_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        hasCourierDetails: false,
        isLoadingCourierDetails: false
      };
    case StockIssueActionTypes.LOAD_PROUDCT_GROUPS:
    case StockIssueActionTypes.LOAD_PRODUCT_CATEGORIES:
    case StockIssueActionTypes.LOAD_EMPLOYEE_DETAILS:
    case StockIssueActionTypes.LOAD_EMPLOYEE_CODES:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case StockIssueActionTypes.LOAD_EMPLOYEE_CODES_SUCCESS:
      return {
        ...state,
        employeeCodes: action.payload,
        isLoading: false,
        error: null
      };
    case StockIssueActionTypes.UPDATE_ITEM_LIST_STATUS_FAILURE:
    case StockIssueActionTypes.LOAD_EMPLOYEE_DETAILS_FAILURE:
    case StockIssueActionTypes.LOAD_EMPLOYEE_CODES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    // case StockIssueActionTypes.LOAD_EMPLOYEE_DETAILS:
    //   return {
    //     ...state,
    //     isLoading: true,
    //     error: null
    //   };
    case StockIssueActionTypes.LOAD_EMPLOYEE_DETAILS_SUCCESS:
      return {
        ...state,
        employeeDetails: action.payload,
        isLoading: false,
        error: null
      };
    // case StockIssueActionTypes.LOAD_EMPLOYEE_DETAILS_FAILURE:
    //   return {
    //     ...state,
    //     isLoading: false,
    //     error: action.payload
    //   };

    // case StockIssueActionTypes.LOAD_PROUDCT_GROUPS:
    // case StockIssueActionTypes.LOAD_PRODUCT_CATEGORIES:
    //   return {
    //     ...state,
    //     isLoading: true,
    //     error: null
    //   };
    case StockIssueActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS:
      return {
        ...state,
        productCategories: action.payload,
        isLoading: false,
        error: null
      };
    case StockIssueActionTypes.LOAD_PROUDCT_GROUPS_FAILURE:
    case StockIssueActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case StockIssueActionTypes.LOAD_PROUDCT_GROUPS_SUCCESS:
      return {
        ...state,
        productGroups: action.payload,
        isLoading: false,
        error: null
      };
    case StockIssueActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        studdedProductGroups: action.payload
      };

    case StockIssueActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        error: action.payload
      };
  }
  switch (action.type) {
    case StockIssueActionTypes.SET_FILTER_DATA_APPROVED_PRODUCTS:
      return {
        ...state,
        filterDataAllProducts: action.payload
      };
    case StockIssueActionTypes.SET_FILTER_DATA_SELECTED_PRODUCTS:
      return {
        ...state,
        filterDataSelectedProducts: action.payload
      };
    case StockIssueActionTypes.SET_SORT_DATA_APPROVED_PRODUCTS:
      return {
        ...state,
        sortDataAllProducts: action.payload
      };
    case StockIssueActionTypes.SET_SORT_DATA_SELECTED_PRODUCTS:
      return {
        ...state,
        sortDataSelectedProducts: action.payload
      };
    case StockIssueActionTypes.CLEAR_SORT_AND_FILTER:
      return {
        ...state,
        filterDataAllProducts: {},
        filterDataSelectedProducts: {},
        sortDataAllProducts: [],
        sortDataSelectedProducts: []
      };
  }
  switch (action.type) {
    case StockIssueActionTypes.LOAD_TOTAL_WEIGHT_AND_VALUE:
    case StockIssueActionTypes.RESET_ERROR:
      return {
        ...state,
        error: null
      };
    case StockIssueActionTypes.UPDATE_ITEM_LIST_STATUS:
      return { ...state, isLoading: true, error: null };
    case StockIssueActionTypes.UPDATE_ITEM_LIST_STATUS_SUCCESS:
      return {
        ...state,
        updateItemListStatusResponse: action.payload,
        isLoading: false,
        error: null
      };
    // case StockIssueActionTypes.UPDATE_ITEM_LIST_STATUS_FAILURE:
    //   return {
    //     ...state,
    //     error: action.payload,
    //     isLoading: false
    //   };

    // case StockIssueActionTypes.LOAD_TOTAL_WEIGHT_AND_VALUE:
    //   return {
    //     ...state,
    //     error: null
    //   };
    case StockIssueActionTypes.LOAD_TOTAL_WEIGHT_AND_VALUE_SUCCESS:
      return {
        ...state,
        totalMeasuredValue: action.payload.totalMeasuredValue,
        totalMeasuredWeight: action.payload.totalMeasuredWeight
      };
    case StockIssueActionTypes.LOAD_TOTAL_WEIGHT_AND_VALUE_FAILURE:
      return {
        ...state,
        error: action.payload
      };
  }
  switch (action.type) {
    case StockIssueActionTypes.LOAD_ISSUE_HISTORY:
      return {
        ...state,
        isLoadingHistory: true,
        error: null
      };
    case StockIssueActionTypes.LOAD_ISSUE_HISTORY_SUCCESS:
      return {
        ...state,
        issueHistoryCount: action.payload.count,
        issueHistory: requestStockTransferNoteAdaptor.addMany(
          action.payload.response,
          state.issueHistory
        ),

        isLoadingHistory: false
      };
    case StockIssueActionTypes.LOAD_ISSUE_HISTORY_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingHistory: false
      };
    case StockIssueActionTypes.RESET_LOADED_HISTORY:
      return {
        ...state,
        issueHistory: requestStockTransferNoteAdaptor.removeAll(
          state.issueHistory
        ),
        issueHistoryCount: 0,
        selectedHistory: null
      };
    case StockIssueActionTypes.LOAD_SELECTED_HISTORY:
      return {
        ...state,
        isLoadingSelectedHistory: true,
        isLoadingHistoryItems: false,
        isHistoryItemsLoaded: false,
        historyItems: issueItemAdaptor.removeAll(state.historyItems),
        historyItemsCount: 0,
        error: null,
        hasSelectedHistory: false
      };
    case StockIssueActionTypes.LOAD_SELECTED_HISTORY_SUCCESS:
      return {
        ...state,
        selectedHistory: action.payload,
        isLoadingSelectedHistory: false,
        hasSelectedHistory: true
      };
    case StockIssueActionTypes.LOAD_SELECTED_HISTORY_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingSelectedHistory: false,
        hasSelectedHistory: false
      };
    case StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS:
      return {
        ...state,
        error: null,
        // historyItems: issueItemAdaptor.removeAll(state.historyItems),
        isLoadingHistoryItems: true,
        isHistoryItemsLoaded: false,
        historyItemsCount: 0
      };
    case StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS_SUCCESS:
      return {
        ...state,
        historyItems: issueItemAdaptor.setAll(
          action.payload.items,
          state.historyItems
        ),
        isLoadingHistoryItems: false,
        isHistoryItemsLoaded: true,
        historyItemsCount: action.payload.count
      };
    case StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS_FAILURE:
      return {
        ...state,
        isLoadingHistoryItems: false,
        isHistoryItemsLoaded: false,
        error: action.payload
      };
    case StockIssueActionTypes.CLEAR_SELECTED_HISTORY_ITEMS:
      return {
        ...state,
        historyItems: issueItemAdaptor.removeAll(state.historyItems)
      };
    case StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS_COUNT:
      return {
        ...state,
        isLoadingHistoryItemsTotalCount: true,
        error: null
      };
    case StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS_COUNT_SUCCESS:
      return {
        ...state,

        historyItemsTotalCount: action.payload,
        isLoadingHistoryItemsTotalCount: false
      };
    case StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS_COUNT_FAILURE:
      return {
        ...state,
        isLoadingHistoryItemsTotalCount: false,
        error: action.payload
      };
    case StockIssueActionTypes.SET_ADAVANCED_FILTER_DATA:
      return {
        ...state,
        advancedFilterData: action.payload
      };
    case StockIssueActionTypes.CLEAR_ADAVANCED_FILTER_DATA:
      return {
        ...state,
        advancedFilterData: {
          docFromDate: moment(action.payload).startOf('day').valueOf(),
          docToDate: moment(action.payload).endOf('day').valueOf(),
          locationCode: null,
          fiscalYear: null,
          docNo: null
        }
      };

    // cancel STN

    case StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_CANCEL_STN:
      return {
        ...state,
        isLoadingIssueCancelSTN: true,
        error: null
      };
    case StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_CANCEL_STN_SUCCESS:
      return {
        ...state,
        issueCancelSTN: requestStockTransferNoteAdaptor.addMany(
          action.payload.response,
          state.issueCancelSTN
        ),
        totalIssueCancelSTNCount: action.payload.count,
        isLoadingIssueCancelSTN: false
      };
    case StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_CANCEL_STN_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingIssueCancelSTN: false
      };

    case StockIssueActionTypes.LOAD_CANCEL_ISSUES_COUNT:
      return {
        ...state,
        isLoadingIssueCount: true,
        error: null
      };
    case StockIssueActionTypes.LOAD_CANCEL_ISSUES_COUNT_SUCCESS:
      return {
        ...state,
        pendingBTQ_BTQ_STNCancelCount: action.payload,
        isLoadingIssueCount: false
      };
    case StockIssueActionTypes.LOAD_CANCEL_ISSUES_COUNT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingIssueCount: false
      };

    case StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS:
      return {
        ...state,
        error: null,
        isLoadingIssueCancelSTN: true
      };
    case StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS_SUCCESS:
      return {
        ...state,
        cancelIssueItems: issueItemAdaptor.setAll(
          action.payload.items,
          state.cancelIssueItems
        ),
        isLoadingIssueCancelSTN: false
      };
    case StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS_FAILURE:
      return {
        ...state,
        isLoadingIssueCancelSTN: false,
        error: action.payload
      };

    case StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS_COUNT:
      return {
        ...state,
        error: null,
        isLoadingIssueCancelSTN: true
      };
    case StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS_COUNT_SUCCESS:
      return {
        ...state,
        cancelIssueItemsCount: action.payload,
        isLoadingIssueCancelSTN: false
      };
    case StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS_COUNT_FAILURE:
      return {
        ...state,
        isLoadingIssueCancelSTN: false,
        error: action.payload
      };

    case StockIssueActionTypes.CLEAR_PENDING_ISSUES_FOR_CANCEL:
      return {
        ...state,
        issueCancelSTN: requestStockTransferNoteAdaptor.removeAll(
          state.issueCancelSTN
        ),
        totalIssueCancelSTNCount: 0,
        error: null
      };

    case StockIssueActionTypes.LOAD_CANCEL_ISSUES_DETAILS:
      return {
        ...state,
        isLoadingIssueCancelSTN: true,
        error: null
      };
    case StockIssueActionTypes.LOAD_CANCEL_ISSUES_DETAILS_SUCCESS:
      return {
        ...state,
        cancelIssueSTNDetails: action.payload,
        isLoadingIssueCancelSTN: false
      };
    case StockIssueActionTypes.LOAD_CANCEL_ISSUES_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingIssueCancelSTN: false
      };

    case StockIssueActionTypes.CANCEL_ISSUE_STN:
      return {
        ...state,
        isLoadingIssueCancelSTN: true,
        error: null
      };
    case StockIssueActionTypes.CANCEL_ISSUE_STN_SUCCESS:
      return {
        ...state,
        cancelIssuesSTNRes: action.payload,
        isLoadingIssueCancelSTN: false
      };
    case StockIssueActionTypes.CANCEL_ISSUE_STN_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingIssueCancelSTN: false
      };

      case StockIssueActionTypes.REGENERATE_FILE:
        return {
          ...state,
          isFileLoading: true,
          error: null
        };
      case StockIssueActionTypes.REGENERATE_FILE_SUCCESS:
        return {
          ...state,
          regenerateFile: action.payload,
          isFileLoading: false
        };
      case StockIssueActionTypes.REGENERATE_FILE_FAILURE:
        return {
          ...state,
          error: action.payload,
          isFileLoading: false
        };
        
      // Image
    case StockIssueActionTypes.LOAD_THUMBNAIL_IMAGE_URL:
      if(action.payload?.isCancelItems){
        return {
          ...state,
          error: null,
          cancelIssueItems: issueItemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: true
              }
            },
            state.cancelIssueItems
          )
        };
      } else if(action.payload?.isHistoryItems){
        return {
          ...state,
          error: null,
          historyItems: issueItemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: true
              }
            },
            state.historyItems
          )
        };
      } else{
        return {
          ...state,
          error: null,
          items: issueItemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: true
              }
            },
            state.items
          )
        };
      }
    case StockIssueActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS:
      if(action.payload?.isCancelItems){
        return {
          ...state,
          cancelIssueItems: issueItemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                thumbnailImageURL: action.payload.thumbnailImageUrl,
                isLoadingThumbnailImage: false
              }
            },
            state.cancelIssueItems
          )
        };
      } else if(action.payload?.isHistoryItems){
        return {
          ...state,
          historyItems: issueItemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                thumbnailImageURL: action.payload.thumbnailImageUrl,
                isLoadingThumbnailImage: false
              }
            },
            state.historyItems
          )
        };
      } else{
        return {
          ...state,
          items: issueItemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                thumbnailImageURL: action.payload.thumbnailImageUrl,
                isLoadingThumbnailImage: false
              }
            },
            state.items
          )
        };
      } 

    case StockIssueActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE:
      if(action.payload?.isCancelItems){
        return {
          ...state,
          cancelIssueItems: issueItemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: false
              }
            },
            state.cancelIssueItems
          )
        };
      } else if(action.payload?.isHistoryItems){
        return {
          ...state,
          historyItems: issueItemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: false
              }
            },
            state.historyItems
          )
        };
      } else{
        return {
          ...state,
          items: issueItemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: false
              }
            },
            state.items
          )
        };
      }
      
    case StockIssueActionTypes.LOAD_IMAGE_URL:
      if(action.payload?.isCancelItems){
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          cancelIssueItems: issueItemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingImage: true
              }
            },
            state.cancelIssueItems
          )
        };
      } else if(action.payload?.isHistoryItems){
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          historyItems: issueItemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingImage: true
              }
            },
            state.historyItems
          )
        };
      } else{
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          items: issueItemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingImage: true
              }
            },
            state.items
          )
        };
      }
    case StockIssueActionTypes.LOAD_IMAGE_URL_SUCCESS:
    case StockIssueActionTypes.LOAD_IMAGE_URL_FAILURE:
      if(action.payload?.isCancelItems){
        return {
          ...state,
          isLoadingImage: false,
          cancelIssueItems: issueItemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
            },
            state.cancelIssueItems
          )
        };
      } else if(action.payload?.isHistoryItems){
        return {
          ...state,
          isLoadingImage: false,
          historyItems: issueItemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
            },
            state.historyItems
          )
        };
      } else{
        return {
          ...state,
          isLoadingImage: false,
          items: issueItemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
            },
            state.items
          )
        };
      }
  }
  return state;
}
