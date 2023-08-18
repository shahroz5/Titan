import { createFeatureSelector } from '@ngrx/store';

import {
  RazorpayVendorConfigurationActions,
  RazorpayVendorMappingActionTypes
} from './razorpay-vendor-mapping.actions';
import { razorpayVendorMappingAdapter } from './razorpay-vendor-mapping.entity';
import { RazorpayVendorConfigurationState } from './razorpay-vendor-mapping.state';
export const razorpayVendorConfigurationKey = 'razorpayConfiguration';

export const razorpayVendorConfigurationState = createFeatureSelector<
  RazorpayVendorConfigurationState
>(razorpayVendorConfigurationKey);

/**
 * Initial state of the store
 */
export const initialState: RazorpayVendorConfigurationState = {
  fileUploadResponse: null,
  updatedVendorList: '',
  vendorList: razorpayVendorMappingAdapter.getInitialState(),
  hasError: null,
  isLoading: false,
  totalCount: 0,
  errorLog: null
};

/**
 * The reducer function which manipulates the store for respective Action
 */
export function razorpayVendorConfigurationReducer(
  state: RazorpayVendorConfigurationState = initialState,
  action: RazorpayVendorConfigurationActions
): RazorpayVendorConfigurationState {
  switch (action.type) {
    case RazorpayVendorMappingActionTypes.FILE_UPLOAD:

    case RazorpayVendorMappingActionTypes.ERROR_LOG_DOWNLOAD:
    case RazorpayVendorMappingActionTypes.GET_VENDOR_LIST:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        updatedVendorList: ''
      };

    case RazorpayVendorMappingActionTypes.FILE_UPLOAD_FAILURE:

    case RazorpayVendorMappingActionTypes.ERROR_LOG_DOWNLOAD_FAILURE:
    case RazorpayVendorMappingActionTypes.GET_VENDOR_LIST_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case RazorpayVendorMappingActionTypes.FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        fileUploadResponse: action.payload,
        hasError: null
      };
    case RazorpayVendorMappingActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS:
      return {
        ...state,
        errorLog: action.payload,
        isLoading: false,
        hasError: null
      };

    case RazorpayVendorMappingActionTypes.GET_VENDOR_LIST_SUCCESS:
      return {
        ...state,
        vendorList: razorpayVendorMappingAdapter.setAll(
          action.payload.vendorList,
          state.vendorList
        ),
        totalCount: action.payload.count,

        isLoading: false,
        hasError: null
      };

    case RazorpayVendorMappingActionTypes.RESET_RESPONSE:
      return {
        ...state,
        fileUploadResponse: null,
        updatedVendorList: '',
        vendorList: razorpayVendorMappingAdapter.getInitialState(),
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
