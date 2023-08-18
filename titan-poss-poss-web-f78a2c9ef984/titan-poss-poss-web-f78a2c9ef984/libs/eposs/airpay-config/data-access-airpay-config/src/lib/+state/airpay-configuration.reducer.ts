import { createFeatureSelector } from '@ngrx/store';
import { AirpayConfigurationState } from './airpay-configuration.state';
import {
  AirpayConfigurationActionTypes,
  AirpayConfigurationActions
} from './airpay-configuration.actions';
export const airpayConfigurationKey = 'airpayHostConfiguration';

export const airpayConfigurationState = createFeatureSelector<
  AirpayConfigurationState
>(airpayConfigurationKey);

export const initialState: AirpayConfigurationState = {
  fileUploadResponse: null,
  vendorList: null,
  hasError: null,
  isLoading: false,
  totalCount: 0,
  errorLog: null
};

export function AirpayConfigurationReducer(
  state: AirpayConfigurationState = initialState,
  action: AirpayConfigurationActions
): AirpayConfigurationState {
  switch (action.type) {
    case AirpayConfigurationActionTypes.GET_AIRPAY_VENDOR_LIST:
      return {
        ...state,
        isLoading: true,
        hasError: null
      };

    case AirpayConfigurationActionTypes.GET_AIRPAY_VENDOR_LIST_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case AirpayConfigurationActionTypes.GET_AIRPAY_VENDOR_LIST_SUCCESS:
      return {
        ...state,
        vendorList: action.payload.vendorList,
        totalCount: action.payload.count,
        isLoading: false,
        hasError: null
      };

    case AirpayConfigurationActionTypes.RESET_RESPONSE:
      return {
        ...state,
        fileUploadResponse: null,
        hasError: null,
        isLoading: false
      };

    default:
      return {
        ...state
      };
  }
}
