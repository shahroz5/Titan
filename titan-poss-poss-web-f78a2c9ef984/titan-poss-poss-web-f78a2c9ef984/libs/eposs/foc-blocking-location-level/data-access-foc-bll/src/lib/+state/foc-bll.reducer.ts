import { createFeatureSelector } from '@ngrx/store';
import { FOCBLLActions, FOCBLLActionTypes } from './foc-bll.actions';
import { FOCBLLState } from './foc-bll.state';

export const initialState: FOCBLLState = {
  error: null,
  isLoading: false,
  hasSaved: false,
  schemeId: null,
  focBlockingDetails: null,
  totalElements: 0,
  selectedLocations: null
};
export const FOC_BLL_FEATURE_KEY = 'FOCBLL';
export const selectFOCBLLState = createFeatureSelector<FOCBLLState>(
  FOC_BLL_FEATURE_KEY
);
export function FOCBLLReducer(
  state: FOCBLLState = initialState,
  action: FOCBLLActions
): FOCBLLState {
  switch (action.type) {
    case FOCBLLActionTypes.SAVE_FOC_BLL_DETAILS: {
      return {
        ...state,
        isLoading: true,
        hasSaved: false,
        error: null
      };
    }
    case FOCBLLActionTypes.SAVE_FOC_BLL_DETAILS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        hasSaved: true,
        error: null
      };
    }
    case FOCBLLActionTypes.SAVE_FOC_BLL_DETAILS_FAILURE: {
      return {
        ...state,
        isLoading: false,
        hasSaved: false,
        error: action.payload
      };
    }
    case FOCBLLActionTypes.SEARCH_LOCATION: {
      return {
        ...state,
        isLoading: true
      };
    }
    case FOCBLLActionTypes.SEARCH_LOCATION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        focBlockingDetails: action.payload
      };
    }
    case FOCBLLActionTypes.SEARCH_LOCATION_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    }
    case FOCBLLActionTypes.LOAD_FOC_BLL_DETAILS:
    case FOCBLLActionTypes.LOAD_FOC_SCHEMES:
    case FOCBLLActionTypes.LOAD_SELECTED_LOCATIONS: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case FOCBLLActionTypes.LOAD_FOC_BLL_DETAILS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        focBlockingDetails: action.payload.response,
        totalElements: action.payload.totalElements
      };
    }
    case FOCBLLActionTypes.LOAD_FOC_SCHEMES_SUCCEESS: {
      return {
        ...state,
        isLoading: false,
        schemeId: action.payload
      };
    }
    case FOCBLLActionTypes.LOAD_FOC_BLL_DETAILS_FAILURE:
    case FOCBLLActionTypes.LOAD_FOC_SCHEMES_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    }
    case FOCBLLActionTypes.RESET_FOC_BLL_DETAILS: {
      return {
        ...state,
        error: null,
        hasSaved: false,
        isLoading: false,
        focBlockingDetails: null,
        totalElements: 0,
        selectedLocations: null
      };
    }
    case FOCBLLActionTypes.LOAD_SELECTED_LOCATIONS_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    }
    case FOCBLLActionTypes.LOAD_SELECTED_LOCATIONS_SUCCESS: {
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
