import {
  PaymentModeEnum,
  PaymentDetails,
  UniPayResponse,
  QCGCCardDetails,
  PaymentGroupEnum,
  OtherDetailsForUnipay,
  UnipayTransationUrlEnum,
  PaymentRequest,
  GHSeVoucherDetails,
  CNListResponsePayload,
  GVStatusUpdateList,
  GvStatusList,
  GHSAccountDetails,
  GHSAttachments,
  DigiPriceDetails,
  DigiGoldDetails,
  CashLimitDetails,
  MaxCashAmountDetails,
  CashBackBankDetail,
  CashBackConfigDetail,
  DiscountTypeEnum
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class PaymentAdaptor {
  static getROPaymentRequest(data: any): PaymentRequest {
    if (data === null) {
      return null;
    }

    return {
      customerId: data.customerId,
      paymentCode: data.paymentCode,
      amount: data.amount,
      requestedReason: data.requestedReason,
      approvedBy: data.approvedBy,
      referenceId: data.referenceId,
      id: data.id,
      status: data.status,
      utilizedAmount: data.utilizedAmount,
      locationCode: data.locationCode,
      requestedBy: data.requestedBy,
      requestedDate: data.requestedDate ? moment(data.requestedDate) : null,
      approvedDate: data?.otherDetails?.data?.approvedTime
        ? moment(data?.otherDetails?.data?.approvedTime)
        : null,
      approvedReason: data.approvedReason,
      otherDetails: data.otherDetails
        ? {
            type: data.type,
            data: data.otherDetails.data
              ? {
                  customerName: data.customerName,
                  customerTitle: data.customerTitle,
                  customerMobileNumber: data.customerMobileNumber,
                  referenceId: data.referenceId,
                  approvedTime: data?.otherDetails?.data?.approvedTime
                    ? moment(data?.otherDetails?.data?.approvedTime).format(
                        'hh:mm A'
                      )
                    : null
                }
              : null
          }
        : null
    };
  }

  //  static getDefaultPaymentDetails(data: any): PaymentDetails {

  //   if (!data) {
  //     return null;
  //   }
  //   const paymentGroup = data.paymentGroup;
  //   let paymentMode;
  //   if (paymentGroup === PaymentGroupEnum.WALLET) {
  //     paymentMode = PaymentModeEnum.WALLET;
  //   } else if (paymentGroup === PaymentGroupEnum.BANK_LOAN) {
  //     paymentMode = PaymentModeEnum.BANK_LOAN;
  //   } else {
  //     paymentMode = data.paymentCode;
  //   }
  //   return {
  //     amount: data.amount,
  //     id: (data.id as string).toLowerCase(),
  //     paymentCode: paymentMode,
  //     paymentGroup: paymentGroup,
  //     instrumentDate: data.instrumentDate ? moment(data.instrumentDate) : null,
  //     instrumentNo: data.instrumentNo,
  //     instrumentType: data.instrumentType,
  //     // Line item number : use it for sort
  //     lineItemNo: data.lineItemNo ? data.lineItemNo : null,
  //     otherDetails: data.otherDetails
  //       ? {
  //           data: data.otherDetails.data,
  //           type: data.otherDetails.type
  //         }
  //       : null,
  //     bankName: data.payeeBankName,
  //     payeeBankName: data.payeeBankName,
  //     payerBankBranch: data.payerBankBranch,
  //     payerBankName: data.payerBankName,
  //     reference1: data.reference1,
  //     reference2: data.reference2,
  //     reference3: data.reference3,
  //     remarks: data.remarks,
  //     status: data.status
  //   };
  // }

  static getDefaultPaymentDetails(data: any): PaymentDetails {
    if (!data) {
      return null;
    }
    const paymentGroup = data.paymentGroup;
    let paymentMode;
    if (paymentGroup === PaymentGroupEnum.WALLET) {
      paymentMode = PaymentModeEnum.WALLET;
    } else if (paymentGroup === PaymentGroupEnum.BANK_LOAN) {
      paymentMode = PaymentModeEnum.BANK_LOAN;
    } else {
      paymentMode = data.paymentCode;
    }

    return {
      amount: data.amount,
      id: (data.id as string).toLowerCase(),
      paymentCode: paymentMode,
      paymentGroup: paymentGroup,
      instrumentDate:
        paymentMode === PaymentModeEnum.CASH
          ? data.paymentDate
            ? moment(data.paymentDate)
            : null
          : data.instrumentDate
          ? moment(data.instrumentDate)
          : null,
      instrumentNo: data.instrumentNo,
      instrumentType: data.instrumentType,
      creditNoteId: data?.creditNoteId,
      // Line item number : use it for sort
      lineItemNo: data.lineItemNo ? data.lineItemNo : null,
      otherDetails: data.otherDetails
        ? {
            data: data.otherDetails.data,
            type: data.otherDetails.type
          }
        : null,
      bankName: data.bankName,
      bankBranch: data.bankBranch,
      reference1: data.reference1,
      reference2: data.reference2,
      reference3: data.reference3,
      remarks: data.remarks,
      status: data.status,
      isEditable: data.isEditable,
      //credit notes invoked via AB should not be deleted
      isDeletable: data.isEditable
        ? data.otherDetails?.data?.isLinkedCn
          ? false
          : true
        : false,
      cashCollected: data.cashCollected,
      isTcsPayment: data.isTcsPayment,
      refundAmount: data.refundAmount ? data.refundAmount : 0,
      hostName: data.hostName,
      paymentDate: data.paymentDate ? moment(data.paymentDate) : null,
      isVoid: data.isVoid
    };
  }

  static getLinkedCNPaymentDetails(data: any): PaymentDetails {
    if (!data) {
      return null;
    }

    return {
      id: (data.transactionId as string).toLowerCase(),
      status: data.paymentStatus,
      paymentCode: PaymentModeEnum.LINKED_CN
    };
  }

  static getHostConfiguration(data: any): boolean {
    if (!data) {
      return false;
    }

    if (data.results.indexOf('UNIPAY') > -1) {
      return true;
    } else {
      return false;
    }
  }

  static getUniPayResponseDetails(data: any): UniPayResponse {
    if (!data) {
      return null;
    }
    return {
      Acquirer_Bank: data.Acquirer_Bank,
      Amount: data.Amount,
      ApprovalCode: data.ApprovalCode,
      BankInvoice_Num: data.BankInvoice_Num,
      Batch_Number: data.Batch_Number,
      CardHolder_Name: data.CardHolder_Name,
      Card_Num: data.Card_Num,
      Card_Type: data.Card_Type,
      Merchant_Id: data.Merchant_Id,
      RRN_No: data.RRN_No,
      Request_Input: data.Request_Input,
      ResponseCode: data.ResponseCode,
      ResponseMessage: data.ResponseMessage,
      Terminal_Id: data.Terminal_Id,
      Txn_Date: data.Txn_Date,
      Txn_Type: data.Txn_Type,
      utid: data.utid,
      errorCode: data.errorCode,
      errorMsg: data.errorMsg
    };
  }

  static cashBackConfigDetailJson(data): CashBackConfigDetail {
    if (!data) {
      return null;
    }

    return {
      maxCashbackOfferAmt: data?.maxDiscountAmtAllowed,
      minCashBackOfferAmt: data?.minDiscountAmt,
      maxSwipeAmt: data?.maxSwipeAmt,
      minSwipeAmt: data?.minSwipeAmt,
      minInvoiceAmnt: data?.minInvoiceAmt,
      offerStartDate: data?.offerStartDate,
      offerEndDate: data?.offerEndDate
    };
  }

  static getCashbackBankDetailJson(data): CashBackBankDetail[] {
    if (!data) {
      return null;
    }
    const cashBackBankDetails: CashBackBankDetail[] = [];
    for (const detail of data.results) {
      cashBackBankDetails.push({
        description: detail?.bankName,
        cardNoLength: detail?.cardNoLength,
        cashbackName: detail?.cashbackName,
        cmRemarks: detail?.cmRemarks,
        endDate: detail?.endDate,
        excludeCashback: detail?.excludeCashback,
        firstCardDigits: detail?.firstCardDigits,
        value: detail?.id,
        isActive: detail?.isActive,
        isCashbackAmount: detail?.isCashbackAmount,
        lastCardDigits: detail?.lastCardDigits,
        maxUsageCount: detail?.maxUsageCount,
        mobileFlag: detail?.mobileFlag,
        offerRemarks: detail?.offerRemarks,
        startDate: detail?.startDate
      });
    }
    return cashBackBankDetails;
  }
  static getQCGCCardBalanceDetails(data): QCGCCardDetails {
    if (!data) {
      return null;
    }
    return {
      amount: Number(data[0].amount).toFixed(2),
      cardExpiryDate: data[0].cardExpiryDate,
      cardNumber: data[0].cardNumber,
      cardType: data[0].cardType,
      cardName: data[0].cardName,
      responseCode: data[0].responseCode,
      responseMessage: data[0].responseMessage,
      transactionId: data[0].transactionId,
      productGroup: data[1].productGroupCode,
      paymentCategoryName: data[1].paymentCategoryName,
      partialRedemption:
        data[1].redemptionType.toUpperCase() === 'PARTIAL' ? true : false
    };
  }

  static getCashLimtCheckDetails(data): CashLimitDetails {
    if (!data) {
      return null;
    }
    return {
      amountDue: data.amountDue,
      eligibleAmount:
        data.eligibleAmount <= data.pmlaEligibleAmount
          ? data.eligibleAmount
          : data.pmlaEligibleAmount,
      pmlaEligibleAmount: data.pmlaEligibleAmount,
      totalAmount: data.totalAmount,
      amountCheck: data.eligibleAmount <= data.pmlaEligibleAmount ? true : false
    };
  }

  static getMaxCashAmountDetails(data): MaxCashAmountDetails {
    if (!data) {
      return null;
    }

    return {
      cashAmountMaxCap: data.cashAmountMaxCap,
      pmlaCashAmountMaxCap: data?.pmlaSettings?.cashAmountMaxCap
    };
  }

  static getGHSeVoucherBalanceDetails(data): GHSeVoucherDetails {
    if (!data) {
      return null;
    }
    return {
      firstName: data[0].firstName,
      phone: data[0].phone,
      cardBalance: Number(data[0].cardBalance).toFixed(2),
      cardExpiryDate: data[0].cardExpiryDate,
      cardNumber: data[0].cardNumber,
      cardStatus: data[0].cardStatus,
      cardProgramGroupName: data[0].cardProgramGroupName,
      responseCode: data[0].responseCode,
      responseMessage: data[0].responseMessage,
      productGroup: data[1].productGroupCode,
      paymentCategoryName: data[1].paymentCategoryName,
      partialRedemption:
        data[1].redemptionType.toUpperCase() === 'PARTIAL' ? true : false
    };
  }

  static GVBalanceDetails(data: any): GVStatusUpdateList {
    const gvStatusList: GvStatusList[] = [];

    if (!data) {
      return null;
    }

    data.results.forEach(element => {
      gvStatusList.push({
        activationDate: element.activationDate,
        denomination: element.denomination,
        newlyAdded:
          moment().diff(moment(element.lastModifiedDate), 'seconds') < 60
            ? true
            : false,

        excludes: element.excludes ? element.excludes : [],
        extendCount: element.extendCount,
        giftCode: element.giftCode,
        giftDetails: element.giftDetails,
        indentNo: element.indentNo,
        mfgDate: element.mfgDate,
        quantity: element.quantity,
        regionCode: element.regionCode,
        remarks: element.remarks,
        serialNo: element.serialNo,
        status: element.status,
        totalValue: element.totalValue,
        validFrom: element.validFrom ? moment(element.validFrom) : null,
        validTill: element.validTill ? moment(element.validTill) : null,
        validityDays: element.validityDays,
        locationCode: element.locationCode
      });
    });
    //  isActive:{ checked: element.isActive, text: element.isActive?'Active':'In-Active'},
    return { gvStatusList: gvStatusList, count: data.totalElements };
  }
  static getEncryptedHostname(data: any) {
    if (!data) {
      return null;
    }

    return {
      hostName: data.encryptedData
    };
  }

  static getUnipayResponse(
    data: any,
    paymentId?: string
  ): OtherDetailsForUnipay {
    if (!data) {
      return null;
    }

    console.log('getUnipayResponse in adaptor', data);

    const response: UniPayResponse = {
      Request_Input: data.Request_Input,
      ResponseCode: Number(data.ResponseCode),
      ResponseMessage: data.ResponseMessage,
      ApprovalCode: data.ApprovalCode,
      RRN_No: data.RRN_No,
      Amount: String(Number(data.Amount) / 100),
      Card_Num: data.Card_Num,
      Card_Type: data.Card_Type,
      CardHolder_Name: data.CardHolder_Name,
      Acquirer_Bank: data.Acquirer_Bank,
      Txn_Date: data.Txn_Date,
      Txn_Type: data.Txn_Type,
      BankInvoice_Num: data.BankInvoice_Num,
      Batch_Number: data.Batch_Number,
      Terminal_Id: data.Terminal_Id,
      Merchant_Id: data.Merchant_Id,
      utid: data.utid,
      errorMsg: data.errorMsg,
      errorCode: data.errorCode,
      paymentId: paymentId ? paymentId : null
    };

    return {
      request: data.Request_Input,
      response: response,
      cardNumber: data.Card_Num,
      httpStatus: 200,
      transactionStatus: true,
      url: UnipayTransationUrlEnum.URL,
      referenceNumber: data.RRN_No
    };
  }

  static getDigiBalanceResponse(data: any): DigiGoldDetails {
    if (!data) {
      return null;
    }

    let response: DigiGoldDetails = {
      mobileNo: data.mobileNo,
      nonTanishqGoldBalanceInGrams: data.nonTanishqGoldBalanceInGrams,
      referenceId: data.referenceId,
      tanishqGoldBalanceInGrams: data.tanishqGoldBalanceInGrams
    };

    return response;
  }

  static getDigiPriceResponse(data: any): DigiPriceDetails {
    if (!data) {
      return null;
    }

    let response: DigiPriceDetails = {
      mobileNo: data.mobileNo,
      sellingPrice: data.sellingPrice
    };

    return response;
  }

  static getCnListResponse(data: any, priority: any): CNListResponsePayload {
    if (!data) {
      return null;
    }
    return {
      amount: Number(data.amount.toFixed(2)),
      creditNoteType: data.creditNoteType,
      customerName: data.customerName,
      fiscalYear: data.fiscalYear,
      id: data.id,
      mobileNumber: data.mobileNumber,
      status: data.status,
      locationCode: data.locationCode,
      linkedTxnType: data.linkedTxnType,
      linkedTxnId: data.linkedTxnId,
      docNo: data.docNo,
      priority: priority,
      docDate: data.docDate ? moment(data.docDate) : null,
      isAdded: false,
      eghsDetails: data.eghsDetails,
      frozenRateDetails: data.frozenRateDetails,
      cashCollected: data.cashCollected ? data.cashCollected : 0,
      totalDiscount: data.discountDetails
        ? this.getTotalDiscount(data.discountDetails)
        : 0,
      rivaahGhsDiscountDetails:
        data?.discountDetails?.data?.ghsAccountDiscount &&
        data?.discountDetails?.data?.ghsAccountDiscount?.discountType ===
          DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
          ? data?.discountDetails?.data?.ghsAccountDiscount
          : null
    };
  }

  static getGHSAccountDetails(data): GHSAccountDetails {
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      customerId: data.customerId,
      accountCustomerId: data.accountCustomerId,
      passbookNo: data.passbookNo,
      enrolledLocationCode: data.enrolledLocationCode,
      scheme: data.scheme,
      discount: data.discount,
      totalGhsAdvance: data.totalGhsAdvance,
      noOfInstallmentPaid: data.noOfInstallmentPaid,
      goldRate: data.goldRate,
      accumulatedGoldWeight: data.accumulatedGoldWeight,
      enrolledDate: moment(data.enrolledDate),
      maturityDate: moment(data.maturityDate),
      fiscalYear: data.fiscalYear,
      isRedeemable: data.isRedeemable,
      maturityLocationCode: data.maturityLocationCode,
      minUtilizationPct: data.minUtilizationPct,
      isProofsAvailable: data.isProofsAvailable,
      schemeCode: data.schemeCode,
      balance: data.balance,
      mobileNo: data.mobileNo,
      discountMcPct: data.discountMcPct,
      discountUcpPct: data.discountUcpPct
    };
  }
  static getGHSAttachments(data): GHSAttachments[] {
    if (!data) {
      return null;
    }
    const attachments: GHSAttachments[] = [];
    for (const detail of data.results) {
      attachments.push({
        docName: detail.docName,
        docUrl: detail.docUrl
      });
    }
    return attachments;
  }

  static getTotalDiscount(data) {
    if (!data) {
      return 0;
    }
    let totalDicountValue = 0;
    if (data.data) {
      for (const eachDiscountKey in data.data) {
        if (
          eachDiscountKey === 'ghsAccountDiscount' ||
          eachDiscountKey === 'digiGoldDiscount' ||
          eachDiscountKey === 'systemDiscountDv' ||
          eachDiscountKey === 'grnMultipleDiscount'
        ) {
          if (data.data[eachDiscountKey]?.discountValue) {
            totalDicountValue =
              totalDicountValue + data.data[eachDiscountKey].discountValue;
          }
        } else if (
          data.data[eachDiscountKey] &&
          eachDiscountKey === 'karatageExchangeDiscount'
        ) {
          for (const discount of data.data[eachDiscountKey]) {
            if (discount.oneKTDiscountValue) {
              totalDicountValue =
                totalDicountValue + discount?.oneKTDiscountValue;
            }
            if (discount.twoKTDiscountValue) {
              totalDicountValue =
                totalDicountValue + discount?.twoKTDiscountValue;
            }
          }
        } else if (data.data[eachDiscountKey]) {
          for (const discount of data.data[eachDiscountKey]) {
            if (discount.discountValue) {
              totalDicountValue = totalDicountValue + discount?.discountValue;
            }
          }
        }
      }
    }
    return Number(totalDicountValue.toFixed(2));
  }
}
