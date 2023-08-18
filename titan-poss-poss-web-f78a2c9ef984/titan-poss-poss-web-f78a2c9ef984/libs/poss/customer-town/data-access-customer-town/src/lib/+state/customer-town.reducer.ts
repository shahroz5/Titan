import { CustomerTownState } from './customer-town.state';
import {
  CustomerTownActions,
  CustomerTownActionTypes
} from './customer-town.actions';
// import { customerTownAdapter } from './customer-town.entity';
import { createFeatureSelector } from '@ngrx/store';

export const CUSTOMER_TOWN_FEATURE_KEY = 'binGroup';

export const selectCustomerTown = createFeatureSelector<CustomerTownState>(
  CUSTOMER_TOWN_FEATURE_KEY
);

const initialState: CustomerTownState = {
  customerTownDetailsListing: null,
  totalCustomerTownDetails: 0,
  error: null,
  stateDetails: null,
  isCustomerTownLoading: false,
  townDetailsByTownCode: null,
  saveTownDetailsResponses: null,
  editTownDetailsResponses: null,
  // regionDetails: null,
  isSearchElements: true
};

export function CustomerTownReducer(
  state: CustomerTownState = initialState,
  action: CustomerTownActions
): CustomerTownState {
  switch (action.type) {
    case CustomerTownActionTypes.LOAD_CORPORATE_TOWN:
    case CustomerTownActionTypes.LOAD_STATE_DETAILS:
    case CustomerTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE:
    case CustomerTownActionTypes.SAVE_CORPORATE_TOWN:
    case CustomerTownActionTypes.EDIT_CORPORATE_TOWN:
      // case CustomerTownActionTypes.LOAD_REGION_DETAILS:
      return {
        ...state,
        isCustomerTownLoading: true
      };

    case CustomerTownActionTypes.LOAD_CORPORATE_TOWN_SUCCESS:
      return {
        ...state,
        totalCustomerTownDetails: action.payload.totalElements,
        isCustomerTownLoading: false,
        customerTownDetailsListing: action.payload.customerTownDetailsListing
      };

    case CustomerTownActionTypes.LOAD_CORPORATE_TOWN_FAILURE:
    case CustomerTownActionTypes.LOAD_STATE_DETAILS_FAILURE:
    case CustomerTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE_FAILURE:
    case CustomerTownActionTypes.SAVE_CORPORATE_TOWN_FAILURE:
    case CustomerTownActionTypes.EDIT_CORPORATE_TOWN_FAILURE:
      // case CustomerTownActionTypes.LOAD_REGION_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isCustomerTownLoading: false,
        isSearchElements: true
      };

    case CustomerTownActionTypes.LOAD_STATE_DETAILS_SUCCESS:
      return {
        ...state,
        stateDetails: action.payload,
        isCustomerTownLoading: false
      };

    case CustomerTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE_SUCCESS:
      console.log('redpay', action.payload);
      return {
        ...state,
        townDetailsByTownCode: action.payload,
        isCustomerTownLoading: false
      };

    case CustomerTownActionTypes.SAVE_CORPORATE_TOWN_SUCCESS:
      return {
        ...state,
        isCustomerTownLoading: false,
        saveTownDetailsResponses: action.payload
      };

    case CustomerTownActionTypes.RESET_CORPORATE_TOWN_DIALOG_DATA:
      return {
        ...state,
        isCustomerTownLoading: false,
        townDetailsByTownCode: null,
        saveTownDetailsResponses: null,
        editTownDetailsResponses: null,
        error: null,
        isSearchElements: true
      };

    case CustomerTownActionTypes.EDIT_CORPORATE_TOWN_SUCCESS:
      return {
        ...state,
        isCustomerTownLoading: false,
        editTownDetailsResponses: action.payload
      };

    // case CustomerTownActionTypes.LOAD_REGION_DETAILS_SUCCESS:
    //   return {
    //     ...state,
    //     regionDetails: action.payload.regionDetailsListing,
    //     isCustomerTownLoading: false
    //   };

    // case CustomerTownActionTypes.SEARCH_CORPORATETOWN:
    //   return {
    //     ...state,
    //     error: null
    //   };
    // case CustomerTownActionTypes.SEARCH_CORPORATETOWN_SUCCESS:
    //   return {
    //     ...state,
    //     error: null,
    //     totalCustomerTownDetails: action.payload.totalElements,
    //     isSearchElements: false,
    //     customerTownDetailsListing: customerTownAdapter.setAll(
    //       action.payload.customerTownDetailsListing,
    //       state.customerTownDetailsListing
    //     )
    //   };

    // case CustomerTownActionTypes.SEARCH_CORPORATETOWN_FAILURE:
    //   return {
    //     ...state,
    //     error: action.payload,
    //     isSearchElements: false,
    //     customerTownDetailsListing: customerTownAdapter.removeAll(
    //       state.customerTownDetailsListing
    //     )
    //   };

    default:
      return state;
  }
}
