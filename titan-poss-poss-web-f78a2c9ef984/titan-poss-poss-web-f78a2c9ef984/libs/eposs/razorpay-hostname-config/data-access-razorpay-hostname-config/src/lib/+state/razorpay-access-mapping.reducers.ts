import { createFeatureSelector } from '@ngrx/store';

import { RazorpayConfigurationState } from './razorpay-access-mapping.state';
import {
  RazorpayConfigurationActionTypes,
  RazorpayConfigurationActions
} from './razorpay-access-mapping.actions';
import { razorpayAccessMappingAdapter } from './razorpay-access-mapping.entity';
export const razorpayConfigurationKey = 'razorpayConfiguration';

export const razorpayConfigurationState = createFeatureSelector<
  RazorpayConfigurationState
>(razorpayConfigurationKey);

/**
 * Initial state of the store
 */
export const initialState: RazorpayConfigurationState = {
  fileUploadResponse: null,
  updatedAccessList: '',
  accessList: razorpayAccessMappingAdapter.getInitialState(),
  hasError: null,
  isLoading: false,
  totalCount: 0,
  errorLog: null
};

/**
 * The reducer function which manipulates the store for respective Action
 */
export function razorpayConfigurationReducer(
  state: RazorpayConfigurationState = initialState,
  action: RazorpayConfigurationActions
): RazorpayConfigurationState {
  switch (action.type) {
    case RazorpayConfigurationActionTypes.FILE_UPLOAD:

    case RazorpayConfigurationActionTypes.ERROR_LOG_DOWNLOAD:
    case RazorpayConfigurationActionTypes.GET_ACCESS_LIST:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        updatedAccessList: ''
      };

    case RazorpayConfigurationActionTypes.FILE_UPLOAD_FAILURE:

    case RazorpayConfigurationActionTypes.ERROR_LOG_DOWNLOAD_FAILURE:
    case RazorpayConfigurationActionTypes.GET_ACCESS_LIST_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case RazorpayConfigurationActionTypes.FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        fileUploadResponse: action.payload,
        hasError: null
      };
    case RazorpayConfigurationActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS:
      return {
        ...state,
        errorLog: action.payload,
        isLoading: false,
        hasError: null
      };

    case RazorpayConfigurationActionTypes.GET_ACCESS_LIST_SUCCESS:
      return {
        ...state,
        accessList: razorpayAccessMappingAdapter.setAll(
          action.payload.accessList,
          state.accessList
        ),
        totalCount: action.payload.count,

        isLoading: false,
        hasError: null
      };

    case RazorpayConfigurationActionTypes.RESET_RESPONSE:
      return {
        ...state,
        fileUploadResponse: null,
        updatedAccessList: '',
        accessList: razorpayAccessMappingAdapter.getInitialState(),
        errorLog: null,
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
