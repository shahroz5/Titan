import { createFeatureSelector } from '@ngrx/store';
import { EncircleProductGroupMappingState } from './encircle-product-group-mapping.state';
import {
  EncircleProductGroupMappingActions,
  EncircleProductGroupMappingActionTypes
} from './encircle-product-group-mapping.actions';

export const ENCIRCLE_PRODUCT_GROUP_MAPPING_KEY = 'EncircleProductGroupMapping';
export const selectEncircleProdcutGroupMappingState = createFeatureSelector<
  EncircleProductGroupMappingState
>(ENCIRCLE_PRODUCT_GROUP_MAPPING_KEY);
export const initialState: EncircleProductGroupMappingState = {
  error: null,
  isLoading: null,
  hasSaved: false,
  selectedProductGroups: [],
  hasRemoved: false,
  productGroups: null,
  totalElements: 0,
  allSelectedGroups: null
};
export function EncircleProductGroupMappingReducer(
  state: EncircleProductGroupMappingState = initialState,
  action: EncircleProductGroupMappingActions
) {
  switch (action.type) {
    case EncircleProductGroupMappingActionTypes.LOAD_SELECTED_PRODUCT_GROUPS:
    case EncircleProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS:
    case EncircleProductGroupMappingActionTypes.SEARCH_PRODUCT_GROUP_CODE:
    case EncircleProductGroupMappingActionTypes.LOAD_ALL_SELECTED_PRODUCT_GROUPS:
      return {
        ...state,
        isLoading: true
      };

    case EncircleProductGroupMappingActionTypes.SAVE_ENCIRCLE_PRODUCT_GROUPS:
      return {
        ...state,
        isLoading: true,
        hasSaved: false
      };
    case EncircleProductGroupMappingActionTypes.SAVE_ENCIRCLE_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: true
      };
    case EncircleProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productGroups: action.payload
      };
    case EncircleProductGroupMappingActionTypes.SAVE_ENCIRCLE_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSaved: false,
        error: action.payload
      };
    case EncircleProductGroupMappingActionTypes.LOAD_SELECTED_PRODUCT_GROUPS_SUCCESS:
    case EncircleProductGroupMappingActionTypes.SEARCH_PRODUCT_GROUP_CODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        selectedProductGroups: action.payload.response,
        totalElements: action.payload.totalElements
      };
    case EncircleProductGroupMappingActionTypes.LOAD_ALL_SELECTED_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allSelectedGroups: action.payload.response
      };
    case EncircleProductGroupMappingActionTypes.LOAD_SELECTED_PRODUCT_GROUPS_FAILURE:
    case EncircleProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS_FAILURE:
    case EncircleProductGroupMappingActionTypes.SEARCH_PRODUCT_GROUP_CODE_FAILURE:
    case EncircleProductGroupMappingActionTypes.LOAD_ALL_SELECTED_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case EncircleProductGroupMappingActionTypes.RESET_PRODUCT_GROUPS:
      return {
        ...state,
        selectedProductGroups: null,
        hasSaved: false,
        hasRemoved: false,
        isLoading: false,
        error: null,
        allSelectedGroups: null,
        totalElements: 0
      };
    case EncircleProductGroupMappingActionTypes.REMOVE_ENCIRCLE_PRODUCT_GROUPS:
      return {
        ...state,
        isLoading: true,
        hasRemoved: false
      };
    case EncircleProductGroupMappingActionTypes.REMOVE_ENCIRCLE_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasRemoved: true
      };
    case EncircleProductGroupMappingActionTypes.REMOVE_ENCIRCLE_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        hasRemoved: false
      };
    default:
      return { ...state };
  }
}
