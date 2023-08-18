import { createFeatureSelector } from '@ngrx/store';
import { ProductGroupMappingState } from './product-group-mapping.state';
import {
  ProductGroupActions,
  ProductGroupMappingActionTypes
} from './product-group-mapping.actions';

export const PRODUCT_GROUP_FEATURE_KEY = 'product-group-mapping';

export const selectProductGroupMappingState = createFeatureSelector<
  ProductGroupMappingState
>(PRODUCT_GROUP_FEATURE_KEY);

export const initialState: ProductGroupMappingState = {
  productGroups: [],
  error: null,
  isLoading: null
};

export function ProductGroupMappingReducer(
  state: ProductGroupMappingState = initialState,
  action: ProductGroupActions
): ProductGroupMappingState {
  switch (action.type) {
    case ProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS:
      return {
        ...state,
        isLoading: true
      };

    case ProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        productGroups: action.payload,
        isLoading: false
      };

    case ProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case ProductGroupMappingActionTypes.LOAD_RESET:
      return {
        ...state,
        isLoading: null,
        error: null,
        productGroups: []
      };

    default:
      return state;
  }
}
