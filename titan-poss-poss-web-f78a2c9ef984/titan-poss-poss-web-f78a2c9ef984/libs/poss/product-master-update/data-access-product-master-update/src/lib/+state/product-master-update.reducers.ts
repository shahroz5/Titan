import { createFeatureSelector } from '@ngrx/store';
import {
  ProductMasterUpdateKey,
  ProductMasterUpdateState
} from './product-master-update.state';
import {
  ProductMasterActions,
  ProductMasterUpdateActionTypes
} from './product-master-update.actions';

export const selectProductMasterUpdateState = createFeatureSelector<
  ProductMasterUpdateState
>(ProductMasterUpdateKey);
export const initialState: ProductMasterUpdateState = {
  errors: null,
  isLoading: false,
  updateResponse: null
};
export function UpdateProductMasterReducer(
  state: ProductMasterUpdateState = initialState,
  action: ProductMasterActions
): ProductMasterUpdateState {
  switch (action.type) {
    case ProductMasterUpdateActionTypes.LOAD_PRODUCT_MASTER_UPDATE:
      return {
        ...state,
        updateResponse: null,
        isLoading: true,
        errors: null
      };
    case ProductMasterUpdateActionTypes.LOAD_PRODUCT_MASTER_UPDATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: null,
        updateResponse: action.payload
      };
    case ProductMasterUpdateActionTypes.LOAD_PRODUCT_MASTER_UPDATE_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        updateResponse: null
      };
    default:
      return state;
  }
}
