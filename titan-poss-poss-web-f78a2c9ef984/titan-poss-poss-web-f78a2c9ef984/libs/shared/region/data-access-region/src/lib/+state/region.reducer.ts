import { regionAdapter } from './region.entity';
import { RegionsState } from './region.state';
import { RegionActions, RegionActionTypes } from './region.actions';
import { createFeatureSelector } from '@ngrx/store';

export const REGIONS_FEATURE_KEY = 'regions';

export const selectRegionsState = createFeatureSelector<RegionsState>(
  REGIONS_FEATURE_KEY
);

export const initialState: RegionsState = {
  regionDetailsListing: regionAdapter.getInitialState(),
  totalRegionDetails: 0,
  error: null,
  isLoading: false,
  regionDetailsByRegionCode: null,
  saveRegionDetailsResponse: null,
  editRegionDetailsResponse: null
};

export function RegionReducer(
  state: RegionsState = initialState,
  action: RegionActions
): RegionsState {
  switch (action.type) {
    case RegionActionTypes.LOAD_REGION_DETAILS:
    case RegionActionTypes.LOAD_REGION_DETAILS_BY_CODE:
    case RegionActionTypes.SAVE_REGION_DETAILS:
    case RegionActionTypes.EDIT_REGION_DETAILS:
      return {
        ...state,
        isLoading: true
      };

    case RegionActionTypes.LOAD_REGION_DETAILS_SUCCESS:
      return {
        ...state,
        totalRegionDetails: action.payload.totalElements,
        isLoading: false,
        regionDetailsListing: regionAdapter.setAll(
          action.payload.regionDetailsListing,
          state.regionDetailsListing
        )
      };

    case RegionActionTypes.LOAD_REGION_DETAILS_FAILURE:
    case RegionActionTypes.LOAD_REGION_DETAILS_BY_CODE_FAILURE:
    case RegionActionTypes.SAVE_REGION_DETAILS_FAILURE:
    case RegionActionTypes.EDIT_REGION_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    // case CorporateTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE:
    //   return {
    //     ...state,
    //     isCorporateTownLoading: true
    //   };

    case RegionActionTypes.LOAD_REGION_DETAILS_BY_CODE_SUCCESS:
      return {
        ...state,
        regionDetailsByRegionCode: action.payload,
        isLoading: false
      };

    case RegionActionTypes.SAVE_REGION_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        saveRegionDetailsResponse: action.payload
      };

    case RegionActionTypes.RESET_REGION_DIALOG_DATA:
      return {
        ...state,
        totalRegionDetails: 0,
        regionDetailsListing: regionAdapter.getInitialState(),
        regionDetailsByRegionCode: null,
        saveRegionDetailsResponse: null,
        editRegionDetailsResponse: null,
        error: null
      };

    case RegionActionTypes.EDIT_REGION_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        editRegionDetailsResponse: action.payload
      };

    case RegionActionTypes.SEARCH_REGION_BY_CODE:
      return {
        ...state,
        error: null
      };
    case RegionActionTypes.SEARCH_REGION_BY_CODE_SUCCESS:
      return {
        ...state,
        error: null,
        totalRegionDetails: action.payload.totalElements,
        regionDetailsListing: regionAdapter.setAll(
          action.payload.regionDetailsListing,
          state.regionDetailsListing
        )
      };

    case RegionActionTypes.SEARCH_REGION_BY_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        regionDetailsListing: regionAdapter.removeAll(
          state.regionDetailsListing
        )
      };

    default:
      return state;
  }
}
