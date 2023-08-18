import { AB } from '@poss-web/shared/models';
import * as moment from 'moment';

export class ABRequestsAdaptor {
  static ABRequestsfromJson(item: any): AB {
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
      requestedDate: moment(item.requestedDate).format('DD-MMM-YYYY'),
      requestorRemarks: item.requestorRemarks,
      taskId: item.taskId,
      taskName: item.taskName,
      workflowType: item.workflowType,
      customerName: item?.headerData?.data?.title
        ? item.headerData.data.title + ' ' + item.headerData.data.customerName
        : item.headerData.data.customerName,
      invoiceNo: item.headerData.data.invoiceNo,
      abDocNo: item.headerData.data.docNo,
      totalAmount: item.headerData.data.finalValue
        ? item.headerData.data.finalValue
        : 0,
      mobileNumber: item.headerData.data.mobileNumber
    };
  }
}
