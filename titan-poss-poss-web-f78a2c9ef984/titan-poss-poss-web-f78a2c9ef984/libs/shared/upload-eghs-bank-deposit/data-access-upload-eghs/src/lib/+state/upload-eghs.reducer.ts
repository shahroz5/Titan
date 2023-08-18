import { createFeatureSelector } from '@ngrx/store';
import {
  UploadeGHSActions,
  UploadEGHSActionTypes
} from './upload-eghs.actions';
import { UploadEGHSState } from './upload-eghs.state';

const initialState: UploadEGHSState = {
  error: null,
  fileResponse: null,
  isLoading: false
};
export const UPLOAD_EGHS_FEATURE_KEY = 'uploadeGHS';
export const selectUploadeGHSState = createFeatureSelector<UploadEGHSState>(
  UPLOAD_EGHS_FEATURE_KEY
);
export function UploadeGHSReducer(
  state: UploadEGHSState = initialState,
  action: UploadeGHSActions
): UploadEGHSState {
  switch (action.type) {
    case UploadEGHSActionTypes.UPLOAD_EGHS_BANK_DEPOSIT:
      return {
        ...state,
        isLoading: true,
        fileResponse: null,
        error: null
      };
    case UploadEGHSActionTypes.UPLOAD_EGHS_BANK_DEPOSIT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        fileResponse: action.payload,
        error: null
      };
    case UploadEGHSActionTypes.UPLOAD_EGHS_BANK_DEPOSIT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case UploadEGHSActionTypes.RESET_UPLOAD_EGHS:
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
