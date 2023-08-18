import { createFeatureSelector } from '@ngrx/store';

import { DataUploadState } from './data-upload.state';
import {
  DataUploadActions,
  DataUploadActionTypes
} from './data-upload.actions';

export const dataUploadFeatureKey = 'dataUpload';

export const selectDataUploadState = createFeatureSelector<DataUploadState>(
  dataUploadFeatureKey
);

/**
 * Initial state of the store
 */
export const initialState: DataUploadState = {
  FIRFileUploadResponse: null,
  MERFileUploadResponse: null,
  invoiceUploadResponse: false,
  STNUploadResponse: false,
  hasError: null,
  isLoading: false
};

/**
 * The reducer function which manipulates the store for respective Action
 */
export function dataUploadReducer(
  state: DataUploadState = initialState,
  action: DataUploadActions
): DataUploadState {
  switch (action.type) {
    case DataUploadActionTypes.FIR_FILE_UPLOAD:
    case DataUploadActionTypes.MER_FILE_UPLOAD:
    case DataUploadActionTypes.INVOICE_UPLOAD:
    case DataUploadActionTypes.STN_UPLOAD:
      return {
        ...state,
        isLoading: true,
        hasError: null
      };

    case DataUploadActionTypes.FIR_FILE_UPLOAD_FAILURE:
    case DataUploadActionTypes.MER_FILE_UPLOAD_FAILURE:
    case DataUploadActionTypes.INVOICE_UPLOAD_FAILURE:
    case DataUploadActionTypes.STN_UPLOAD_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case DataUploadActionTypes.FIR_FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        FIRFileUploadResponse: action.payload,
        isLoading: false,
        hasError: null
      };

    case DataUploadActionTypes.MER_FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        MERFileUploadResponse: action.payload,
        isLoading: false,
        hasError: null
      };

    case DataUploadActionTypes.INVOICE_UPLOAD_SUCCESS:
      return {
        ...state,
        invoiceUploadResponse: action.payload,
        isLoading: false,
        hasError: null
      };

    case DataUploadActionTypes.STN_UPLOAD_SUCCESS:
      return {
        ...state,
        STNUploadResponse: action.payload,
        isLoading: false,
        hasError: null
      };

    case DataUploadActionTypes.RESET_RESPONSE:
      return {
        ...state,
        FIRFileUploadResponse: null,
        MERFileUploadResponse: null,
        invoiceUploadResponse: false,
        STNUploadResponse: false,
        hasError: null,
        isLoading: false
      };

    default:
      return state;
  }
}
