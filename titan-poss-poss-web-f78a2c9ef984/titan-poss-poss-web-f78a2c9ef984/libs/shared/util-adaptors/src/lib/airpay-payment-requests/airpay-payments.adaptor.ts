import {
  PaymentRequestDetails,
  CustomerPayload
} from '@poss-web/shared/models';

export class AirpayPaymentAdaptor {
  static paymentDetails(payment: any): PaymentRequestDetails {
    return {
      amount: payment.amount,
      approvedBy: payment.approvedBy,
      approvedDate: payment.approvedDate,
      approvedReason: payment.approvedReason,
      customerId: payment.customerId,
      id: payment.id,
      locationCode: payment.locationCode,
      otherDetails: payment.otherDetails
        ? {
            type: payment.otherDetails.type,
            data: payment.otherDetails.data
              ? {
                  customerName: payment.otherDetails.data.customerName,
                  customerTitle: payment.otherDetails.data.customerTitle,
                  customerMobileNumber:
                    payment.otherDetails.data.customerMobileNumber,
                  referenceId: payment.otherDetails.data.referenceId,
                  // ulpId: payment.OtherDetails.data.ulpId
                  creditNoteDocNo: payment?.otherDetails?.data?.creditNoteDocNo
                    ? payment?.otherDetails?.data?.creditNoteDocNo
                    : null,
                  creditNoteFiscalYear: payment?.otherDetails?.data
                    ?.creditNoteFiscalYear
                    ? payment?.otherDetails?.data?.creditNoteFiscalYear
                    : null,
                  creditNoteId: payment?.otherDetails?.data?.creditNoteId
                    ? payment?.otherDetails?.data?.creditNoteId
                    : null,
                  errorMessage: payment?.otherDetails?.data?.errorMessage
                    ? payment?.otherDetails?.data?.errorMessage
                    : ''
                }
              : null
          }
        : null,
      paymentCode: payment.paymentCode,
      referenceId: payment.referenceId,
      requestedBy: payment.requestedBy,
      requestedDate: payment.requestedDate,
      requestedReason: payment.requestedReason,
      status: payment.status,
      utilizedAmount: payment.utilizedAmount,
      customerName: payment.otherDetails
        ? payment.otherDetails.data
          ? payment.otherDetails.data.customerName
          : null
        : null,
      customerMobileNo: payment.otherDetails
        ? payment.otherDetails.data
          ? payment.otherDetails.data.customerMobileNumber
          : null
        : null,
      customerTitle: payment.otherDetails
        ? payment.otherDetails.data
          ? payment.otherDetails.data.customerTitle
          : null
        : null,
      ulpId: payment.otherDetails
        ? payment.otherDetails.data
          ? payment.otherDetails.data.ulpId
          : null
        : null,
      isVerifying: false
    };
  }

  static fromJson(data: any): CustomerPayload {
    return {
      currentTier: data.currentTier,
      custTaxNo: data.custTaxNo,
      customerId: data.customerId,
      ulpId: data.ulpId,
      mobileNumber: data.mobileNumber,
      title: data.title,
      customerName: data.customerName,
      isPulseCustomer: data.isPulseCustomer,
      customerType: data.customerType,
      instiTaxNo: data.instiTaxNo,
      isMemberBlocked: data.isMemberBlocked,
      passportId: data.passportId,
      customerDetails: data.customerDetails
        ? {
            type: data.customerDetails.type,
            data: data.customerDetails.data
          }
        : null
    };
  }
}
