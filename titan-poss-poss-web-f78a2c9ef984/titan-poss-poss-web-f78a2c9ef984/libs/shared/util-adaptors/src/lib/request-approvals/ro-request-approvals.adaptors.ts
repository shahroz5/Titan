import {
  RoRequestApprovalListResponse,
  BoutiqueRoRequestApprovalListResponse,
  BoutiqueRoRequestApprovalList
} from '@poss-web/shared/models';
import * as moment from 'moment';
export class RoRequestApprovalAdaptor {
  static getRoRequestApprovalList(data: any): RoRequestApprovalListResponse[] {
    let roRequestApprovalListResponse: RoRequestApprovalListResponse[] = [];
    if (data.results !== null && data.results !== undefined) {
      for (const request of data.results) {
        roRequestApprovalListResponse.push({
          approvedBy: request.approvedBy,
          approvedDate: moment(request.approvedDate),
          remarks: request.approverRemarks,
          docDate: moment(request.docDate),
          reqNo: request.docNo,
          fiscalYear: request.fiscalYear,
          amount: request.headerData.data.amount,
          customerName: request.headerData.data.customerName,
          customerTitle: request.headerData.data.customerTitle,
          customerMobileNumber: request.headerData.data.customerMobileNumber,
          cashierId: request.headerData.data.requestorEmployeeCode,
          customerId: request.headerData.data.customerId,
          locationCode: request.locationCode,
          processId: request.processId,
          cashierName: request.requestedBy,
          requestedDate: moment(request.requestedDate),
          requestTime: moment(request.requestedDate).format('hh:mm A'),
          // requestTime: moment(request.requestedDate).
          requestorReason: request.requestorRemarks,
          taskId: request.taskId,
          taskName: request.taskName,
          workflowType: request.workflowType,
          totalElements: data.totalElements,
          approvalStatus: request.approvalStatus
        });
      }
    } else {
      roRequestApprovalListResponse = [];
    }

    return roRequestApprovalListResponse;
  }
  static getRoRequestApprovalCount(data: any) {
    for (const request of data.results) {
      if (request.workflowType === 'APPROVE_RO_PAYMENT') {
        return request.count;
      }
    }
  }

  static getApprovedIds(data: any) {
    const ids = [];
    for (const request of data) {
      ids.push(request.processId);
    }
    return ids;
  }

  static getBoutiqueApprovalRequests(data: any) {
    let boutiqueRoRequestApprovalListResponse: BoutiqueRoRequestApprovalListResponse;
    const boutiqueRoRequestApprovalList: BoutiqueRoRequestApprovalList[] = [];
    for (const request of data?.results) {
      boutiqueRoRequestApprovalList.push({
        approvedBy: request.approvedBy,

        approvedDate: moment(request.approvedDate),
        id: request.processId,
        reqNo: request.docNo,
        fiscalYear: request.fiscalYear,
        amount: request.headerData.data.amount,
        customerName: request.headerData.data.customerName,

        customerMobileNumber: request.headerData.data.customerMobileNumber,

        cashierName: request.headerData.data.requestorEmployeeCode,
        requestedDate: moment(request.requestedDate),
        requestTime: moment(request.requestedDate).format('hh:mm A'),
        status: request.approvalStatus,
        requestorReason: request.requestorRemarks,
        remarks: request.approverRemarks
      });
    }

    boutiqueRoRequestApprovalListResponse = {
      requestList: boutiqueRoRequestApprovalList,
      totalElements: data.totalElements
    };
    return boutiqueRoRequestApprovalListResponse;
  }
}
