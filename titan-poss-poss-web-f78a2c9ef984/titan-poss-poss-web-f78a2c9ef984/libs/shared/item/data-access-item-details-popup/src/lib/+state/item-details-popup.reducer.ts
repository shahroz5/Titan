import { ItemDetailsPopupState } from './item-details-popup.state';
import { createFeatureSelector } from '@ngrx/store';
import {
  ItemDetailsPopupActions,
  ItemDetailsPopupActionTypes
} from './item-details-popup.actions';

export const ITEM_DETAILS_POPUP_FEATURE_KEY = 'itemDetailspopup';

export const selectItemDetailsState = createFeatureSelector<
  ItemDetailsPopupState
>(ITEM_DETAILS_POPUP_FEATURE_KEY);

/**
 * The initial state of the store
 */
export const initialState: ItemDetailsPopupState = {
  stoneDetails: [],
  error: null,
  isLoading: false,
  productCategoryDesc: null,
  productGroupDesc: null,
  isDescLoaded: false,
  COStoneDetails: []
};

/**
 * The reducer function which manipulates the store for respective Action
 */
export function ItemDetailsPopupReducer(
  state: ItemDetailsPopupState = initialState,
  action: ItemDetailsPopupActions
): ItemDetailsPopupState {
  switch (action.type) {
    case ItemDetailsPopupActionTypes.LOAD_STONE_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: true,
        stoneDetails: []
      };
    case ItemDetailsPopupActionTypes.LOAD_STONE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        stoneDetails: action.payload
      };
    case ItemDetailsPopupActionTypes.LOAD_STONE_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        stoneDetails: []
      };
    case ItemDetailsPopupActionTypes.LOAD_PC_DESC:
    case ItemDetailsPopupActionTypes.LOAD_PG_DESC:
      return {
        ...state,
        error: null,
        isLoading: true
      };
    case ItemDetailsPopupActionTypes.LOAD_PC_DESC_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productCategoryDesc: action.payload
      };
    case ItemDetailsPopupActionTypes.LOAD_PG_DESC_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productGroupDesc: action.payload
      };
    case ItemDetailsPopupActionTypes.LOAD_PC_DESC_FAILURE:
    case ItemDetailsPopupActionTypes.LOAD_PG_DESC_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case ItemDetailsPopupActionTypes.CLEAR:
      return {
        ...state,
        stoneDetails: [],
        COStoneDetails: [],
        error: null,
        isLoading: false
      };
    case ItemDetailsPopupActionTypes.LOAD_CO_STONE_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: true,
        COStoneDetails: []
      };
    case ItemDetailsPopupActionTypes.LOAD_CO_STONE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        COStoneDetails: action.payload
      };
    case ItemDetailsPopupActionTypes.LOAD_C0_STONE_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        COStoneDetails: []
      };

    default:
      return state;
  }
}
