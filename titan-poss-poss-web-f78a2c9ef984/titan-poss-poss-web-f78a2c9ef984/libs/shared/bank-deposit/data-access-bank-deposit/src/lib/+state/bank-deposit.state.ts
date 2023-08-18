import { BankDepositResponse, CustomErrors, DepositDateResponse } from '@poss-web/shared/models';

export const BANK_DEPOSIT_FEATURE_KEY = 'bank-deposit';

export interface BankDepositState {
  isLoading: boolean;
  error: CustomErrors;
  bankDepositData: BankDepositResponse;
  transacionDetails: DepositDateResponse;
}
