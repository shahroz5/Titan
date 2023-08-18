import { ErrorEnums } from '@poss-web/shared/util-error';
import { createFeatureSelector } from '@ngrx/store';
import { CustomerState } from './customer.state';
import { countryAdapter, stateAdapter, zoneAdapter } from './customer.entity';
import { CustomerActions, CustomerActionTypes } from './customer.actions';

export const CUSTOMER_FEATURE_KEY = 'customer';

export const selectcustomerState = createFeatureSelector<CustomerState>(
  CUSTOMER_FEATURE_KEY
);

export const initialState: CustomerState = {
  error: null,
  isLoading: false,
  countries: countryAdapter.getInitialState(),
  states: stateAdapter.getInitialState(),
  city: [],
  salutations: [],
  idProofList: [],
  isSearchingCustomer: false,
  hasCustomerResult: null,
  searchCustomerResult: null,
  searchOneTimeCustomer: [],
  customerDetails: null,
  selectedCustomer: null,
  searchError: null,
  pincode: null,
  selectedCustomerDetail: null,
  zones: zoneAdapter.getInitialState(),
  isUniqueCustomer: null,
  isUniqueEmail: null,
  isUniquePan: null,
  isUniqueGst: null,
  isUniquePassport: null,
  countryCode: null,
  createdCustomerStatus: null,
  isCustomerSaving: false,
  enableClear: true,
  enableEdit: true,
  enableCreate: true,
  allowedTransactionTypes: null,
  updatedCustomerStatus: null,
  brandDetails: null,
  panVerificationResponse: null,
  gstVerificationResponse: null,
  catchmentList: [],
  rivaahCouponDetail: null,
  emailValidationResponse: null,
  verifyPanDetailsResponse: null
};

export function CustomerReducer(
  state: CustomerState = initialState,
  action: CustomerActions
): CustomerState {
  switch (action.type) {
    case CustomerActionTypes.LOAD_ALLOWED_TRANSACTIONTYPES:
      return {
        ...state,
        allowedTransactionTypes: null
      };

    case CustomerActionTypes.LOAD_ALLOWED_TRANSACTIONTYPES_SUCCESS:
      return {
        ...state,
        allowedTransactionTypes: action.payload
      };

    case CustomerActionTypes.LOAD_ALLOWED_TRANSACTIONTYPES_FAILURE:
      return {
        ...state,
        searchError: action.payload
      };

    case CustomerActionTypes.LOAD_COUNTRIES_SUCCESS:
      return {
        ...state,
        countries: countryAdapter.setAll(action.payload, state.countries),
        error: null
      };

    case CustomerActionTypes.LOAD_COUNTRIES_FAILURE:
      return {
        ...state,
        countries: countryAdapter.setAll([], state.countries),
        error: action.payload
      };

    case CustomerActionTypes.LOAD_STATES_SUCCESS:
      return {
        ...state,
        states: stateAdapter.setAll(action.payload, state.states),
        error: null
      };

    case CustomerActionTypes.LOAD_STATES_FAILURE:
      return {
        ...state,
        states: stateAdapter.setAll([], state.states),
        error: action.payload
      };

    case CustomerActionTypes.LOAD_TOWNS_SUCCESS:
      return {
        ...state,
        city: action.payload,
        error: null
      };

    case CustomerActionTypes.LOAD_CATCHMENT_AREA_SUCCESS:
      return {
        ...state,
        catchmentList: action.payload,
        error: null
      };

    case CustomerActionTypes.LOAD_COUNTRY_CODE_SUCCESS:
      return {
        ...state,
        countryCode: action.payload,
        error: null
      };
    case CustomerActionTypes.VERIFY_PAN_DETAILS_SUCCESS:
      return {
        ...state,
        verifyPanDetailsResponse: action.payload,
        isLoading: false,
        error: null
      };
    case CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PASSPORT_FAILURE:

    case CustomerActionTypes.LOAD_TOWNS_FAILURE:
    case CustomerActionTypes.LOAD_CATCHMENT_AREA_FAILURE:
    case CustomerActionTypes.LOAD_PINCODE_FAILURE:
    case CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_MOBILE_FAILURE:
    case CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_EMAIL_FAILURE:
    case CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_GST_FAILURE:
    case CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PAN_FAILURE:
    case CustomerActionTypes.PAN_CARD_VERIFICATION_STATUS_FAILURE:
    case CustomerActionTypes.GST_CARD_VERIFICATION_STATUS_FAILURE:
    case CustomerActionTypes.LOAD_COUNTRY_CODE_FAILURE:
    case CustomerActionTypes.SELECT_INTERNATIONAL_CUSTOMER_FAILURE:
    case CustomerActionTypes.SELECT_ONETIME_CUSTOMER_FAILURE:
    case CustomerActionTypes.LOAD_SALUTATIONS_FAILURE:
    case CustomerActionTypes.LOAD_ID_PROOFS_FAILURE:
    case CustomerActionTypes.EMAIL_VALIDATION_STATUS_FAILURE:
    case CustomerActionTypes.VERIFY_PAN_DETAILS_FAILURE:
    case CustomerActionTypes.UPDATE_PAN_FORM_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case CustomerActionTypes.SELECT_INTERNATIONAL_CUSTOMER:
    case CustomerActionTypes.SELECT_ONETIME_CUSTOMER:
    case CustomerActionTypes.UPDATE_PAN_FORM_DETAILS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case CustomerActionTypes.VERIFY_PAN_DETAILS:
      return {
        ...state,
        isLoading: true,
        verifyPanDetailsResponse: null,
        error: null
      };

    case CustomerActionTypes.LOAD_PINCODE_SUCCESS:
      return {
        ...state,
        pincode: action.payload,
        error: null
      };
    case CustomerActionTypes.UPDATE_PAN_FORM_DETAILS_SUCCESS:
      return {
        ...state,
        updatedCustomerStatus: true,
        isLoading: false
      };
    case CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_MOBILE_SUCCESS:
      return {
        ...state,
        isUniqueCustomer: action.payload,
        error: null
      };

    case CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PASSPORT_SUCCESS:
      return {
        ...state,
        isUniquePassport: action.payload,
        error: null
      };

    case CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_EMAIL_SUCCESS:
      return {
        ...state,
        isUniqueEmail: action.payload,
        error: null
      };

    case CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PAN_SUCCESS:
      return {
        ...state,
        isUniquePan: action.payload,
        error: null
      };

    case CustomerActionTypes.PAN_CARD_VERIFICATION_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        panVerificationResponse: action.payload,

        error: null
      };

    case CustomerActionTypes.GST_CARD_VERIFICATION_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        gstVerificationResponse: action.payload,
        error: null
      };

    case CustomerActionTypes.EMAIL_VALIDATION_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        emailValidationResponse: action.payload,
        error: null
      };

    case CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_GST_SUCCESS:
      return {
        ...state,
        isUniqueGst: action.payload,
        error: null
      };

    case CustomerActionTypes.LOAD_SALUTATIONS_SUCCESS:
      return {
        ...state,
        salutations: action.payload,
        error: null
      };

    case CustomerActionTypes.LOAD_ID_PROOFS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case CustomerActionTypes.LOAD_ID_PROOFS_SUCCESS:
      return {
        ...state,
        idProofList: action.payload,
        isLoading: false,
        error: null
      };

    case CustomerActionTypes.SELECTED_CUSTOMER_DETAIL:
      return {
        ...state,
        isLoading: true,
        selectedCustomerDetail: null
      };

    case CustomerActionTypes.SAVE_CUSTOMER_FORM_DETAILS:
    case CustomerActionTypes.UPDATE_CUSTOMER:
      return {
        ...state,
        isCustomerSaving: true
      };
    case CustomerActionTypes.UPDATE_CUSTOMER_SUCCESS:
      return {
        ...state,
        isCustomerSaving: false,
        selectedCustomerDetail: action.payload,
        selectedCustomer: { ...action.payload, isCalledFromCustomer: true },
        updatedCustomerStatus: true
      };

    case CustomerActionTypes.SAVE_CUSTOMER_FORM_DETAILS_SUCCESS:
      return {
        ...state,
        isCustomerSaving: false,
        selectedCustomer: { ...action.payload, isCalledFromCustomer: true },
        selectedCustomerDetail: action.payload,
        createdCustomerStatus: {
          customerId: action.payload.customerId,
          customerType: action.payload.customerType,
          ulpId: action.payload.ulpId
        }
      };
    case CustomerActionTypes.SAVE_CUSTOMER_FORM_DETAILS_FAILURE:
    case CustomerActionTypes.UPDATE_CUSTOMER_FAILURE:
      return {
        ...state,
        error: action.payload,
        isCustomerSaving: false
      };
    case CustomerActionTypes.LOAD_BRAND_DETAILS:
    case CustomerActionTypes.PAN_CARD_VERIFICATION_STATUS:
    case CustomerActionTypes.GST_CARD_VERIFICATION_STATUS:
    case CustomerActionTypes.LOAD_RIVAAH_COUPON_DETAIL:
    case CustomerActionTypes.EMAIL_VALIDATION_STATUS:
      return {
        ...state,
        isLoading: true
      };

    case CustomerActionTypes.LOAD_RIVAAH_COUPON_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rivaahCouponDetail: action.payload
      };

    case CustomerActionTypes.LOAD_BRAND_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        brandDetails: action.payload
      };

    case CustomerActionTypes.LOAD_BRAND_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case CustomerActionTypes.SELECTED_CUSTOMER_DETAIL_FAILURE:
      return {
        ...state,
        error: action.payload
      };
  }

  switch (action.type) {
    case CustomerActionTypes.SEARCH_CUSTOMER:
      return {
        ...state,
        isSearchingCustomer: true,
        hasCustomerResult: null,
        searchCustomerResult: null,
        searchError: null
      };

    case CustomerActionTypes.SEARCH_CUSTOMER_SUCCESS:
      if (action.payload) {
        return {
          ...state,
          isSearchingCustomer: false,
          hasCustomerResult: true,
          searchCustomerResult: action.payload
        };
      } else {
        return {
          ...state,
          isSearchingCustomer: false,
          hasCustomerResult: false
        };
      }

    case CustomerActionTypes.SEARCH_CUSTOMER_FAILURE:
      if (action.payload.code === ErrorEnums.ERR_SALE_070) {
        return {
          ...state,
          isSearchingCustomer: false,
          hasCustomerResult: false
        };
      } else {
        return {
          ...state,
          isSearchingCustomer: false,
          searchError: action.payload
        };
      }

    case CustomerActionTypes.SEARCH_ONE_TIME_CUSTOMER:
      return {
        ...state,
        isSearchingCustomer: true,
        hasCustomerResult: null,
        searchOneTimeCustomer: [],
        searchError: null
      };

    case CustomerActionTypes.SEARCH_ONE_TIME_CUSTOMER_SUCCESS:
      if (action.payload) {
        return {
          ...state,
          isSearchingCustomer: false,
          hasCustomerResult: true,
          searchOneTimeCustomer: action.payload
        };
      } else {
        return {
          ...state,
          isSearchingCustomer: false,
          hasCustomerResult: false
        };
      }

    case CustomerActionTypes.SEARCH_ONE_TIME_CUSTOMER_FAILURE:
      if (action.payload.code === ErrorEnums.ERR_SALE_070) {
        return {
          ...state,
          isSearchingCustomer: false,
          hasCustomerResult: false
        };
      } else {
        return {
          ...state,
          isSearchingCustomer: false,
          searchError: action.payload
        };
      }

    case CustomerActionTypes.CLEAR_CUSTOMER_SEARCH:
      return {
        ...state,
        isSearchingCustomer: false,
        hasCustomerResult: null,
        searchCustomerResult: null,
        searchOneTimeCustomer: [],
        selectedCustomer: null,
        searchError: null,
        selectedCustomerDetail: null,
        updatedCustomerStatus: null,
        panVerificationResponse: null,
        gstVerificationResponse: null,
        emailValidationResponse: null,
        enableClear: true,
        enableEdit: true,
        enableCreate: true
      };

    case CustomerActionTypes.CLEAR_VERIFICATION_STATUS:
      return {
        ...state,
        panVerificationResponse: null,
        gstVerificationResponse: null
      };

    case CustomerActionTypes.CLEAR_PAN_VERIFICATION_STATUS:
      return {
        ...state,
        panVerificationResponse: null
      };

    case CustomerActionTypes.CLEAR_GST_VERIFICATION_STATUS:
      return {
        ...state,
        gstVerificationResponse: null
      };

    case CustomerActionTypes.CLEAR_EMIAL_VALIDATION_STATUS:
      return {
        ...state,
        emailValidationResponse: null
      };

    case CustomerActionTypes.CLEAR_ALLOWED_TRANSACTIONS:
      return {
        ...state,
        allowedTransactionTypes: null
      };

    case CustomerActionTypes.CLEAR_UPDATED_CUSTOMER:
      return {
        ...state,
        updatedCustomerStatus: false
      };

    case CustomerActionTypes.CLEAR_RIVAAH_COUPON_DETAIL:
      return {
        ...state,
        rivaahCouponDetail: null
      };

    case CustomerActionTypes.CLEAR_SELECTED_CUSTOMER:
      return {
        ...state,
        selectedCustomer: null,
        selectedCustomerDetail: null,
        createdCustomerStatus: null,
        panVerificationResponse: null,
        gstVerificationResponse: null,
        emailValidationResponse: null
      };

    case CustomerActionTypes.LOAD_SELECTED_CUSTOMER_SUCCESS:
      return {
        ...state,
        selectedCustomer: action.payload.customerInfo,
        enableClear: action.payload.enableClear,
        enableEdit: action.payload.enableEdit,
        enableCreate: action.payload.enableCreate
      };

    case CustomerActionTypes.SELECT_INTERNATIONAL_CUSTOMER_SUCCESS:
    case CustomerActionTypes.SELECT_ONETIME_CUSTOMER_SUCCESS:
    case CustomerActionTypes.SELECT_CUSTOMER:
      return {
        ...state,
        selectedCustomer: action.payload,
        isLoading: false
      };

    case CustomerActionTypes.LOAD_SELECTED_CUSTOMER:
      return {
        ...state,
        enableClear: action.payload.enableClear,
        enableEdit: action.payload.enableEdit,
        enableCreate: action.payload.enableCreate,
        selectedCustomer: null,
        panVerificationResponse: null,
        gstVerificationResponse: null,
        emailValidationResponse: null
      };
    case CustomerActionTypes.LOAD_SELECTED_CUSTOMER_FAILURE:
      return {
        ...state,
        searchError: action.payload,
        error: action.payload
      };
    case CustomerActionTypes.GET_GHS_CUSTOMER_DETAILS:
      return {
        ...state,
        customerDetails: null
      };

    case CustomerActionTypes.GET_GHS_CUSTOMER_DETAILS_SUCCESS:
      return {
        ...state,
        customerDetails: action.payload
      };

    case CustomerActionTypes.GET_GHS_CUSTOMER_DETAILS_FAILURE:
    case CustomerActionTypes.LOAD_RIVAAH_COUPON_DETAIL_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case CustomerActionTypes.LOAD_ZONES_SUCCESS:
      return {
        ...state,
        zones: zoneAdapter.setAll(action.payload, state.zones),
        error: null
      };

    case CustomerActionTypes.LOAD_ZONES_FAILURE:
      return {
        ...state,
        zones: zoneAdapter.setAll([], state.zones),
        error: action.payload
      };

    case CustomerActionTypes.SELECTED_CUSTOMER_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        selectedCustomerDetail: action.payload
      };

    case CustomerActionTypes.ENABLE_CUSTOMER_CREATE:
      return {
        ...state,
        enableCreate: true
      };

    case CustomerActionTypes.DISABLE_CUSTOMER_CREATE:
      return {
        ...state,
        enableCreate: false
      };

    default:
      return state;
  }
}
