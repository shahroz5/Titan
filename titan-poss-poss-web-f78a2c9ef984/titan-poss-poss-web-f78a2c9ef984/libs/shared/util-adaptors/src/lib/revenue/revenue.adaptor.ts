import {
  PaymentModeEnum,
  RevenuePaymentModeWiseResponse,
  RevenueResult,
  TodayRevenueResult
} from '@poss-web/shared/models';

export class RevenueDataAdaptor {
  static dayWiseRevenueFromJson(data: any): RevenueResult {
    return {
      date: data.date,
      revenues: this.getPaymentModeWiseRevenue(data.revenues)
    };
  }

  static todayRevenueFromJson(data: any): TodayRevenueResult {
    return {
      revenueType: data.revenueType,
      revenues: this.getPaymentModeWiseRevenue(data.revenues)
    };
  }

  static getPaymentModeWiseRevenue(
    revenueList: any
  ): RevenuePaymentModeWiseResponse[] {
    let paymentModeWiseRevenue: RevenuePaymentModeWiseResponse[] = [];
    // let firtPaymentlist: RevenuePaymentModeWiseResponse[] = [];
    if (revenueList.length === 0) {
      paymentModeWiseRevenue.push({
        cashPayment: 0,
        cardPayment: 0,
        chequePayment: 0,
        ddPayment: 0,
        airpayPayment: 0,
        rtgsPayment: 0,
        walletPayment: 0,
        employeeLoanPayment: 0,
        salaryAdvancePayment: 0,
        roPayment: 0,
        razorPayPayment: 0,
        upiPayment: 0
      });
    } else {
      for (let i = 0; i < revenueList.length; i++) {
        if (i === 0) {
          paymentModeWiseRevenue.push({
            cashPayment:
              revenueList[i].paymentCode === PaymentModeEnum.CASH
                ? revenueList[i].revenues
                : 0,
            cardPayment:
              revenueList[i].paymentCode === PaymentModeEnum.CARD
                ? revenueList[i].revenues
                : 0,
            chequePayment:
              revenueList[i].paymentCode === PaymentModeEnum.CHEQUE
                ? revenueList[i].revenues
                : 0,
            ddPayment:
              revenueList[i].paymentCode === PaymentModeEnum.DD
                ? revenueList[i].revenues
                : 0,
            airpayPayment:
              revenueList[i].paymentCode === PaymentModeEnum.AIRPAY
                ? revenueList[i].revenues
                : 0,
            rtgsPayment:
              revenueList[i].paymentCode === PaymentModeEnum.RTGS
                ? revenueList[i].revenues
                : 0,
            walletPayment:
              revenueList[i].paymentCode === PaymentModeEnum.WALLET
                ? revenueList[i].revenues
                : 0,
            employeeLoanPayment:
              revenueList[i].paymentCode === PaymentModeEnum.EMPLOYEE_LOAN
                ? revenueList[i].revenues
                : 0,
            salaryAdvancePayment:
              revenueList[i].paymentCode === PaymentModeEnum.SALARY_ADVANCE_LOAN
                ? revenueList[i].revenues
                : 0,
            roPayment:
              revenueList[i].paymentCode === PaymentModeEnum.RO_PAYMENT
                ? revenueList[i].revenues
                : 0,
            razorPayPayment:
              revenueList[i].paymentCode === PaymentModeEnum.RAZOR_PAY
                ? revenueList[i].revenues
                : 0,
            upiPayment:
              revenueList[i].paymentCode === PaymentModeEnum.UPI
                ? revenueList[i].revenues
                : 0
          });
        } else {
          paymentModeWiseRevenue = paymentModeWiseRevenue.map(newRevenue => ({
            cashPayment:
              revenueList[i].paymentCode === PaymentModeEnum.CASH
                ? revenueList[i].revenues
                : newRevenue.cashPayment,
            cardPayment:
              revenueList[i].paymentCode === PaymentModeEnum.CARD
                ? revenueList[i].revenues
                : newRevenue.cardPayment,
            chequePayment:
              revenueList[i].paymentCode === PaymentModeEnum.CHEQUE
                ? revenueList[i].revenues
                : newRevenue.chequePayment,
            ddPayment:
              revenueList[i].paymentCode === PaymentModeEnum.DD
                ? revenueList[i].revenues
                : newRevenue.ddPayment,
            airpayPayment:
              revenueList[i].paymentCode === PaymentModeEnum.AIRPAY
                ? revenueList[i].revenues
                : newRevenue.airpayPayment,
            rtgsPayment:
              revenueList[i].paymentCode === PaymentModeEnum.RTGS
                ? revenueList[i].revenues
                : newRevenue.rtgsPayment,
            walletPayment:
              revenueList[i].paymentCode === PaymentModeEnum.WALLET
                ? revenueList[i].revenues
                : newRevenue.walletPayment,
            employeeLoanPayment:
              revenueList[i].paymentCode === PaymentModeEnum.EMPLOYEE_LOAN
                ? revenueList[i].revenues
                : newRevenue.employeeLoanPayment,
            salaryAdvancePayment:
              revenueList[i].paymentCode === PaymentModeEnum.SALARY_ADVANCE_LOAN
                ? revenueList[i].revenues
                : newRevenue.salaryAdvancePayment,
            roPayment:
              revenueList[i].paymentCode === PaymentModeEnum.RO_PAYMENT
                ? revenueList[i].revenues
                : newRevenue.roPayment,
            razorPayPayment :
              revenueList[i].paymentCode === PaymentModeEnum.RAZOR_PAY
                ? revenueList[i].revenues
                : newRevenue.razorPayPayment,
            upiPayment :
              revenueList[i].paymentCode === PaymentModeEnum.UPI
                ? revenueList[i].revenues
                : newRevenue.upiPayment,
          }));
        }
      }
    }

    return paymentModeWiseRevenue;
  }
}
