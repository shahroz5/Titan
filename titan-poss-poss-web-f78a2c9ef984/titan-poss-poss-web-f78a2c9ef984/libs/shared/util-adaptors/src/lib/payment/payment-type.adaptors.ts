import { PaymentDetails, PaymentModeEnum } from '@poss-web/shared/models';
import { PaymentAdaptorBase } from './payment-type-adaptors.base';

export const PaymentAdaptorMap = new Map<PaymentModeEnum, string>();
PaymentAdaptorMap.set(PaymentModeEnum.CASH, 'CashPaymentAdaptor');
PaymentAdaptorMap.set(PaymentModeEnum.CARD, 'CardPaymentAdaptor');
PaymentAdaptorMap.set(PaymentModeEnum.CHEQUE, 'ChequePaymentAdaptor');
PaymentAdaptorMap.set(PaymentModeEnum.DD, 'DDPaymentAdaptor');
PaymentAdaptorMap.set(PaymentModeEnum.ENCIRCLE, 'EncirclePaymentAdaptor');
PaymentAdaptorMap.set(PaymentModeEnum.AIRPAY, 'AirpayPaymentAdaptor');
PaymentAdaptorMap.set(PaymentModeEnum.RTGS, 'RTGSPaymentAdaptor');
PaymentAdaptorMap.set(PaymentModeEnum.QCGC, 'QCGCPaymentAdaptor');
PaymentAdaptorMap.set(PaymentModeEnum.UNIPAY, 'UnipayPaymentAdaptor');
PaymentAdaptorMap.set(PaymentModeEnum.RO_PAYMENT, 'ROPaymentAdaptor');
PaymentAdaptorMap.set(PaymentModeEnum.WALLET, 'WalletPaymentAdaptor');
PaymentAdaptorMap.set(PaymentModeEnum.BANK_LOAN, 'BankLoanPaymentAdaptor');
PaymentAdaptorMap.set(PaymentModeEnum.CREDIT_NOTE, 'CreditNotePaymentAdaptor');
PaymentAdaptorMap.set(
  PaymentModeEnum.EMPLOYEE_LOAN,
  'EmployeeLoanPaymentAdaptor'
);
PaymentAdaptorMap.set(
  PaymentModeEnum.GHS_EVOUCHER,
  'GHSeVoucherPaymentAdaptor'
);
PaymentAdaptorMap.set(PaymentModeEnum.GIFT_VOUCHER, 'GVPaymentAdaptor');
PaymentAdaptorMap.set(PaymentModeEnum.GHS_ACCOUNT, 'GHSAccountAdaptor');
PaymentAdaptorMap.set(PaymentModeEnum.RAZOR_PAY, 'RazorpayPaymentAdaptor');
PaymentAdaptorMap.set(
  PaymentModeEnum.DIGI_GOLD_NON_TANISHQ,
  'RazorpayPaymentAdaptor'
);
PaymentAdaptorMap.set(
  PaymentModeEnum.DIGI_GOLD_TANISHQ,
  'RazorpayPaymentAdaptor'
);
PaymentAdaptorMap.set(PaymentModeEnum.CASH_BACK, 'CashBackPaymentAdaptor');
PaymentAdaptorMap.set(PaymentModeEnum.UPI, 'UPIPaymentAdaptor');
PaymentAdaptorMap.set(
  PaymentModeEnum.VALUE_ACCESS,
  'ValueAccessPaymentAdaptor'
);

export class NullablePaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    super(data);
  }

  isNull() {
    return true;
  }
}

export class CashPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    // data.instrumentNo = null;
    data.bankName = null;

    super(data);
  }
  isNull() {
    return false;
  }
}

export class CashBackPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    super(data);
  }
  isNull() {
    return false;
  }
}

export class CardPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    // data.instrumentNo = null;

    super(data);
  }
  isNull() {
    return false;
  }
}

export class ChequePaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    // data.paymentCode = PaymentModeEnum.CHEQUE;
    // data.instrumentType = PaymentModeEnum.CHEQUE;
    // data.bankName = data.bankName;

    super(data);
  }
  isNull() {
    return false;
  }
}
export class DDPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    // data.paymentCode = PaymentModeEnum.DD;
    // data.instrumentType = PaymentModeEnum.DD;
    // data.bankName = data.bankName;

    super(data);
  }
}

export class EncirclePaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    data.instrumentNo = null;
    data.bankName = null;

    super(data);
  }
}

export class AirpayPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    // data.paymentCode = PaymentModeEnum.AIRPAY;
    // data.instrumentNo = null;
    // data.instrumentType = PaymentModeEnum.AIRPAY;
    // if (data?.otherDetails?.data?.isOnline) {
    //   data.bankName = data.reference2
    //     ? PaymentModeEnum.AIRPAY + ' - ' + data.reference2
    //     : null;
    // } else {
    //   data.bankName =
    //     data.reference1 || data.reference2 || data.reference3
    //       ? PaymentModeEnum.AIRPAY +
    //         (data.reference1 ? ' - ' + data.reference1 : '') +
    //         (data.reference2 ? ' - ' + data.reference2 : '') +
    //         (data.reference3 ? ' - ' + data.reference3 : '')
    //       : null;
    // }
    super(data);
  }
  isNull() {
    return false;
  }
}
export class RazorpayPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    // data.paymentCode = PaymentModeEnum.AIRPAY;
    // data.instrumentNo = null;
    // data.instrumentType = PaymentModeEnum.AIRPAY;
    // if (data?.otherDetails?.data?.isOnline) {
    //   data.bankName = data.reference2
    //     ? PaymentModeEnum.AIRPAY + ' - ' + data.reference2
    //     : null;
    // } else {
    //   data.bankName =
    //     data.reference1 || data.reference2 || data.reference3
    //       ? PaymentModeEnum.AIRPAY +
    //         (data.reference1 ? ' - ' + data.reference1 : '') +
    //         (data.reference2 ? ' - ' + data.reference2 : '') +
    //         (data.reference3 ? ' - ' + data.reference3 : '')
    //       : null;
    // }
    super(data);
  }
  isNull() {
    return false;
  }
}

export class RTGSPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    // data.paymentCode = PaymentModeEnum.RTGS;
    // data.instrumentNo = null;
    // data.instrumentType = PaymentModeEnum.RTGS;
    // data.bankName = data.reference1;
    super(data);
  }

  isNull() {
    return false;
  }
}

export class EmployeeLoanPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    super(data);
  }

  isNull() {
    return false;
  }
}

export class QCGCPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    // data.paymentCode = PaymentModeEnum.QCGC;
    // data.instrumentType = PaymentModeEnum.QCGC;
    // data.bankName = data.bankName;

    super(data);
  }

  isNull() {
    return false;
  }
}

export class GVPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    // data.paymentCode = PaymentModeEnum.GIFT_VOUCHER;
    // data.instrumentType = PaymentModeEnum.GIFT_VOUCHER;
    // data.bankName = data.bankName;

    super(data);
  }

  isNull() {
    return false;
  }
}

export class UnipayPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    // data.paymentCode = PaymentModeEnum.UNIPAY;
    // data.instrumentType = PaymentModeEnum.UNIPAY;
    // data.bankName = null;

    super(data);
  }

  isNull() {
    return false;
  }
}

export class ROPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    data.instrumentNo = null;
    super(data);
  }

  isNull() {
    return false;
  }
}

export class WalletPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    // data.paymentCode = PaymentModeEnum.WALLET;
    // data.instrumentNo = data.instrumentType;
    // data.bankName =
    //   data.instrumentType && data.reference1
    //     ? data.instrumentType + ' - ' + data.reference1
    //     : null;
    // data.instrumentType = PaymentModeEnum.WALLET;

    super(data);
  }

  isNull() {
    return false;
  }
}

export class BankLoanPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    // data.paymentCode = PaymentModeEnum.BANK_LOAN;
    // data.instrumentNo = data.instrumentNo;
    // data.bankName = data.bankName;
    // data.instrumentType = data.instrumentType;

    super(data);
  }

  isNull() {
    return false;
  }
}

export class GHSeVoucherPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    // data.paymentCode = PaymentModeEnum.GHS_EVOUCHER;
    // data.instrumentType = PaymentModeEnum.GHS_EVOUCHER;
    // data.bankName = data.bankName;

    super(data);
  }

  isNull() {
    return false;
  }
}

export class CreditNotePaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    // data.paymentCode = PaymentModeEnum.CREDIT_NOTE;
    data.bankName = null;

    super(data);
  }

  isNull() {
    return false;
  }
}
export class GHSAccountAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    super(data);
  }
}
export class UPIPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    super(data);
  }

  isNull() {
    return false;
  }
}

export class ValueAccessPaymentAdaptor extends PaymentAdaptorBase {
  constructor(data: PaymentDetails) {
    super(data);
  }
  isNull() {
    return false;
  }
}
