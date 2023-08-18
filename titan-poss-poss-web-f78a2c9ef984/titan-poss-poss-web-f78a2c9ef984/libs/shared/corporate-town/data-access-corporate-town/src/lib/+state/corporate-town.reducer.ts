import { CorporateTownState } from './corporate-town.state';
import {
  CorporateTownActions,
  CorporateTownActionTypes
} from './corporate-town.actions';
import { corporateTownAdapter } from './corporate-town.entity';
import { createFeatureSelector } from '@ngrx/store';

export const CORPORATE_TOWN_FEATURE_KEY = 'binGroup';

export const selectCorporateTown = createFeatureSelector<CorporateTownState>(
  CORPORATE_TOWN_FEATURE_KEY
);

export const initialState: CorporateTownState = {
  corporateTownDetailsListing: corporateTownAdapter.getInitialState(),
  totalCorporateTownDetails: 0,
  error: null,
  stateDetails: null,
  isCorporateTownLoading: false,
  townDetailsByTownCode: null,
  saveTownDetailsResponses: null,
  editTownDetailsResponses: null,
  // regionDetails: null,
  isSearchElements: true,
  countryData: null
};

export function CorporateTownReducer(
  state: CorporateTownState = initialState,
  action: CorporateTownActions
): CorporateTownState {
  switch (action.type) {
    case CorporateTownActionTypes.LOAD_CORPORATE_TOWN:
    case CorporateTownActionTypes.LOAD_STATE_DETAILS:
    case CorporateTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE:
    case CorporateTownActionTypes.SAVE_CORPORATE_TOWN:
    case CorporateTownActionTypes.EDIT_CORPORATE_TOWN:
      // case CorporateTownActionTypes.LOAD_COUNTRY_DETAILS_BY_NAME:
      // case CorporateTownActionTypes.LOAD_REGION_DETAILS:
      return {
        ...state,
        isCorporateTownLoading: true
      };

    case CorporateTownActionTypes.LOAD_CORPORATE_TOWN_SUCCESS:
      return {
        ...state,
        totalCorporateTownDetails: action.payload.totalElements,
        isCorporateTownLoading: false,
        corporateTownDetailsListing: corporateTownAdapter.setAll(
          action.payload.corporateTownDetailsListing,
          state.corporateTownDetailsListing
        ),
        isSearchElements: true
      };
    // case CorporateTownActionTypes.LOAD_COUNTRY_DETAILS_BY_NAME_SUCCESS:
    //   return {
    //     ...state,
    //     countryData: action.payload
    //   };
    case CorporateTownActionTypes.LOAD_CORPORATE_TOWN_FAILURE:
    case CorporateTownActionTypes.LOAD_STATE_DETAILS_FAILURE:
    case CorporateTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE_FAILURE:
    case CorporateTownActionTypes.SAVE_CORPORATE_TOWN_FAILURE:
    case CorporateTownActionTypes.EDIT_CORPORATE_TOWN_FAILURE:
      // case CorporateTownActionTypes.LOAD_COUNTRY_DETAILS_BY_NAME_FAILURE:
      // case CorporateTownActionTypes.LOAD_REGION_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isCorporateTownLoading: false,
        isSearchElements: true
      };

    case CorporateTownActionTypes.LOAD_STATE_DETAILS_SUCCESS:
      return {
        ...state,
        stateDetails: action.payload,
        isCorporateTownLoading: false
      };

    case CorporateTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE_SUCCESS:
      console.log('redpay', action.payload);
      return {
        ...state,
        townDetailsByTownCode: action.payload,
        isCorporateTownLoading: false
      };

    case CorporateTownActionTypes.SAVE_CORPORATE_TOWN_SUCCESS:
      return {
        ...state,
        isCorporateTownLoading: false,
        saveTownDetailsResponses: action.payload
      };

    case CorporateTownActionTypes.RESET_CORPORATE_TOWN_DIALOG_DATA:
      return {
        ...state,
        isCorporateTownLoading: false,
        corporateTownDetailsListing: corporateTownAdapter.getInitialState(),
        townDetailsByTownCode: null,
        saveTownDetailsResponses: null,
        editTownDetailsResponses: null,
        error: null,
        isSearchElements: true
      };

    case CorporateTownActionTypes.EDIT_CORPORATE_TOWN_SUCCESS:
      return {
        ...state,
        isCorporateTownLoading: false,
        editTownDetailsResponses: action.payload
      };

    // case CorporateTownActionTypes.LOAD_REGION_DETAILS_SUCCESS:
    //   return {
    //     ...state,
    //     regionDetails: action.payload.regionDetailsListing,
    //     isCorporateTownLoading: false
    //   };

    case CorporateTownActionTypes.SEARCH_CORPORATETOWN:
      return {
        ...state,
        error: null
      };
    case CorporateTownActionTypes.SEARCH_CORPORATETOWN_SUCCESS:
      return {
        ...state,
        error: null,
        totalCorporateTownDetails: action.payload.totalElements,
        isSearchElements: false,
        corporateTownDetailsListing: corporateTownAdapter.setAll(
          action.payload.corporateTownDetailsListing,
          state.corporateTownDetailsListing
        )
      };

    case CorporateTownActionTypes.SEARCH_CORPORATETOWN_FAILURE:
      return {
        ...state,
        error: action.payload,
        isSearchElements: false,
        corporateTownDetailsListing: corporateTownAdapter.removeAll(
          state.corporateTownDetailsListing
        )
      };

    default:
      return state;
  }
}
