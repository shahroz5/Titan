import { CountryState } from './country.state';
import { CountryActions, CountryActionTypes } from './country.action';
import { createFeatureSelector } from '@ngrx/store';

export const initialState: CountryState = {
  countryListing: null,
  countryDetails: null,
  totalCountryDetails: 0,
  isLoading: false,
  error: null,
  saveCountryResponses: null,
  editCountryResponses: null,
  countryName: null,
  currencyCode: null,
  timeFormats: [],
  dateFormats: []
};

export const COUNTRY_FEATURE_KEY = 'country';
export const selectCountryState = createFeatureSelector<CountryState>(
  COUNTRY_FEATURE_KEY
);

export function CountryReducer(
  state: CountryState = initialState,
  action: CountryActions
): CountryState {
  switch (action.type) {
    case CountryActionTypes.LOAD_COUNTRY_LISTING:
    case CountryActionTypes.LOAD_COUNTRY_DETAILS_BY_COUNTRYCODE:
    case CountryActionTypes.SAVE_COUNTRY_FORM_DETAILS:
    case CountryActionTypes.EDIT_COUNTRY_FORM_DETAILS:
    case CountryActionTypes.SEARCH_COUNTRY_DETAILS:
    // case CountryActionTypes.LOAD_COUNTRY_NAME:
    case CountryActionTypes.LOAD_CURRENCY_CODE:
    case CountryActionTypes.LOAD_TIME_FORMATS:
    case CountryActionTypes.LOAD_DATE_FORMATS:
    case CountryActionTypes.LOAD_CURRENCY_CODE:
      return {
        ...state,
        isLoading: true
      };

    case CountryActionTypes.LOAD_COUNTRY_LISTING_SUCCESS:
      return {
        ...state,
        countryListing: action.payload.countryListing,
        totalCountryDetails: action.payload.totalElements,
        isLoading: false
      };

    case CountryActionTypes.LOAD_COUNTRY_LISTING_FAILURE:
    case CountryActionTypes.LOAD_COUNTRY_DETAILS_BY_COUNTRYCODE_FAILURE:
    case CountryActionTypes.EDIT_COUNTRY_FORM_DETAILS_FAILURE:
    case CountryActionTypes.SAVE_COUNTRY_FORM_DETAILS_FAILURE:
    case CountryActionTypes.LOAD_TIME_FORMATS_FAILURE:
    case CountryActionTypes.LOAD_DATE_FORMATS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case CountryActionTypes.LOAD_COUNTRY_DETAILS_BY_COUNTRYCODE_SUCCESS:
      return {
        ...state,
        countryDetails: action.payload,
        isLoading: false
      };

    case CountryActionTypes.RESET_COUNTRY_DIALOG_DATA:
      return {
        ...state,
        countryListing: null,
        countryDetails: null,
        error: null,
        isLoading: false,
        saveCountryResponses: null,
        editCountryResponses: null
      };

    case CountryActionTypes.SAVE_COUNTRY_FORM_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        saveCountryResponses: action.payload
        // countryListing: [...state.countryListing, action.payload]
      };

    case CountryActionTypes.EDIT_COUNTRY_FORM_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        editCountryResponses: action.payload
      };

    case CountryActionTypes.SEARCH_COUNTRY_DETAILS_SUCCESS:
      return {
        ...state,
        countryListing: action.payload,
        isLoading: false,
        totalCountryDetails: 0
      };
    case CountryActionTypes.LOAD_TIME_FORMATS_SUCCESS:
      return {
        ...state,
        timeFormats: action.payload,
        isLoading: false
      };
    case CountryActionTypes.LOAD_DATE_FORMATS_SUCCESS:
      return {
        ...state,
        dateFormats: action.payload,
        isLoading: false
      };
    case CountryActionTypes.SEARCH_COUNTRY_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        countryListing: null,
        isLoading: false,
        totalCountryDetails: 0
      };

    // case CountryActionTypes.LOAD_COUNTRY_NAME_SUCCESS:
    //   return {
    //     ...state,
    //     countryName: action.payload
    //   };

    // case CountryActionTypes.LOAD_COUNTRY_NAME_FAILURE:
    case CountryActionTypes.LOAD_CURRENCY_CODE_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case CountryActionTypes.LOAD_CURRENCY_CODE_SUCCESS:
      console.log(action.payload, 'currency in reducer');

      return {
        ...state,
        currencyCode: action.payload
      };

    default:
      return state;
  }
}
