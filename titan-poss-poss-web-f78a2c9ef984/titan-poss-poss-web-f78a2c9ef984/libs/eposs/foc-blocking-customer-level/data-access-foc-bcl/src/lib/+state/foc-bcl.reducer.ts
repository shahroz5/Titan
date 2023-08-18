import { createFeatureSelector } from '@ngrx/store';
import { FOCBCLState } from './foc-bcl.state';
import { FOCBCLActions, FOCBCLActionTypes } from './foc-bcl.actions';

const initialState: FOCBCLState = {
  error: null,
  isLoading: false,
  hasSaved: false,
  schemeId: null,
  focBlockingCustomerLevel: null,
  totalElements: 0,
  selectedLocations: null
};
export const FOC_BCL_FEATURE_KEY = 'FOCBCL';
export const selectFOCBCLState = createFeatureSelector<FOCBCLState>(
  FOC_BCL_FEATURE_KEY
);
export function FOCBCLReducer(
  state: FOCBCLState = initialState,
  action: FOCBCLActions
): FOCBCLState {
  switch (action.type) {
    case FOCBCLActionTypes.LOAD_FOC_SCHEMES:
    case FOCBCLActionTypes.LOAD_FOC_BCL_DETAILS:
    case FOCBCLActionTypes.LOAD_SELECTED_LOCATIONS: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case FOCBCLActionTypes.SAVE_FOC_BCL_DETAILS: {
      return {
        ...state,
        isLoading: true,
        error: null,
        hasSaved: false
      };
    }
    case FOCBCLActionTypes.LOAD_FOC_BCL_DETAILS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        focBlockingCustomerLevel: action.payload.response,
        totalElements: action.payload.totalElements
      };
    }
    case FOCBCLActionTypes.SAVE_FOC_BCL_DETAILS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        hasSaved: true
      };
    }

    case FOCBCLActionTypes.LOAD_FOC_SCHEMES_SUCCEESS: {
      return {
        ...state,
        isLoading: false,
        schemeId: action.payload,
        error: null
      };
    }
    case FOCBCLActionTypes.LOAD_FOC_SCHEMES_FAILURE:
    case FOCBCLActionTypes.LOAD_FOC_BCL_DETAILS_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    }
    case FOCBCLActionTypes.SAVE_FOC_BCL_DETAILS_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        hasSaved: false
      };
    }

    case FOCBCLActionTypes.SEARCH_LOCATION: {
      return {
        ...state,
        isLoading: true
      };
    }
    case FOCBCLActionTypes.SEARCH_LOCATION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        focBlockingCustomerLevel: action.payload
      };
    }
    case FOCBCLActionTypes.SEARCH_LOCATION_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    }
    case FOCBCLActionTypes.RESET_FOC_BCL_DETAILS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        schemeId: null,
        focBlockingCustomerLevel: null,
        totalElements: 0,
        hasSaved: false,
        selectedLocations: null
      };
    }
    case FOCBCLActionTypes.LOAD_SELECTED_LOCATIONS_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    }
    case FOCBCLActionTypes.LOAD_SELECTED_LOCATIONS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        selectedLocations: action.payload
      };
    }
    default: {
      return {
        ...state
      };
    }
  }
}
