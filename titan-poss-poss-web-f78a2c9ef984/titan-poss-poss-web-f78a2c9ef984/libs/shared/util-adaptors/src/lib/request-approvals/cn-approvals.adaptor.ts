import {
  CnApprovalListResponse,
  CountResponse,
} from '@poss-web/shared/models';
import * as moment from 'moment';
export class CnApprovalsAdaptor {
  static getCnRequestList(data: any): CnApprovalListResponse[] {
    const roRequestApprovalListResponse: CnApprovalListResponse[] = [];
    for (const request of data.results) {
      roRequestApprovalListResponse.push({
        locationCode: request.headerData.data.locationCode,
        cnNumber: request.headerData.data.docNo,
        fiscalYear: request.headerData.data.fiscalYear,
        cnType: request.headerData.data.creditNoteType,
        cnDate: request.headerData?.data?.docDate ? moment(request.headerData?.data?.docDate) : '',
        customerName: request.headerData.data.customerName,
        customerMobileNumber: request.headerData.data.mobileNumber,
        amount: request.headerData.data.amount,
        requestedBy: request.requestedBy,
        requestedType: request.headerData.data.requestedType,
        suspendedDate: request.headerData.data.suspendedDate,
        requestorRemarks: request.requestorRemarks,
        remarks: request.approverRemarks,
        processId: request.processId,
        taskId: request.taskId,
        taskName: request.taskName,
        totalElements: data.totalElements
      });
    }
    return roRequestApprovalListResponse;
  }

  static getTotalElements(data): CountResponse[] {
    const countResponse: CountResponse[] = [];
    for (const res of data.results) {
      countResponse.push({
        count: res.count,
        taskStatus: res.taskStatus,
        workflowType: res.workflowType
      });
    }
    return countResponse;
  }
}
