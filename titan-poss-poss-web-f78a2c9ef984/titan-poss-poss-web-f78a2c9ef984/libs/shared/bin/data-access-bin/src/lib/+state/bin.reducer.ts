import { BinState } from './bin.state';
import { BinActions, BinActionTypes } from './bin.actions';
import { createFeatureSelector } from '@ngrx/store';
import { binAdapter } from './bin.entity';

export const BIN_FEATURE_KEY = 'bin';

export const selectBinState = createFeatureSelector<BinState>(BIN_FEATURE_KEY);

export const initialState: BinState = {
  error: null,
  binCodeSaveNewResponses: null,
  binCodeDetailsListing: null,
  totalBinCodeDetails: 0,
  binCodesByBinGroup: binAdapter.getInitialState(),
  isBinCodeLoading: false,
  editBinCodeResponses: null,
  locationsByBinCodesAndBinGroup: null,
  locationMappingResponse: null,
  isSearchElements: true
};
export function BinReducer(
  state: BinState = initialState,
  action: BinActions
): BinState {
  switch (action.type) {
    case BinActionTypes.RESET_BINCODE_DIALOG_DATA:
      return {
        ...state,
        error: null,
        binCodeDetailsListing: null,
        binCodeSaveNewResponses: null,
        editBinCodeResponses: null,
        binCodesByBinGroup: binAdapter.getInitialState(),
        locationMappingResponse: null,
        isSearchElements: true
      };

    case BinActionTypes.SAVE_BINCODE_FORM_DETAILS:
    case BinActionTypes.LOAD_BIN_CODE_DETAILS:
    case BinActionTypes.EDIT_BINCODE_FORM_DETAILS:
    case BinActionTypes.LOAD_BIN_CODES_BY_BIN_GROUPCODE:
    case BinActionTypes.LOAD_LOCATIONS_BY_BINGROUP_AND_BINCODE:
    case BinActionTypes.SAVE_LOCATION_MAPPING_DETAILS:
      return {
        ...state,
        isBinCodeLoading: true
      };

    case BinActionTypes.SAVE_BINCODE_FORM_DETAILS_SUCCESS:
      return {
        ...state,
        binCodeSaveNewResponses: action.payload,
        isBinCodeLoading: false
      };

    case BinActionTypes.LOAD_BIN_CODE_DETAILS_SUCCESS:
      return {
        ...state,
        binCodeDetailsListing: action.payload.binCodeDetailsListing,
        totalBinCodeDetails: action.payload.totalElements,
        isBinCodeLoading: false,
        isSearchElements: true
      };

    case BinActionTypes.LOAD_BIN_CODE_DETAILS_FAILURE:
    case BinActionTypes.EDIT_BINCODE_FORM_DETAILS_FAILURE:
    case BinActionTypes.LOAD_LOCATIONS_BY_BINGROUP_AND_BINCODE_FAILURE:
    case BinActionTypes.LOAD_BIN_CODES_BY_BIN_GROUPCODE_FAILURE:
    case BinActionTypes.SAVE_LOCATION_MAPPING_DETAILS_FAILURE:
    case BinActionTypes.SAVE_BINCODE_FORM_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isBinCodeLoading: false,
        isSearchElements: true
      };

    case BinActionTypes.LOAD_BIN_CODES_BY_BIN_GROUPCODE_SUCCESS:
      return {
        ...state,
        binCodesByBinGroup: binAdapter.setAll(
          action.payload.binCodeSearchListing,
          state.binCodesByBinGroup
        ),
        totalBinCodeDetails: action.payload.totalElements,
        isBinCodeLoading: false
      };

    case BinActionTypes.EDIT_BINCODE_FORM_DETAILS_SUCCESS:
      return {
        ...state,
        editBinCodeResponses: action.payload,
        isBinCodeLoading: false
      };

    case BinActionTypes.LOAD_LOCATIONS_BY_BINGROUP_AND_BINCODE_SUCCESS:
      return {
        ...state,
        locationsByBinCodesAndBinGroup: action.payload,
        isBinCodeLoading: false
      };

    case BinActionTypes.SAVE_LOCATION_MAPPING_DETAILS_SUCCESS:
      return {
        ...state,
        locationMappingResponse: action.payload,
        isBinCodeLoading: false
      };

    case BinActionTypes.SEARCH_BIN_NAME:
      return {
        ...state,
        error: null
      };
    case BinActionTypes.SEARCH_BIN_NAME_SUCCESS:
      return {
        ...state,
        error: null,
        totalBinCodeDetails: action.payload.totalElements,
        isSearchElements: true,
        binCodesByBinGroup: binAdapter.setAll(
          action.payload.binCodeSearchListing,
          state.binCodesByBinGroup
        )
      };

    case BinActionTypes.SEARCH_BIN_NAME_FAILURE:
      return {
        ...state,
        error: action.payload,
        isSearchElements: false,
        binCodesByBinGroup: binAdapter.removeAll(state.binCodesByBinGroup)
      };

    default:
      return state;
  }
}
