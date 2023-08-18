import { createFeatureSelector } from '@ngrx/store';

import { DocumentsSearchState } from './documents-search.state';
import {
  DocumentsSearchActions,
  DocumentsSearchActionTypes
} from './documents-search.actions';

export const documentSearchFeatureKey = 'documentsSearch';

export const selectDocumentSearchState = createFeatureSelector<
  DocumentsSearchState
>(documentSearchFeatureKey);

export const initialState: DocumentsSearchState = {
  invoiceListResponse: null,
  hasError: null,
  isLoading: null
};

export function DocumentsSearchReducer(
  state: DocumentsSearchState = initialState,
  action: DocumentsSearchActions
): DocumentsSearchState {
  switch (action.type) {
    case DocumentsSearchActionTypes.LOAD_INVOICE_LIST:
    case DocumentsSearchActionTypes.DOCUMENT_DOWNLOAD:
      return {
        ...state,
        isLoading: true,
        hasError: null
      };

    case DocumentsSearchActionTypes.DOCUMENT_DOWNLOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasError: null
      };

    case DocumentsSearchActionTypes.LOAD_INVOICE_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        invoiceListResponse: action.payload,
        hasError: null
      };

    case DocumentsSearchActionTypes.LOAD_INVOICE_LIST_FAILURE:
    case DocumentsSearchActionTypes.DOCUMENT_DOWNLOAD_FAILURE:
      return {
        ...state,
        isLoading: false,
        invoiceListResponse: null,
        hasError: action.payload
      };

    case DocumentsSearchActionTypes.RESET_DOCUMENTS_SEARCH:
      return {
        ...state,
        invoiceListResponse: null
      };

    default:
      return state;
  }
}
