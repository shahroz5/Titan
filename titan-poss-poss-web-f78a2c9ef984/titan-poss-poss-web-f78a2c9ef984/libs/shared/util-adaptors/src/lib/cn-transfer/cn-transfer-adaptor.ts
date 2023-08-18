import {
  CnTransferSearchResult,
  CnTransferSearchResponsePayload,
  SendRequestResponsePayload,
  CNDetailsInfo,
  LegacyOutwardTransferResponsePayload,
  LegacyInwardTransferResponsePayload,
  LocationSummaryList,
  cnTransferTabEnum
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class CreditNoteTransferAdaptor {
  static getCreditNotetransferSearchResult(
    data: any
  ): CnTransferSearchResponsePayload {
    const creditNoteSearchResult: CnTransferSearchResult[] = [];
    for (const listItem of data.results) {
      creditNoteSearchResult.push({
        amount: listItem.amount,
        creditNoteType: listItem.creditNoteType,
        customerName: listItem.customerName,
        docDate: moment(listItem.docDate),
        docNo: listItem.docNo,
        fiscalYear: listItem.fiscalYear,
        id: listItem.id,
        linkedTxnId: listItem.linkedTxnId,
        linkedTxnType: listItem.linkedTxnType,
        locationCode: listItem.locationCode,
        mobileNumber: listItem.mobileNumber,
        status: listItem.status,
        isPaymentForEGHS: listItem.eghsDetails?.data?.isPaymentForEGHS
      });
    }

    return { result: creditNoteSearchResult, totalCount: data.totalCount };
  }


  static getRequestsDetails(data: any): SendRequestResponsePayload {
    const requests: CNDetailsInfo[] = [];
    for (const listItem of data.results) {
      requests.push({
        approvalLevel: listItem?.approvalLevel,
        approvalStatus: listItem?.approvalStatus,
        approvedBy: listItem?.approvedBy,
        approvedDate: moment(listItem?.approvedDate),
        approverRemarks: listItem?.approverRemarks,
        headerData: {
          type: listItem.headerData?.type,
          data: {
            id: listItem.headerData?.data?.id,
            salesTxnId: listItem.headerData?.data?.salesTxnId,
            linkedTxnId: listItem.headerData?.data?.linkedTxnId,
            parentCnId: listItem.headerData?.data?.parentCnId,
            originalCnId: listItem.headerData?.data?.originalCnId,
            cancelTxnId: listItem.headerData?.data?.cancelTxnId,
            creditNoteType: listItem.headerData?.data?.creditNoteType,
            locationCode: listItem.headerData?.data?.locationCode,
            fiscalYear: listItem.headerData?.data?.fiscalYear,
            docNo: listItem.headerData?.data?.docNo,
            docDate: moment(listItem.headerData?.data?.docDate),
            customerId: listItem.headerData?.data?.customerId,
            amount: listItem.headerData?.data?.amount,
            utilisedAmount: listItem.headerData?.data?.utilisedAmount,
            paymentDetails: listItem.headerData?.data?.paymentDetails,
            processId: listItem.headerData?.data?.processId,
            remarks: listItem.headerData?.data?.remarks,
            status: listItem.headerData?.data?.status,
            workflowStatus: listItem.headerData?.data?.workflowStatus,
            approverLocationCode:
              listItem.headerData?.data?.approverLocationCode,
            customerName: listItem.headerData?.data?.customerName
          }
        },
        processId: listItem?.processId ? listItem.processId : listItem.id,
        requestedBy: listItem?.requestedBy,
        requestedDate: moment(listItem.requestedDate),
        requestorRemarks: listItem?.requestorRemarks,
        workflowType: listItem?.workflowType,
        taskId: listItem?.taskId,
        taskName: listItem?.taskName,
        amount: listItem?.amount,
        creditNoteType: listItem?.creditNoteType,
        customerId: listItem?.customerId
          ? listItem?.customerId
          : listItem.headerData?.data?.customerId,
        customerName: listItem?.customerName,
        docDate: moment(listItem?.docDate),
        docNo: listItem?.docNo,
        fiscalYear: listItem?.fiscalYear,
        id: listItem?.id,
        linkedTxnId: listItem?.linkedTxnId,
        linkedTxnType: listItem?.linkedTxnType,
        locationCode: listItem?.locationCode,
        mobileNumber: listItem?.mobileNumber,
        refDocNo: listItem?.refDocNo,
        refDocType: listItem?.refDocType,
        status: listItem?.status,
        workflowStatus: listItem?.workflowStatus
      });
    }

    return { results: requests, count: data.totalElements };
  }
  static getCreditNoteTransferSearchDetailsData(
    data: any,
    tab?: string
  ): CNDetailsInfo {
    if (!data) {
      return null;
    }

    return {
      amount: data?.amount,
      creditNoteType: data?.creditNoteType,
      customerId:
        tab === cnTransferTabEnum.SEARCH
          ? data?.destCustomerId
          : tab === cnTransferTabEnum.SENT_REQUESTS
          ? data.headerData?.data?.destCustomerId
          : tab === cnTransferTabEnum.RECEIVED_REQUESTS
          ? data.headerData?.data?.customerId
          : data?.customerId
          ? data?.customerId
          : data.headerData?.data?.customerId,
      customerName: data?.customerName,
      docDate: moment(data?.docDate),
      docNo: data?.docNo,
      fiscalYear: data.fiscalYear,
      id: data?.id,
      linkedTxnId: data?.linkedTxnId,
      linkedTxnType: data?.linkedTxnType,
      locationCode: data?.locationCode,
      mobileNumber: data?.mobileNumber,
      refDocNo: data?.refDocNo,
      refDocType: data.refDocType,
      status: data?.status,
      workflowStatus: data?.workflowStatus,
      headerData: {
        type: data.headerData?.type,
        data: {
          id: data.headerData?.data?.id,
          salesTxnId: data.headerData?.data?.salesTxnId,
          linkedTxnId: data.headerData?.data?.linkedTxnId,
          parentCnId: data.headerData?.data?.parentCnId,
          originalCnId: data.headerData?.data?.originalCnId,
          cancelTxnId: data.headerData?.data?.cancelTxnId,
          creditNoteType: data.headerData?.data?.creditNoteType,
          locationCode: data.headerData?.data?.locationCode,
          fiscalYear: data.headerData?.data?.fiscalYear,
          docNo: data.headerData?.data?.docNo,
          docDate: moment(data.headerData?.data?.docDate),
          customerId: data.headerData?.data?.customerId,
          amount: data.headerData?.data?.amount,
          utilisedAmount: data.headerData?.data?.utilisedAmount,
          paymentDetails: data.headerData?.data?.paymentDetails,
          processId: data.headerData?.data?.processId,
          remarks: data.headerData?.data?.remarks,
          status: data.headerData?.data?.status,
          workflowStatus: data.headerData?.data?.workflowStatus,
          approverLocationCode: data.headerData?.data?.approverLocationCode,
          customerName: data.headerData?.data?.customerName
        }
      },
      approvalLevel: data?.approvalLevel,
      approvalStatus: data?.approvalStatus,
      approvedDate: data?.approvedDate,
      approvedBy: data?.approvedBy,
      approverLocationCode: data?.approverLocationCode,
      approverRemarks: data?.approverRemarks,
      processId: data?.processId,
      requestorRemarks: data?.requestorRemarks,
      requestorUserName: data?.requestorUserName,
      workflowType: data?.workflowType
    };
  }

  static getLegacyCNOutwardTransferResponseData(
    data: any
  ): LegacyOutwardTransferResponsePayload {
    if (!data) {
      return null;
    }

    return {
      errorMessage: data?.errorMessage,
      status: data?.status
    };
  }

  static getLegacyCNInwardTransferResponseData(
    data: any
  ): LegacyInwardTransferResponsePayload {
    if (!data) {
      return null;
    }

    return {
      docNo: data?.docNo
    };
  }
  static getLegacyLocationCodesResponseData(data: any): LocationSummaryList[] {
    if (!data) {
      return null;
    }
    const locationData: LocationSummaryList[] = [];
    for (const location of data.results) {
      locationData.push({
        description: location.description,
        locationCode: location.locationCode,
        isMigrated: false
      });
    }
    return locationData;
  }
  static getMigratedLocationCodesResponseData(
    data: any
  ): LocationSummaryList[] {
    if (!data) {
      return null;
    }
    const locationData: LocationSummaryList[] = [];
    for (const location of data.results) {
      locationData.push({
        description: location.description,
        locationCode: location.locationCode,
        isMigrated: true
      });
    }
    return locationData;
  }
}
