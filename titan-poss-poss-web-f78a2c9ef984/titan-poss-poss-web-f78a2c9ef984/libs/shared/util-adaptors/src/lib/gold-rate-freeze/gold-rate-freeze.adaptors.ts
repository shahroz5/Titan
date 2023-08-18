import {
  CreditNote,
  InitiateAdvanceResponse,
  InitiateGrfResponse,
  UpdateAdvanceTransactionResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class CtGrfAdaptor {
  static getInitiateAdvanceResponse(
    data: InitiateGrfResponse
  ): InitiateGrfResponse {
    if (!data) {
      return null;
    }
    return {
      docNo: data.docNo,
      id: data.id,
      status: data.status,
      subTxnType: data.subTxnType,
      txnType: data.txnType,
      manualBillDetails: data.manualBillDetails
    };
  }

  static getUpdateAdvanceTransactionResponse(
    data: UpdateAdvanceTransactionResponse
  ): UpdateAdvanceTransactionResponse {
    if (!data) {
      return null;
    }
    return {
      cndocNos: data.cndocNos,
      docNo: data.docNo,
      id: data.id
    };
  }

  static getCreditNoteDetails(data: any): CreditNote {
    let creditNoteDetails: CreditNote;

    creditNoteDetails = {
      amount: data.amount,
      creditNoteType: data.creditNoteType,
      customerId: data.customerId,
      customerName: data.customerName,
      docDate: moment(data.docDate),
      docNo: data.docNo,
      fiscalYear: data.fiscalYear,
      ratePerUnit: data?.frozenRateDetails?.data?.ratePerUnit,
      weight: data?.frozenRateDetails?.data?.weight,
      id: data.id,
      linkedTxnId: data.linkedTxnId,
      linkedTxnType: data.linkedTxnType,
      locationCode: data.locationCode,
      mobileNumber: data.mobileNumber,
      status: data.status,
      utilisedAmount: data.utilisedAmount,
      workflowStatus: data.workflowStatus,
      cashCollected: data.cashCollected ? data.cashCollected : 0
    };

    return creditNoteDetails;
  }
}
