import { itemAdapter, stockAdapter } from './stock-receive.entity';
import { StockReceiveState } from './stock-receive.state';
import {
  StockReceiveActions,
  StockReceiveActionTypes
} from './stock-receive.actions';

/**
 * The initial state of the store
 */
export const initialState: StockReceiveState = {
  pendingFactorySTN: stockAdapter.getInitialState(),
  pendingBoutiqueSTN: stockAdapter.getInitialState(),
  pendingCFAInvoice: stockAdapter.getInitialState(),
  pendingMerchandiseSTN: stockAdapter.getInitialState(),
  searchStockResults: stockAdapter.getInitialState(),
  searchInvoiceResults: stockAdapter.getInitialState(),
  isLoadingPendingFactorySTN: false,
  isLoadingPendingBoutiqueSTN: false,
  isLoadingPendingMerchandiseSTN: false,
  isLoadingPendingCFAInvoice: false,

  isSearchingStocks: false,
  hasSearchStockResults: false,

  isSearchingInvoices: false,
  hasSearchInvoiceResults: false,

  // for item verification in detail page
  selectedStock: null,
  selectedInvoice: null,
  isLoadingSelectedStock: false,

  isItemsTotalCountLoading: false,
  isItemsTotalCountLoaded: null,
  isTotalMeasuredWeightLoading: false,

  items: itemAdapter.getInitialState(),
  isItemsLoading: false,
  isItemsLoaded: null,
  itemsCount: 0,
  totalCounts: {
    nonVerifiedItemsTotalCount: 0,
    verifiedItemsTotalCount: 0,
    isLoaded: false
  },
  verifyItemSuccess: null,
  updateItemSuccess: null,

  isVerifyingAllItem: false,
  isVerifyingAllItemSuccess: null,

  isAssigningBinToAllItems: false,
  isAssigningBinToAllItemsSuccess: null,

  binCodes: [],
  remarks: [],
  isLoadingBinGroups: false,
  isLoadingRemarks: false,

  confirmedStock: null,
  isConfirmStockReceiveSuccess: null,
  isConfirmingStockReceive: false,

  productGroups: [],
  isLoadingProductGroups: false,

  productCategories: [],
  isLoadingProductCategories: false,

  studdedProductGroups: [],

  searchReset: {
    reset: false
  },
  error: null,
  //history
  stockReceiveHistory: stockAdapter.getInitialState(),
  isLoadingHistory: false,
  totalElements: 0,
  historyType: null,
  advancedFilter: {
    docFromDate: null,
    docToDate: null,
    stnNumber: null,
    sourceLocationCode: null,
    fiscalYear: null,
    docNumber: null
  },

  oracleFetchInfo: {
    hasFecthed: false
  },
  totalMeasuredWeight: 0,
  isLoadingImage: false
};

/**
 * The reducer function which manipulates the store for respective Action
 */
export function StockReceiveReducer(
  state: StockReceiveState = initialState,
  action: StockReceiveActions
): StockReceiveState {
  switch (action.type) {
    case StockReceiveActionTypes.LOAD_PENDING_FACTORY_STN:
      return {
        ...state,
        isLoadingPendingFactorySTN: true,
        error: null
      };

    case StockReceiveActionTypes.LOAD_PENDING_FACTORY_STN_SUCCESS:
      return {
        ...state,
        pendingFactorySTN: stockAdapter.addMany(
          action.payload,
          state.pendingFactorySTN
        ),
        isLoadingPendingFactorySTN: false
      };

    case StockReceiveActionTypes.LOAD_PENDING_FACTORY_STN_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingPendingFactorySTN: false
      };

    case StockReceiveActionTypes.LOAD_PENDING_BOUTIQUE_STN:
      return {
        ...state,
        isLoadingPendingBoutiqueSTN: true,
        error: null
      };

    case StockReceiveActionTypes.LOAD_PENDING_BOUTIQUE_STN_SUCCESS:
      return {
        ...state,
        pendingBoutiqueSTN: stockAdapter.addMany(
          action.payload,
          state.pendingBoutiqueSTN
        ),
        isLoadingPendingBoutiqueSTN: false
      };

    case StockReceiveActionTypes.LOAD_PENDING_BOUTIQUE_STN_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingPendingBoutiqueSTN: false
      };

    case StockReceiveActionTypes.LOAD_PENDING_MERCHANDISE_STN:
      return {
        ...state,
        isLoadingPendingMerchandiseSTN: true,
        error: null
      };

    case StockReceiveActionTypes.LOAD_PENDING_MERCHANDISE_STN_SUCCESS:
      return {
        ...state,
        pendingMerchandiseSTN: stockAdapter.addMany(
          action.payload,
          state.pendingMerchandiseSTN
        ),
        isLoadingPendingMerchandiseSTN: false
      };

    case StockReceiveActionTypes.LOAD_PENDING_MERCHANDISE_STN_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingPendingMerchandiseSTN: false
      };

    case StockReceiveActionTypes.LOAD_PENDING_CFA_INVOICE:
      return {
        ...state,
        isLoadingPendingCFAInvoice: true,
        error: null
      };

    case StockReceiveActionTypes.LOAD_PENDING_CFA_INVOICE_SUCCESS:
      return {
        ...state,
        pendingCFAInvoice: stockAdapter.addMany(
          action.payload,
          state.pendingCFAInvoice
        ),
        isLoadingPendingCFAInvoice: false
      };

    case StockReceiveActionTypes.LOAD_PENDING_CFA_INVOICE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingPendingCFAInvoice: false
      };

    case StockReceiveActionTypes.SEARCH_PENDING_STOCKS:
    case StockReceiveActionTypes.FETCH_STN_FROM_ORACLE:
      return {
        ...state,
        isSearchingStocks: true,
        hasSearchStockResults: false,
        searchStockResults: stockAdapter.removeAll(state.searchStockResults),
        error: null
      };
    case StockReceiveActionTypes.SEARCH_PENDING_STOCKS_SUCCESS:
      return {
        ...state,
        searchStockResults: stockAdapter.setAll(
          action.payload,
          state.searchStockResults
        ),
        isSearchingStocks: false,
        hasSearchStockResults: true
      };

    case StockReceiveActionTypes.FETCH_STN_FROM_ORACLE_SUCCESS:
      return {
        ...state,
        searchStockResults: stockAdapter.setAll(
          action.payload,
          state.searchStockResults
        ),
        isSearchingStocks: false,
        hasSearchStockResults: true,
        oracleFetchInfo: {
          hasFecthed: action.payload.length !== 0
        }
      };

    case StockReceiveActionTypes.FETCH_STN_FROM_ORACLE_FAILURE:
    case StockReceiveActionTypes.SEARCH_PENDING_STOCKS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isSearchingStocks: false,
        hasSearchStockResults: true
      };

    case StockReceiveActionTypes.SEARCH_PENDING_INVOICES:
    case StockReceiveActionTypes.FETCH_INVOICE_FROM_ORACLE:
      return {
        ...state,
        isSearchingInvoices: true,
        hasSearchInvoiceResults: false,
        searchInvoiceResults: stockAdapter.removeAll(
          state.searchInvoiceResults
        ),
        error: null
      };
    case StockReceiveActionTypes.SEARCH_PENDING_INVOICES_SUCCESS:
      return {
        ...state,
        searchInvoiceResults: stockAdapter.setAll(
          action.payload,
          state.searchInvoiceResults
        ),
        isSearchingInvoices: false,
        hasSearchInvoiceResults: true
      };

    case StockReceiveActionTypes.FETCH_INVOICE_FROM_ORACLE_SUCCESS:
      return {
        ...state,
        searchInvoiceResults: stockAdapter.setAll(
          action.payload,
          state.searchInvoiceResults
        ),
        isSearchingInvoices: false,
        hasSearchInvoiceResults: true,
        oracleFetchInfo: {
          hasFecthed: action.payload.length !== 0
        }
      };

    case StockReceiveActionTypes.SEARCH_PENDING_INVOICES_SUCCESS:
    case StockReceiveActionTypes.FETCH_INVOICE_FROM_ORACLE_SUCCESS:
      return {
        ...state,
        searchInvoiceResults: stockAdapter.setAll(
          action.payload,
          state.searchInvoiceResults
        ),
        isSearchingInvoices: false,
        hasSearchInvoiceResults: true
      };

    case StockReceiveActionTypes.SEARCH_PENDING_INVOICES_FAILURE:
    case StockReceiveActionTypes.FETCH_INVOICE_FROM_ORACLE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isSearchingInvoices: false,
        hasSearchInvoiceResults: true
      };

    case StockReceiveActionTypes.SEARCH_CLEAR:
      return {
        ...state,
        searchStockResults: stockAdapter.removeAll(state.searchStockResults),
        searchInvoiceResults: stockAdapter.removeAll(
          state.searchInvoiceResults
        ),
        error: null,
        isSearchingStocks: false,
        hasSearchStockResults: false,
        isSearchingInvoices: false,
        hasSearchInvoiceResults: false
      };

    case StockReceiveActionTypes.CLEAR_SEARCH_RESULT:
      return {
        ...state,
        searchStockResults: stockAdapter.removeAll(state.searchStockResults),
        searchInvoiceResults: stockAdapter.removeAll(
          state.searchInvoiceResults
        ),
        error: null,
        hasSearchStockResults: true,
        hasSearchInvoiceResults: true
      };
  }
  switch (action.type) {
    case StockReceiveActionTypes.LOAD_SELECTED_STOCK:
      return {
        ...state,
        isLoadingSelectedStock: true,
        selectedStock: null,
        selectedInvoice: null,

        isItemsTotalCountLoading: false,
        isItemsTotalCountLoaded: null,

        items: itemAdapter.removeAll(state.items),
        isItemsLoading: false,
        isItemsLoaded: null,
        itemsCount: 0,
        totalCounts: {
          nonVerifiedItemsTotalCount: 0,
          verifiedItemsTotalCount: 0,
          isLoaded: false
        },

        isVerifyingAllItem: false,
        isVerifyingAllItemSuccess: null,

        isAssigningBinToAllItems: false,
        isAssigningBinToAllItemsSuccess: null,

        confirmedStock: null,
        isConfirmStockReceiveSuccess: null,
        isConfirmingStockReceive: false,

        error: null
      };

    case StockReceiveActionTypes.LOAD_SELECTED_STOCK_SUCCESS:
      return {
        ...state,
        selectedStock: action.payload,
        isLoadingSelectedStock: false
      };

    case StockReceiveActionTypes.LOAD_SELECTED_STOCK_FAILURE:
    case StockReceiveActionTypes.LOAD_SELECTED_INVOICE_FAILURE:
      return {
        ...state,
        isLoadingSelectedStock: false,
        error: action.payload
      };

    case StockReceiveActionTypes.LOAD_SELECTED_INVOICE:
      return {
        ...state,
        isLoadingSelectedStock: true,
        selectedInvoice: null,
        error: null,
        selectedStock: null,

        isItemsTotalCountLoading: false,
        isItemsTotalCountLoaded: null,

        items: itemAdapter.removeAll(state.items),
        isItemsLoading: false,
        isItemsLoaded: null,
        itemsCount: 0,
        totalCounts: {
          nonVerifiedItemsTotalCount: 0,
          verifiedItemsTotalCount: 0,
          isLoaded: false
        },

        isVerifyingAllItem: false,
        isVerifyingAllItemSuccess: null,

        isAssigningBinToAllItems: false,
        isAssigningBinToAllItemsSuccess: null,

        confirmedStock: null,
        isConfirmStockReceiveSuccess: null,
        isConfirmingStockReceive: false
      };

    case StockReceiveActionTypes.LOAD_SELECTED_INVOICE_SUCCESS:
      return {
        ...state,
        selectedInvoice: action.payload,
        isLoadingSelectedStock: false
      };

    case StockReceiveActionTypes.LOAD_ItEMS_COUNT:
      return {
        ...state,
        isItemsTotalCountLoading: true,
        isItemsTotalCountLoaded: null,
        error: null
      };

    case StockReceiveActionTypes.LOAD_ItEMS_COUNT_SUCCESS:
      return {
        ...state,
        totalCounts: {
          nonVerifiedItemsTotalCount: action.payload.nonVerifiedItemsTotalCount,
          verifiedItemsTotalCount: action.payload.verifiedItemsTotalCount,
          isLoaded: true
        },
        isItemsTotalCountLoading: false,
        isItemsTotalCountLoaded: true
      };

    case StockReceiveActionTypes.LOAD_ItEMS_COUNT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isItemsTotalCountLoading: false,
        isItemsTotalCountLoaded: false
      };

    case StockReceiveActionTypes.GET_TOTAL_MEASURED_WEIGHT:
      return {
        ...state,
        isTotalMeasuredWeightLoading: true,
        error: null
      };
    case StockReceiveActionTypes.GET_TOTAL_MEASURED_WEIGHT_SUCCESS:
      return {
        ...state,
        totalMeasuredWeight: action.payload.totalMeasuredWeight,
        isTotalMeasuredWeightLoading: false,
      };
    case StockReceiveActionTypes.GET_TOTAL_MEASURED_WEIGHT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isTotalMeasuredWeightLoading: false,
      };
    case StockReceiveActionTypes.LOAD_ITEMS:
    case StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY_ITEMS:
      return {
        ...state,
        isItemsLoading: true,
        isItemsLoaded: null,
        error: null
      };

    case StockReceiveActionTypes.LOAD_ITEMS_SUCCESS:
    case StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY_ITEMS_SUCCESS:
      return {
        ...state,
        items: itemAdapter.setAll(action.payload.items, state.items),
        itemsCount: action.payload.count,
        isItemsLoading: false,
        isItemsLoaded: true
      };

    case StockReceiveActionTypes.LOAD_ITEMS_FAILURE:
    case StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isItemsLoading: false,
        isItemsLoaded: false
      };

    case StockReceiveActionTypes.LOAD_BIN_CODES:
      return {
        ...state,
        isLoadingBinGroups: true,
        error: null
      };

    case StockReceiveActionTypes.LOAD_BIN_CODES_SUCCESS:
      return {
        ...state,
        binCodes: action.payload,
        isLoadingBinGroups: false
      };

    case StockReceiveActionTypes.LOAD_BIN_CODES_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingBinGroups: false
      };

    case StockReceiveActionTypes.LOAD_REMARKS:
      return {
        ...state,
        isLoadingRemarks: true,
        error: null
      };

    case StockReceiveActionTypes.LOAD_REMARKS_SUCCESS:
      return {
        ...state,
        remarks: action.payload,
        isLoadingRemarks: false
      };

    case StockReceiveActionTypes.LOAD_REMARKS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingRemarks: false
      };

    case StockReceiveActionTypes.LOAD_PRODUCT_GROUPS:
      return {
        ...state,
        isLoadingProductGroups: true,
        error: null
      };

    case StockReceiveActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        productGroups: action.payload,
        isLoadingProductGroups: false
      };

    case StockReceiveActionTypes.LOAD_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingProductGroups: false
      };

    case StockReceiveActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        studdedProductGroups: action.payload
      };

    case StockReceiveActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case StockReceiveActionTypes.LOAD_PRODUCT_CATEGORIES:
      return {
        ...state,
        isLoadingProductCategories: true,
        error: null
      };

    case StockReceiveActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS:
      return {
        ...state,
        productCategories: action.payload,
        isLoadingProductCategories: false
      };

    case StockReceiveActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingProductCategories: false
      };
  }
  switch (action.type) {
    case StockReceiveActionTypes.CLEAR_ITEMS:
      return {
        ...state,
        items: itemAdapter.removeAll(state.items)
      };

    case StockReceiveActionTypes.RESET_SEARCH:
      return {
        ...state,
        searchReset: { reset: action.payload }
      };
    case StockReceiveActionTypes.VERIFY_ITEM:
      return {
        ...state,
        items: itemAdapter.updateOne(
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
          state.items
        ),

        error: null,
        verifyItemSuccess: null
      };

    case StockReceiveActionTypes.VERIFY_ITEM_SUCCESS:
      return {
        ...state,
        verifyItemSuccess: true
      };

    case StockReceiveActionTypes.VERIFY_ITEM_FAILURE:
      return {
        ...state,
        items: itemAdapter.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              isUpdating: false,
              isUpdatingSuccess: false
            }
          },
          state.items
        ),

        error: action.payload.error,
        verifyItemSuccess: false
      };

    case StockReceiveActionTypes.UPADTE_ITEM:
      return {
        ...state,

        items: itemAdapter.updateOne(
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
          state.items
        ),
        updateItemSuccess: null,
        error: null
      };

    case StockReceiveActionTypes.UPADTE_ITEM_SUCCESS:
      return {
        ...state,
        items: itemAdapter.updateOne(
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

    case StockReceiveActionTypes.UPADTE_ITEM_FAILURE:
      return {
        ...state,
        items: itemAdapter.updateOne(
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
          state.items
        ),
        error: action.payload.error,
        updateItemSuccess: false
      };

    case StockReceiveActionTypes.VALIDATE_ITEM:
      return {
        ...state,
        items: itemAdapter.updateOne(
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

    case StockReceiveActionTypes.VALIDATE_ITEM_SUCCESS:
      return {
        ...state,
        items: itemAdapter.updateOne(
          {
            id: action.payload.itemId,
            changes: {
              isValidating: false,
              isValidatingSuccess: action.payload.isSuccess
            }
          },
          state.items
        )
      };

    case StockReceiveActionTypes.VALIDATE_ITEM_FAILURE:
      return {
        ...state,
        items: itemAdapter.updateOne(
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

    case StockReceiveActionTypes.VERIFY_ALL_ITEMS:
      return {
        ...state,
        isVerifyingAllItem: true,
        isVerifyingAllItemSuccess: null,
        error: null
      };

    case StockReceiveActionTypes.VERIFY_ALL_ITEMS_SUCCESS:
      return {
        ...state,
        items: itemAdapter.removeAll(state.items),
        totalCounts: {
          ...state.totalCounts,
          nonVerifiedItemsTotalCount: 0
        },

        isVerifyingAllItem: false,
        isVerifyingAllItemSuccess: true
      };

    case StockReceiveActionTypes.VERIFY_ALL_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isVerifyingAllItem: false,
        isVerifyingAllItemSuccess: false
      };

    case StockReceiveActionTypes.ASSIGN_BIN_ALL_ITEMS:
      return {
        ...state,
        isAssigningBinToAllItems: true,
        isAssigningBinToAllItemsSuccess: null,
        error: null
      };

    case StockReceiveActionTypes.ASSIGN_BIN_ALL_ITEMS_SUCCESS:
      return {
        ...state,
        isAssigningBinToAllItems: false,
        isAssigningBinToAllItemsSuccess: true
      };

    case StockReceiveActionTypes.ASSIGN_BIN_ALL_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isAssigningBinToAllItems: false,
        isAssigningBinToAllItemsSuccess: false
      };

    case StockReceiveActionTypes.CONFIRM_STOCK_RECEIVE:
      return {
        ...state,
        confirmedStock: null,
        isConfirmStockReceiveSuccess: null,
        isConfirmingStockReceive: true,
        error: null
      };

    case StockReceiveActionTypes.CONFIRM_STOCK_RECEIVE_SUCCESS:
      return {
        ...state,
        confirmedStock: action.payload,
        isConfirmStockReceiveSuccess: true,
        isConfirmingStockReceive: false,

        pendingFactorySTN: stockAdapter.removeAll(state.pendingFactorySTN),
        pendingBoutiqueSTN: stockAdapter.removeAll(state.pendingBoutiqueSTN),
        pendingCFAInvoice: stockAdapter.removeAll(state.pendingCFAInvoice),
        pendingMerchandiseSTN: stockAdapter.removeAll(
          state.pendingMerchandiseSTN
        )
      };

    case StockReceiveActionTypes.CONFIRM_STOCK_RECEIVE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isConfirmStockReceiveSuccess: false,
        isConfirmingStockReceive: false
      };

    case StockReceiveActionTypes.RESET_ERROR:
      return {
        ...state,
        error: null
      };

    case StockReceiveActionTypes.CLEAR_STOCKS:
      return {
        ...state,
        pendingFactorySTN: stockAdapter.removeAll(state.pendingFactorySTN),
        pendingBoutiqueSTN: stockAdapter.removeAll(state.pendingBoutiqueSTN),
        pendingCFAInvoice: stockAdapter.removeAll(state.pendingCFAInvoice),
        pendingMerchandiseSTN: stockAdapter.removeAll(
          state.pendingMerchandiseSTN
        )
      };
  }
  switch (action.type) {
    case StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY:
    case StockReceiveActionTypes.LOAD_STOCK_RECEIVE_INVOICE_HISTORY:
      return {
        ...state,
        isLoadingHistory: true
      };
    case StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY_SUCCESS:
    case StockReceiveActionTypes.LOAD_STOCK_RECEIVE_INVOICE_HISTORY_SUCCESS:
      return {
        ...state,
        isLoadingHistory: false,
        stockReceiveHistory: stockAdapter.addMany(
          action.payload.stocks,
          state.stockReceiveHistory
        ),
        totalElements: action.payload.count
      };
    case StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY_FAILURE:
    case StockReceiveActionTypes.LOAD_STOCK_RECEIVE_INVOICE_HISTORY_FAILURE:
      return {
        ...state,
        isLoadingHistory: false,
        error: action.payload
      };
    case StockReceiveActionTypes.RESET_STOCK_RECEIVE_HISTORY:
      return {
        ...state,
        stockReceiveHistory: stockAdapter.removeAll(state.stockReceiveHistory),
        totalElements: 0
      };
    case StockReceiveActionTypes.STORE_HISTORY_TYPE:
      return {
        ...state,
        historyType: action.payload
      };
    case StockReceiveActionTypes.STORE_ADVANCED_FILTER_DATE:
      return {
        ...state,
        advancedFilter: action.payload
      };
    case StockReceiveActionTypes.RESET_ADVANCE_FILTER:
      return {
        ...state,
        advancedFilter: {
          docFromDate: action.payload,
          docToDate: action.payload,
          stnNumber: null,
          sourceLocationCode: null,
          fiscalYear: null,
          docNumber: null
        }
      };
      
    // Image
    case StockReceiveActionTypes.LOAD_THUMBNAIL_IMAGE_URL:
      return {
        ...state,
        error: null,
        items: itemAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              isLoadingThumbnailImage: true
            }
          },
          state.items
        )
      };
    case StockReceiveActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS:
      return {
        ...state,
        items: itemAdapter.updateOne(
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

    case StockReceiveActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE:
      return {
        ...state,
        items: itemAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              isLoadingThumbnailImage: false
            }
          },
          state.items
        )
      };

    case StockReceiveActionTypes.LOAD_IMAGE_URL:
      return {
        ...state,
        error: null,
        isLoadingImage: true,
        items: itemAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              isLoadingImage: true
            }
          },
          state.items
        )
      };
    case StockReceiveActionTypes.LOAD_IMAGE_URL_SUCCESS:
    case StockReceiveActionTypes.LOAD_IMAGE_URL_FAILURE:
      return {
        ...state,
        isLoadingImage: false,
        items: itemAdapter.updateOne(
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
  return state;
}
