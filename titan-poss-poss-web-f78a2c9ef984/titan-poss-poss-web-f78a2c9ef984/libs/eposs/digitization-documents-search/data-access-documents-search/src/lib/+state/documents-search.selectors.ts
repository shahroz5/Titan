import { createSelector } from '@ngrx/store';

import { selectDocumentSearchState } from './documents-search.reducer';

/**
 * The selectors for Data-Upload store
 */
const selectInvoiceListResponse = createSelector(
  selectDocumentSearchState,
  state => state.invoiceListResponse
);

const selectIsLoading = createSelector(
  selectDocumentSearchState,
  state => state.isLoading
);

const selectHasError = createSelector(
  selectDocumentSearchState,
  state => state.hasError
);

export const DocumentsSearchSelectors = {
  selectInvoiceListResponse,
  selectIsLoading,
  selectHasError
};
