import { createFeatureSelector } from '@ngrx/store';
import { FindPriceActions, FindPriceActionTypes } from './find-price.actions';
import { FindPriceState, findPriceFeatureKey } from './find-price.state';

export const selectFindPriceState = createFeatureSelector<FindPriceState>(
  findPriceFeatureKey
);

export const initialState: FindPriceState = {
  hasError: null,
  isLoading: false,
  isViewPricing: null,
  standardMetalPriceDetails: null,
  taxDetails: null,
  priceDetails: null,
  itemCode: ''
};

export function findPriceReducer(
  state: FindPriceState = initialState,
  action: FindPriceActions
): FindPriceState {
  switch (action.type) {
    case FindPriceActionTypes.LOAD_STANDARD_METAL_PRICE_DETAILS:
      return {
        ...state,
        // isLoading: true
      };
    case FindPriceActionTypes.LOAD_STANDARD_METAL_PRICE_DETAILS_SUCCESS:
      return {
        ...state,
        standardMetalPriceDetails: action.payload,
        isLoading: false
      };
    case FindPriceActionTypes.LOAD_STANDARD_METAL_PRICE_DETAILS_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };
      
    case FindPriceActionTypes.FIND_PRICE:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        priceDetails: null,
        isViewPricing: null,
      };
    case FindPriceActionTypes.FIND_PRICE_SUCCESS:
      return {
        ...state,
        priceDetails: action.payload.data,
        isViewPricing: action.payload.isViewPricing,
        hasError: null,
        isLoading: false
      };
    case FindPriceActionTypes.FIND_PRICE_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case FindPriceActionTypes.LOAD_TAX_DETAILS:
      return { 
        ...state, 
        isLoading: true,
        hasError: null, 
        taxDetails: null 
      };
    case FindPriceActionTypes.LOAD_TAX_DETAILS_SUCCESS:
      return {
        ...state,
        taxDetails: action.payload,
        hasError: null,
        isLoading: false
      };
    case FindPriceActionTypes.LOAD_TAX_DETAILS_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case FindPriceActionTypes.SET_ITEM_CODE:
      return {
        ...state,
        itemCode: action.payload
      };

    case FindPriceActionTypes.RESET_ITEM_CODE:
      return {
        ...state,
        itemCode: ''
      };

    case FindPriceActionTypes.RESET_VALUES:
      return {
        ...state,
        hasError: null,
        isLoading: false,
        isViewPricing: null,
        taxDetails: null,
        priceDetails: null
      };
    default:
      return state;
  }
}