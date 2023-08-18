import {
  CashMemoDetailsResponse,
  CustomErrors
} from '@poss-web/shared/models';


export class OrderConfirmationState {
  hasError?: CustomErrors;
  updateCashMemoResponse: CashMemoDetailsResponse;
  isLoading?: boolean;
}
