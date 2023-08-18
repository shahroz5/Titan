import { createFeatureSelector } from '@ngrx/store';

import { StoneTypeState } from './stone-type.state';
import { StoneTypeActions, StoneTypeActionTypes } from './stone-type.actions';

export const STONE_TYPE_FEATURE_KEY = 'StoneType';
export const selectStoneTypeState = createFeatureSelector<StoneTypeState>(
  STONE_TYPE_FEATURE_KEY
);

export const initialState: StoneTypeState = {
  stoneTypeListing: null,
  stoneTypeDetails: null,
  totalStoneTypeDetails: 0,
  isLoading: false,
  error: null,
  saveStoneTypeResponses: null,
  editStoneTypeResponses: null
};
export function StoneTypeReducer(
  state: StoneTypeState = initialState,
  action: StoneTypeActions
): StoneTypeState {
  switch (action.type) {
    case StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS:
    case StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS_BY_STONE_TYPECODE:
    case StoneTypeActionTypes.SAVE_STONE_TYPE_FORM_DETAILS:
    case StoneTypeActionTypes.EDIT_STONE_TYPE_FORM_DETAILS:
    case StoneTypeActionTypes.SEARCH_STONE_TYPE_DETAILS:
      return {
        ...state,
        isLoading: true
      };

    case StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS_SUCCESS:
      return {
        ...state,
        stoneTypeListing: action.payload.stoneTypeListing,
        totalStoneTypeDetails: action.payload.totalElements,
        isLoading: false
      };

    case StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS_FAILURE:
    case StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS_BY_STONE_TYPECODE_FAILURE:
    case StoneTypeActionTypes.SAVE_STONE_TYPE_FORM_DETAILS_FAILURE:
    case StoneTypeActionTypes.EDIT_STONE_TYPE_FORM_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS_BY_STONE_TYPECODE_SUCCESS:
      return {
        ...state,
        stoneTypeDetails: action.payload,
        isLoading: false
      };

    case StoneTypeActionTypes.RESET_STONE_TYPE_DIALOG_DATA:
      return {
        ...state,
        stoneTypeListing: null,
        stoneTypeDetails: null,
        error: null,
        isLoading: false,
        saveStoneTypeResponses: null,
        editStoneTypeResponses: null
      };

    case StoneTypeActionTypes.SAVE_STONE_TYPE_FORM_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        saveStoneTypeResponses: action.payload
        // stoneTypeListing: [...state.stoneTypeListing, action.payload]
      };

    case StoneTypeActionTypes.EDIT_STONE_TYPE_FORM_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        editStoneTypeResponses: action.payload
      };

    case StoneTypeActionTypes.SEARCH_STONE_TYPE_DETAILS_SUCCESS:
      return {
        ...state,
        stoneTypeListing: action.payload,
        isLoading: false,
        totalStoneTypeDetails: 0
      };

    case StoneTypeActionTypes.SEARCH_STONE_TYPE_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        stoneTypeListing: null,
        isLoading: false,
        totalStoneTypeDetails: 0
      };
    default:
      return state;
  }
}
