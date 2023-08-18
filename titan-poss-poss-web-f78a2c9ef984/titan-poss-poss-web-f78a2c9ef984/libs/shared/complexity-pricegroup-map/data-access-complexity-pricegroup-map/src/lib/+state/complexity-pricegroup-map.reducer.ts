import { createFeatureSelector } from '@ngrx/store';

import { ComplexityPricegroupState } from './complexity-pricegroup-map.state';
import {
  ComplexityPriceGroupActionTypes,
  ComplexityPriceGroupActions
} from './complexity-pricegroup-map.actions';

export const COMPLEXITY_PRICEGROUP_MAP_FEATURE_KEY = 'ComplexityPricegroup';

export const selectComplexityPriceGroupState = createFeatureSelector<
  ComplexityPricegroupState
>(COMPLEXITY_PRICEGROUP_MAP_FEATURE_KEY);

export const initialState: ComplexityPricegroupState = {
  error: null,
  complexityPricegroupListing: null,
  complexityPricegroupDetails: null,
  totalComplexityPricegroupDetails: 0,
  isLoading: false,
  savecomplexityPricegroup: null,
  editcomplexityPricegroup: null,
  complexityCode: null,
  pricegroup: null,
  isUploadSuccess: null,
};

export function ComplexityPricegroupReducer(
  state: ComplexityPricegroupState = initialState,
  action: ComplexityPriceGroupActions
): ComplexityPricegroupState {
  switch (action.type) {
    case ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_LISTING:
    case ComplexityPriceGroupActionTypes.LOAD_FILE_UPLOAD_ITEMS:
    case ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_DETAILS_BY_ID:
    case ComplexityPriceGroupActionTypes.SAVE_COMPLEXITY_PRICEGROUP_FORM_DETAILS:
    case ComplexityPriceGroupActionTypes.EDIT_COMPLEXITY_PRICEGROUP_FORM_DETAILS:
    case ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_CODE:
    case ComplexityPriceGroupActionTypes.LOAD_PRICEGROUP:
      return {
        ...state,
        isLoading: true
      };
    case ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_LISTING_SUCCESS:
      return {
        ...state,
        complexityPricegroupListing: action.payload.complexityPricegroupListing,
        totalComplexityPricegroupDetails: action.payload.totalElements,
        isLoading: false
      };

      case ComplexityPriceGroupActionTypes.LOAD_FILE_UPLOAD_ITEMS_SUCCESS:
        return {
          ...state,
        isUploadSuccess: action.payload,
        isLoading: false
        };

    case ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_LISTING_FAILURE:
    case ComplexityPriceGroupActionTypes.LOAD_FILE_UPLOAD_ITEMS_FAILURE:
    case ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_DETAILS_BY_ID_FAILURE:
    case ComplexityPriceGroupActionTypes.SAVE_COMPLEXITY_PRICEGROUP_FORM_DETAILS_FAILURE:
    case ComplexityPriceGroupActionTypes.EDIT_COMPLEXITY_PRICEGROUP_FORM_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        complexityPricegroupDetails: action.payload,
        isLoading: false
      };

    case ComplexityPriceGroupActionTypes.RESET_COMPLEXITY_PRICEGROUP_DIALOG_DATA:
      return {
        ...state,
        error: null,

        complexityPricegroupDetails: null,
        isLoading: false,
        savecomplexityPricegroup: null,
        editcomplexityPricegroup: null
      };

    case ComplexityPriceGroupActionTypes.SAVE_COMPLEXITY_PRICEGROUP_FORM_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        savecomplexityPricegroup: action.payload,
        complexityPricegroupListing: [
          ...state.complexityPricegroupListing,
          action.payload
        ]
      };

    case ComplexityPriceGroupActionTypes.EDIT_COMPLEXITY_PRICEGROUP_FORM_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        editcomplexityPricegroup: action.payload
      };

    case ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_CODE_SUCCESS:
      return {
        ...state,
        complexityCode: action.payload
      };

    case ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_CODE_FAILURE:
    case ComplexityPriceGroupActionTypes.LOAD_PRICEGROUP_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case ComplexityPriceGroupActionTypes.LOAD_PRICEGROUP_SUCCESS:
      return {
        ...state,
        pricegroup: action.payload
      };

    default:
      return state;
  }
}
