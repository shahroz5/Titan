import {
  BillCancellation,
  CancelResponse,
  CmBillList,
  ConfirmResponse,
  bcHistoryDetails,
  bcHistoryResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class BillCancellationRequestsAdaptor {
  static billCancellationRequestsfromJson(item: any): BillCancellation {
    return {
      approvedBy: item.approvedBy,
      approvedDate: moment(item.approvedDate),
      approverRemarks: item.approverRemarks,
      docDate: moment(item.docDate),
      docNo: item.docNo,
      fiscalYear: item.fiscalYear,
      headerData: item.headerData,
      locationCode: item.locationCode,
      processId: item.processId,
      requestedBy: item.requestedBy,
      requestedDate: moment(item.requestedDate),
      // requestedDate:
      //   moment(item.requestedDate).format('MMM Do,YYYY') +
      //   ' (' +
      //   moment(item.requestedDate).format('hh:mm A') +
      //   ')',
      requestorRemarks: item.requestorRemarks,
      taskId: item.taskId,
      taskName: item.taskName,
      workflowType: item.workflowType,
      customerName: item.headerData.data.customerName,
      invoiceNo: item.headerData.data.invoiceNo,
      totalAmount: item.headerData.data.totalValue
        ? item.headerData.data.totalValue
        : 0
    };
  }

  static getCmBillListFromJson(data: any, totalElements: number): CmBillList {
    if (!data) {
      return null;
    }

    return {
      currencyCode: data.currencyCode,
      customerName: data.customerName,
      refDocDate: moment(data.refDocDate),
      refDocNo: data.refDocNo,
      refTxnId: data.refTxnId,
      refTxnTime: moment(data.refTxnTime),
      subTxnType: data.subTxnType,
      totalValue: data.totalValue,
      txnType: data.txnType,
      totalElements: totalElements
    };
  }

  static getCancelResFromJson(data: any): CancelResponse {
    if (!data) {
      return null;
    }

    return {
      cndocNos: data.cndocTypes['BILL_CANCELATION'],
      docNo: data.docNo,
      id: data.id,
      tcsCnDocNos: data.cndocTypes['TCS_CREDIT_NOTE'],
      tcsCnAmount: data.tcsCnAmt,
      cnId:data.cndocNos
    };
  }

  static getConfirmResFromJson(data: any): ConfirmResponse {
    if (!data) {
      return null;
    }

    return {
      docNo: data.docNo,
      id: data.id,
      requestNo: data.requestNo
    };
  }

  static getBillCancellationHistoryDetails(data: any): bcHistoryDetails {
    if (!data) {
      return null;
    }
    return {
      customerName: data.customerName,
      createdBy: data.createdBy,
      createdDate: data.createdDate,
      fiscalYear: data.fiscalYear,
      docDate: data.docDate,
      docNo: data.docNo,
      cancelReason: data.cancelReason,
      netAmount: data.netAmount,
      cancellationType: data.cancellationType,
      cmId: data.cmId,
      subTxnType: data.subTxnType,
    };
  }
}
