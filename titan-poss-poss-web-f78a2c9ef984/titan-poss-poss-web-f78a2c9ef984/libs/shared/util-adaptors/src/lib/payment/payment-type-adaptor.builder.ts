import { PaymentDetails } from '@poss-web/shared/models';
import { PaymentAdaptorBase } from './payment-type-adaptors.base';
import { NullablePaymentAdaptor } from './payment-type.adaptors';

type PaymentAdaptorConstructor = new (
  data: PaymentDetails
) => PaymentAdaptorBase;

type PaymentAdaptorConstructorOrPaymentAdaptorConstructorName =
  | PaymentAdaptorConstructor
  | string;

export class PaymentAdaptorBuilder {
  private _paymentAdaptorContructorRepo: any;

  constructor(paymentAdaptorContructorRepo: any) {
    this._paymentAdaptorContructorRepo = paymentAdaptorContructorRepo;
  }

  private _isPaymentAdaptorConstructorName(
    maybePaymentAdaptorName: string
  ): boolean {
    return Boolean(
      Object.keys(this._paymentAdaptorContructorRepo).find(constructorName => {
        return constructorName === maybePaymentAdaptorName;
      })
    );
  }

  private _isPaymentAdaptorConstructor(
    maybePaymentAdaptorConstructor: PaymentAdaptorConstructorOrPaymentAdaptorConstructorName
  ): maybePaymentAdaptorConstructor is PaymentAdaptorConstructor {
    return (
      Object.getPrototypeOf(maybePaymentAdaptorConstructor) ===
      PaymentAdaptorBase
    );
  }

  construct(
    constructorOrCustomerName: PaymentAdaptorConstructorOrPaymentAdaptorConstructorName,
    data: PaymentDetails
  ): PaymentAdaptorBase {
    if (this._isPaymentAdaptorConstructor(constructorOrCustomerName)) {
      return new constructorOrCustomerName(data);
    }

    return this._isPaymentAdaptorConstructorName(constructorOrCustomerName)
      ? new this._paymentAdaptorContructorRepo[constructorOrCustomerName](data)
      : new NullablePaymentAdaptor(data);
  }
}
