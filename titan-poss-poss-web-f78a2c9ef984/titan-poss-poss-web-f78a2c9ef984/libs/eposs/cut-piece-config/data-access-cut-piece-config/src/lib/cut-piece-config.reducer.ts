import { createFeatureSelector } from '@ngrx/store';
import {
  CutPieceConfigActions,
  CutPieceConfigActionTypes
} from './cut-piece-config.actions';
import { CutPieceConfigState } from './cut-piece-config.state';

export const initialState: CutPieceConfigState = {
  error: null,
  isLoading: false,
  configId: null,
  hasSaved: false,
  cutPieceConfigList: [],
  totalElements: 0,
  productCategories: [],
  allSelectedCategories: null
};
export const CUT_PIECE_CONFIG_FEATURE_KEY = 'payerBank';
export const selectCutPieceConfigState = createFeatureSelector<
  CutPieceConfigState
>(CUT_PIECE_CONFIG_FEATURE_KEY);
export function CutPieceConfigReducer(
  state: CutPieceConfigState = initialState,
  action: CutPieceConfigActions
): CutPieceConfigState {
  switch (action.type) {
    case CutPieceConfigActionTypes.LOAD_CUT_PIECE_CONFIGS:
    case CutPieceConfigActionTypes.SEARCH_PRODUCT_CATEGORY_CODE:
    case CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES_MAPPING:
    case CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES:
    case CutPieceConfigActionTypes.LOAD_SELECTED_PRODUCT_CATEGORIES:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case CutPieceConfigActionTypes.LOAD_CUT_PIECE_CONFIGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        configId: action.payload
      };
    case CutPieceConfigActionTypes.LOAD_CUT_PIECE_CONFIGS_FAILURE:
    case CutPieceConfigActionTypes.SEARCH_PRODUCT_CATEGORY_CODE_FAILURE:
    case CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES_MAPPING_FAILURE:
    case CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE:
    case CutPieceConfigActionTypes.LOAD_SELECTED_PRODUCT_CATEGORIES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case CutPieceConfigActionTypes.SEARCH_PRODUCT_CATEGORY_CODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cutPieceConfigList: action.payload
      };
    case CutPieceConfigActionTypes.SAVE_CUT_PIECE_CONFIG:
      return {
        ...state,
        isLoading: true,
        hasSaved: false
      };
    case CutPieceConfigActionTypes.SAVE_CUT_PIECE_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: true
      };
    case CutPieceConfigActionTypes.SAVE_CUT_PIECE_CONFIG_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSaved: false,
        error: action.payload
      };
    case CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES_MAPPING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cutPieceConfigList: action.payload.response,
        totalElements: action.payload.totalElements
      };

    case CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productCategories: action.payload
      };

    case CutPieceConfigActionTypes.RESET_CUT_PIECE_CONFIG:
      return {
        ...state,
        error: null,
        isLoading: false,
        configId: null,
        hasSaved: false,
        cutPieceConfigList: [],
        totalElements: 0,
        productCategories: [],
        allSelectedCategories: null
      };
    case CutPieceConfigActionTypes.LOAD_SELECTED_PRODUCT_CATEGORIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allSelectedCategories: action.payload
      };
  }
  return {
    ...state
  };
}
