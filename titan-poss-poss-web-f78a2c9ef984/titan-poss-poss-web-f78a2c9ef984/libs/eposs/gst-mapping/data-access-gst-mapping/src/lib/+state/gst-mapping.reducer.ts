import { GSTMappingState } from './gst-mapping.state';
import { createFeatureSelector } from '@ngrx/store';
import { GSTMappingActions, GSTMappingActionTypes } from './gst-mapping.action';

export const initialState: GSTMappingState = {
  error: null,
  isLoading: false,
  gstMappingList: null,
  totalElements: 0,
  txnTypes: [],
  taxes: [],
  reloadStatus: {
    reload: false,
    type: null
  }
};
export const GST_MAPPING_FEATURE_KEY = 'GSTMapping';
export const selectGSTMappingState = createFeatureSelector<GSTMappingState>(
  GST_MAPPING_FEATURE_KEY
);
export function GSTMappingReducer(
  state: GSTMappingState = initialState,
  action: GSTMappingActions
): GSTMappingState {
  switch (action.type) {
    case GSTMappingActionTypes.LOAD_GST_MAPPING_LIST:
    case GSTMappingActionTypes.LOAD_TRANSACTION_TYPES:
    case GSTMappingActionTypes.LOAD_TAXES:
    case GSTMappingActionTypes.ADD_GST_MAPPING:
    case GSTMappingActionTypes.EDIT_GST_MAPPING:
      return {
        ...state,
        isLoading: true
      };

    case GSTMappingActionTypes.LOAD_GST_MAPPING_LIST_FAILURE:
    case GSTMappingActionTypes.LOAD_TRANSACTION_TYPES_FAILURE:
    case GSTMappingActionTypes.LOAD_TAXES_FAILURE:
    case GSTMappingActionTypes.ADD_GST_MAPPING_FAILURE:
    case GSTMappingActionTypes.EDIT_GST_MAPPING_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case GSTMappingActionTypes.LOAD_GST_MAPPING_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        gstMappingList: action.payload.gstMappingList,
        totalElements: action.payload.totalElements
      };

    case GSTMappingActionTypes.LOAD_TRANSACTION_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        txnTypes: action.payload
      };

    case GSTMappingActionTypes.LOAD_TAXES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        taxes: action.payload
      };
    case GSTMappingActionTypes.ADD_GST_MAPPING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        reloadStatus: {
          reload: true,
          type: 'NEW'
        }
      };
    case GSTMappingActionTypes.EDIT_GST_MAPPING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        reloadStatus: {
          reload: true,
          type: 'EDIT'
        }
      };

    case GSTMappingActionTypes.RESET_DATA:
      return {
        ...state,
        error: null,
        isLoading: false,
        gstMappingList: null,
        totalElements: 0,

        txnTypes: [],
        taxes: [],
        reloadStatus: {
          reload: false,
          type: null
        },
      };

    default: {
      return { ...state };
    }
  }
}
