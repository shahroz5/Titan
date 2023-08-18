import {
  BankDepositPaymentModeWiseResponse,
  BankDepositResponse,
  BankDepositResult,
  PaymentModeEnum
} from '@poss-web/shared/models';

export class BankDepositAdaptor {
  static BankDepositFromJson(data: any): BankDepositResult {
    return {
      date: data.date,
      deposits: this.getPaymentModeWiseDeposits(data.deposits)
    };
  }

  static getPaymentModeWiseDeposits(
    bankDepositList: any
  ): BankDepositPaymentModeWiseResponse[] {
    let paymentModeWiseDeposit: BankDepositPaymentModeWiseResponse[] = [];

    for (let i = 0; i < bankDepositList.length; i++) {
      if (i === 0) {
        paymentModeWiseDeposit.push({
          cashPayment:
            bankDepositList[i].paymentCode === PaymentModeEnum.CASH
              ? bankDepositList[i].deposit
              : 0,
          cardPayment:
            bankDepositList[i].paymentCode === PaymentModeEnum.CARD
              ? bankDepositList[i].deposit
              : 0,

          ddPayment:
            bankDepositList[i].paymentCode === PaymentModeEnum.DD ||
            bankDepositList[i].paymentCode === PaymentModeEnum.CHEQUE
              ? bankDepositList[i].deposit
              : 0,
          transactionId: bankDepositList[i].txnId
        });
      } else {
        paymentModeWiseDeposit = paymentModeWiseDeposit.map(newDeposit => ({
          cashPayment:
            bankDepositList[i].paymentCode === PaymentModeEnum.CASH
              ? bankDepositList[i].deposit
              : newDeposit.cashPayment,
          cardPayment:
            bankDepositList[i].paymentCode === PaymentModeEnum.CARD
              ? bankDepositList[i].deposit
              : newDeposit.cardPayment,

          ddPayment:
            bankDepositList[i].paymentCode === PaymentModeEnum.DD ||
            bankDepositList[i].paymentCode === PaymentModeEnum.CHEQUE
              ? bankDepositList[i].deposit
              : newDeposit.ddPayment,

          transactionId: bankDepositList[i].txnId
        }));
      }
    }
    return paymentModeWiseDeposit;
  }
}
