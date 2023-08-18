import { locationListAdapter } from './location-master.entity';
import { LocationMasterState } from './location-master.state';
import {
  LocationMasterActions,
  LocationMasterActionTypes
} from './location-master.actions';
import { createFeatureSelector } from '@ngrx/store';

/**
 * The initial state of the store
 */
export const initialState: LocationMasterState = {
  locationListing: locationListAdapter.getInitialState(),
  locationDetails: null,
  totalCount: 0,
  locationTypes: null,
  towns: null,
  stateTypes: null,
  regions: null,
  subRegions: null,
  ownerInfo: null,
  brands: null,
  subBrands: null,
  marketTypes: null,
  baseCurrencyTypes: null,
  isSaved: false,
  currencyTypes: null,
  locationSize: null,
  invoicetype: null,
  refundMode: null,
  isCopySuccess: false,
  isLoading: false,
  error: null,
  countryCode: null,
  LocationCFATypes: null
};

export const LOCATION_MASTER_FEATURE_KEY = 'LocationMaster';
export const selectLocationMasterState = createFeatureSelector<
  LocationMasterState
>(LOCATION_MASTER_FEATURE_KEY);

/**
 * The reducer function which manipulates the store for respective Action
 */
export function LocationMasterReducer(
  state: LocationMasterState = initialState,
  action: LocationMasterActions
): LocationMasterState {
  switch (action.type) {
    case LocationMasterActionTypes.LOAD_LOCATION_LISTING:
      return {
        ...state,
        locationDetails: null,
        subRegions: null,
        subBrands: null,
        isSaved: false,
        isLoading: true,
        isCopySuccess: false,
        error: null
      };

    case LocationMasterActionTypes.LOAD_LOCATION_LISTING_SUCCESS:
      return {
        ...state,

        locationListing: locationListAdapter.setAll(
          action.payload.results,
          state.locationListing
        ),
        isLoading: false,
        totalCount: action.payload.totalElements,
        error: null
      };

    case LocationMasterActionTypes.LOAD_LOCATION_LISTING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case LocationMasterActionTypes.SEARCH_LOCATION_BY_LOCATIONCODE:
      return {
        ...state,
        error: null
      };
    case LocationMasterActionTypes.SEARCH_LOCATION_BY_LOCATIONCODE_SUCCESS:
      return {
        ...state,
        locationListing: locationListAdapter.setAll(
          action.payload.results,
          state.locationListing
        ),
        totalCount: action.payload.totalElements,
        error: null
      };

    case LocationMasterActionTypes.SEARCH_LOCATION_BY_LOCATIONCODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        locationListing: locationListAdapter.removeAll(state.locationListing)
      };

    case LocationMasterActionTypes.COPY_DETAILS:
      return {
        ...state,
        error: null,
        isCopySuccess: false
      };
    case LocationMasterActionTypes.COPY_DETAILS_SUCCESS:
      return {
        ...state,
        isCopySuccess: true,
        error: null
      };

    case LocationMasterActionTypes.COPY_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isCopySuccess: false
      };

    case LocationMasterActionTypes.LOAD_LOCATION_DETAILS:
      return {
        ...state,
        isLoading: true,
        isSaved: false,
        error: null
      };

    case LocationMasterActionTypes.LOAD_LOCATION_DETAILS_SUCCESS:
      return {
        ...state,
        locationDetails: action.payload,
        isLoading: false,
        error: null
      };

    case LocationMasterActionTypes.LOAD_LOCATION_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case LocationMasterActionTypes.SAVE_LOCATION_DETAILS:
      return {
        ...state,
        isLoading: true,
        isSaved: false,
        error: null
      };

    case LocationMasterActionTypes.SAVE_LOCATION_DETAILS_SUCCESS:
      return {
        ...state,
        locationDetails: action.payload,
        isLoading: false,
        isSaved: true,
        error: null
      };

    case LocationMasterActionTypes.SAVE_LOCATION_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isSaved: false,
        isLoading: false
      };

    case LocationMasterActionTypes.UPDATE_LOCATION_DETAILS:
      return {
        ...state,
        isLoading: true,
        isSaved: false,
        error: null
      };

    case LocationMasterActionTypes.UPDATE_LOCATION_DETAILS_SUCCESS:
      return {
        ...state,
        locationDetails: action.payload,
        isSaved: true,
        isLoading: false,
        error: null
      };

    case LocationMasterActionTypes.UPDATE_LOCATION_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isSaved: false,
        isLoading: false
      };

    case LocationMasterActionTypes.LOAD_STATES:
    case LocationMasterActionTypes.LOAD_MARKET_CODE:
    case LocationMasterActionTypes.LOAD_LOCATION_TYPES:
    case LocationMasterActionTypes.LOAD_TOWNS:
    case LocationMasterActionTypes.LOAD_STATES:
    case LocationMasterActionTypes.LOAD_OWNER_INFO:
    case LocationMasterActionTypes.LOAD_REGION:
    case LocationMasterActionTypes.LOAD_SUB_REGION_DETAILS:
    case LocationMasterActionTypes.LOAD_BRAND:
    case LocationMasterActionTypes.LOAD_SUB_BRAND_DETAILS:
    case LocationMasterActionTypes.LOAD_CURRENCY:
    case LocationMasterActionTypes.LOAD_BASE_CURRENCY:
    case LocationMasterActionTypes.LOAD_LOCATION_SIZE:
    case LocationMasterActionTypes.LOAD_INVOICE_TYPE:
    case LocationMasterActionTypes.LOAD_REFUND_MODE:
    case LocationMasterActionTypes.LOAD_COUNTRY_CODE:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case LocationMasterActionTypes.LOAD_STATES_FAILURE:
    case LocationMasterActionTypes.LOAD_BRAND_FAILURE:
    case LocationMasterActionTypes.LOAD_MARKET_CODE_FAILURE:
    case LocationMasterActionTypes.LOAD_LOCAITON_TYPES_FAILURE:
    case LocationMasterActionTypes.LOAD_TOWNS_FAILURE:
    case LocationMasterActionTypes.LOAD_STATES_FAILURE:
    case LocationMasterActionTypes.LOAD_OWNER_INFO_FAILURE:
    case LocationMasterActionTypes.LOAD_REGION_FAILURE:
    case LocationMasterActionTypes.LOAD_SUB_REGION_DETAILS_FAILURE:
    case LocationMasterActionTypes.LOAD_BRAND_FAILURE:
    case LocationMasterActionTypes.LOAD_SUB_BRAND_DETAILS_FAILURE:
    case LocationMasterActionTypes.LOAD_CURRENCY_FAILURE:
    case LocationMasterActionTypes.LOAD_BASE_CURRENCY_FAILURE:
    case LocationMasterActionTypes.LOAD_LOCATION_SIZE_FAILURE:
    case LocationMasterActionTypes.LOAD_INVOICE_TYPE_FAILURE:
    case LocationMasterActionTypes.LOAD_REFUND_MODE_FAILURE:
    case LocationMasterActionTypes.LOAD_COUNTRY_CODE_FAILURE:
    case LocationMasterActionTypes.LOAD_CFA_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case LocationMasterActionTypes.LOAD_LOCATION_TYPES_SUCCESS:
      return {
        ...state,
        locationTypes: action.payload,
        isLoading: false,
        error: null
      };

    case LocationMasterActionTypes.LOAD_TOWNS_SUCCESS:
      return {
        ...state,
        towns: action.payload,
        isLoading: false
      };

    case LocationMasterActionTypes.LOAD_STATES_SUCCESS:
      return {
        ...state,
        stateTypes: action.payload,
        isLoading: false,
        error: null
      };

    case LocationMasterActionTypes.LOAD_OWNER_INFO_SUCCESS:
      return {
        ...state,
        ownerInfo: action.payload,
        isLoading: false
      };

    case LocationMasterActionTypes.LOAD_REGION_SUCCESS:
      return {
        ...state,
        regions: action.payload,
        isLoading: false
      };

    case LocationMasterActionTypes.LOAD_SUB_REGION_DETAILS_SUCCESS:
      return {
        ...state,
        subRegions: action.payload,
        isLoading: false
      };

    case LocationMasterActionTypes.LOAD_BRAND_SUCCESS:
      return {
        ...state,
        brands: action.payload,
        isLoading: false,
        error: null
      };

    case LocationMasterActionTypes.LOAD_SUB_BRAND_DETAILS_SUCCESS:
      return {
        ...state,
        subBrands: action.payload,
        isLoading: false
      };

    case LocationMasterActionTypes.LOAD_MARKET_CODE_SUCCESS:
      return {
        ...state,
        marketTypes: action.payload,
        isLoading: false,
        error: null
      };

    case LocationMasterActionTypes.LOAD_BASE_CURRENCY_SUCCESS:
      return {
        ...state,
        baseCurrencyTypes: action.payload,
        isLoading: false,
        error: null
      };

    case LocationMasterActionTypes.LOAD_CURRENCY_SUCCESS:
      return {
        ...state,
        currencyTypes: action.payload,
        isLoading: false,
        error: null
      };

    case LocationMasterActionTypes.LOAD_LOCATION_SIZE_SUCCESS:
      return {
        ...state,
        locationSize: action.payload,
        isLoading: false,
        error: null
      };

    case LocationMasterActionTypes.LOAD_INVOICE_TYPE_SUCCESS:
      return {
        ...state,
        invoicetype: action.payload,
        isLoading: false,
        error: null
      };

    case LocationMasterActionTypes.LOAD_REFUND_MODE_SUCCESS:
      return {
        ...state,
        refundMode: action.payload,
        isLoading: false,
        error: null
      };

    case LocationMasterActionTypes.LOAD_COUNTRY_CODE_SUCCESS:
      return {
        ...state,
        countryCode: action.payload,
        isLoading: false,
        error: null
      };

    case LocationMasterActionTypes.LOAD_CFA_LIST_SUCCESS:
      return {
        ...state,
        LocationCFATypes: action.payload,
        isLoading: false,
        error: null
      };

    default:
      return state;
  }
}
