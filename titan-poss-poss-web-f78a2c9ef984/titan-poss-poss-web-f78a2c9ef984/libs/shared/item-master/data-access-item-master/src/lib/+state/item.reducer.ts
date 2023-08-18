import { createFeatureSelector } from '@ngrx/store';

import { ItemListingState } from './item.state';
import { ItemActions, ItemActionTypes } from './item.actions';

export const ITEM_FEATURE_KEY = 'Item';
export const selectItemState = createFeatureSelector<ItemListingState>(
  ITEM_FEATURE_KEY
);

export const initialState: ItemListingState = {
  itemListing: null,
  itemDetails: null,
  totalItemDetails: 0,
  isLoading: false,
  error: null,
  itemStones: null,
  itemFilter: null,
  filterPayload: null,
  pricingType: null,
  CFAproductCode: null
};

export function ItemReducer(
  state: ItemListingState = initialState,
  action: ItemActions
): ItemListingState {
  switch (action.type) {
    case ItemActionTypes.LOAD_ITEM_DETAILS_BY_ITEM_CODE:
    case ItemActionTypes.LOAD_STONES:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ItemActionTypes.LOAD_PRICING_TYPES:
    case ItemActionTypes.LOAD_CFAPRODUCT_CODE:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ItemActionTypes.LOAD_ITEM_FILTER:
      return {
        ...state,
        itemFilter: action.payload,
        isLoading: true,
        error: null
      };
    case ItemActionTypes.STORE_FILTER_DATA:
      return {
        ...state,
        filterPayload: action.payload
      };

    case ItemActionTypes.RESET_FILTER_DATA:
      return {
        ...state,
        itemFilter: null,
        filterPayload: null,
        isLoading: false,
        itemListing: null,
        totalItemDetails: 0,
        pricingType: null,
        CFAproductCode: null,
        error: null
      };

    case ItemActionTypes.LOAD_ITEM_FILTER_SUCCESS:
      return {
        ...state,
        itemListing: action.payload.itemListing,
        totalItemDetails: action.payload.totalElements,
        isLoading: false
      };

    case ItemActionTypes.LOAD_ITEM_DETAILS_BY_ITEM_CODE_SUCCESS:
      return {
        ...state,
        itemDetails: action.payload,
        isLoading: false
      };
    case ItemActionTypes.LOAD_STONES_SUCCESS:
      return {
        ...state,
        itemStones: action.payload
      };
    case ItemActionTypes.LOAD_PRICING_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pricingType: action.payload
      };
    case ItemActionTypes.LOAD_CFAPRODUCT_CODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        CFAproductCode: action.payload
      };
    case ItemActionTypes.LOAD_ITEM_DETAILS_BY_ITEM_CODE_FAILURE:
    case ItemActionTypes.LOAD_STONES_FAILURE:
    case ItemActionTypes.LOAD_ITEM_FILTER_FAILURE:
    case ItemActionTypes.LOAD_PRICING_TYPES_FAILURE:
    case ItemActionTypes.LOAD_CFAPRODUCT_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case ItemActionTypes.RESET_ITEM_DETAILS_BY_ITEM_CODE:
      return {
        ...state,
        itemDetails: null
      };

    // case ItemActionTypes.SEARCH_ITEM:
    //   return {
    //     ...state,
    //     isLoading: true
    //   };
    // case ItemActionTypes.SEARCH_ITEM_SUCCESS:
    //   console.log(action.payload, 'in red');

    //   return {
    //     ...state,
    //     itemListing: action.payload,
    //     totalItemDetails: 1,
    //     isLoading: false
    //   };
    // case ItemActionTypes.SEARCH_ITEM_FAILURE:
    //   return {
    //     ...state,
    //     error: action.payload,
    //     isLoading: false,
    //     itemListing: null,
    //     totalItemDetails: null
    //   };

    default:
      return state;
  }
}
