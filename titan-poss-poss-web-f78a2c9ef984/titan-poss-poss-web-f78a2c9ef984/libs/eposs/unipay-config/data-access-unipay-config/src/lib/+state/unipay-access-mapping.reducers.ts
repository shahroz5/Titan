import { createFeatureSelector } from '@ngrx/store';

import { UnipayConfigurationState } from './unipay-access-mapping.state';
import {
  UnipayConfigurationActionTypes,
  UnipayConfigurationActions
} from './unipay-access-mapping.actions';
import { unipayAccessMappingAdapter } from './unipay-access-mapping.entity';
export const unipayConfigurationKey = 'unipayConfiguration';

export const unipayConfigurationState = createFeatureSelector<
  UnipayConfigurationState
>(unipayConfigurationKey);

/**
 * Initial state of the store
 */
export const initialState: UnipayConfigurationState = {
  fileUploadResponse: null,
  updatedAccessList: '',
  accessList: unipayAccessMappingAdapter.getInitialState(),
  hasError: null,
  isLoading: false,
  totalCount: 0,
  errorLog: null
};

/**
 * The reducer function which manipulates the store for respective Action
 */
export function unipayConfigurationReducer(
  state: UnipayConfigurationState = initialState,
  action: UnipayConfigurationActions
): UnipayConfigurationState {
  switch (action.type) {
    case UnipayConfigurationActionTypes.FILE_UPLOAD:

    case UnipayConfigurationActionTypes.ERROR_LOG_DOWNLOAD:
    case UnipayConfigurationActionTypes.GET_ACCESS_LIST:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        updatedAccessList: ''
      };

    case UnipayConfigurationActionTypes.FILE_UPLOAD_FAILURE:

    case UnipayConfigurationActionTypes.ERROR_LOG_DOWNLOAD_FAILURE:
    case UnipayConfigurationActionTypes.GET_ACCESS_LIST_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case UnipayConfigurationActionTypes.FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        fileUploadResponse: action.payload,
        hasError: null
      };
    case UnipayConfigurationActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS:
      return {
        ...state,
        errorLog: action.payload,
        isLoading: false,
        hasError: null
      };

    case UnipayConfigurationActionTypes.GET_ACCESS_LIST_SUCCESS:
      return {
        ...state,
        accessList: unipayAccessMappingAdapter.setAll(
          action.payload.accessList,
          state.accessList
        ),

        totalCount: action.payload.count,

        isLoading: false,
        hasError: null
      };

    case UnipayConfigurationActionTypes.RESET_RESPONSE:
      return {
        ...state,
        fileUploadResponse: null,
        updatedAccessList: '',
        accessList: unipayAccessMappingAdapter.getInitialState(),
        hasError: null,
        isLoading: false,
        totalCount: 0
      };

    default:
      return {
        ...state
      };
  }
}
