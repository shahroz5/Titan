import { TaxClassActions, TaxClassActionTypes } from './tax-class.actions';
import { createFeatureSelector } from '@ngrx/store';
import { TaxClassState } from './tax-class.state';

export const initialState: TaxClassState = {
    taxClassListing: null,
    taxClassDetails: null,
    totalTaxClassDetails: 0,
    error: null,
    saveTaxClassResponses: null,
    editTaxClassResponses: null,
    isLoading: null
};

export const TAX_CLASS_FEATURE_KEY = 'taxClass';
export const selectTaxClassState = createFeatureSelector<TaxClassState>(
    TAX_CLASS_FEATURE_KEY
);


export function TaxClassReducer(state: TaxClassState = initialState, action: TaxClassActions): TaxClassState {
    switch (action.type) {
        case TaxClassActionTypes.LOAD_TAX_CLASS_LISTING:
        case TaxClassActionTypes.LOAD_TAX_CLASS_DETAILS_BY_TAXCLASSCODE:
        case TaxClassActionTypes.SAVE_TAX_CLASS_FORM_DETAILS:
        case TaxClassActionTypes.EDIT_TAX_CLASS_FORM_DETAILS:
        case TaxClassActionTypes.SEARCH_TAX_CLASS_DETAILS:
            return {
                ...state,
                isLoading: true
            };

        case TaxClassActionTypes.LOAD_TAX_CLASS_LISTING_SUCCESS:
            return {
                ...state,
                taxClassListing: action.payload.taxClassListing,
                totalTaxClassDetails: action.payload.totalElements,
                isLoading: false
            };

        case TaxClassActionTypes.LOAD_TAX_CLASS_LISTING_FAILURE:
        case TaxClassActionTypes.LOAD_TAX_CLASS_DETAILS_BY_TAXCLASSCODE_FAILURE:
        case TaxClassActionTypes.SAVE_TAX_CLASS_FORM_DETAILS_FAILURE:
        case TaxClassActionTypes.EDIT_TAX_CLASS_FORM_DETAILS_FAILURE:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };


        case TaxClassActionTypes.LOAD_TAX_CLASS_DETAILS_BY_TAXCLASSCODE_SUCCESS:
            return {
                ...state,
                taxClassDetails: action.payload,
                isLoading: false
            };

        case TaxClassActionTypes.SAVE_TAX_CLASS_FORM_DETAILS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                saveTaxClassResponses: action.payload,
                taxClassListing: [...state.taxClassListing, action.payload]
            };

        case TaxClassActionTypes.EDIT_TAX_CLASS_FORM_DETAILS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                editTaxClassResponses: action.payload
            };

        case TaxClassActionTypes.SEARCH_TAX_CLASS_DETAILS_SUCCESS:
            return {
                ...state,
                taxClassListing: action.payload,
                isLoading: false,
                totalTaxClassDetails: 0
            };

        case TaxClassActionTypes.SEARCH_TAX_CLASS_DETAILS_FAILURE:
            return {
                ...state,
                error: action.payload,
                taxClassListing: null,
                isLoading: false,
                totalTaxClassDetails: 0
            };

        case TaxClassActionTypes.RESET_TAX_CLASS_DIALOG_DATA:
            return {
                ...state,
                editTaxClassResponses: null,
                saveTaxClassResponses: null,
                error: null,
                isLoading: false,
                taxClassListing: null,
                taxClassDetails: null,
                totalTaxClassDetails: 0
            };
        default:
            return state;
    }
}
