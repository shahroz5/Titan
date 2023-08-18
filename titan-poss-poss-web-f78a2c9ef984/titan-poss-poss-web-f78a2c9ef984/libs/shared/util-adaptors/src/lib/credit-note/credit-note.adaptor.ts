import {
  BankDetails,
  CnRefundAmountDetails,
  CNRefundDetails,
  CreditNoteDetails,
  CreditNoteSearchResult,
  SelectDropDownOption,
  SentRequestResponse,
  TransferedCNS,
  TransferToEghs
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class CreditNoteAdaptor {
  static getCreditNoteSearchResult(
    data: any
  ): { searchResult: CreditNoteSearchResult[]; count: number } {
    const creditNoteSearchResult: CreditNoteSearchResult[] = [];
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
        customerId: listItem.customerId,
        frozenRateDetails: listItem.frozenRateDetails,
        accountNumber: listItem.eghsDetails?.data?.accountNumber,
        isCancleAllowed: listItem.isCancleAllowed
          ? listItem.isCancleAllowed
          : false,
        isUnipay: listItem.isUnipay ? listItem.isUnipay : false
      });
    }

    return { searchResult: creditNoteSearchResult, count: data.totalElements };
  }

  static getCreditNoteDetails(data: any): CreditNoteDetails {
    let creditNoteDetails: CreditNoteDetails;

    creditNoteDetails = {
      id: data.id,
      docNo: data?.docNo,
      cancelDate: data?.cancelDate,
      fiscalYear: data?.fiscalYear,
      customerName: data?.customerName,
      customerId: data?.customerId,
      locationCode: data?.locationCode,
      destLocationCode: data?.destLocation,
      creditNoteType: data?.creditNoteType,
      docDate: moment(data?.docDate),
      amount: data?.amount,
      status: data?.status,
      linkedTxnType: data?.linkedTxnType,
      mobileNumber: data?.mobileNumber,
      linkedTxnId: data?.linkedTxnId,
      refDocNo: data?.refDocNo,
      refDocNos: data?.refDocNos?.toString(),
      refDocType: data?.refDocType,
      workflowStatus: data?.workflowStatus,
      frozenRateDetails: data?.frozenRateDetails,
      maxGhsAmount: data?.maxGhsAmount,
      isAutoApproved: data?.isAutoApproved,
      isRefundDetailsApplicable: data?.isRefundDetailsApplicable,
      cnRefundDetails: this.getCnRefundDetails(data),
      cancelRemarks: data?.remarks,
      approverBy: data?.approverBy,
      approverRemarks: data?.approverRemarks,
      isPaymentForEGHS: data?.eghsDetails?.data?.isPaymentForEGHS,
      paymentDetails: data?.paymentDetails,
      isUnipay: data.isUnipay ? data.isUnipay : false,
      originalDocDate: data?.originalDocDate
        ? moment(data.originalDocDate)
        : null
    };

    return creditNoteDetails;
  }

  static getCnRefundDetails(data): CNRefundDetails {
    let cnRefundDetails: CNRefundDetails;
    cnRefundDetails = {
      netRefundAmount: data?.refundAmount,
      refundPaymentMode: data?.paymentInstrumentType
        ? data?.paymentInstrumentType
        : data?.paymentCode,
      refundPaymentType: data?.paymentInstrumentType
        ? data?.paymentCode
        : data?.paymentInstrumentType,
      bankDetails: this.getBankDetails(data.bankDetails)
    };
    return cnRefundDetails;
  }

  static getBankDetails(data): BankDetails {
    let bankDetails: BankDetails;
    bankDetails = {
      accountHoldersName: data?.accountHoldersName
        ? data?.accountHoldersName
        : data?.payeeName,
      accountNumber: data?.accountNumber,
      bankName: data?.bankName ? data?.bankName : data?.acquiredBank,
      branch: data?.Branch,
      ifscCode: data?.ifscCode,
      approvalCode: data?.approvalCode,
      tidNumber: data?.tidNumber,
      tanishqTransactionId: data?.tanishqTransactionId,
      airpayTransactionId: data?.airpayTransactionId,
      razorpayTransactionId: data?.razorpayTransactionId,
      micrCode: data?.micrCode,
      chequeNumber: data?.chequeNumber
    };
    return bankDetails;
  }

  static getSentRequests(
    data: any
  ): { requestSentResponse: SentRequestResponse[]; count: number } {
    const sentRequests: SentRequestResponse[] = [];
    for (const listItem of data.results) {
      sentRequests.push({
        docNo: listItem?.docNo,
        fiscalYear: listItem?.fiscalYear,
        cnType: listItem?.headerData?.data?.creditNoteType,
        amount: listItem?.headerData?.data?.amount,
        custName: listItem?.headerData?.data?.customerName,
        reqDate: listItem?.headerData?.data?.requestedDocDate,
        status: listItem?.approvalStatus,
        id: listItem?.headerData?.data?.id,
        processId: listItem.processId,
        requestorRemarks: listItem?.requestorRemarks,
        frozenRateDetails: listItem?.headerData?.data?.frozenRateDetails,
        approvalStatus: listItem?.approvalStatus,
        createdDate: moment(listItem?.headerData?.data?.docDate),
        custId: listItem?.headerData?.data?.customerId,
        cnNumber: listItem?.headerData?.data?.docNo
      });
    }

    return { requestSentResponse: sentRequests, count: data.totalElements };
  }

  static getRequest(data: any): SentRequestResponse {
    let sentRequest: SentRequestResponse;

    sentRequest = {
      docNo: data?.docNo,
      fiscalYear: data?.fiscalYear,
      cnType: data?.headerData?.data?.creditNoteType,
      amount: data?.headerData?.data?.amount,
      custName: data?.headerData?.data?.customerName,
      reqDate: data?.headerData?.data?.requestedDocDate,
      status: data?.headerData?.data?.status,
      id: data?.headerData?.data?.id,
      processId: data.processId,
      requestorRemarks: data?.requestorRemarks,
      frozenRateDetails: data?.headerData?.data?.frozenRateDetails,
      approvalStatus: data?.approvalStatus,
      createdDate: moment(data?.headerData?.data?.docDate),
      custId: data?.headerData?.data?.customerId,
      cnNumber: data?.headerData?.data?.docNo,
      remarks: data?.headerData?.data?.remarks,
      approverRemarks: data.approverRemarks
    };

    return sentRequest;
  }
  static getTransferedCNs(
    data: any
  ): { transferedCNs: TransferedCNS[]; totalCount: number } {
    const transferedCNs: TransferedCNS[] = [];
    let transferedCNsList: {
      transferedCNs: TransferedCNS[];
      totalCount: number;
    };
    for (const cns of data.results) {
      transferedCNs.push({
        creditNoteType: cns.creditNoteType,
        amount: cns.amount,
        ghsDiscount: cns.ghsDiscount,
        ghsDocNo: cns.ghsDocNo,
        fiscalYear: cns.fiscalYear,
        customerName: cns.customerName,
        customerId: cns.customerId,
        mobileNumber: cns.mobileNumber,
        ulpId: cns.ulpId,
        status: cns.status,
        docNo: cns.cnDocNo
      });
    }
    transferedCNsList = {
      transferedCNs: transferedCNs,
      totalCount: data.totalElements
    };
    return transferedCNsList;
  }

  static transferToEGHS(data: any): TransferToEghs {
    let transferToEHS: TransferToEghs;
    transferToEHS = {
      balanceAmtCnDocNo: data?.balanceAmtCnDocNo,
      amount: data?.amount,
      cashCollected: data?.cashCollected,
      docNo: data?.docNo,
      id: data?.id
    };
    return transferToEHS;
  }

  static getCnRefundAmountDetails(data: any): CnRefundAmountDetails {
    let cnRefundAmountDetails: CnRefundAmountDetails;

    let allowedPaymentModes: SelectDropDownOption[] = [];
    if (data?.paymentModeList && data.paymentModeList.length > 0) {
      data.paymentModeList.forEach(paymentMode => {
        allowedPaymentModes.push({
          value: paymentMode,
          description: paymentMode
        });
      });
    }

    cnRefundAmountDetails = {
      amount: data.amount,
      deductionPercentage: data.deductionPercentage,
      fullAdvCNPaymentMode: data.fullAdvCNPaymentMode,
      netRefundAmount: data.netRefundAmount,
      refundPaymentMode: data?.paymentCode,
      allowedRefundPaymentModes: allowedPaymentModes,
      refundDeductionAmount: data.refundDeductionAmount,
      totalTax: data.totalTax,
      utilisedAmount: data.utilisedAmount,
      acquiredBank: data?.acquiredBank
    };
    return cnRefundAmountDetails;
  }
}
