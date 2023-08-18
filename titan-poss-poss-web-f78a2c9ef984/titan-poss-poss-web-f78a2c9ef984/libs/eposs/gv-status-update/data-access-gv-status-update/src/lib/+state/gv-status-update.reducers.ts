import { createFeatureSelector } from '@ngrx/store';

import { GVStatusUpdateState } from './gv-status-update.state';
import {
  GVStatusUpdateActionTypes,
  GVStatusActions
} from './gv-status-update.actions';
import { gvStatusUpdateAdapter } from './gv-status-update.entity';
import { Update } from '@ngrx/entity';
export const gvStatusUpdateKey = 'gvStatusUpdate';

export const gvStatusUpdateState = createFeatureSelector<GVStatusUpdateState>(
  gvStatusUpdateKey
);

/**
 * Initial state of the store
 */
export const initialState: GVStatusUpdateState = {
  fileUploadResponse: null,
  updatedList: null,
  newList: null,
  gvStatusUpdateList: gvStatusUpdateAdapter.getInitialState(),
  hasError: null,
  isLoading: false,
  totalCount: 0,
  errorLog: null
};

/**
 * The reducer function which manipulates the store for respective Action
 */
export function gvStatusUpdateReducer(
  state: GVStatusUpdateState = initialState,
  action: GVStatusActions
): GVStatusUpdateState {
  switch (action.type) {
    case GVStatusUpdateActionTypes.FILE_UPLOAD:

    case GVStatusUpdateActionTypes.EXTEND_GV_STATUS:
    case GVStatusUpdateActionTypes.CHANGE_GV_STATUS:
    case GVStatusUpdateActionTypes.ERROR_LOG_DOWNLOAD:
    case GVStatusUpdateActionTypes.GET_GV_STATUS_LIST:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        updatedList: null
      };

    case GVStatusUpdateActionTypes.FILE_UPLOAD_FAILURE:

    case GVStatusUpdateActionTypes.CHANGE_GV_STATUS_FAILURE:
    case GVStatusUpdateActionTypes.EXTEND_GV_STATUS_FAILURE:
    case GVStatusUpdateActionTypes.GET_GV_STATUS_LIST_FAILURE:
    case GVStatusUpdateActionTypes.ERROR_LOG_DOWNLOAD_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };
    case GVStatusUpdateActionTypes.CHANGE_GV_STATUS_SUCCESS: {
      return {
        ...state,
        newList: action.payload.gvStatusList,
        gvStatusUpdateList: gvStatusUpdateAdapter.updateMany(
          action.payload.gvStatusList.map(
            (ob): Update<any> => ({
              id: ob.serialNo,
              changes: {
                status: ob.status
              }
            })
          ),
          state.gvStatusUpdateList
        ),

        isLoading: false
      };
    }
    case GVStatusUpdateActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS:
      return {
        ...state,
        errorLog: action.payload,
        isLoading: false,
        hasError: null
      };

    case GVStatusUpdateActionTypes.EXTEND_GV_STATUS_SUCCESS: {
      return {
        ...state,
        newList: action.payload.gvStatusList,
        gvStatusUpdateList: gvStatusUpdateAdapter.updateMany(
          action.payload.gvStatusList.map(
            (ob): Update<any> => ({
              id: ob.serialNo,
              changes: {
                validTill: ob.validTill
              }
            })
          ),
          state.gvStatusUpdateList
        ),

        isLoading: false
      };
    }
    case GVStatusUpdateActionTypes.FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        fileUploadResponse: action.payload,
        hasError: null
      };



    case GVStatusUpdateActionTypes.GET_GV_STATUS_LIST_SUCCESS:
      return {
        ...state,
        gvStatusUpdateList: gvStatusUpdateAdapter.setAll(
          action.payload.gvStatusList,
          state.gvStatusUpdateList
        ),
        totalCount: action.payload.count,

        isLoading: false,
        hasError: null
      };

    case GVStatusUpdateActionTypes.RESET_RESPONSE:
      return {
        ...state,
        fileUploadResponse: null,
        updatedList: null,
        gvStatusUpdateList: gvStatusUpdateAdapter.getInitialState(),
        hasError: null,
        isLoading: false,
        errorLog:null,
        totalCount: 0,
        newList: null
      };

    default:
      return {
        ...state
      };
  }
}
