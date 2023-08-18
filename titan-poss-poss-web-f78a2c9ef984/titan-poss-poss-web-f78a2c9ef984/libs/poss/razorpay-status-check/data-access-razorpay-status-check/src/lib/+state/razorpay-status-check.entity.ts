import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { PaymentRequestDetails } from '@poss-web/shared/models';

export interface RazorpayPaymentRequestEntity
  extends EntityState<PaymentRequestDetails> {}
export const razorpayPaymentDetailsAdapter = createEntityAdapter<
  PaymentRequestDetails
>({
  selectId: details => details.id
});
export const razorPaymentRequestEntitySelector = razorpayPaymentDetailsAdapter.getSelectors();
