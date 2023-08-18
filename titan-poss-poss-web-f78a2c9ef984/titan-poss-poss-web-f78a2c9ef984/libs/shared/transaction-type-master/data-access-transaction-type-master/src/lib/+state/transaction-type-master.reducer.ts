import { createFeatureSelector } from '@ngrx/store';
import { TransactionTypeMasterState } from './transaction-type-master.state';
import { TransactionTypeMasterActions, TransactionTypeMasterActionTypes } from './transaction-type-master.actions';

export const initialState: TransactionTypeMasterState = {
    transactionTypeMasterListing: null,
    transactionTypeMasterDetails: null,
    totalTransactionTypeMasterDetails: 0,
    error: null,
    saveResponses: null,
    editResponses: null,
    isLoading: null
};

export const TRANSACTION_TYPE_MASTER_FEATURE_KEY = 'transactionTypeMaster';
export const selectTransactionTypeMasterState = createFeatureSelector<TransactionTypeMasterState>(
    TRANSACTION_TYPE_MASTER_FEATURE_KEY
);


export function TransactionTypeMasterReducer(state: TransactionTypeMasterState = initialState, action: TransactionTypeMasterActions): TransactionTypeMasterState {
    switch (action.type) {
        case TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_DETAILS_BY_CODE:
        case TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_LISTING:
        case TransactionTypeMasterActionTypes.SAVE_TRANSACTION_TYPE_MASTER_FORM_DETAILS:
        case TransactionTypeMasterActionTypes.EDIT_TRANSACTION_TYPE_MASTER_FORM_DETAILS:
        case TransactionTypeMasterActionTypes.SEARCH_TRANSACTION_TYPE_MASTER_DETAILS:
            return {
                ...state,
                isLoading: true
            };

        case TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_LISTING_SUCCESS:
            return {
                ...state,
                transactionTypeMasterListing: action.payload.transactionTypeMasterListing,
                totalTransactionTypeMasterDetails: action.payload.totalElements,
                isLoading: false
            };

        case TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_LISTING_FAILURE:
        case TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_DETAILS_BY_CODE_FAILURE:
        case TransactionTypeMasterActionTypes.SAVE_TRANSACTION_TYPE_MASTER_FORM_DETAILS_FAILURE:
        case TransactionTypeMasterActionTypes.EDIT_TRANSACTION_TYPE_MASTER_FORM_DETAILS_FAILURE:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };


        case TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_DETAILS_BY_CODE_SUCCESS:
            return {
                ...state,
                transactionTypeMasterDetails: action.payload,
                isLoading: false
            };

        case TransactionTypeMasterActionTypes.SAVE_TRANSACTION_TYPE_MASTER_FORM_DETAILS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                saveResponses: action.payload,
                transactionTypeMasterListing: [...state.transactionTypeMasterListing, action.payload]
            };

        case TransactionTypeMasterActionTypes.EDIT_TRANSACTION_TYPE_MASTER_FORM_DETAILS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                editResponses: action.payload
            };

        case TransactionTypeMasterActionTypes.SEARCH_TRANSACTION_TYPE_MASTER_DETAILS_SUCCESS:
            return {
                ...state,
                transactionTypeMasterListing: action.payload.transactionTypeMasterListing,
                isLoading: false,
                totalTransactionTypeMasterDetails: 0
            };

        case TransactionTypeMasterActionTypes.SEARCH_TRANSACTION_TYPE_MASTER_DETAILS_FAILURE:
            return {
                ...state,
                error: action.payload,
                transactionTypeMasterListing: null,
                isLoading: false,
                totalTransactionTypeMasterDetails: 0
            };

        case TransactionTypeMasterActionTypes.RESET_TRANSACTION_TYPE_MASTER_DATA:
            return {
                ...state,
                editResponses: null,
                saveResponses: null,
                error: null,
                isLoading: false,
                transactionTypeMasterDetails: null,
                transactionTypeMasterListing: null,
                totalTransactionTypeMasterDetails: 0
            };
        default:
            return state;
    }
}
