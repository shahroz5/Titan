import { createSelector } from '@ngrx/store';

import { selectDataUploadState } from './data-upload.reducers';

/**
 * The selectors for Data-Upload store
 */
const selectFIRFileUploadResponse = createSelector(
  selectDataUploadState,
  state => state.FIRFileUploadResponse
);

const selectMERFileUploadResponse = createSelector(
  selectDataUploadState,
  state => state.MERFileUploadResponse
);

const selectInvoiceUploadResponse = createSelector(
  selectDataUploadState,
  state => state.invoiceUploadResponse
);

const selectSTNUploadResponse = createSelector(
  selectDataUploadState,
  state => state.STNUploadResponse
);

const selectHasError = createSelector(
  selectDataUploadState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  selectDataUploadState,
  state => state.isLoading
);

export const dataUploadSelectors = {
  selectFIRFileUploadResponse,
  selectInvoiceUploadResponse,
  selectSTNUploadResponse,
  selectMERFileUploadResponse,
  selectHasError,
  selectIsLoading
};
