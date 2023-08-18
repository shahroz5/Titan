import { TEPList } from '@poss-web/shared/models';

export class TEPAdaptor {
  static TEPSearchList(data: any): TEPList {
    if (!data) {
      return null;
    }
    return {
      customerName: data.customerName,
      refDocDate: data.refDocDate,
      refDocNo: data.refDocNo,
      refTxnId: data.refTxnId,
      refTxnTime: data.refTxnTime,
      currencyCode: data.currencyCode,
      totalValue: data.totalValue,
      txnType: data.txnType,
      subTxnType: data.subTxnType
    };
  }

  static TEPHistoryList(data: any): TEPList {
    if (!data) {
      return null;
    }
    return {
      customerName: data.customerName,
      refDocDate: data.docDate,
      refDocNo: data.docNo,
      refTxnId: data.txnId ? data.txnId : null,
      refTxnTime: data.createdDate,
      currencyCode: data.currencyCode ? data.currencyCode : null,
      totalValue: data.netAmount,
      txnType: data.txnType ? data.txnType : null,
      subTxnType: data.goodsType ? data.goodsType : null
    };
  }
}
