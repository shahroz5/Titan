import { CustomErrors, InvoiceListResponse } from '@poss-web/shared/models';

export interface DocumentsSearchState {
  hasError?: CustomErrors;
  isLoading?: boolean;
  invoiceListResponse: InvoiceListResponse;
}
