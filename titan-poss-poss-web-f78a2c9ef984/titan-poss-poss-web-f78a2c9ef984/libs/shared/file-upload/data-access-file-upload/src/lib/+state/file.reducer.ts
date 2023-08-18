import { createFeatureSelector } from '@ngrx/store';

import { FileState } from './file.state';
import { FileActions, FileActionTypes } from './file.actions';
export const FILE_FEATURE_KEY = 'File';
export const selectFileState = createFeatureSelector<FileState>(
  FILE_FEATURE_KEY
);

export const initialState: FileState = {
  error: null,
  fileStatusList: [],
  totalFileStatus: 0,
  isLoading: false,
  fileUploadResponse: undefined,
  imageResponse: null,
  docsList: null,
  isDeleted: false,
  documentUrl: null,
  fileIds: [],
  clearFileList: false,
  resetFileType: false
};
export function FileReducer(
  state: FileState = initialState,
  action: FileActions
): FileState {
  switch (action.type) {
    case FileActionTypes.LOAD_FILE_STATUS_LIST:
    case FileActionTypes.FILE_UPLOAD:
    case FileActionTypes.DOCUMENT_UPLOAD:
    case FileActionTypes.LOAD_DOCS_LIST:
    case FileActionTypes.DELETE_DOCUMENT:
    case FileActionTypes.LOAD_DOCUMENT_URL_BY_ID:
      return {
        ...state,
        isLoading: true,
        imageResponse: null,
        isDeleted: false,
        error: null
      };
    case FileActionTypes.LOAD_FILE_STATUS_LIST_SUCCESS:
      return {
        ...state,
        fileStatusList: action.payload.fileStatusList,
        totalFileStatus: action.payload.totalElements,
        isLoading: false
      };
    case FileActionTypes.FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        fileUploadResponse: action.payload,
        error: null
      };
    case FileActionTypes.DOCUMENT_UPLOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        imageResponse: action.payload,
        error: null
      };
    case FileActionTypes.LOAD_DOCS_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        docsList: action.payload,
        error: null
      };
    case FileActionTypes.LOAD_DOCUMENT_URL_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        documentUrl: action.payload,
        error: null
      };
    case FileActionTypes.DELETE_DOCUMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isDeleted: true,
        error: null
      };
    case FileActionTypes.GET_UPLOADED_FILE_IDS:
      return {
        ...state,
        fileIds: action.payload
      };
    case FileActionTypes.LOAD_FILE_STATUS_LIST_FAILURE:
    case FileActionTypes.FILE_UPLOAD_FAILURE:
    case FileActionTypes.ERROR_LOG_DOWNLOAD_FAILURE:
    case FileActionTypes.PDF_File_DOWNLOAD_FAILURE:
    case FileActionTypes.DOCUMENT_UPLOAD_FAILURE:
    case FileActionTypes.LOAD_DOCS_LIST_FAILURE:
    case FileActionTypes.DELETE_DOCUMENT_FAILURE:
    case FileActionTypes.LOAD_DOCUMENT_URL_BY_ID_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case FileActionTypes.RESET_File_TYPE:
      return {
        ...state,
        resetFileType: action.payload,
        isLoading: false
      };
    case FileActionTypes.RESET_RESPONSE:
      return {
        ...state,
        fileUploadResponse: undefined,
        imageResponse: null,
        error: null,
        isLoading: false,
        fileIds: [],
        docsList: null,
        isDeleted: false,
        documentUrl: null,
        clearFileList: false,
        resetFileType: false
      };
    case FileActionTypes.CLEAR_FILE_LSIT:
      return {
        ...state,
        clearFileList: action.payload,
        isLoading: false
      };
    default:
      return state;
  }
}
