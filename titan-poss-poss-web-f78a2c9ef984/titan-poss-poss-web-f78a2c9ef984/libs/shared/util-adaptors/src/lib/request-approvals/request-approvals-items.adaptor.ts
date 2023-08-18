import {
  FullValueApprovalListItem,
  FullValueTepRequestsResponse,
  RequestApprovals,
  tepApprovalListResponse,
  tepRequests
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class RequestApprovalsItemsAdaptor {
  static fromJson(item: any): RequestApprovals {
    return {
      id: item.id,
      reqDocNo: item.reqDocNo,
      srcDocNo: item.srcDocNo,
      srcLocationCode: item.srcLocationCode,
      destLocationCode: item.destLocationCode,
      totalAcceptedQuantity: item.totalAcceptedQuantity
        ? item.totalAcceptedQuantity
        : 0,
      totalAcceptedValue: item.totalAcceptedValue ? item.totalAcceptedValue : 0,
      totalAcceptedWeight: item.totalAcceptedWeight
        ? item.totalAcceptedWeight
        : 0,
      totalRequestedQuantity: item.totalRequestedQuantity
        ? item.totalRequestedQuantity
        : 0,
      totalRequestedValue: item.totalRequestedValue
        ? item.totalRequestedValue
        : 0,
      totalRequestedWeight: item.totalRequestedWeight
        ? item.totalRequestedWeight
        : 0,
      totalIssuedQuantity: item.totalIssuedQuantity
        ? item.totalIssuedQuantity
        : 0,
      totalIssuedValue: item.totalIssuedValue ? item.totalIssuedValue : 0,
      totalIssuedWeight: item.totalIssuedWeight ? item.totalIssuedWeight : 0,
      status: item.status,
      reqDocDate: moment(item.reqDocDate),
      srcDocDate: moment(item.srcDocDate),
      createdDate: moment(item.createdDate),
      requestType: item.requestType,
      weightUnit: item.weightUnit,
      currencyCode: item.currencyCode,

      otherDetails: item.otherDetails
        ? {
            type: item.otherDetails['type'],
            data: item.otherDetails['data']
          }
        : {
            type: null,
            data: null
          },
      carrierDetails: item.carrierDetails
        ? {
            type: item.carrierDetails['type'],
            data: item.carrierDetails['data']
          }
        : {
            type: null,
            data: null
          }
    };
  }

  static TepRequestList(data: any): tepRequests {
    const requestApprovalListResponse: tepApprovalListResponse[] = [];
    for (const request of data.results) {
      requestApprovalListResponse.push({
        locationCode: request.headerData.data.locationCode,
        cnNumber: request.headerData.data.cmDocNo,
        fiscalYear: request.headerData.data.fiscalYear,
        grossWt: request.headerData.data.measuredWeight,
        variantCode: request.headerData.data.itemCode,
        standardWt: request.headerData.data.stdWeight,
        customerName: request.headerData.data.customerName,
        totalElements: request.headerData.data.totalQuantity,
        approvedData: request.approvedData ? request.approvedData : null,
        tepExceptionDetails: request.headerData.data.tepExceptionDetails ? request.headerData.data.tepExceptionDetails : null,
        amount: request.headerData.data.finalValue,
        requestedBy: request.requestedBy,
        requestNo: request.docNo,
        requestDate: request.requestedDate,
        requestorRemarks: request.requestorRemarks,
        remarks: request.approverRemarks,
        processId: request.processId,
        taskId: request.taskId,
        taskName: request.taskName,
        customerMobileNo: request.headerData.data.customerMobileNo,
        flatExchangeValue: request.headerData.data.tepExceptionDetails.data.flatExchangeValue,
        deductionPercent: request.headerData.data.tepExceptionDetails.data.deductionPercent,
        approvedBy: request.headerData.data.tepExceptionDetails.data.approvedBy,
        customerId:request.headerData.data.tepExceptionDetails.data.customerId,
        itemCode:request.headerData.data.tepExceptionDetails.data.itemCode
      });
    }
    return {
      results: requestApprovalListResponse,
      count: data.totalElements ? data.totalElements : 0
    };
  }

  static FullValueTepRequestsList(data: any): FullValueTepRequestsResponse {
    if (data) {
      let requestListObj: FullValueTepRequestsResponse = {
        results: data.results,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        pageSize: data.pageSize,
        pageNumber: data.pageNumber
      };
      return requestListObj;
    } else {
      return null;
    }
  }

  static TepWorkflowDeatils(request: any): tepApprovalListResponse {
    if (!request) {
      return null;
    }
    const requestApprovalListResponse: tepApprovalListResponse = {
      locationCode: request.headerData.data.locationCode,
      cnNumber: request.headerData.data.cmDocNo,
      fiscalYear: request.headerData.data.fiscalYear,
      grossWt: request.headerData.data.measuredWeight,
      variantCode: request.headerData.data.itemCode,
      standardWt: request.headerData.data.stdWeight,
      customerName: request.headerData.data.customerName,
      totalElements: request.headerData.data.totalQuantity,
      approvedData: request.approvedData ? request.approvedData : null,
      tepExceptionDetails: request.headerData.data.tepExceptionDetails ? request.headerData.data.tepExceptionDetails : null,
      amount: request.headerData.data.finalValue,
      requestedBy: request.requestedBy,
      requestNo: request.docNo,
      requestDate: request.requestedDate,
      requestorRemarks: request.requestorRemarks,
      remarks: request.approverRemarks,
      processId: request.processId,
      taskId: request.taskId,
      taskName: request.taskName
    };

    return requestApprovalListResponse;
  }
}
