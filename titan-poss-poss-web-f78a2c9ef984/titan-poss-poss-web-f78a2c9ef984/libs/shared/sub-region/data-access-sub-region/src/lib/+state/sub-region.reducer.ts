import { SubRegionActions, SubRegionActionTypes } from './sub-region.actions';
import { SubRegionState } from './sub-region.state';
import { subRegionAdapter } from './sub-region.entity';
import { createFeatureSelector } from '@ngrx/store';

export const SUBREGIONS_FEATURE_KEY = 'sub-regions';

export const selectSubRegionsState = createFeatureSelector<SubRegionState>(
  SUBREGIONS_FEATURE_KEY
);

export const initialState: SubRegionState = {
  regionDetailsListing: subRegionAdapter.getInitialState(),
  subRegionDetailsListing: subRegionAdapter.getInitialState(),
  totalSubRegionDetails: 0,
  error: null,
  isLoading: false,
  subRegionDetailsBySubRegionCode: null,
  saveSubRegionDetailsResponse: null,
  editSubRegionDetailsResponse: null,
  isSearchElements: true
};

export function SubRegionReducer(
  state: SubRegionState = initialState,
  action: SubRegionActions
): SubRegionState {
  switch (action.type) {
    case SubRegionActionTypes.LOAD_REGION_DETAILS:
    case SubRegionActionTypes.LOAD_SUB_REGION_DETAILS:
    case SubRegionActionTypes.LOAD_SUB_REGION_DETAILS_BY_CODE:
    case SubRegionActionTypes.SAVE_SUB_REGION_DETAILS:
    case SubRegionActionTypes.EDIT_SUB_REGION_DETAILS:
      return {
        ...state,
        isLoading: true
      };

    case SubRegionActionTypes.LOAD_REGION_DETAILS_SUCCESS:
      return {
        ...state,
        // corporateTownDetailsListing: action.payload.corporateTownDetailsListing,
        totalSubRegionDetails: action.payload.totalElements,
        isLoading: false,
        regionDetailsListing: subRegionAdapter.setAll(
          action.payload.regionDetailsListing,
          state.regionDetailsListing
        ),
        isSearchElements: true
      };

    case SubRegionActionTypes.LOAD_SUB_REGION_DETAILS_SUCCESS:
      return {
        ...state,
        // corporateTownDetailsListing: action.payload.corporateTownDetailsListing,
        totalSubRegionDetails: action.payload.totalElements,
        isLoading: false,
        subRegionDetailsListing: subRegionAdapter.setAll(
          action.payload.subRegionDetailsListing,
          state.subRegionDetailsListing
        ),
        isSearchElements: true
      };

    case SubRegionActionTypes.LOAD_SUB_REGION_DETAILS_FAILURE:
    case SubRegionActionTypes.LOAD_SUB_REGION_DETAILS_BY_CODE_FAILURE:
    case SubRegionActionTypes.SAVE_SUB_REGION_DETAILS_FAILURE:
    case SubRegionActionTypes.EDIT_SUB_REGION_DETAILS_FAILURE:
    case SubRegionActionTypes.LOAD_REGION_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isSearchElements: true
      };

    case SubRegionActionTypes.LOAD_SUB_REGION_DETAILS_BY_CODE_SUCCESS:
      return {
        ...state,
        subRegionDetailsBySubRegionCode: action.payload,
        isLoading: false
      };

    case SubRegionActionTypes.SAVE_SUB_REGION_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        saveSubRegionDetailsResponse: action.payload
      };

    case SubRegionActionTypes.RESET_SUB_REGION_DIALOG_DATA:
      return {
        ...state,
        isLoading: false,
        totalSubRegionDetails: 0,
        subRegionDetailsBySubRegionCode: null,
        subRegionDetailsListing: subRegionAdapter.getInitialState(),
        saveSubRegionDetailsResponse: null,
        editSubRegionDetailsResponse: null,
        error: null,
        isSearchElements: true
      };

    case SubRegionActionTypes.EDIT_SUB_REGION_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        editSubRegionDetailsResponse: action.payload
      };

    case SubRegionActionTypes.SEARCH_SUB_REGION_BY_CODE:
      return {
        ...state,
        error: null
      };
    case SubRegionActionTypes.SEARCH_SUB_REGION_CODE_SUCCESS:
      return {
        ...state,
        //searchBinGroup: action.payload.searchBinGroupListing,
        error: null,
        // hasSearched: true,
        totalSubRegionDetails: action.payload.totalElements,
        isSearchElements: true,
        subRegionDetailsListing: subRegionAdapter.setAll(
          action.payload.subRegionDetailsListing,
          state.subRegionDetailsListing
        )
      };

    case SubRegionActionTypes.SEARCH_SUB_REGION_BY_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isSearchElements: false,
        subRegionDetailsListing: subRegionAdapter.removeAll(
          state.subRegionDetailsListing
        )
      };

    default:
      return state;
  }
}
