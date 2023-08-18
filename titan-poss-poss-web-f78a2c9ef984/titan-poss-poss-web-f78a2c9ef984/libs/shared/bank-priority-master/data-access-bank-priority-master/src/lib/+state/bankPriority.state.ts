import { CustomErrors,BankPriority } from '@poss-web/shared/models';

export interface BankPriorityState {
  error: CustomErrors;
  bankPriorityListing: BankPriority[];
  isLoading: boolean;
  hasUpdated: boolean;
}
