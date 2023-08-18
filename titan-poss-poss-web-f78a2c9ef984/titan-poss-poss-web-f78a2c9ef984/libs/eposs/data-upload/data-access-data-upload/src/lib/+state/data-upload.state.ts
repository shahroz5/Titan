import { CustomErrors, NewFileUploadResponse } from '@poss-web/shared/models';

export interface DataUploadState {
  FIRFileUploadResponse: NewFileUploadResponse;
  MERFileUploadResponse: NewFileUploadResponse;
  invoiceUploadResponse: boolean;
  STNUploadResponse: boolean;
  hasError?: CustomErrors;
  isLoading?: boolean;
}
