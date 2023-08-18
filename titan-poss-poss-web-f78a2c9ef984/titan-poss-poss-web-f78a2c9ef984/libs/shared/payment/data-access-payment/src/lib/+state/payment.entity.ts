import { EntityState, createEntityAdapter } from '@ngrx/entity';
import {
  GvStatusList,
  PaymentDetails,
  PaymentRequest
} from '@poss-web/shared/models';

export interface PaymentDetailsEntity extends EntityState<PaymentDetails> {}
export const paymentDetailsAdapter = createEntityAdapter<PaymentDetails>({
  selectId: pymentDetails => pymentDetails.id
});

export interface IntegratedPaymentRequestDetailsEntity
  extends EntityState<PaymentRequest> {}
export const integratedPaymentRequestDetailsAdapter = createEntityAdapter<
  PaymentRequest
>({
  selectId: paymentRequestDetails => paymentRequestDetails.id
});

// export interface QCGCDetailsEntity extends EntityState<QCGCCardDetails> {}
// export const QCGCDetailsAdapter = createEntityAdapter<QCGCCardDetails>({
//   selectId: cardDetails => cardDetails.transactionId
// });

export const paymentDetailsSelector = paymentDetailsAdapter.getSelectors();
//export const QCGCDetailsSelector = QCGCDetailsAdapter.getSelectors();

export interface GVStatusUpdateEntity extends EntityState<GvStatusList> {}
export const gvAdapter = createEntityAdapter<GvStatusList>({
  selectId: List => List.serialNo
});

export const gvStatusUpdateSelector = gvAdapter.getSelectors();

export const integratedPaymentRequestSelector = integratedPaymentRequestDetailsAdapter.getSelectors();

// Todo add sort by line item number
