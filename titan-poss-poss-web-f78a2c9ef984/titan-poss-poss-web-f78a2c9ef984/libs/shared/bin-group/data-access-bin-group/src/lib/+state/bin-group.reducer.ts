import { BinGroupState } from './bin-group.state';
import { BinGroupActions, BinGroupActionTypes } from './bin-group.actions';
import { binGrouptAdapter } from './bin-group.entity';

import { createFeatureSelector } from '@ngrx/store';

export const BINGROUP_FEATURE_KEY = 'binGroup';

export const selectBinGroupState = createFeatureSelector<BinGroupState>(
  BINGROUP_FEATURE_KEY
);

export const initialState: BinGroupState = {
  binGroupDetailsListing: binGrouptAdapter.getInitialState(),
  binGroupDetails: null,
  totalBinGroupDetails: 0,
  isLoading: false,
  saveBinGroupResponses: null,
  editBinGroupResponses: null,
  error: null,
  isSearchElements: true
};
export function BinGroupReducer(
  state: BinGroupState = initialState,
  action: BinGroupActions
): BinGroupState {
  switch (action.type) {
    case BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS:
    case BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS_BY_BIN_GROUPCODE:
    case BinGroupActionTypes.SAVE_BINGROUP_FORM_DETAILS:
    case BinGroupActionTypes.EDIT_BINGROUP_FORM_DETAILS:
      return {
        ...state,
        isLoading: true
      };

    case BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS_SUCCESS:
      return {
        ...state,
        binGroupDetailsListing: binGrouptAdapter.setAll(
          action.payload.binGroupDetailsListing,
          state.binGroupDetailsListing
        ),
        totalBinGroupDetails: action.payload.totalElements,
        isLoading: false,
        isSearchElements: true
      };

    case BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isSearchElements: true
      };

    case BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS_BY_BIN_GROUPCODE_SUCCESS:
      return {
        ...state,
        binGroupDetails: action.payload,
        isLoading: false
      };

    case BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS_BY_BIN_GROUPCODE_FAILURE:
    case BinGroupActionTypes.SAVE_BINGROUP_FORM_DETAILS_FAILURE:
    case BinGroupActionTypes.EDIT_BINGROUP_FORM_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case BinGroupActionTypes.RESET_BINGROUP_DIALOG_DATA:
      return {
        ...state,
        binGroupDetailsListing: binGrouptAdapter.getInitialState(),
        binGroupDetails: null,
        saveBinGroupResponses: null,
        editBinGroupResponses: null,
        error: null,
        isSearchElements: true
      };

    case BinGroupActionTypes.SAVE_BINGROUP_FORM_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        saveBinGroupResponses: action.payload
      };

    case BinGroupActionTypes.EDIT_BINGROUP_FORM_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        editBinGroupResponses: action.payload
      };

    case BinGroupActionTypes.SEARCH_BINGROUP_BY_BINGROUPCODE:
      return {
        ...state,
        error: null
      };
    case BinGroupActionTypes.SEARCH_BINGROUP_BY_BINGROUPCODE_SUCCESS:
      return {
        ...state,
        error: null,
        totalBinGroupDetails: action.payload.totalElements,
        isSearchElements: true,
        binGroupDetailsListing: binGrouptAdapter.setAll(
          action.payload.binGroupDetailsListing,
          state.binGroupDetailsListing
        )
      };

    case BinGroupActionTypes.SEARCH_BINGROUP_BY_BINGROUPCODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isSearchElements: false,
        binGroupDetailsListing: binGrouptAdapter.removeAll(
          state.binGroupDetailsListing
        )
      };

    default:
      return state;
  }
}
