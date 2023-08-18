import { TaxMasterActions, TaxMasterActionTypes } from './tax-master.actions';
import { createFeatureSelector } from '@ngrx/store';
import { TaxMasterState } from './tax-master.state';

export const initialState: TaxMasterState = {
    taxMasterListing: null,
    taxMasterDetails: null,
    totalTaxMasterDetails: 0,
    error: null,
    saveTaxMasterResponses: null,
    editTaxMasterResponses: null,
    isLoading: null
};

export const TAX_MASTER_FEATURE_KEY = 'taxMaster';
export const selectTaxMasterState = createFeatureSelector<TaxMasterState>(
    TAX_MASTER_FEATURE_KEY
);


export function TaxMasterReducer(state: TaxMasterState = initialState, action: TaxMasterActions): TaxMasterState {
    switch (action.type) {
        case TaxMasterActionTypes.LOAD_TAX_MASTER_LISTING:
        case TaxMasterActionTypes.LOAD_TAX_MASTER_DETAILS_BY_TAXCODE:
        case TaxMasterActionTypes.SAVE_TAX_MASTER_FORM_DETAILS:
        case TaxMasterActionTypes.EDIT_TAX_MASTER_FORM_DETAILS:
        case TaxMasterActionTypes.SEARCH_TAX_MASTER_DETAILS:
            return {
                ...state,
                isLoading: true
            };

        case TaxMasterActionTypes.LOAD_TAX_MASTER_LISTING_SUCCESS:
            return {
                ...state,
                taxMasterListing: action.payload.taxMasterListing,
                totalTaxMasterDetails: action.payload.totalElements,
                isLoading: false
            };

        case TaxMasterActionTypes.LOAD_TAX_MASTER_LISTING_FAILURE:
        case TaxMasterActionTypes.LOAD_TAX_MASTER_DETAILS_BY_TAXCODE_FAILURE:
        case TaxMasterActionTypes.SAVE_TAX_MASTER_FORM_DETAILS_FAILURE:
        case TaxMasterActionTypes.EDIT_TAX_MASTER_FORM_DETAILS_FAILURE:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };


        case TaxMasterActionTypes.LOAD_TAX_MASTER_DETAILS_BY_TAXCODE_SUCCESS:
            return {
                ...state,
                taxMasterDetails: action.payload,
                isLoading: false
            };

        case TaxMasterActionTypes.SAVE_TAX_MASTER_FORM_DETAILS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                saveTaxMasterResponses: action.payload,
                taxMasterListing: [...state.taxMasterListing, action.payload]
            };

        case TaxMasterActionTypes.EDIT_TAX_MASTER_FORM_DETAILS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                editTaxMasterResponses: action.payload
            };

        case TaxMasterActionTypes.SEARCH_TAX_MASTER_DETAILS_SUCCESS:
            return {
                ...state,
                taxMasterListing: action.payload,
                isLoading: false,
                totalTaxMasterDetails: 0
            };

        case TaxMasterActionTypes.SEARCH_TAX_MASTER_DETAILS_FAILURE:
            return {
                ...state,
                error: action.payload,
                taxMasterListing: null,
                isLoading: false,
                totalTaxMasterDetails: 0
            };

        case TaxMasterActionTypes.RESET_TAX_MASTER_DIALOG_DATA:
            return {
                ...state,
                editTaxMasterResponses: null,
                saveTaxMasterResponses: null,
                error: null,
                isLoading: false,
                taxMasterListing: null,
                taxMasterDetails: null,
                totalTaxMasterDetails: 0
            };
        default:
            return state;
    }
}
