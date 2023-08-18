import { createFeatureSelector } from '@ngrx/store';

import { IssueTEPState } from './stock-issue-tep-gep.state';
import {
  IssueTEPActionTypes,
  IssueTEPActions
} from './stock-issue-tep-gep.action';
import {
  itemsAdapter,
  stockIssueItemsAdapter
} from './stock-issue-tep-gep.entity';
import { CreateStockIssueResponse } from '@poss-web/shared/models';

export const tepGepFeatureKey = 'issueTepGep';

export const selectIssueTEPGEPState = createFeatureSelector<IssueTEPState>(
  tepGepFeatureKey
);

export const initialState: IssueTEPState = {
  createStockIssueResponse: {} as CreateStockIssueResponse,
  updateStockIssueResponse: {} as CreateStockIssueResponse,
  createStockIssueItemsResponse: false,
  updateAllStockIssueItemsResponse: false,
  items: itemsAdapter.getInitialState(),
  stockIssueItems: stockIssueItemsAdapter.getInitialState(),
  searchItems: itemsAdapter.getInitialState(),
  searchStockIssueItems: stockIssueItemsAdapter.getInitialState(),
  totalItemsCount: 0,
  totalStockIssueItemsCount: 0,
  factoryAddress: null,
  cfaAddress: null,
  productCategories: [],
  productGroups: [],
  courierDetails: [],
  employeeCodes: [],
  employeeDetails: [],
  sortDataItems: [],
  sortDataStockIssueItems: [],
  filterDataItems: {},
  filterDataStockIssueItems: {},
  studdedProductGroups: [],
  hasError: null,
  isLoading: false,
  isLoadingImage: false,
  LocationCode: [],
  selectedStockIssueResponse: {} as CreateStockIssueResponse
};

export function issueTEPReducer(
  state: IssueTEPState = initialState,
  action: IssueTEPActions
): IssueTEPState {
  switch (action.type) {
    case IssueTEPActionTypes.CREATE_STOCK_ISSUE:
    case IssueTEPActionTypes.UPDATE_STOCK_ISSUE:
    case IssueTEPActionTypes.LOAD_ITEMS:
    case IssueTEPActionTypes.UPDATE_ALL_STOCK_ISSUE_ITEMS:
    case IssueTEPActionTypes.CREATE_STOCK_ISSUE_ITEMS:
    case IssueTEPActionTypes.LOAD_STOCK_ISSUE_ITEMS:
    case IssueTEPActionTypes.LOAD_TOTAL_ITEMS_COUNT:
    case IssueTEPActionTypes.LOAD_TOTAL_STOCK_ISSUE_ITEMS_COUNT:
    case IssueTEPActionTypes.LOAD_EMPLOYEE_DETAILS:
    case IssueTEPActionTypes.LOAD_STUDDED_PRODUCT_GROUPS:
      return { ...state, isLoading: true, hasError: null };

    case IssueTEPActionTypes.CREATE_STOCK_ISSUE_FAILURE:
    case IssueTEPActionTypes.UPDATE_STOCK_ISSUE_FAILURE:
    case IssueTEPActionTypes.LOAD_ITEMS_FAILURE:
    case IssueTEPActionTypes.UPDATE_ALL_STOCK_ISSUE_ITEMS_FAILURE:
    case IssueTEPActionTypes.CREATE_STOCK_ISSUE_ITEMS_FAILURE:
    case IssueTEPActionTypes.LOAD_STOCK_ISSUE_ITEMS_FAILURE:
    case IssueTEPActionTypes.LOAD_TOTAL_ITEMS_COUNT_FAILURE:
    case IssueTEPActionTypes.LOAD_TOTAL_STOCK_ISSUE_ITEMS_COUNT_FAILURE:
    case IssueTEPActionTypes.LOAD_EMPLOYEE_DETAILS_FAILURE:
    case IssueTEPActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case IssueTEPActionTypes.CREATE_STOCK_ISSUE_SUCCESS:
      return {
        ...state,
        createStockIssueResponse: action.payload,
        isLoading: false,
        hasError: null
      };

    case IssueTEPActionTypes.LOAD_SELECTED_STOCK_ISSUE:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        selectedStockIssueResponse: {} as CreateStockIssueResponse
      };

    case IssueTEPActionTypes.LOAD_SELECTED_STOCK_ISSUE_SUCCESS:
      return {
        ...state,
        selectedStockIssueResponse: action.payload,
        isLoading: false,
        hasError: null
      };

    case IssueTEPActionTypes.LOAD_SELECTED_STOCK_ISSUE_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false,
        selectedStockIssueResponse: {} as CreateStockIssueResponse
      };

    case IssueTEPActionTypes.UPDATE_STOCK_ISSUE_SUCCESS:
      return {
        ...state,
        updateStockIssueResponse: action.payload,
        isLoading: false,
        hasError: null
      };

    case IssueTEPActionTypes.LOAD_ITEMS_SUCCESS:
      return {
        ...state,
        items: itemsAdapter.setAll(action.payload, state.items),
        isLoading: false,
        hasError: null
      };

    case IssueTEPActionTypes.UPDATE_ALL_STOCK_ISSUE_ITEMS_SUCCESS:
      return {
        ...state,
        updateAllStockIssueItemsResponse: action.payload,
        isLoading: false,
        hasError: null
      };

    case IssueTEPActionTypes.CREATE_STOCK_ISSUE_ITEMS_SUCCESS:
      return {
        ...state,
        createStockIssueItemsResponse: action.payload,
        isLoading: false,
        hasError: null
      };

    case IssueTEPActionTypes.LOAD_STOCK_ISSUE_ITEMS_SUCCESS:
      return {
        ...state,
        stockIssueItems: stockIssueItemsAdapter.setAll(
          action.payload,
          state.stockIssueItems
        ),
        isLoading: false,
        hasError: null
      };

    case IssueTEPActionTypes.SEARCH_CLEAR:
      return {
        ...state,
        searchItems: itemsAdapter.removeAll(state.searchItems),
        searchStockIssueItems: itemsAdapter.removeAll(
          state.searchStockIssueItems
        ),
        hasError: null,
        isLoading: false
      };

    case IssueTEPActionTypes.RESET_LIST:
      return {
        ...state,
        items: itemsAdapter.removeAll(state.items),
        stockIssueItems: itemsAdapter.removeAll(state.stockIssueItems),
        hasError: null,
        isLoading: false
      };

    case IssueTEPActionTypes.RESET_RESPONSE:
      return {
        ...state,
        updateAllStockIssueItemsResponse: false,
        createStockIssueItemsResponse: false,
        totalItemsCount: 0,
        totalStockIssueItemsCount: 0,
        hasError: null,
        isLoading: false
      };

    case IssueTEPActionTypes.RESET_ALL:
      return {
        ...state,
        createStockIssueResponse: {} as CreateStockIssueResponse,
        updateStockIssueResponse: {} as CreateStockIssueResponse,
        createStockIssueItemsResponse: false,
        updateAllStockIssueItemsResponse: false,
        items: itemsAdapter.removeAll(state.items),
        stockIssueItems: itemsAdapter.removeAll(state.stockIssueItems),
        searchItems: itemsAdapter.removeAll(state.searchItems),
        searchStockIssueItems: stockIssueItemsAdapter.removeAll(
          state.searchStockIssueItems
        ),
        totalItemsCount: 0,
        totalStockIssueItemsCount: 0,
        factoryAddress: null,
        cfaAddress: null,
        productCategories: null,
        productGroups: null,
        courierDetails: [],
        employeeCodes: null,
        employeeDetails: null,
        sortDataItems: [],
        sortDataStockIssueItems: [],
        filterDataItems: {},
        filterDataStockIssueItems: {},
        studdedProductGroups: [],
        hasError: null,
        isLoading: false,
        selectedStockIssueResponse: {} as CreateStockIssueResponse
      };

    case IssueTEPActionTypes.LOAD_TOTAL_ITEMS_COUNT_SUCCESS:
      return {
        ...state,
        totalItemsCount: action.payload,
        isLoading: false,
        hasError: null
      };

    case IssueTEPActionTypes.LOAD_TOTAL_STOCK_ISSUE_ITEMS_COUNT_SUCCESS:
      return {
        ...state,
        totalStockIssueItemsCount: action.payload,
        isLoading: false,
        hasError: null
      };

    case IssueTEPActionTypes.LOAD_EMPLOYEE_DETAILS_SUCCESS:
      return {
        ...state,
        employeeDetails: action.payload,
        isLoading: false,
        hasError: null
      };

    case IssueTEPActionTypes.SET_SORT_DATA_ITEMS:
      return {
        ...state,
        sortDataItems: action.payload
      };
    case IssueTEPActionTypes.SET_SORT_DATA_STOCK_ISSUE_ITEMS:
      return {
        ...state,
        sortDataStockIssueItems: action.payload
      };

    case IssueTEPActionTypes.SET_FILTER_DATA_ITEMS:
      return {
        ...state,
        filterDataItems: action.payload
      };
    case IssueTEPActionTypes.SET_FILTER_DATA_STOCK_ISSUE_ITEMS:
      return {
        ...state,
        filterDataStockIssueItems: action.payload
      };
  }
  switch (action.type) {
    case IssueTEPActionTypes.LOAD_FACTORY_ADDRESS:
      return {
        ...state,
        isFactoryAddressLoading: true,
        hasError: null
      };
    case IssueTEPActionTypes.LOAD_FACTORY_ADDRESS_SUCCESS:
      return {
        ...state,
        factoryAddress: action.payload,
        isFactoryAddressLoading: false,
        hasError: null
      };
    case IssueTEPActionTypes.LOAD_FACTORY_ADDRESS_FAILURE:
      return {
        ...state,
        isFactoryAddressLoading: false,
        hasError: action.payload
      };

    case IssueTEPActionTypes.LOAD_CFA_ADDRESS:
      return {
        ...state,
        hasError: null
      };
    case IssueTEPActionTypes.LOAD_CFA_ADDRESS_SUCCESS:
      return {
        ...state,
        cfaAddress: action.payload,
        hasError: null
      };
    case IssueTEPActionTypes.LOAD_CFA_ADDRESS_FAILURE:
      return {
        ...state,
        hasError: action.payload
      };

    case IssueTEPActionTypes.LOAD_PRODUCT_CATEGORIES:
      return {
        ...state,
        isProductCategoriesLoading: true,
        hasError: null
      };
    case IssueTEPActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS:
      return {
        ...state,
        productCategories: action.payload,
        isProductCategoriesLoading: false,
        hasError: null
      };
    case IssueTEPActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE:
      return {
        ...state,
        isProductCategoriesLoading: false,
        hasError: action.payload
      };

    case IssueTEPActionTypes.LOAD_PROUDCT_GROUPS:
      return {
        ...state,
        isProductGroupsLoading: true,
        hasError: null
      };
    case IssueTEPActionTypes.LOAD_PROUDCT_GROUPS_SUCCESS:
      return {
        ...state,
        productGroups: action.payload,
        isProductGroupsLoading: false,
        hasError: null
      };
    case IssueTEPActionTypes.LOAD_PROUDCT_GROUPS_FAILURE:
      return {
        ...state,
        isProductGroupsLoading: false,
        hasError: action.payload
      };

    case IssueTEPActionTypes.LOAD_COURIER_DETAILS:
      return {
        ...state,
        isCourierDetailsLoading: true,
        hasError: null
      };
    case IssueTEPActionTypes.LOAD_COURIER_DETAILS_SUCCESS:
      return {
        ...state,
        courierDetails: action.payload,
        isCourierDetailsLoading: false,
        hasError: null
      };
    case IssueTEPActionTypes.LOAD_COURIER_DETAILS_FAILURE:
      return {
        ...state,
        isCourierDetailsLoading: false,
        hasError: action.payload
      };

    case IssueTEPActionTypes.LOAD_LOCATION_CODES:
      return {
        ...state,
        hasError: null
      };
    case IssueTEPActionTypes.LOAD_LOCATION_CODES_SUCCESS:
      return {
        ...state,
        LocationCode: action.payload,
        hasError: null
      };
    case IssueTEPActionTypes.LOAD_LOCATION_CODES_FAILURE:
      return {
        ...state,
        hasError: action.payload
      };

    case IssueTEPActionTypes.LOAD_EMPLOYEE_CODES:
      return {
        ...state,
        isEmployeeCodesLoading: true,
        hasError: null
      };
    case IssueTEPActionTypes.LOAD_EMPLOYEE_CODES_SUCCESS:
      return {
        ...state,
        employeeCodes: action.payload,
        isEmployeeCodesLoading: false,
        hasError: null
      };
    case IssueTEPActionTypes.LOAD_EMPLOYEE_CODES_FAILURE:
      return {
        ...state,
        isEmployeeCodesLoading: false,
        hasError: action.payload
      };

    case IssueTEPActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        studdedProductGroups: action.payload
      };

    // Image
    case IssueTEPActionTypes.LOAD_THUMBNAIL_IMAGE_URL:
      if (action.payload?.isSearchedItem) {
        return {
          ...state,
          hasError: null,
          stockIssueItems: stockIssueItemsAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: true
              }
            },
            state.stockIssueItems
          )
        };
      } else {
        return {
          ...state,
          hasError: null,
          items: itemsAdapter.updateOne(
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
    case IssueTEPActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS:
      if (action.payload?.isSearchedItem) {
        return {
          ...state,
          stockIssueItems: stockIssueItemsAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                thumbnailImageURL: action.payload.thumbnailImageUrl,
                isLoadingThumbnailImage: false
              }
            },
            state.stockIssueItems
          )
        };
      } else {
        return {
          ...state,
          items: itemsAdapter.updateOne(
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

    case IssueTEPActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE:
      if (action.payload?.isSearchedItem) {
        return {
          ...state,
          stockIssueItems: stockIssueItemsAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: false
              }
            },
            state.stockIssueItems
          )
        };
      } else {
        return {
          ...state,
          items: itemsAdapter.updateOne(
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

    case IssueTEPActionTypes.LOAD_IMAGE_URL:
      if (action.payload?.isSearchedItem) {
        return {
          ...state,
          hasError: null,
          isLoadingImage: true,
          stockIssueItems: stockIssueItemsAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingImage: true
              }
            },
            state.stockIssueItems
          )
        };
      } else {
        return {
          ...state,
          hasError: null,
          isLoadingImage: true,
          items: itemsAdapter.updateOne(
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
    case IssueTEPActionTypes.LOAD_IMAGE_URL_SUCCESS:
    case IssueTEPActionTypes.LOAD_IMAGE_URL_FAILURE:
      if (action.payload?.isSearchedItem) {
        return {
          ...state,
          isLoadingImage: false,
          stockIssueItems: stockIssueItemsAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
            },
            state.stockIssueItems
          )
        };
      } else {
        return {
          ...state,
          isLoadingImage: false,
          items: itemsAdapter.updateOne(
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
