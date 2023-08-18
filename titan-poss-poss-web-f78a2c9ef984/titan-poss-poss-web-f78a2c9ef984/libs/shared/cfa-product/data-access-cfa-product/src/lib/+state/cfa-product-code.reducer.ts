import { CFAProductCodeState } from './cfa-product-code.state';
import {
  CFAProductCodeActions,
  CFAProductCodeActionTypes
} from './cfa-product-code.actions';
import { createFeatureSelector } from '@ngrx/store';
export const initialState: CFAProductCodeState = {
  error: null,
  CFAProductCodeListing: null,
  totalElements: null,
  CFAProduct: null,
  isLoading: null,
  hasSaved: null,
  hasUpdated: null,
  productType: null,
  itemTypes: null,
  plainStuddedType: null,
  hallmarkingExcludeKaratType: null,
  pricingType: null
};
export const CFA_PRODUCT_CODE_FEATURE_KEY = 'cfaProductCode';
export const selectCFAProductCodeState = createFeatureSelector<
  CFAProductCodeState
>(CFA_PRODUCT_CODE_FEATURE_KEY);
export function CFAProductCodeReducer(
  state: CFAProductCodeState,
  action: CFAProductCodeActions
): CFAProductCodeState {
  switch (action.type) {
    case CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS:
    case CFAProductCodeActionTypes.SEARCH_CFA_PRODUCT:
    case CFAProductCodeActionTypes.LOAD_PRODUCT_TYPES:
    case CFAProductCodeActionTypes.LOAD_ITEM_TYPES:
    case CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS_BASED_ON_PRODUCTGROUPCODE:
    case CFAProductCodeActionTypes.LOAD_PLAIN_STUDDED_TYPE:
    case CFAProductCodeActionTypes.LOAD_HALLMARKING_EXCLUDE_KARAT_TYPE:
    case CFAProductCodeActionTypes.LOAD_PRICING_TYPE:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        CFAProductCodeListing: action.payload.CFAProductCodeListing,
        totalElements: action.payload.totalElements
      };

    case CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS_BASED_ON_PRODUCTGROUPCODE_SUCCESS:
      return {
        ...state,
        CFAProduct: action.payload,
        isLoading: false
      };

    case CFAProductCodeActionTypes.SEARCH_CFA_PRODUCT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        CFAProductCodeListing: action.payload,
        totalElements: 0
      };
    case CFAProductCodeActionTypes.SEARCH_CFA_PRODUCT_FAILURE:
      return {
        ...state,
        error: action.payload,
        CFAProductCodeListing: null,
        totalElements: null,
        isLoading: false
      };
    case CFAProductCodeActionTypes.SAVE_CFA_PRODUCTS:
      return {
        ...state,
        hasSaved: false,
        isLoading: true
      };
    case CFAProductCodeActionTypes.SAVE_CFA_PRODUCTS_SUCCESS:
      return {
        ...state,
        hasSaved: true,
        isLoading: false
      };
    case CFAProductCodeActionTypes.SAVE_CFA_PRODUCTS_FAILURE:
      return {
        ...state,
        hasSaved: false,
        isLoading: false,
        error: action.payload
      };
    case CFAProductCodeActionTypes.RESET_CFA_PRODUCTS:
      return {
        ...state,
        CFAProduct: null,
        error: null,
        hasSaved: null,
        hasUpdated: null,
        isLoading: false,
        pricingType: null,
        plainStuddedType: null,
        hallmarkingExcludeKaratType:null
      };
    case CFAProductCodeActionTypes.UPDATE_CFA_PRODUCTS:
      return {
        ...state,
        hasUpdated: false,
        isLoading: true
      };
    case CFAProductCodeActionTypes.UPDATE_CFA_PRODUCTS_SUCCESS:
      return {
        ...state,
        hasUpdated: true,
        isLoading: false
      };
    case CFAProductCodeActionTypes.UPDATE_CFA_PRODUCTS_FAILURE:
      return {
        ...state,
        hasUpdated: false,
        error: action.payload,
        isLoading: false
      };

    case CFAProductCodeActionTypes.LOAD_PRODUCT_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productType: action.payload
      };
    case CFAProductCodeActionTypes.LOAD_PRODUCT_TYPES_FAILURE:
    case CFAProductCodeActionTypes.LOAD_ITEM_TYPES_FAILURE:
    case CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS_FAILURE:
    case CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS_BASED_ON_PRODUCTGROUPCODE_FAILURE:
    case CFAProductCodeActionTypes.LOAD_PLAIN_STUDDED_TYPE_FAILURE:
    case CFAProductCodeActionTypes.LOAD_HALLMARKING_EXCLUDE_KARAT_TYPE_FAILURE:
    case CFAProductCodeActionTypes.LOAD_PRICING_TYPE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case CFAProductCodeActionTypes.LOAD_ITEM_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        itemTypes: action.payload
      };
    case CFAProductCodeActionTypes.LOAD_PLAIN_STUDDED_TYPE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        plainStuddedType: action.payload
      };
    case CFAProductCodeActionTypes.LOAD_HALLMARKING_EXCLUDE_KARAT_TYPE_SUCCESS:
        return {
          ...state,
          isLoading: false,
          hallmarkingExcludeKaratType: action.payload
        };
    case CFAProductCodeActionTypes.LOAD_PRICING_TYPE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pricingType: action.payload
      };

    default:
      return state;
  }
}
