import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { PaymentRequestDetails } from '@poss-web/shared/models';

export interface AirpayPaymentRequestEntity
  extends EntityState<PaymentRequestDetails> {}
export const airpayPaymentDetailsAdapter = createEntityAdapter<
  PaymentRequestDetails
>({
  selectId: details => details.id
});
export const airpayPaymentRequestEntitySelector = airpayPaymentDetailsAdapter.getSelectors();
