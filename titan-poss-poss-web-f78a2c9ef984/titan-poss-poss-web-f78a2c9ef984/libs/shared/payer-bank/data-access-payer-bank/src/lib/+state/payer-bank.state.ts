import {
  CustomErrors,
  PayerBankDetails,
  FileResponse
} from '@poss-web/shared/models';

export interface PayerBankState {
  error: CustomErrors;
  bankDetails: PayerBankDetails[];
  isLoading: boolean;
  totalElements: number;
  fileResponse: FileResponse;
  errorLog: any;
}
