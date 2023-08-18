import { createFeatureSelector } from '@ngrx/store';
import { AirpayHostConfigurationState } from './airpay-host-configuration.state';
import {
  AirpayHostConfigurationActionTypes,
  AirpayHostConfigurationActions
} from './airpay-host-configuration.actions';
import { airpayHostConfigAdapter } from './airpay-host-configuration.entity';
export const airpayHostConfigurationKey = 'airpayHostConfiguration';

export const airpayHostConfigurationState = createFeatureSelector<
  AirpayHostConfigurationState
>(airpayHostConfigurationKey);

export const initialState: AirpayHostConfigurationState = {
  fileUploadResponse: null,
  updatedHostNameList: '',
  hostNameList: airpayHostConfigAdapter.getInitialState(),
  hasError: null,
  isLoading: false,
  totalCount: 0,
  errorLog: null
};

export function AirpayHostConfigurationReducer(
  state: AirpayHostConfigurationState = initialState,
  action: AirpayHostConfigurationActions
): AirpayHostConfigurationState {
  switch (action.type) {
    case AirpayHostConfigurationActionTypes.GET_HOSTNAME_LIST:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        updatedHostNameList: ''
      };

    case AirpayHostConfigurationActionTypes.GET_HOSTNAME_LIST_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case AirpayHostConfigurationActionTypes.GET_HOSTNAME_LIST_SUCCESS:
      console.log(action.payload, 'in reducer');
      return {
        ...state,
        hostNameList: airpayHostConfigAdapter.setAll(
          action.payload.hostList,
          state.hostNameList
        ),
        totalCount: action.payload.count,
        isLoading: false,
        hasError: null
      };

    case AirpayHostConfigurationActionTypes.RESET_RESPONSE:
      return {
        ...state,
        fileUploadResponse: null,
        hostNameList: airpayHostConfigAdapter.getInitialState(),
        totalCount: 0,
        updatedHostNameList: '',
        hasError: null,
        isLoading: false
      };

    default:
      return {
        ...state
      };
  }
}
