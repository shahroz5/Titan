import { StockReturnState } from './stock-return.state';
import {
  StockReturnActions,
  StockReturnActionTypes
} from './stock-return.actions';
import { itemAdaptor, requestInvoiceAdaptor } from './stock-return.entity';
import { createFeatureSelector } from '@ngrx/store';
import * as moment from 'moment';

export const STOCK_RETURN_FEATURE_KEY = 'stockReturn';

export const selectStockReturnState = createFeatureSelector<StockReturnState>(
  STOCK_RETURN_FEATURE_KEY
);

/**
 * Initial state of the store
 */
export const initialState: StockReturnState = {
  newRequestId: null,
  loadedItems: itemAdaptor.getInitialState(),
  sortedItems: itemAdaptor.getInitialState(),
  items: itemAdaptor.getInitialState(),
  isLoading: false,
  hasSearchedItem: null,
  searchedItems: itemAdaptor.getInitialState(),
  invoiceNumber: null,
  hasIssued: null,
  CFAddress: null,
  totalItemCount: 0,
  selectedProductsSearchCount: null,
  hasSearched: false,
  hasLoaded: false,
  error: null,
  hasUpdated: null,
  hasRemovedMultipleItems: null,
  hasSelectedProductsSearch: null,
  searchCount: null,

  courierDetails: null,
  headerLevelDetails: null,
  productCategories: [],
  productGroups: [],
  employeeCodes: [],
  employeeDetails: null,
  invoiceHistory: requestInvoiceAdaptor.getInitialState(),
  totalHistoryInvoiceItems: 0,
  isLoadingHistory: null,
  advancedFilter: {
    docFromDate: null,
    docToDate: null,
    fiscalYear: null,
    invoiceNumber: null
  },
  historyType: null,
  studdedProductGroups: [],
  isLoadingImage: false
};

/**
 * The reducer function which manipulates the store for respective Action
 */
export function stockReturnReducer(
  state: StockReturnState = initialState,
  action: StockReturnActions
): StockReturnState {
  switch (action.type) {
    case StockReturnActionTypes.CREATE_REQUEST_TO_CFA:
      return { ...state, newRequestId: null, isLoading: true };
    case StockReturnActionTypes.CREATE_REQUEST_TO_CFA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        newRequestId: action.payload
      };
    case StockReturnActionTypes.CONFIRM_ISSUE:
      return {
        ...state,
        invoiceNumber: null
      };

    case StockReturnActionTypes.CONFIRM_ISSUE_SUCCESS:
      return {
        ...state,
        invoiceNumber: action.payload
      };

    case StockReturnActionTypes.SEARCH_ITEM:
      console.log('payload1233333', action.payload);
      return {
        ...state,
        hasSearched: true,
        hasSearchedItem: false
      };
    case StockReturnActionTypes.SEARCH_ITEM_SUCCESS:
      console.log('payload1233333', action.payload);
      return {
        ...state,
        hasSearched: false,
        hasSearchedItem: true,
        searchedItems: itemAdaptor.setAll(
          action.payload.items,
          state.searchedItems
        ),
        searchCount: action.payload.count
      };

    case StockReturnActionTypes.SEARCH_ITEM_FAILURE:
      return {
        ...state,
        hasSearched: false,
        hasSearchedItem: false,
        error: action.payload
      };
    case StockReturnActionTypes.CREATE_ISSUE_ITEMS:
      return {
        ...state,
        isLoading: true,
        hasIssued: null
      };
    case StockReturnActionTypes.CREATE_ISSUE_ITEMS_SUCCESS:
      return {
        ...state,
        hasIssued: true,
        isLoading: false
      };
    case StockReturnActionTypes.CREATE_ISSUE_ITEMS_FAILURE:
      return {
        ...state,
        hasIssued: false,
        isLoading: false,
        error: action.payload
      };

    case StockReturnActionTypes.CLEAR_SEARCH:
      return {
        ...state,
        searchedItems: itemAdaptor.removeAll(state.searchedItems),
        isLoading: false,
        totalItemCount: 0,
        selectedProductsSearchCount: null,
        invoiceNumber: null,
        loadedItems: itemAdaptor.removeAll(state.loadedItems),
        hasSearchedItem: null
      };

    case StockReturnActionTypes.CLEAR_SEARCH_ITEMS:
      return {
        ...state,
        searchedItems: itemAdaptor.removeAll(state.searchedItems),
        isLoading: false,
        selectedProductsSearchCount: null,
        hasSearchedItem: null
      };

    case StockReturnActionTypes.LOAD_ITEMS:
      return {
        ...state,
        isLoading: true,
        selectedProductsSearchCount: null
      };
    case StockReturnActionTypes.LOAD_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasLoaded: true,
        loadedItems: itemAdaptor.setAll(
          action.payload.items,
          state.loadedItems
        ),
        totalItemCount: action.payload.count
      };
    case StockReturnActionTypes.LOAD_ITEM_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasLoaded: false,
        error: action.payload,
        totalItemCount: 0
      };

      case StockReturnActionTypes.LOAD_ITEMS_CFA:
        return {
          ...state,
          isLoading: true,
          selectedProductsSearchCount: null
        };
      case StockReturnActionTypes.LOAD_ITEMS_SUCCESS_CFA:
        return {
          ...state,
          isLoading: false,
          hasLoaded: true,
          loadedItems: itemAdaptor.setAll(
            action.payload.items,
            state.loadedItems
          ),
          totalItemCount: action.payload.count
        };
      case StockReturnActionTypes.LOAD_ITEMS_FAILURE_CFA:
        return {
          ...state,
          isLoading: false,
          hasLoaded: false,
          error: action.payload,
          totalItemCount: 0
        };

    case StockReturnActionTypes.REMOVE_SELECTED_ITEMS:
      return {
        ...state,
        isLoading: true,
        hasRemovedMultipleItems: false
      };
    case StockReturnActionTypes.REMOVE_SELECTED_ITEMS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasRemovedMultipleItems: true
      };
    case StockReturnActionTypes.REMOVE_SELECTED_ITEMS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasRemovedMultipleItems: false,
        error: action.payload
      };
    case StockReturnActionTypes.SELECTED_PRODUCTS_SEARCH:
      return {
        ...state,
        isLoading: true,
        hasSelectedProductsSearch: null
      };
    case StockReturnActionTypes.SELECTED_PRODUCTS_SEARCH_SUCESSS:
      return {
        ...state,
        isLoading: false,
        hasSelectedProductsSearch: true,
        loadedItems: itemAdaptor.setAll(
          action.payload.items,
          state.loadedItems
        ),
        selectedProductsSearchCount: action.payload.count
      };
    case StockReturnActionTypes.SELECTED_PRODUCTS_SEARCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSelectedProductsSearch: false,
        error: action.payload
      };

    case StockReturnActionTypes.LOAD_COURIER_DETAILS_SUCCESS:
      return {
        ...state,
        courierDetails: action.payload,
        isLoading: false,
        error: null
      };
    case StockReturnActionTypes.LOAD_COURIER_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case StockReturnActionTypes.LOAD_HEADER_LEVEL_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        headerLevelDetails: action.payload
      };

    case StockReturnActionTypes.LOAD_PRODUCT_CATEGORIES:
    case StockReturnActionTypes.LOAD_PROUDCT_GROUPS:
    case StockReturnActionTypes.LOAD_HEADER_LEVEL_DETAILS:
    case StockReturnActionTypes.LOAD_COURIER_DETAILS:
    case StockReturnActionTypes.LOAD_CFA_LOCATION_CODE:
    case StockReturnActionTypes.LOAD_EMPLOYEE_DETAILS:
    case StockReturnActionTypes.LOAD_EMPLOYEE_CODES:
      return { ...state, isLoading: true, error: null };
    case StockReturnActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS:
      return {
        ...state,
        productCategories: action.payload,
        isLoading: false,
        error: null
      };
  }
  switch (action.type) {
    case StockReturnActionTypes.LOAD_CFA_LOCATION_CODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        CFAddress: action.payload
      };
    case StockReturnActionTypes.CONFIRM_ISSUE_FAILURE:
    case StockReturnActionTypes.CREATE_REQUEST_TO_CFA_FAILURE:
    case StockReturnActionTypes.LOAD_CFA_LOCATION_CODE_FAILURE:
    case StockReturnActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE:
    case StockReturnActionTypes.LOAD_PROUDCT_GROUPS_FAILURE:
    case StockReturnActionTypes.LOAD_HEADER_LEVEL_DETAILS_FAILURE:
    case StockReturnActionTypes.LOAD_EMPLOYEE_CODES_FAILURE:
    case StockReturnActionTypes.LOAD_EMPLOYEE_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case StockReturnActionTypes.LOAD_PROUDCT_GROUPS_SUCCESS:
      return {
        ...state,
        productGroups: action.payload,
        isLoading: false,
        error: null
      };

    case StockReturnActionTypes.LOAD_EMPLOYEE_CODES_SUCCESS:
      return {
        ...state,
        employeeCodes: action.payload,
        isLoading: false
      };
    case StockReturnActionTypes.LOAD_EMPLOYEE_DETAILS_SUCCESS:
      return {
        ...state,
        employeeDetails: action.payload,
        isLoading: false
      };
    case StockReturnActionTypes.LOAD_ISSUE_INVOICE_HISTORY:
      return {
        ...state,
        isLoadingHistory: true,
        error: null
      };
    case StockReturnActionTypes.LOAD_ISSUE_INVOICE_HISTORY_SUCCESS:
      return {
        ...state,
        invoiceHistory: requestInvoiceAdaptor.addMany(
          action.payload.requestInvoice,
          state.invoiceHistory
        ),
        totalHistoryInvoiceItems: action.payload.totalElements,
        isLoadingHistory: false
      };
    case StockReturnActionTypes.LOAD_ISSUE_INVOICE_HISTORY_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingHistory: false
      };
    case StockReturnActionTypes.STORE_HISTORY_TYPE:
      return {
        ...state,
        historyType: action.payload
      };
    case StockReturnActionTypes.STORE_ADVANCED_FILTER_DATE:
      return {
        ...state,
        advancedFilter: action.payload
      };
    case StockReturnActionTypes.RESET_STOCK_RETURN_HISTORY:
      return {
        ...state,
        invoiceHistory: requestInvoiceAdaptor.removeAll(state.invoiceHistory),
        totalHistoryInvoiceItems: 0
      };
    case StockReturnActionTypes.RESET_STOCK_RETURN_ITEMS:
      return {
        ...state,
        loadedItems: itemAdaptor.removeAll(state.loadedItems),
        hasSelectedProductsSearch: false,
        selectedProductsSearchCount: 0
      };
    case StockReturnActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        studdedProductGroups: action.payload
      };

    case StockReturnActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case StockReturnActionTypes.RESET_ERROR:
      return {
        ...state,
        error: null
      };
    case StockReturnActionTypes.RESET_ADVANCE_FILTER:
      return {
        ...state,
        advancedFilter: {
          docFromDate: moment(action.payload).startOf('day').valueOf(),
          docToDate: moment(action.payload).endOf('day').valueOf(),
          fiscalYear: null,
          invoiceNumber: null
        }
      };
            
    // Image
    case StockReturnActionTypes.LOAD_THUMBNAIL_IMAGE_URL:
      return {
        ...state,
        error: null,
        searchedItems: itemAdaptor.updateOne(
          {
            id: action.payload.id,
            changes: {
              isLoadingThumbnailImage: true
            }
          },
          state.searchedItems
        ),
        loadedItems: itemAdaptor.updateOne(
          {
            id: action.payload.id,
            changes: {
              isLoadingThumbnailImage: true
            }
          },
          state.loadedItems
        )
      };
      
    case StockReturnActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS:
      return {
        ...state,
        searchedItems: itemAdaptor.updateOne(
          {
            id: action.payload.id,
            changes: {
              thumbnailImageURL: action.payload.thumbnailImageUrl,
              isLoadingThumbnailImage: false
            }
          },
          state.searchedItems
        ),
        loadedItems: itemAdaptor.updateOne(
          {
            id: action.payload.id,
            changes: {
              thumbnailImageURL: action.payload.thumbnailImageUrl,
              isLoadingThumbnailImage: false
            }
          },
          state.loadedItems
        )
      };

    case StockReturnActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE:
      return {
        ...state,
        searchedItems: itemAdaptor.updateOne(
          {
            id: action.payload.id,
            changes: {
              isLoadingThumbnailImage: false
            }
          },
          state.searchedItems
        ),
        loadedItems: itemAdaptor.updateOne(
          {
            id: action.payload.id,
            changes: {
              isLoadingThumbnailImage: false
            }
          },
          state.loadedItems
        )
      };

    case StockReturnActionTypes.LOAD_IMAGE_URL:
      if(action.payload?.isSearchedItem){
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          searchedItems: itemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingImage: true
              }
            },
            state.searchedItems
          )
        };
      } else{
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          loadedItems: itemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingImage: true
              }
            },
            state.loadedItems
          )
        };
      }
    case StockReturnActionTypes.LOAD_IMAGE_URL_SUCCESS:
    case StockReturnActionTypes.LOAD_IMAGE_URL_FAILURE:
      if(action.payload?.isSearchedItem){
        return {
          ...state,
          isLoadingImage: false,
          searchedItems: itemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
            },
            state.searchedItems
          )
        };
      } else{
        return {
          ...state,
          isLoadingImage: false,
          loadedItems: itemAdaptor.updateOne(
            {
              id: action.payload.id,
              changes: {
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
            },
            state.loadedItems
          )
        };
      }
  }
  return state;
}
