import { CustomErrors, TransactionIdsResponse } from '@poss-web/shared/models';

export class PrintingState {
  hasError?: CustomErrors;
  isLoading?: boolean;
  isPrintingSuccess?: boolean;
  isMailSent?: boolean;
  lastTransactionId?: string;
  lastTransactionPaymentType?: string;
  transactionIds?: TransactionIdsResponse;
  isNotificationPrintSuccess?: boolean;
  isNotificationMailSent?: boolean;
}
