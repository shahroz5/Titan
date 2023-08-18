import { ConversionConfigState } from './conversion-config.state';
import {
  ConversionConfigActions,
  ConversionConfigActionTypes
} from './conversion-config.actions';
import { createFeatureSelector } from '@ngrx/store';
export const CONVERSION_CONFIG_KEY = 'ConversionConfig';
export const selectConversionConfigState = createFeatureSelector<
  ConversionConfigState
>(CONVERSION_CONFIG_KEY);
export const initialState: ConversionConfigState = {
  totalElements: 0,
  isLoading: false,
  conversionConfigList: null,
  error: null,
  hasSaved: false,
  configDetailsById: null,
  hasUpdated: false,
  hasSearched: null,
  productGroups: [],
  productCategories: [],
  saveSuccessPayload: null
};
export function ConversionConfigReducer(
  state: ConversionConfigState = initialState,
  action: ConversionConfigActions
) {
  switch (action.type) {
    case ConversionConfigActionTypes.LOAD_CONVERSION_CONFIG_LIST:
    case ConversionConfigActionTypes.CONVERSION_CONFIG_DETAILS_BY_ID:
    case ConversionConfigActionTypes.LOAD_PRODUCT_GROUPS:
    case ConversionConfigActionTypes.LOAD_PRODUCT_CATEGORIES:
      return {
        ...state,
        isLoading: true
      };
    case ConversionConfigActionTypes.SEARCH_CONFIG_NAME:
      return {
        ...state,
        isLoading: true,
        hasSearched: false
      };
    case ConversionConfigActionTypes.SEARCH_CONFIG_NAME_SUCCESS:
      return {
        ...state,
        conversionConfigList: action.payload.conversionConfigList,
        totalElements: action.payload.totalElements,
        hasSearched: true,
        isLoading: false
      };
    case ConversionConfigActionTypes.SEARCH_CONFIG_NAME_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        hasSearched: false
      };
    case ConversionConfigActionTypes.LOAD_CONVERSION_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        conversionConfigList: action.payload.conversionConfigList,
        totalElements: action.payload.totalElements,
        isLoading: false,
        hasSearched: false
      };
    case ConversionConfigActionTypes.LOAD_CONVERSION_CONFIG_LIST_FAILURE:
    case ConversionConfigActionTypes.CONVERSION_CONFIG_DETAILS_BY_ID_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case ConversionConfigActionTypes.LOAD_PRODUCT_GROUPS_FAILURE:
    case ConversionConfigActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case ConversionConfigActionTypes.CONVERSION_CONFIG_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        configDetailsById: action.payload
      };
    case ConversionConfigActionTypes.UPDATE_CONVERSION_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };
    case ConversionConfigActionTypes.UPDATE_CONVERSION_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true
      };

    case ConversionConfigActionTypes.UPDATE_CONVERSION_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasUpdated: false,
        error: action.payload
      };
    case ConversionConfigActionTypes.RESET_CONVERSION_CONFIG:
      return {
        ...state,
        hasSaved: null,
        hasUpdated: null,
        hasLocationsSaved: null,
        error: null,
        saveSuccessPayload: null,
        configDetailsById: null,
        addedProducts: [],
        removedProducts: []
      };

    case ConversionConfigActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        productGroups: action.payload,
        isLoading: false
      };
    case ConversionConfigActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS:
      return {
        ...state,
        productCategories: action.payload,
        isLoading: false
      };
    case ConversionConfigActionTypes.SAVE_CONVERSION_CONFIG_VALUES:
      return {
        ...state,
        isLoading: true,
        hasSaved: false
      };
    case ConversionConfigActionTypes.SAVE_CONVERSION_CONFIG_VALUES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        saveSuccessPayload: action.payload,
        hasSaved: true
      };
    case ConversionConfigActionTypes.SAVE_CONVERSION_CONFIG_VALUES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        hasSaved: false
      };

    case ConversionConfigActionTypes.UPDATE_TOGGLE_BUTTON:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };
    case ConversionConfigActionTypes.UPDATE_TOGGLE_BUTTON_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true
      };
    case ConversionConfigActionTypes.UPDATE_TOGGLE_BUTTON_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasUpdated: false,
        error: action.payload
      };
    default:
      return { ...state };
  }
}
