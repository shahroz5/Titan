import { createFeatureSelector } from '@ngrx/store';
import { PaymentConfigurationState } from './payment-configuration.state';
import {
  PaymentConfigurationActionTypes,
  PaymentConfigurationAction
} from './payment-configuration.actions';
import { paymentModeAdaptor } from './payment-configuration.entity';
import { Update } from '@ngrx/entity';

export const paymentConfigurationFeatureKey = 'paymentConfiguration';

export const selectPaymentConfigurationState = createFeatureSelector<
  PaymentConfigurationState
>(paymentConfigurationFeatureKey);

export const initialState: PaymentConfigurationState = {
  paymentConfigurationlist: [],
  paymentConfiguration: null,
  isLoading: null,
  hasSaved: null,
  hasUpdated: null,
  totalElements: null,
  error: null,
  transctionTypes: [],
  paymentModes: paymentModeAdaptor.getInitialState(),
  selectedOptions: null,
  paymentModeCount: null,
  configId: null,
  tcsPaymentModes: []
};

export function paymentConfigurationReducer(
  state: PaymentConfigurationState = initialState,
  action: PaymentConfigurationAction
) {
  switch (action.type) {
    case PaymentConfigurationActionTypes.LOAD_PAYMENT_MODE_COUNT:
    case PaymentConfigurationActionTypes.LOAD_PAYMENT_MODES_AND_TRANSACTION_TYPES:
    case PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_BY_CONFIG_ID:
    case PaymentConfigurationActionTypes.SEARCH_PAYMENT_CONFIGURATION_LIST:
    case PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_LIST:
    case PaymentConfigurationActionTypes.LOAD_MAPPED_COUNT:
    case PaymentConfigurationActionTypes.LOAD_TCS_PAYMENT_MODE:
      return {
        ...state,
        isLoading: true
      };

    case PaymentConfigurationActionTypes.LOAD_TCS_PAYMENT_MODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        tcsPaymentModes: action.payload
      };
    case PaymentConfigurationActionTypes.LOAD_PAYMENT_MODE_COUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        paymentModeCount: action.payload
      };
    case PaymentConfigurationActionTypes.LOAD_TCS_PAYMENT_MODE_FAILURE:
    case PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_BY_CONFIG_ID_FAILURE:
    case PaymentConfigurationActionTypes.LOAD_PAYMENT_MODE_COUNT_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };

    case PaymentConfigurationActionTypes.SEARCH_PAYMENT_CONFIGURATION_LIST_SUCCESS:
    case PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        paymentConfigurationlist: action.payload.paymentConfigurationList,
        totalElements: action.payload.totalElements
      };

    case PaymentConfigurationActionTypes.LOAD_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID_FAILURE:
    case PaymentConfigurationActionTypes.LOAD_PAYMENT_MODES_AND_TRANSACTION_TYPES_FAILURE:
    case PaymentConfigurationActionTypes.LOAD_MAPPED_COUNT_FAILURE:

    case PaymentConfigurationActionTypes.SEARCH_PAYMENT_CONFIGURATION_LIST_FAILURE:
    case PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };

    case PaymentConfigurationActionTypes.LOAD_MAPPED_COUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        paymentModes: paymentModeAdaptor.updateMany(
          action.payload.map(
            (ob): Update<any> => ({
              id: ob.paymentName,
              changes: {
                selectedCount: ob.count
              }
            })
          ),
          state.paymentModes
        )
      };
    case PaymentConfigurationActionTypes.UPDATE_COUNT:
      return {
        ...state,
        paymentModes: paymentModeAdaptor.updateOne(
          {
            id: action.payload.id,
            changes: {
              selectedCount: action.payload.count
            }
          },
          state.paymentModes
        )
      };
    case PaymentConfigurationActionTypes.LOAD_PAYMENT_MODES_AND_TRANSACTION_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        paymentModes: paymentModeAdaptor.setAll(
          action.payload.paymentMode,
          state.paymentModes
        ),
        transctionTypes: action.payload.transactioncode
      };

    case PaymentConfigurationActionTypes.LOAD_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID:
      return {
        ...state,
        isLoading: true,
        selectedOptions: null
      };
    case PaymentConfigurationActionTypes.LOAD_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        // tcsPaymentModes: [...state.tcsPaymentModes],
        selectedOptions: action.payload,
        paymentModes: paymentModeAdaptor.updateOne(
          {
            id: action.payload.id,
            changes: {
              selectedCount: action.payload.count
            }
          },
          state.paymentModes
        )
      };

    case PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_BY_CONFIG_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        paymentConfiguration: action.payload
      };
    case PaymentConfigurationActionTypes.SAVE_PAYMENT_CONFIGURATION:
      return {
        ...state,
        hasSaved: false,
        isLoading: true
      };
    case PaymentConfigurationActionTypes.SAVE_PAYMENT_CONFIGURATION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: true,
        configId: action.payload
      };

    case PaymentConfigurationActionTypes.SAVE_PAYMENT_CONFIGURATION_FAILURE:
      return {
        ...state,
        isLoading: null,
        hasSaved: null,
        error: action.payload
      };
    case PaymentConfigurationActionTypes.UPDATE_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID:
    case PaymentConfigurationActionTypes.UPADTE_PAYMENT_CONFIGURATION:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };
    case PaymentConfigurationActionTypes.UPDATE_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID_SUCCESS:
    case PaymentConfigurationActionTypes.UPADTE_PAYMENT_CONFIGURATION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true
      };
    case PaymentConfigurationActionTypes.UPDATE_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID_FAILURE:
    case PaymentConfigurationActionTypes.UPADTE_PAYMENT_CONFIGURATION_FAILURE:
      return {
        ...state,
        isLoading: null,
        hasUpdated: false,
        error: action.payload
      };
    case PaymentConfigurationActionTypes.CHECK_UNIQUE_PAYMENT_NAME_SUCCESS:
      return {
        ...state,
        paymentConfigurationlist: action.payload.paymentConfigurationList
      };
    case PaymentConfigurationActionTypes.CHECK_UNIQUE_PAYMENT_NAME_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case PaymentConfigurationActionTypes.LOAD_RESET:
      return {
        ...state,
        configId: null,

        hasSaved: null,

        hasUpdated: null,
        isLoading: null,
        paymentConfiguration: null,
        paymentModes: paymentModeAdaptor.removeAll(state.paymentModes),
        transctionTypes: [],
        tcsPaymentModes: [],
        selectedOptions: null,

        error: null,

        paymentConfigurationlist: []
      };

    default: {
      return { ...state };
    }
  }
}
