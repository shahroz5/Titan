import {
  PayerBankConfiguration,
  CustomErrors,
  PayerBankConfigDetails,
  PaymentModeResponse,
  PayerBankMaster
} from '@poss-web/shared/models';
export interface PayerBankConfigState {
  payerBankConfigListing: PayerBankConfiguration[];
  totalElements: number;
  error: CustomErrors;
  isLoading: boolean;
  hasSaved: boolean;
  hasUpdated: boolean;
  payerBanks: PayerBankMaster[];
  configId: string;
  payerBanksConfigDetails: PayerBankConfigDetails;
  paymentModes: PaymentModeResponse[];
  hasSearched: boolean;
  banksCount: number;
}
