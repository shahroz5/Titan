import { createFeatureSelector } from '@ngrx/store';
import {
  UploadServicePossActions,
  UploadServicePossActionTypes
} from './upload-service-poss.actions';
import { UploadServicePossState } from './upload-service-poss.state';

const initialState: UploadServicePossState = {
  error: null,
  fileResponse: null,
  isLoading: false
};
export const UPLOAD_SERVICE_POSS_FEATURE_KEY = 'uploadServicePoss';
export const selectUploadServicePossState = createFeatureSelector<UploadServicePossState>(
  UPLOAD_SERVICE_POSS_FEATURE_KEY
);
export function UploadServicePossReducer(
  state: UploadServicePossState = initialState,
  action: UploadServicePossActions
): UploadServicePossState {
  switch (action.type) {
    case UploadServicePossActionTypes.UPLOAD_SERVICE_POSS_BANK_DEPOSIT:
      return {
        ...state,
        isLoading: true,
        fileResponse: null,
        error: null
      };
    case UploadServicePossActionTypes.UPLOAD_SERVICE_POSS_BANK_DEPOSIT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        fileResponse: action.payload,
        error: null
      };
    case UploadServicePossActionTypes.UPLOAD_SERVICE_POSS_BANK_DEPOSIT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case UploadServicePossActionTypes.RESET_UPLOAD_SERVICE_POSS:
      return {
        ...state,
        isLoading: false,
        error: null,
        fileResponse: null
      };
    default:
      return {
        ...state
      };
  }
}