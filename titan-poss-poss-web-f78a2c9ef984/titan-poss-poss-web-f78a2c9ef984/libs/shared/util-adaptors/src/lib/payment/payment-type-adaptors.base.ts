import { PaymentDetails } from '@poss-web/shared/models';

export interface Nullable {
  isNull(): boolean;
}

export abstract class PaymentAdaptorBase implements Nullable {
  private _paymentDetails: PaymentDetails;
  protected constructor(paymentDetails: PaymentDetails) {
    this._paymentDetails = paymentDetails;
  }

  getPaymentDetails(): PaymentDetails {
    return this._paymentDetails;
  }

  isNull() {
    return false;
  }
}
