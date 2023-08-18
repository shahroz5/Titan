import {
  OtherReceiptsActionTypes,
  OtherReceiptsActions
} from './other-receipts.actions';
import {
  OtherReceiptAdapter,
  itemAdapter,
  ItemEntity,
  adjustmentAdaptor
} from './other-receipts.entity';
import { OtherReceiptState } from './other-receipts.state';
import { createFeatureSelector } from '@ngrx/store';
import { OtherReceiptsIssuesEnum } from '@poss-web/shared/models';
import { act } from '@ngrx/effects';

export const OTHER_RECEIPT_FEATURE_KEY = 'otherReceipt';

export const selectStockIssueState = createFeatureSelector<OtherReceiptState>(
  OTHER_RECEIPT_FEATURE_KEY
);
export const initialState: OtherReceiptState = {
  isLoading: false,

  pendingOtherReceiptsSTNCount: 0,
  otherReceiptList: OtherReceiptAdapter.getInitialState(),
  otherReceiptLoanList: OtherReceiptAdapter.getInitialState(),
  isLoadingOtherReceiptList: false,
  isLoadingOtherReceiptLoanList: true,
  isSearchingStocks: false,
  searchStockResults: OtherReceiptAdapter.getInitialState(),
  hasSearchStockResults: null,
  nonVerifiedItems: itemAdapter.getInitialState(),
  isNonVerifiedItemsLoading: false,
  nonVerifiedItemsTotalCount: 0,
  itemsCountNonVerified: 0,
  itemsCountVerified: 0,
  verifiedItems: itemAdapter.getInitialState(),
  isVerifiedItemsLoading: false,
  verifiedItemsTotalCount: 0,

  isItemsTotalCountLoaded: null,
  isItemsTotalCountLoading: false,

  isSearchingItems: false,
  hasSearchedItems: false,
  binCodes: null,
  remarks: null,

  selectedStock: null,
  confirmedStock: null,
  isVerifyingAllItem: false,
  isVerifyingAllItemSuccess: null,
  confirmStockReceiveErrors: null,
  selectedStockLoadError: null,
  isAssigningBinToAllItems: false,
  isAssigningBinToAllItemsSuccess: null,
  printDataResponse: null,
  isConfirmStockReceiveSuccess: null,
  isConfirmingStockReceive: false,
  verifyItemSuccess: null,
  otherReceiptsDropdownValues: null,
  selectedDropDownForReceipts: OtherReceiptsIssuesEnum.EXHIBITION_TYPE,
  error: null,
  isItemIssued: false,
  totalElementsOtherReceipts: 0,
  isLoadingRemarks: false,
  isLoadingSelectedStock: false,
  updateItemSuccess: false,
  isLoadingBinGroups: false,
  isSearchingAdjustmentItems: false,
  hasSearchedAdjustmentItems: false,
  isLoadingAdjustment: false,
  adjustmentSearchedItems: null,
  itemsInCarts: adjustmentAdaptor.getInitialState(),
  adjustmentSearchedItemsCount: null,
  confirmAdjustementItemResponse: null,
  adjustmentItemsInCartsSearch: adjustmentAdaptor.getInitialState(),
  hasSearchItemInCartSearchAdjustment: false,
  otherReceiptADJList: OtherReceiptAdapter.getInitialState(),
  isLoadingOtherReceiptADJList: false,
  studdedProductGroups: [],
  isSearchingPSVItems: false,
  hasSearchedItemPSV: false,
  psvSearchedItems: null,
  itemsInCartsPSV: adjustmentAdaptor.getInitialState(),
  psvSearchedItemsCount: null,
  confirmPSVItemResponse: null,
  IsLoadingPSV: false,
  hasSearchItemInCartSearchPSV: false,
  psvItemsInCartsSearch: adjustmentAdaptor.getInitialState(),

  productCategories: null,
  productGroups: null,

  filterDataNonVerifiedProducts: {},
  filterDataVerifiedProducts: {},

  sortDataNonVerifiedProducts: [],
  sortDataVerifiedProducts: [],
  isNonVerifiedItemsLoaded: null,
  isVerifiedItemsLoaded: null,

  otherReceiptsHistory: OtherReceiptAdapter.getInitialState(),
  isLoadingHistory: false,
  otherReceiptsHistoryCount: 0,

  isLoadingSelectedHistory: false,
  hasSelectedHistory: false,
  selectedHistory: null,

  historyItemsCount: 0,
  historyItems: itemAdapter.getInitialState(),
  isLoadingHistoryItems: false,
  isHistoryItemsLoaded: false,

  historyItemsTotalCount: 0,
  isLoadingHistoryItemsTotalCount: false,
  isHistoryItemsTotalCountLoaded: false,
  isLoadingImage: false
};

export function OtherReceiptsReducer(
  state: OtherReceiptState = initialState,
  action: OtherReceiptsActions
): OtherReceiptState {
  // other receipt Loan and Exhibtion
  switch (action.type) {
    case OtherReceiptsActionTypes.RESET_RECEIPTS_LIST_DATA:
      return {
        ...state,
        pendingOtherReceiptsSTNCount: 0,
        otherReceiptsDropdownValues: null,
        otherReceiptList: OtherReceiptAdapter.getInitialState(),
        otherReceiptLoanList: OtherReceiptAdapter.getInitialState(),
        totalElementsOtherReceipts: 0,
        selectedDropDownForReceipts: OtherReceiptsIssuesEnum.EXHIBITION_TYPE,
        error: null
      };
    case OtherReceiptsActionTypes.LOAD_RECEIPTS_STN_COUNT:
      return {
        ...state,
        error: null
      };
    case OtherReceiptsActionTypes.LOAD_RECEIPTS_STN_COUNT_SUCCESS:
      return {
        ...state,
        pendingOtherReceiptsSTNCount:
          action.payload.pendingOtherReceiptsSTNCount,
        otherReceiptsDropdownValues: action.payload.countData
      };
    case OtherReceiptsActionTypes.LOAD_RECEIPTS_STN_COUNT_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case OtherReceiptsActionTypes.LOAD_RECEIPT_LIST:
      return {
        ...state,
        isLoadingOtherReceiptList: true,
        error: null
      };

    case OtherReceiptsActionTypes.LOAD_RECEIPT_LIST_SUCCESS:
      return {
        ...state,
        otherReceiptList: OtherReceiptAdapter.addMany(
          action.payload.receiptsData,
          state.otherReceiptList
        ),
        isLoadingOtherReceiptList: false,
        totalElementsOtherReceipts: action.payload.totalElements,
        error: null
      };

    case OtherReceiptsActionTypes.LOAD_RECEIPT_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingOtherReceiptList: false
      };

    case OtherReceiptsActionTypes.PRINT_OTHER_RECIVES:
      return {
        ...state,
        printDataResponse: null,
        error: null
      };
    case OtherReceiptsActionTypes.PRINT_OTHER_RECIVES_SUCCESS:
      return {
        ...state,
        printDataResponse: action.payload,
        error: null
      };

    case OtherReceiptsActionTypes.PRINT_OTHER_RECIVES_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case OtherReceiptsActionTypes.SEARCH_PENDING_RECEIPTS:
      return {
        ...state,
        isSearchingStocks: true,
        hasSearchStockResults: null,
        searchStockResults: OtherReceiptAdapter.removeAll(
          state.searchStockResults
        ),
        error: null
      };

    case OtherReceiptsActionTypes.SEARCH_PENDING_RECEIPTS_SUCCESS:
      return {
        ...state,
        searchStockResults: OtherReceiptAdapter.setAll(
          action.payload,
          state.searchStockResults
        ),
        isSearchingStocks: false,
        hasSearchStockResults: true
      };

    case OtherReceiptsActionTypes.SEARCH_PENDING_RECEIPTS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isSearchingStocks: false,
        hasSearchStockResults: false
      };

    case OtherReceiptsActionTypes.SEARCH_CLEAR:
      return {
        ...state,
        searchStockResults: OtherReceiptAdapter.removeAll(
          state.searchStockResults
        ),
        error: null,
        isSearchingStocks: false,
        hasSearchStockResults: null
      };

    case OtherReceiptsActionTypes.LOAD_ItEMS_COUNT:
      return {
        ...state,
        isItemsTotalCountLoading: true,
        isItemsTotalCountLoaded: null,
        nonVerifiedItemsTotalCount: 0,
        verifiedItemsTotalCount: 0,
        error: null
      };

    case OtherReceiptsActionTypes.LOAD_ItEMS_COUNT_SUCCESS:
      return {
        ...state,
        nonVerifiedItemsTotalCount: action.payload.nonVerifiedItemsTotalCount,
        verifiedItemsTotalCount: action.payload.verifiedItemsTotalCount,
        isItemsTotalCountLoading: false,
        isItemsTotalCountLoaded: true
      };

    case OtherReceiptsActionTypes.LOAD_ItEMS_COUNT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isItemsTotalCountLoading: false,
        isItemsTotalCountLoaded: false
      };

    case OtherReceiptsActionTypes.LOAD_SELECTED_STOCK:
      return {
        ...state,
        isLoading: true,
        selectedStock: null,
        selectedStockLoadError: null,

        isItemsTotalCountLoading: false,
        isItemsTotalCountLoaded: null,

        nonVerifiedItems: itemAdapter.removeAll(state.nonVerifiedItems),
        isNonVerifiedItemsLoading: false,
        nonVerifiedItemsTotalCount: 0,

        verifiedItems: itemAdapter.removeAll(state.verifiedItems),
        isVerifiedItemsLoading: false,
        verifiedItemsTotalCount: 0,

        isSearchingItems: false,
        hasSearchedItems: false,

        isVerifyingAllItem: false,
        isVerifyingAllItemSuccess: null,

        isAssigningBinToAllItems: false,
        isAssigningBinToAllItemsSuccess: null,

        confirmStockReceiveErrors: null,
        confirmedStock: null,
        isConfirmStockReceiveSuccess: null,
        isConfirmingStockReceive: false,
        error: null,
        isLoadingImage: false
      };

    case OtherReceiptsActionTypes.LOAD_SELECTED_STOCK_SUCCESS:
      return {
        ...state,
        selectedStock: action.payload,
        isLoading: false
      };
    case OtherReceiptsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE:
    case OtherReceiptsActionTypes.LOAD_SELECTED_STOCK_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case OtherReceiptsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        studdedProductGroups: action.payload
      };

    case OtherReceiptsActionTypes.CLEAR_ITEMS:
      return {
        ...state,
        verifiedItems: itemAdapter.removeAll(state.verifiedItems),
        nonVerifiedItems: itemAdapter.removeAll(state.verifiedItems)
      };

    case OtherReceiptsActionTypes.LOAD_BIN_CODES:
      return {
        ...state,
        isLoadingBinGroups: true,
        error: null
      };
    case OtherReceiptsActionTypes.LOAD_BIN_CODES_SUCCESS:
      return {
        ...state,
        binCodes: action.payload,
        isLoadingBinGroups: false
      };

    case OtherReceiptsActionTypes.LOAD_BIN_CODES_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingBinGroups: false
      };

    case OtherReceiptsActionTypes.VERIFY_ITEM:
      return {
        ...state,
        nonVerifiedItems: itemAdapter.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              binCode: action.payload.newUpdate.binCode,
              binGroupCode: action.payload.newUpdate.binGroupCode,
              measuredWeight: action.payload.newUpdate.measuredWeight,
              remarks: action.payload.newUpdate.remarks,
              isUpdating: true,
              isUpdatingSuccess: null
            }
          },
          state.nonVerifiedItems
        ),
        error: null,
        verifyItemSuccess: null
      };

    case OtherReceiptsActionTypes.VERIFY_ITEM_SUCCESS:
      const newNonVerifiedItems: ItemEntity = itemAdapter.removeOne(
        action.payload.id,
        state.nonVerifiedItems
      );

      const countDiff =
        state.nonVerifiedItems.ids.length - newNonVerifiedItems.ids.length;

      return {
        ...state,
        nonVerifiedItems: newNonVerifiedItems,
        nonVerifiedItemsTotalCount:
          state.nonVerifiedItemsTotalCount - countDiff,
        verifiedItemsTotalCount: state.verifiedItemsTotalCount + countDiff,
        verifyItemSuccess: true
      };

    case OtherReceiptsActionTypes.VERIFY_ITEM_FAILURE:
      return {
        ...state,
        nonVerifiedItems: itemAdapter.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              isUpdating: false,
              isUpdatingSuccess: false
            }
          },
          state.nonVerifiedItems
        ),

        error: action.payload.error,
        verifyItemSuccess: false
      };

    case OtherReceiptsActionTypes.UPADTE_ITEM:
      return {
        ...state,

        verifiedItems: itemAdapter.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              binCode: action.payload.newUpdate.binCode,
              binGroupCode: action.payload.newUpdate.binGroupCode,
              measuredWeight: action.payload.newUpdate.measuredWeight,
              remarks: action.payload.newUpdate.remarks,
              isUpdating: true,
              isUpdatingSuccess: null,
              isValidatingSuccess: null
            }
          },
          state.verifiedItems
        ),
        error: null
      };
  }
  //other receipt Loan and Exhibtion  load verifed and non verified items .
  switch (action.type) {
    case OtherReceiptsActionTypes.LOAD_NON_VERIFIED_ITEMS:
      return {
        ...state,
        isNonVerifiedItemsLoading: true,
        isNonVerifiedItemsLoaded: null,
        error: null
      };

    case OtherReceiptsActionTypes.LOAD_NON_VERIFIED_ITEMS_SUCCESS:
      return {
        ...state,
        nonVerifiedItems: itemAdapter.setAll(
          action.payload.items,
          state.nonVerifiedItems
        ),
        itemsCountNonVerified: action.payload.count,
        isNonVerifiedItemsLoading: false,
        isNonVerifiedItemsLoaded: true
      };

    case OtherReceiptsActionTypes.LOAD_NON_VERIFIED_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isNonVerifiedItemsLoading: false,
        isNonVerifiedItemsLoaded: false
      };

    case OtherReceiptsActionTypes.LOAD_VERIFIED_ITEMS:
      return {
        ...state,
        isVerifiedItemsLoading: true,
        isVerifiedItemsLoaded: null,
        error: null
      };

    case OtherReceiptsActionTypes.LOAD_VERIFIED_ITEMS_SUCCESS:
      return {
        ...state,
        verifiedItems: itemAdapter.setAll(
          action.payload.items,
          state.verifiedItems
        ),
        itemsCountVerified: action.payload.count,
        isVerifiedItemsLoading: false,
        isVerifiedItemsLoaded: true
      };

    case OtherReceiptsActionTypes.LOAD_VERIFIED_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isVerifiedItemsLoading: false,
        isVerifiedItemsLoaded: false
      };
  }
  // other receipt Loan and Exhibtion
  switch (action.type) {
    case OtherReceiptsActionTypes.UPADTE_ITEM_SUCCESS:
      return {
        ...state,
        verifiedItems: itemAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              ...action.payload,
              isUpdating: false,
              isUpdatingSuccess: true
            }
          },
          state.verifiedItems
        )
      };

    case OtherReceiptsActionTypes.UPADTE_ITEM_FAILURE:
      return {
        ...state,
        verifiedItems: itemAdapter.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              binCode: action.payload.actualDetails.binCode,
              binGroupCode: action.payload.actualDetails.binGroupCode,
              measuredWeight: action.payload.actualDetails.measuredWeight,
              remarks: action.payload.actualDetails.remarks,
              isUpdating: false,
              isUpdatingSuccess: false
            }
          },
          state.verifiedItems
        ),

        error: action.payload.error
      };

    case OtherReceiptsActionTypes.CONFIRM_STOCK_RECEIVE:
      return {
        ...state,
        confirmedStock: null,
        isConfirmStockReceiveSuccess: null,
        isConfirmingStockReceive: true,
        confirmStockReceiveErrors: null
      };

    case OtherReceiptsActionTypes.CONFIRM_STOCK_RECEIVE_SUCCESS:
      return {
        ...state,
        confirmedStock: action.payload,
        isConfirmStockReceiveSuccess: true,
        isConfirmingStockReceive: false,
        otherReceiptList: OtherReceiptAdapter.removeAll(state.otherReceiptList)
      };

    case OtherReceiptsActionTypes.CONFIRM_STOCK_RECEIVE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isConfirmStockReceiveSuccess: false,
        isConfirmingStockReceive: false
      };

    case OtherReceiptsActionTypes.LOAD_REMARKS:
      return {
        ...state,
        isLoadingRemarks: true,
        error: null
      };
    case OtherReceiptsActionTypes.LOAD_REMARKS_SUCCESS:
      return {
        ...state,
        remarks: action.payload,
        isLoadingRemarks: false
      };

    case OtherReceiptsActionTypes.LOAD_REMARKS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingRemarks: false
      };

    case OtherReceiptsActionTypes.VALIDATE_NON_VERIFIED_ITEM:
      return {
        ...state,
        nonVerifiedItems: itemAdapter.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              isValidating: true,
              isValidatingSuccess: null,
              isValidatingError: false
            }
          },
          state.nonVerifiedItems
        ),
        error: null
      };

    case OtherReceiptsActionTypes.VALIDATE_NON_VERIFIED_ITEM_SUCCESS:
      return {
        ...state,
        nonVerifiedItems: itemAdapter.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              isValidating: false,
              isValidatingSuccess: action.payload.isSuccess
            }
          },
          state.nonVerifiedItems
        )
      };

    case OtherReceiptsActionTypes.VALIDATE_NON_VERIFIED_ITEM_FAILURE:
      return {
        ...state,
        nonVerifiedItems: itemAdapter.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              isValidatingError: true,
              isValidating: false
            }
          },
          state.nonVerifiedItems
        ),
        error: action.payload.error
      };

    case OtherReceiptsActionTypes.VALIDATE_VERIFIED_ITEM:
      return {
        ...state,
        verifiedItems: itemAdapter.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              isValidating: true,
              isValidatingSuccess: null,
              isValidatingError: false
            }
          },
          state.verifiedItems
        ),
        error: null
      };

    case OtherReceiptsActionTypes.VALIDATE_VERIFIED_ITEM_SUCCESS:
      return {
        ...state,
        verifiedItems: itemAdapter.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              isValidating: false,
              isValidatingSuccess: action.payload.isSuccess
            }
          },
          state.verifiedItems
        )
      };

    case OtherReceiptsActionTypes.VALIDATE_VERIFIED_ITEM_FAILURE:
      return {
        ...state,
        verifiedItems: itemAdapter.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              isValidatingError: true,
              isValidating: false
            }
          },
          state.verifiedItems
        ),
        error: action.payload.error
      };
    case OtherReceiptsActionTypes.VERIFY_ALL_ITEMS:
      return {
        ...state,
        isVerifyingAllItem: true,
        isVerifyingAllItemSuccess: null,
        error: null
      };

    case OtherReceiptsActionTypes.VERIFY_ALL_ITEMS_SUCCESS:
      return {
        ...state,
        nonVerifiedItems: itemAdapter.removeAll(state.nonVerifiedItems),
        nonVerifiedItemsTotalCount: 0,
        verifiedItemsTotalCount:
          state.verifiedItemsTotalCount + state.nonVerifiedItemsTotalCount,
        isVerifyingAllItem: false,
        isVerifyingAllItemSuccess: true
      };

    case OtherReceiptsActionTypes.VERIFY_ALL_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isVerifyingAllItem: false,
        isVerifyingAllItemSuccess: false
      };

    case OtherReceiptsActionTypes.ASSIGN_BIN_ALL_ITEMS:
      return {
        ...state,
        isAssigningBinToAllItems: true,
        isAssigningBinToAllItemsSuccess: null,
        error: null
      };

    case OtherReceiptsActionTypes.ASSIGN_BIN_ALL_ITEMS_SUCCESS:
      return {
        ...state,
        isAssigningBinToAllItems: false,
        isAssigningBinToAllItemsSuccess: true
      };

    case OtherReceiptsActionTypes.ASSIGN_BIN_ALL_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isAssigningBinToAllItems: false,
        isAssigningBinToAllItemsSuccess: false
      };
    case OtherReceiptsActionTypes.LOAD_RECEIPT_LOAN_LIST:
      return {
        ...state,
        isLoadingOtherReceiptLoanList: true,
        error: null
      };

    case OtherReceiptsActionTypes.LOAD_RECEIPT_LOAN_LIST_SUCCESS:
      return {
        ...state,
        otherReceiptLoanList: OtherReceiptAdapter.addMany(
          action.payload.receiptsData,
          state.otherReceiptLoanList
        ),
        isLoadingOtherReceiptLoanList: false,
        totalElementsOtherReceipts: action.payload.totalElements,
        error: null
      };

    case OtherReceiptsActionTypes.LOAD_RECEIPT_LOAN_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingOtherReceiptLoanList: false
      };
    case OtherReceiptsActionTypes.DROPDOWN_SELECTED_FOR_RECEIPTS:
      return {
        ...state,
        selectedDropDownForReceipts: action.payload
      };

    case OtherReceiptsActionTypes.SET_FILTER_DATA_NON_VERIFIED_PRODUCTS:
      return {
        ...state,
        filterDataNonVerifiedProducts: action.payload
      };
    case OtherReceiptsActionTypes.SET_FILTER_DATA_VERIFIED_PRODUCTS:
      return {
        ...state,
        filterDataVerifiedProducts: action.payload
      };
    case OtherReceiptsActionTypes.SET_SORT_DATA_NON_VERIFIED_PRODUCTS:
      return {
        ...state,
        sortDataNonVerifiedProducts: action.payload
      };
    case OtherReceiptsActionTypes.SET_SORT_DATA_VERIFIED_PRODUCTS:
      return {
        ...state,
        sortDataVerifiedProducts: action.payload
      };
  }

  //other receipt adjustment
  switch (action.type) {
    case OtherReceiptsActionTypes.ADJUSTMENT_SEARCH:
      return {
        ...state,
        isSearchingAdjustmentItems: true,
        hasSearchedAdjustmentItems: false,
        hasError: null
      };
    case OtherReceiptsActionTypes.ADJUSTMENT_SEARCH_SUCCESS:
      return {
        ...state,
        isSearchingAdjustmentItems: false,
        hasSearchedAdjustmentItems: true,
        adjustmentSearchedItems: action.payload
      };

    case OtherReceiptsActionTypes.ADJUSTMENT_SEARCH_FAILUREE:
      return {
        ...state,
        isSearchingAdjustmentItems: false,
        hasSearchedAdjustmentItems: false,
        error: action.payload
      };
    case OtherReceiptsActionTypes.ADD_ITEMS_TO_CART:
      return {
        ...state,
        adjustmentSearchedItems: null,
        itemsInCarts: adjustmentAdaptor.addMany(
          action.payload,
          state.itemsInCarts
        )
      };
    case OtherReceiptsActionTypes.CONFIRM_ADJUSTEMENT_ITEMS:
      return {
        ...state,
        isLoadingAdjustment: true
      };
    case OtherReceiptsActionTypes.CONFIRM_ADJUSTEMENT_ITEMS_SUCCEESS:
      return {
        ...state,
        confirmAdjustementItemResponse: action.payload,
        isLoadingAdjustment: false
      };
    case OtherReceiptsActionTypes.CONFIRM_ADJUSTEMENT_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingAdjustment: false
      };
    case OtherReceiptsActionTypes.REMOVE_ADJUSTEMENT_ITEM:
      return {
        ...state,
        itemsInCarts: adjustmentAdaptor.removeOne(
          action.payload.itemCode,
          state.itemsInCarts
        ),
        adjustmentItemsInCartsSearch: adjustmentAdaptor.removeOne(
          action.payload.itemCode,
          state.adjustmentItemsInCartsSearch
        ),
        hasSearchItemInCartSearchAdjustment: false
      };
    case OtherReceiptsActionTypes.REMOVE_MULTIPLE_ADJUSTEMENT_ITEMs:
      return {
        ...state,
        itemsInCarts: adjustmentAdaptor.removeMany(
          action.payload,
          state.itemsInCarts
        ),
        adjustmentItemsInCartsSearch: adjustmentAdaptor.removeMany(
          action.payload,
          state.adjustmentItemsInCartsSearch
        ),
        hasSearchItemInCartSearchAdjustment: false
      };
    case OtherReceiptsActionTypes.UPDATE_ADJUSTEMENT_ITEMS:
      return {
        ...state,
        itemsInCarts: adjustmentAdaptor.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              itemCode: action.payload.items.itemCode,
              binCode: action.payload.items.binCode,
              binGroupCode: action.payload.items.binGroupCode,
              measuredWeight: action.payload.items.measuredWeight,
              measuredQuantity: action.payload.items.quantity,
              isHallmarked: action.payload.items.isHallmarked,
            }
          },
          state.itemsInCarts
        )
      };
    case OtherReceiptsActionTypes.SEARCH_CART_ITEM_ADJUSTMENT:
      return {
        ...state,
        adjustmentItemsInCartsSearch: state.itemsInCarts,
        hasSearchItemInCartSearchAdjustment: true
      };
    case OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT:
      return {
        ...state,
        adjustmentItemsInCartsSearch: adjustmentAdaptor.getInitialState(),
        hasSearchItemInCartSearchAdjustment: false
      };
    case OtherReceiptsActionTypes.RESET_ADJUSTMENT_DATA:
      return {
        ...state,
        itemsInCarts: adjustmentAdaptor.removeAll(state.itemsInCarts),
        adjustmentItemsInCartsSearch: adjustmentAdaptor.getInitialState(),
        confirmAdjustementItemResponse: null,
        error: null,
        isSearchingAdjustmentItems: false,
        hasSearchedAdjustmentItems: false,
        adjustmentSearchedItems: null,
        adjustmentSearchedItemsCount: null,
        hasSearchItemInCartSearchAdjustment: false
      };
    case OtherReceiptsActionTypes.CLEAR_SEARCH_INVENTORY_ADJUSTMENT:
      return {
        ...state,
        isSearchingAdjustmentItems: false,
        hasSearchedAdjustmentItems: false,
        adjustmentSearchedItems: null,
        adjustmentSearchedItemsCount: null
      };
    case OtherReceiptsActionTypes.LOAD_RECEIPTS_ADJ_LIST:
      return {
        ...state,
        isLoadingOtherReceiptADJList: true,
        error: null
      };

    case OtherReceiptsActionTypes.LOAD_RECEIPTS_ADJ_LIST_SUCCESS:
      return {
        ...state,
        otherReceiptADJList: OtherReceiptAdapter.addMany(
          action.payload.receiptsData,
          state.otherReceiptADJList
        ),
        isLoadingOtherReceiptADJList: false,
        totalElementsOtherReceipts: action.payload.totalElements,
        error: null
      };

    case OtherReceiptsActionTypes.LOAD_RECEIPTS_ADJ_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingOtherReceiptADJList: false
      };
  }

  // other receipt psv
  switch (action.type) {
    case OtherReceiptsActionTypes.PSV_SEARCH:
      return {
        ...state,
        isSearchingPSVItems: true,
        hasSearchedItemPSV: false,
        hasError: null
      };
    case OtherReceiptsActionTypes.PSV_SEARCH_SUCCESS:
      return {
        ...state,
        isSearchingPSVItems: false,
        psvSearchedItems: action.payload,
        hasSearchedItemPSV: true
      };

    case OtherReceiptsActionTypes.PSV_SEARCH_FAILUREE:
      return {
        ...state,
        isSearchingPSVItems: false,
        error: action.payload,
        hasSearchedItemPSV: false
      };
    case OtherReceiptsActionTypes.PSV_ADD_ITEMS_TO_CART:
      return {
        ...state,
        psvSearchedItems: null,
        itemsInCartsPSV: adjustmentAdaptor.addMany(
          action.payload,
          state.itemsInCartsPSV
        )
      };
    case OtherReceiptsActionTypes.CONFIRM_PSV_ITEMS:
      return {
        ...state,
        IsLoadingPSV: true
      };
    case OtherReceiptsActionTypes.CONFIRM_PSV_ITEMS_SUCCEESS:
      return {
        ...state,
        confirmPSVItemResponse: action.payload,
        IsLoadingPSV: false
      };
    case OtherReceiptsActionTypes.CONFIRM_PSV_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        IsLoadingPSV: false
      };
    case OtherReceiptsActionTypes.REMOVE_PSV_ITEM:
      return {
        ...state,
        itemsInCartsPSV: adjustmentAdaptor.removeOne(
          action.payload.itemCode,
          state.itemsInCartsPSV
        ),
        psvItemsInCartsSearch: adjustmentAdaptor.removeOne(
          action.payload.itemCode,
          state.psvItemsInCartsSearch
        )
      };
    case OtherReceiptsActionTypes.REMOVE_MULTIPLE_PSV_ITEMs:
      return {
        ...state,
        itemsInCartsPSV: adjustmentAdaptor.removeMany(
          action.payload,
          state.itemsInCartsPSV
        ),
        psvItemsInCartsSearch: adjustmentAdaptor.removeMany(
          action.payload,
          state.psvItemsInCartsSearch
        ),
        hasSearchItemInCartSearchPSV: false
      };
    case OtherReceiptsActionTypes.UPDATE_PSV_ITEMS:
      return {
        ...state,
        itemsInCartsPSV: adjustmentAdaptor.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              itemCode: action.payload.items.itemCode,
              binCode: action.payload.items.binCode,
              binGroupCode: action.payload.items.binGroupCode,
              measuredWeight: action.payload.items.measuredWeight,
              measuredQuantity: action.payload.items.quantity,
              isHallmarked: action.payload.items.isHallmarked,
            }
          },
          state.itemsInCartsPSV
        )
      };
    case OtherReceiptsActionTypes.SEARCH_CART_ITEM_PSV:
      return {
        ...state,
        psvItemsInCartsSearch: state.itemsInCartsPSV,
        hasSearchItemInCartSearchPSV: true
      };
    case OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_PSV:
      return {
        ...state,
        psvItemsInCartsSearch: adjustmentAdaptor.getInitialState(),
        hasSearchItemInCartSearchPSV: false
      };
    case OtherReceiptsActionTypes.RESET_PSV_DATA:
      return {
        ...state,
        itemsInCartsPSV: adjustmentAdaptor.removeAll(state.itemsInCartsPSV),
        psvItemsInCartsSearch: adjustmentAdaptor.getInitialState(),
        confirmPSVItemResponse: null,
        error: null,
        isSearchingPSVItems: false,
        hasSearchedItemPSV: false,
        psvSearchedItems: null,
        psvSearchedItemsCount: null,
        hasSearchItemInCartSearchPSV: false
      };
    case OtherReceiptsActionTypes.CLEAR_SEARCH_INVENTORY_PSV:
      return {
        ...state,
        isSearchingPSVItems: false,
        hasSearchedItemPSV: false,
        psvSearchedItems: null,
        psvSearchedItemsCount: null
      };

    case OtherReceiptsActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS:
      return {
        ...state,
        productCategories: action.payload,
        isLoading: false,
        error: null
      };

    case OtherReceiptsActionTypes.LOAD_PROUDCT_GROUPS:
    case OtherReceiptsActionTypes.LOAD_PRODUCT_CATEGORIES:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case OtherReceiptsActionTypes.LOAD_PROUDCT_GROUPS_SUCCESS:
      return {
        ...state,
        productGroups: action.payload,
        isLoading: false,
        error: null
      };
    case OtherReceiptsActionTypes.LOAD_PROUDCT_GROUPS_FAILURE:
    case OtherReceiptsActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
  }
  // OTHER RECEIPTS HISTORY
  switch (action.type) {
    case OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY:
      return {
        ...state,
        isLoadingHistory: true,
        error: null
      };
    case OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_SUCCESS:
      return {
        ...state,
        otherReceiptsHistory: OtherReceiptAdapter.addMany(
          action.payload.receiptsData,
          state.otherReceiptsHistory
        ),
        otherReceiptsHistoryCount: action.payload.totalElements,
        isLoadingHistory: false
      };
    case OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingHistory: false
      };
    case OtherReceiptsActionTypes.RESET_OTHER_RECEIPTS_HISTORY:
      return {
        ...state,
        otherReceiptsHistory: OtherReceiptAdapter.removeAll(
          state.otherReceiptsHistory
        )
      };

    case OtherReceiptsActionTypes.LOAD_SELECTED_OTHER_RECEIPTS_HISTORY:
      return {
        ...state,
        isLoadingSelectedHistory: true,
        hasSelectedHistory: false,
        selectedHistory: null,
        historyItemsCount: 0,
        historyItems: itemAdapter.getInitialState(),
        isLoadingHistoryItems: false,
        isHistoryItemsLoaded: false,
        error: null
      };
    case OtherReceiptsActionTypes.LOAD_SELECTED_OTHER_RECEIPTS_HISTORY_SUCCESS:
      return {
        ...state,
        selectedHistory: action.payload,
        isLoadingSelectedHistory: false,
        hasSelectedHistory: true
      };
    case OtherReceiptsActionTypes.LOAD_SELECTED_OTHER_RECEIPTS_HISTORY_FAILURE:
      return {
        ...state,
        isLoadingSelectedHistory: false,
        hasSelectedHistory: false,
        error: action.payload
      };
    case OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS:
      return {
        ...state,
        historyItems: itemAdapter.removeAll(state.historyItems),
        isLoadingHistoryItems: true,
        isHistoryItemsLoaded: false,
        error: null
      };
    case OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_SUCCESS:
      return {
        ...state,
        historyItemsCount: action.payload.count,
        historyItems: itemAdapter.setAll(
          action.payload.items,
          state.historyItems
        ),
        isHistoryItemsLoaded: true,
        isLoadingHistoryItems: false
      };
    case OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_FAILURE:
      return {
        ...state,
        isLoadingHistoryItems: false,
        isHistoryItemsLoaded: false,
        error: action.payload
      };
    case OtherReceiptsActionTypes.CLEAR_OTHER_RECEIPTS_HISTORY_ITEMS:
      return {
        ...state,
        historyItems: itemAdapter.removeAll(state.historyItems)
      };
    case OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_TOTAL_COUNT:
      return {
        ...state,
        isLoadingHistoryItemsTotalCount: true,
        error: null
      };
    case OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_TOTAL_COUNT_SUCCESS:
      return {
        ...state,
        historyItemsTotalCount: action.payload,
        isLoadingHistoryItemsTotalCount: false,
        isHistoryItemsTotalCountLoaded: true
      };
    case OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_TOTAL_COUNT_FAILURE:
      return {
        ...state,
        isLoadingHistoryItemsTotalCount: false,
        error: action.payload
      };

    // Image
    case OtherReceiptsActionTypes.LOAD_THUMBNAIL_IMAGE_URL:
      if (action.payload?.isHistoryItems) {
        return {
          ...state,
          error: null,
          historyItems: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: true
              }
            },
            state.historyItems
          )
        };
      } else if (action.payload?.isPSVItems) {
        return {
          ...state,
          error: null,
          itemsInCartsPSV: adjustmentAdaptor.updateOne(
            {
              id: action.payload?.itemCode,
              changes: {
                isLoadingThumbnailImage: true
              }
            },
            state.itemsInCartsPSV
          )
        };
      } else if (action.payload?.isAdjustmentItems) {
        return {
          ...state,
          error: null,
          itemsInCarts: adjustmentAdaptor.updateOne(
            {
              id: action.payload?.itemCode,
              changes: {
                isLoadingThumbnailImage: true
              }
            },
            state.itemsInCarts
          )
        };
      } else if (action.payload?.isVerifiedItems) {
        return {
          ...state,
          error: null,
          verifiedItems: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: true
              }
            },
            state.verifiedItems
          )
        };
      } else {
        return {
          ...state,
          error: null,
          nonVerifiedItems: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: true
              }
            },
            state.nonVerifiedItems
          )
        };
      }

    case OtherReceiptsActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS:
      if (action.payload?.isHistoryItems) {
        return {
          ...state,
          historyItems: itemAdapter.updateOne(
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
      } else if (action.payload?.isPSVItems) {
        return {
          ...state,
          itemsInCartsPSV: adjustmentAdaptor.updateOne(
            {
              id: action.payload?.itemCode,
              changes: {
                thumbnailImageURL: action.payload.thumbnailImageUrl,
                isLoadingThumbnailImage: false
              }
            },
            state.itemsInCartsPSV
          )
        };
      } else if (action.payload?.isAdjustmentItems) {
        return {
          ...state,
          itemsInCarts: adjustmentAdaptor.updateOne(
            {
              id: action.payload?.itemCode,
              changes: {
                thumbnailImageURL: action.payload.thumbnailImageUrl,
                isLoadingThumbnailImage: false
              }
            },
            state.itemsInCarts
          )
        };
      } else if (action.payload?.isVerifiedItems) {
        return {
          ...state,
          verifiedItems: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                thumbnailImageURL: action.payload.thumbnailImageUrl,
                isLoadingThumbnailImage: false
              }
            },
            state.verifiedItems
          )
        };
      } else {
        return {
          ...state,
          nonVerifiedItems: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                thumbnailImageURL: action.payload.thumbnailImageUrl,
                isLoadingThumbnailImage: false
              }
            },
            state.nonVerifiedItems
          )
        };
      }

    case OtherReceiptsActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE:
      if (action.payload?.isHistoryItems) {
        return {
          ...state,
          historyItems: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: false
              }
            },
            state.historyItems
          )
        };
      } else if (action.payload?.isPSVItems) {
        return {
          ...state,
          itemsInCartsPSV: adjustmentAdaptor.updateOne(
            {
              id: action.payload?.itemCode,
              changes: {
                isLoadingThumbnailImage: false
              }
            },
            state.itemsInCartsPSV
          )
        };
      } else if (action.payload?.isAdjustmentItems) {
        return {
          ...state,
          itemsInCarts: adjustmentAdaptor.updateOne(
            {
              id: action.payload?.itemCode,
              changes: {
                isLoadingThumbnailImage: false
              }
            },
            state.itemsInCarts
          )
        };
      } else if (action.payload?.isVerifiedItems) {
        return {
          ...state,
          verifiedItems: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: false
              }
            },
            state.verifiedItems
          )
        };
      } else {
        return {
          ...state,
          nonVerifiedItems: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: false
              }
            },
            state.nonVerifiedItems
          )
        };
      }

    case OtherReceiptsActionTypes.LOAD_IMAGE_URL:
      if (action.payload?.isHistoryItems) {
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          historyItems: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingImage: true
              }
            },
            state.historyItems
          )
        };
      } else if (action.payload?.isPSVItems) {
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          itemsInCartsPSV: adjustmentAdaptor.updateOne(
            {
              id: action.payload?.itemCode,
              changes: {
                isLoadingImage: true
              }
            },
            state.itemsInCartsPSV
          )
        };
      } else if (action.payload?.isAdjustmentItems) {
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          itemsInCarts: adjustmentAdaptor.updateOne(
            {
              id: action.payload?.itemCode,
              changes: {
                isLoadingImage: true
              }
            },
            state.itemsInCarts
          )
        };
      } else if (action.payload?.isVerifiedItems) {
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          verifiedItems: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingImage: true
              }
            },
            state.verifiedItems
          )
        };
      } else {
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          nonVerifiedItems: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingImage: true
              }
            },
            state.nonVerifiedItems
          )
        };
      }

    case OtherReceiptsActionTypes.LOAD_IMAGE_URL_SUCCESS:
    case OtherReceiptsActionTypes.LOAD_IMAGE_URL_FAILURE:
      if (action.payload?.isHistoryItems) {
        return {
          ...state,
          isLoadingImage: false,
          historyItems: itemAdapter.updateOne(
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
      } else if (action.payload?.isPSVItems) {
        return {
          ...state,
          isLoadingImage: false,
          itemsInCartsPSV: adjustmentAdaptor.updateOne(
            {
              id: action.payload?.itemCode,
              changes: {
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
            },
            state.itemsInCartsPSV
          )
        };
      } else if (action.payload?.isAdjustmentItems) {
        return {
          ...state,
          isLoadingImage: false,
          itemsInCarts: adjustmentAdaptor.updateOne(
            {
              id: action.payload?.itemCode,
              changes: {
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
            },
            state.itemsInCarts
          )
        };
      } else if (action.payload?.isVerifiedItems) {
        return {
          ...state,
          isLoadingImage: false,
          verifiedItems: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
            },
            state.verifiedItems
          )
        };
      } else {
        return {
          ...state,
          isLoadingImage: false,
          nonVerifiedItems: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
            },
            state.nonVerifiedItems
          )
        };
      }
  }

  return state;
}
