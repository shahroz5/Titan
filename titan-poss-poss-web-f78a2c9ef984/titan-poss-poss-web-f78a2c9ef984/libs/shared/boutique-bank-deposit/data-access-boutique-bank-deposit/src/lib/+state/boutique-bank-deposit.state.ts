import { BankDepositDetails, CustomErrors, PendingDatesResponse, PifNoResponse } from '@poss-web/shared/models';
export interface BoutiqueBankDepositState {
  error: CustomErrors;
  isLoading: boolean;
  depositDetails: BankDepositDetails[];
  totalElements: number;
  hasSaved: boolean;
  depositedAmount: number;
  saveResponse: BankDepositDetails[];
  hasDenomitionSaved: boolean;
  pendingDates: PendingDatesResponse;
  pifNoResponse: PifNoResponse;
}
