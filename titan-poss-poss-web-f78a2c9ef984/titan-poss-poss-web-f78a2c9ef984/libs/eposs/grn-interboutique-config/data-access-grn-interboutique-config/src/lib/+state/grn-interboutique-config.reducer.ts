import { createFeatureSelector } from '@ngrx/store';
import { GrnInterboutiqueConfigState } from './grn-interboutique-config.state';
import { GrnInterboutiqueConfigActionTypes, GrnInterboutuqieConfigActions } from './grn-interboutique-config.actions';

export const initialState: GrnInterboutiqueConfigState = {
    grnInterboutiqueConfigDetails: null,
    editGrnInterboutiqueConfigResponses: null,
    error: null,
    isLoading: null
};

export const GRNINTERBOUTIQUECONGIG_FEATURE_KEY = 'grnInterboutiqueConfig';
export const selectGrnInterboutiqueConfigState = createFeatureSelector<GrnInterboutiqueConfigState>(
    GRNINTERBOUTIQUECONGIG_FEATURE_KEY
);


export function GrnInterboutiqueConfigReducer(state: GrnInterboutiqueConfigState = initialState, action: GrnInterboutuqieConfigActions): GrnInterboutiqueConfigState {
    switch (action.type) {
        case GrnInterboutiqueConfigActionTypes.LOAD_GRN_INTERBOUTIQUE_CONFIG:
            return {
                ...state,
                editGrnInterboutiqueConfigResponses: null,
                error: null,
                isLoading: true
            };

        case GrnInterboutiqueConfigActionTypes.LOAD_GRN_INTERBOUTIQUE_CONFIG_SUCCESS:
            return {
                ...state,
                grnInterboutiqueConfigDetails: action.payload,
                isLoading: false
            };

        case GrnInterboutiqueConfigActionTypes.LOAD_GRN_INTERBOUTIQUE_CONFIG_FAILURE:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };


        case GrnInterboutiqueConfigActionTypes.ADDNEW_GRN_INTERBOUTIQUE_CONFIG:
        case GrnInterboutiqueConfigActionTypes.EDIT_GRN_INTERBOUTIQUE_CONFIG:
            return {
                ...state,
                editGrnInterboutiqueConfigResponses: null,
                isLoading: true
            };

        case GrnInterboutiqueConfigActionTypes.ADDNEW_GRN_INTERBOUTIQUE_CONFIG_SUCCESS:
        case GrnInterboutiqueConfigActionTypes.EDIT_GRN_INTERBOUTIQUE_CONFIG_SUCCESS:
            return {
                ...state,
                grnInterboutiqueConfigDetails: action.payload,
                editGrnInterboutiqueConfigResponses: action.payload,
                isLoading: false
            };

        case GrnInterboutiqueConfigActionTypes.ADDNEW_GRN_INTERBOUTIQUE_CONFIG_FAILURE:
        case GrnInterboutiqueConfigActionTypes.EDIT_GRN_INTERBOUTIQUE_CONFIG_FAILURE:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };

        default:
            return state;
    }
}
