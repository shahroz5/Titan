import { createFeatureSelector } from '@ngrx/store';
import { ProductCategoryMappingState } from './pc-mapping.state';
import {
  ProductCategoryMappingActions,
  ProductCategoryMappingActionTypes
} from './pc-mapping.actions';

export const PRODUCT_CATEGORIES_MAPPING_FEATURE_KEY =
  'product-category-mapping';

export const selectProductCategoryState = createFeatureSelector<
  ProductCategoryMappingState
>(PRODUCT_CATEGORIES_MAPPING_FEATURE_KEY);

export const initialState: ProductCategoryMappingState = {
  productCategory: [],
  error: null,
  isLoading: null
};

export function ProductCategoryMappingReducer(
  state: ProductCategoryMappingState = initialState,
  action: ProductCategoryMappingActions
): ProductCategoryMappingState {
  switch (action.type) {
    case ProductCategoryMappingActionTypes.LOAD_PRODUCT_CATEGORIES:
      return {
        ...state,
        isLoading: true
      };

    case ProductCategoryMappingActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS:
      return {
        ...state,
        productCategory: action.payload,
        isLoading: false
      };

    case ProductCategoryMappingActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case ProductCategoryMappingActionTypes.LOAD_RESET:
      return {
        ...state,
        isLoading: null,
        error: null,
        productCategory: []
      };

    default:
      return state;
  }
}
