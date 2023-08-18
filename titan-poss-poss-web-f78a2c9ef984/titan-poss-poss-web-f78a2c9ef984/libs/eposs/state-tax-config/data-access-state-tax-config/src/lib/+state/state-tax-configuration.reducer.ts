import { createFeatureSelector } from '@ngrx/store';

import { StateTaxConfigurationState } from './state-tax-configuration.state';
import {
  StateTaxConfigurationActions,
  StateTaxConfigurationActionTypes
} from './state-tax-configuration.actions';
import {
  StateTaxConfigurationListingAdapter,
  taxDetailsConfigListingAdapter
} from './state-tax-configuration.entity';

export const initialState: StateTaxConfigurationState = {
  stateTaxConfigurationListing: StateTaxConfigurationListingAdapter.getInitialState(),
  taxDetailsStateDetails: null,
  taxDetailsStateDetailsSaveResponse: null,
  taxDetailsStateDetailsEditResponse: null,
  taxDetailsSaveResponse: null,
  taxComponentDetails: null,
  taxDetailsListing: taxDetailsConfigListingAdapter.getInitialState(),
  allStateList: null,
  allTaxSystemList: null,
  allTaxClassList: null,
  allTaxsList: null,
  totalStateTaxConfiguration: 0,
  error: null,
  isLoading: null
};

export const STATE_TAX_CONFIGURATION_FEATURE_KEY = 'stateTaxConfiguration';
export const selectStateTaxConfigurationState = createFeatureSelector<
  StateTaxConfigurationState
>(STATE_TAX_CONFIGURATION_FEATURE_KEY);

export function StateTaxConfigurationReducer(
  state: StateTaxConfigurationState = initialState,
  action: StateTaxConfigurationActions
): StateTaxConfigurationState {
  switch (action.type) {
    case StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_LISTING:
      return {
        ...state,
        isLoading: true,
        taxDetailsStateDetailsSaveResponse: null,
        taxDetailsStateDetailsEditResponse: null,
        taxDetailsSaveResponse: null,
        error: null
      };

    case StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_LISTING_SUCCESS:
      return {
        ...state,
        stateTaxConfigurationListing: StateTaxConfigurationListingAdapter.setAll(
          action.payload.stateTaxConfigurationListing,
          state.stateTaxConfigurationListing
        ),
        totalStateTaxConfiguration: action.payload.totalElements,
        isLoading: false
      };

    case StateTaxConfigurationActionTypes.LOAD_ALL_TAXS_LIST_FAILURE:
    case StateTaxConfigurationActionTypes.LOAD_ALL_TAXCLASS_LIST_FAILURE:
    case StateTaxConfigurationActionTypes.LOAD_ALL_TAXSYSTEM_LIST_FAILURE:
    case StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_STATE_DETAILS_FAILURE:
    case StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_LISTING_FAILURE:
    case StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_STATE_DETAILS_FAILURE:
    case StateTaxConfigurationActionTypes.EDIT_STATE_TAX_CONFIGURATION_STATE_DETAILS_FAILURE:
    case StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_TAX_DETAILS_FAILURE:
    case StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_TAX_DETAILS_FAILURE:
    case StateTaxConfigurationActionTypes.LOAD_ALL_STATE_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case StateTaxConfigurationActionTypes.EDIT_STATE_TAX_CONFIGURATION_STATE_DETAILS:
    case StateTaxConfigurationActionTypes.SEARCH_STATE_TAX_CONFIGURATION_LISTING:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case StateTaxConfigurationActionTypes.SEARCH_STATE_TAX_CONFIGURATION_LISTING_SUCCESS:
      return {
        ...state,
        totalStateTaxConfiguration: 1,
        stateTaxConfigurationListing: StateTaxConfigurationListingAdapter.setAll(
          action.payload.stateTaxConfigurationListing,
          state.stateTaxConfigurationListing
        ),
        isLoading: false
      };

    case StateTaxConfigurationActionTypes.SEARCH_STATE_TAX_CONFIGURATION_LISTING_FAILURE:
      return {
        ...state,
        totalStateTaxConfiguration: 0,
        stateTaxConfigurationListing: StateTaxConfigurationListingAdapter.removeAll(
          state.stateTaxConfigurationListing
        ),
        error: action.payload,
        isLoading: false
      };

    case StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_STATE_DETAILS:
      return {
        ...state,
        taxDetailsStateDetailsSaveResponse: null,
        taxDetailsStateDetailsEditResponse: null,
        taxDetailsSaveResponse: null,
        isLoading: true
      };

    case StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_STATE_DETAILS_SUCCESS:
      const taxComponent: string[] = [];

      action.payload.taxComponent.tax.forEach(el => {
        taxComponent.push(el.taxCode);
      });
      action.payload.taxComponent.cess.forEach(el => {
        taxComponent.push(el.cessCode);
      });

      return {
        ...state,
        taxDetailsStateDetails: action.payload,
        taxComponentDetails: taxComponent,
        isLoading: false
      };

    case StateTaxConfigurationActionTypes.LOAD_ALL_TAXS_LIST:
    case StateTaxConfigurationActionTypes.LOAD_ALL_TAXCLASS_LIST:
    case StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_TAX_DETAILS:
    case StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_STATE_DETAILS:
    case StateTaxConfigurationActionTypes.LOAD_ALL_TAXSYSTEM_LIST:
    case StateTaxConfigurationActionTypes.LOAD_ALL_STATE_LIST:
      return {
        ...state,
        isLoading: true
      };
    case StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_STATE_DETAILS_SUCCESS:
      const taxComponent2: string[] = [];

      action.payload.taxComponent.tax.forEach(el => {
        taxComponent2.push(el.taxCode);
      });
      action.payload.taxComponent.cess.forEach(el => {
        taxComponent2.push(el.cessCode);
      });

      return {
        ...state,
        taxDetailsStateDetails: action.payload,
        taxDetailsStateDetailsSaveResponse: action.payload,
        taxComponentDetails: taxComponent2,
        isLoading: false
      };

    case StateTaxConfigurationActionTypes.EDIT_STATE_TAX_CONFIGURATION_STATE_DETAILS_SUCCESS:
      const taxComponent3: string[] = [];

      action.payload.taxComponent.tax.forEach(el => {
        taxComponent3.push(el.taxCode);
      });
      action.payload.taxComponent.cess.forEach(el => {
        taxComponent3.push(el.cessCode);
      });

      return {
        ...state,
        taxDetailsStateDetails: action.payload,
        taxDetailsStateDetailsEditResponse: action.payload,
        taxComponentDetails: taxComponent3,
        isLoading: false,
        error: null
      };

    case StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_TAX_DETAILS_SUCCESS:
      return {
        ...state,
        taxDetailsListing: taxDetailsConfigListingAdapter.setAll(
          action.payload,
          state.taxDetailsListing
        ),

        isLoading: false
      };

    case StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_TAX_DETAILS:
      return {
        ...state,
        taxDetailsSaveResponse: null,
        isLoading: true
      };
    case StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_TAX_DETAILS_SUCCESS:
      return {
        ...state,
        taxDetailsSaveResponse: action.payload,
        isLoading: false
      };

    case StateTaxConfigurationActionTypes.SELECT_STATE_TAX_DETAILS:
      return {
        ...state,
        taxDetailsListing: taxDetailsConfigListingAdapter.updateOne(
          {
            id: action.payload.taxDetailsId,
            changes: { isSelected: action.payload.checked }
          },
          state.taxDetailsListing
        )
      };

    case StateTaxConfigurationActionTypes.SELECT_ALL_STATE_TAX_DETAILS:
      return {
        ...state,
        taxDetailsListing: taxDetailsConfigListingAdapter.map(data => {
          return { ...data, isSelected: action.payload };
        }, state.taxDetailsListing)
      };

    case StateTaxConfigurationActionTypes.LOAD_ALL_STATE_LIST_SUCCESS:
      return {
        ...state,
        allStateList: action.payload.stateDetailsListing,
        isLoading: false
      };

    case StateTaxConfigurationActionTypes.LOAD_ALL_TAXSYSTEM_LIST_SUCCESS:
      return {
        ...state,
        allTaxSystemList: action.payload,
        isLoading: false
      };

    case StateTaxConfigurationActionTypes.LOAD_ALL_TAXCLASS_LIST_SUCCESS:
      return {
        ...state,
        allTaxClassList: action.payload,
        isLoading: false
      };

    case StateTaxConfigurationActionTypes.LOAD_ALL_TAXS_LIST_SUCCESS:
      return {
        ...state,
        allTaxsList: action.payload,
        isLoading: false
      };

    case StateTaxConfigurationActionTypes.RESET_STATE:
      return {
        ...state,
        error: null,
        isLoading: false,
        allTaxSystemList: null,
        taxDetailsStateDetailsSaveResponse: null,
        taxDetailsStateDetailsEditResponse: null,
        taxDetailsSaveResponse: null,
        taxDetailsStateDetails: null,
        totalStateTaxConfiguration: 0
      };

    default:
      return state;
  }
}
