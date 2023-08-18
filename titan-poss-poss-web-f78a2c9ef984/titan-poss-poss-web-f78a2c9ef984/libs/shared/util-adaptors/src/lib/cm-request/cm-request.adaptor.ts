
import { CashMemoHelper } from '../helpers/cash-memo.helper';

export class CmRequestAdaptor {
  static sendWorkFlowDataToIntegration(
    method: any,
    url: any,
    params?: any,
    reqBody?: any
  ): any {
    return {
      httpMethod: method ? method : null,
      relativeUrl: url ? url : null,
      reqBody: reqBody ? reqBody : null,
      requestParams: params ? params : null
    };
  }

  static getUserType(data: any, userType: any): any {
    return {
      data: data,
      userType: userType
    };
  }

  static getType(data: any): any {
    return {
      data: data,
    };
  }

  static getCmRequestListFromJson(data: any, totalElements: any): any {
    if (!data) {
      return null;
    }
    return {
      approvedBy: data.approvedBy,
      approvedDate: data.approvedDate,
      approverRemarks: data.approverRemarks,
      docDate: data.docDate,
      docNo: data.docNo,
      fiscalYear: data.fiscalYear,
      headerData: data.headerData,
      locationCode: data.locationCode,
      processId: data.processId,
      requestedBy: data.requestedBy,
      requestedDate: data.requestedDate,
      requestorRemarks: data.requestorRemarks,
      taskId: data.taskId,
      taskName: data.taskName,
      workflowType: data.workflowType,
      totalElements: totalElements,
      approvalLevel: data.approvalLevel,
      approvalStatus: data.approvalStatus
    };
  }

  static getCmRequestDetailsFromJson(data: any): any {
    if (!data) {
      return null;
    }

    return {
      approvalLevel: data.approvalLevel,
      approvalStatus: data.approvalStatus,
      approvedData: {
        data: {
          itemList: CashMemoHelper.getCMItemDetails(
            data.approvedData.data.itemList
          ),
          paymentList: data.approvedData.data.paymentList,
          discountList: data.approvedData.data.discountList
        }
      },
      docNo: data.docNo,
      headerData: data.headerData,
      locationCode: data.locationCode,
      processId: data.processId,
      requestorRemarks: data.requestorRemarks,
      requestorUserName: data.requestorUserName,
      taskId: data.taskId,
      taskName: data.taskName,
      workflowType: data.workflowType,
      approvedDate: data.approvedDate,
      approvedby: data.approvedby,
      approverRemarks: data.approverRemarks,
      fiscalYear: data.fiscalYear
    };
  }

  static getCmApprovalRequestFromJson(data: any): any {
    if (!data) {
      return null;
    }

    return {
      approverRemarks: data.approverRemarks,
      approverRoleCode: data.approverRoleCode,
      approverUserName: data.approverUserName,
      level: data.level,
      processId: data.processId,
      requestorUserName: data.requestorUserName,
      taskId: data.taskId,
      taskStatus: data.taskStatus,
      totalApproverLevels: data.totalApproverLevels
    };
  }
}
