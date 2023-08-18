import { TransactionCount, TransactionDetails } from '@poss-web/shared/models';

export class ToolbarAdaptor {
  /**
   * The function maps the json data to respective model type
   */

  static transactionDetailsFromJson(
    transaction: any,
    data: any
  ): TransactionDetails {
    if (!transaction) {
      return null;
    }
    return {
      customerId: transaction.customerId,
      customerName: transaction.customerName,
      docNo: transaction.docNo,
      fiscalYear: transaction.fiscalYear,
      id: transaction.id,
      locationCode: transaction.locationCode,
      status: transaction.status,
      totalElements: data.totalElements,
      docDate: transaction.docDate,
      firstHoldTime: transaction.firstHoldTime,
      lastHoldTime: transaction.lastHoldTime,
      paymentType: transaction.paymentType,
      txnType: transaction.txnType,
      subTxnType: transaction.subTxnType
    };
  }

  static transactionCountFromJson(transactionCount: any): TransactionCount {
    if (!transactionCount) {
      return null;
    }
    return {
      count: transactionCount.count,
      txnType: transactionCount.txnType,
      subTxnType: transactionCount.subTxnType
    };
  }
}
