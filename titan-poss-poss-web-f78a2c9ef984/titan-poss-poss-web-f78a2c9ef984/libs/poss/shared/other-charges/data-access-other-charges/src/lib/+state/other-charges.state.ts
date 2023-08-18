import {
  CustomErrors,
  CashMemoDetailsResponse,
  CashMemoTaxDetails,
  Lov
} from '@poss-web/shared/models';

export class OtherChargesState {
  hasError?: CustomErrors;
  isLoading?: boolean;
  taxDetails: CashMemoTaxDetails;
  reasons: Lov[];
  partialUpdateCashMemoResponse: CashMemoDetailsResponse;
}
