import { CashPaymentConfigurationActions, CashPaymentConfigurationActionTypes } from './cash-payment-configuration.actions';
import { createFeatureSelector } from '@ngrx/store';
import { CashPaymentConfigurationState } from './cash-payment-configuration.state';

export const initialState: CashPaymentConfigurationState = {
    cashPaymentConfigurationDetails: null,
    editCashPaymentConfigurationResponses: null,
    error: null,
    isLoading: null
};

export const CASHPAYMENTCONFIGURATION_FEATURE_KEY = 'cashPaymentConfiguration';
export const selectCashPaymentConfigurationState = createFeatureSelector<CashPaymentConfigurationState>(
    CASHPAYMENTCONFIGURATION_FEATURE_KEY
);


export function CashPaymentConfigurationReducer(state: CashPaymentConfigurationState = initialState, action: CashPaymentConfigurationActions): CashPaymentConfigurationState {
    switch (action.type) {
        case CashPaymentConfigurationActionTypes.LOAD_CASH_PAYMENT_CONFIGURATION:
            return {
                ...state,
                editCashPaymentConfigurationResponses: null,
                error: null,
                isLoading: true
            };

        case CashPaymentConfigurationActionTypes.LOAD_CASH_PAYMENT_CONFIGURATION_SUCCESS:
            return {
                ...state,
                cashPaymentConfigurationDetails: action.payload,
                isLoading: false
            };

        case CashPaymentConfigurationActionTypes.LOAD_CASH_PAYMENT_CONFIGURATION_FAILURE:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };


        case CashPaymentConfigurationActionTypes.ADDNEW_CASH_PAYMENT_CONFIGURATION:
        case CashPaymentConfigurationActionTypes.EDIT_CASH_PAYMENT_CONFIGURATION:
            return {
                ...state,
                editCashPaymentConfigurationResponses: null,
                isLoading: true
            };

        case CashPaymentConfigurationActionTypes.ADDNEW_CASH_PAYMENT_CONFIGURATION_SUCCESS:
        case CashPaymentConfigurationActionTypes.EDIT_CASH_PAYMENT_CONFIGURATION_SUCCESS:
            return {
                ...state,
                cashPaymentConfigurationDetails: action.payload,
                editCashPaymentConfigurationResponses: action.payload,
                isLoading: false
            };

        case CashPaymentConfigurationActionTypes.ADDNEW_CASH_PAYMENT_CONFIGURATION_FAILURE:
        case CashPaymentConfigurationActionTypes.EDIT_CASH_PAYMENT_CONFIGURATION_FAILURE:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };

        default:
            return state;
    }
}
