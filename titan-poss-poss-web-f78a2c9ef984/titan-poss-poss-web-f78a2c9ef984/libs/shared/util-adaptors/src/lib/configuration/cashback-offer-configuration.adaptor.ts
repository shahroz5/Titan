import {
  BankDetailsPayload,
  CashbackOfferList,
  CashbackOffer,
  PayerBankList,
  OfferDetails,
  ProductGroupMappingOption,
  CardDetails,
  CardDetailsResponse,
  CardDetailsUploadResponse
} from '@poss-web/shared/models';

import * as moment from 'moment';

export class CashbackOfferConfigurationAdaptor {
  static getPayerBankList(data: any) {
    const payerBankList: PayerBankList[] = [];
    for (const p of data.results) {
      payerBankList.push({
        id: p.bankName,
        name: p.bankName
      });
    }

    return payerBankList;
  }
  static getCashBackOfferList(data: any) {
    let cashbackOfferList: CashbackOfferList;
    const cashbackOffer: CashbackOffer[] = [];
    for (const d of data.results) {
      cashbackOffer.push({
        id: d.id,
        cardBankName: d.bankName,
        cashBackName: d.cashbackName,
        isActive: d.isActive
      });
    }

    cashbackOfferList = {
      cashbackOfferList: cashbackOffer,
      totalElements: data.totalElements
    };
    return cashbackOfferList;
  }
  static getBankDetails(data: any) {
    console.log(data);
    let bankDetails: BankDetailsPayload;
    let digitsTobeValidated: string;
    let fromFirst = true;
    if (data && data.firstCardDigits) {
      digitsTobeValidated = data.firstCardDigits;
      fromFirst = true;
    } else if (data && data.lastCardDigits) {
      digitsTobeValidated = data.lastCardDigits;
      fromFirst = false;
    }
    if (data) {
      bankDetails = {
        bankName: data?.bankName,
        cashbackName: data?.cashbackName,
        cardNoLength: data?.cardNoLength,
        cmRemarks: data?.cmRemarks,
        endDate: moment(data?.endDate).toISOString(),
        startDate: moment(data?.startDate).toISOString(),
        excludeCashback: data?.excludeCashback,
        digitsTobeValidated: digitsTobeValidated,
        fromFirst: fromFirst,
        id: data?.id,
        isActive: data?.isActive,
        maxUsageCount: data?.maxUsageCount,
        mobileFlag: data?.mobileFlag,
        offerRemarks: data?.offerRemarks,
        isCashAmount: data?.isCashbackAmount
      };
    } else {
      bankDetails = {
        bankName: '',
        cashbackName: '',
        cardNoLength: '',
        cmRemarks: '',
        endDate: '',
        excludeCashback: true,
        fromFirst: true,
        digitsTobeValidated: '',
        id: 'new',
        isActive: true,
        maxUsageCount: '',
        mobileFlag: true,
        offerRemarks: '',
        startDate: '',
        isCashAmount: true
      };
    }

    return bankDetails;
  }

  static getOfferDetails(data: any) {
    let i = 0;
    const offerDetails: OfferDetails[] = [];
    for (const o of data.results) {
      offerDetails.push({
        discountAmt: o.discountAmt,
        discountPercent: o.discountPercent,
        maxDiscountPercent: o.maxDiscountAmt,
        maxInvoiceAmt: o.maxInvoiceAmt,
        maxSwipeAmt: o.maxSwipeAmt,
        minInvoiceAmt: o.minInvoiceAmt,
        minSwipeAmt: o.minSwipeAmt,
        isCashbackAmount: o.isCashbackAmount,
        excludeCashback: o.excludeCashback,
        id: o.id,
        rowId: ++i
      });
    }
    return offerDetails;
  }
  static getMappedProductGroup(data: any) {
    const selectedProductGroups: ProductGroupMappingOption[] = [];
    for (const p of data.results) {
      selectedProductGroups.push({
        uuid: p.id,
        id: p.productGroupCode,
        description: p.productGroupCode
      });
    }
    return selectedProductGroups;
  }

  static getFileUploadResponse(data: any) {
    let fileResponse: CardDetailsUploadResponse;
    fileResponse = {
      fileProcessId: data.fileId,
      hasError: data.fileValidationError,
      message: data.message,
      records: {
        errorLogId: data.fileId,
        failureCount: data?.records?.failureCount,
        successCount: data?.records?.successCount,
        totalCount: data?.records?.totalCount
      }
    };
    return fileResponse;
  }

  static getCardDetails(data: any) {
    let cardDetailsResponse: CardDetailsResponse;
    const cardDetails: CardDetails[] = [];
    for (const c of data.results) {
      cardDetails.push({
        cardNo: c.cardNo,
        id: c.id,
        isActive: c.isActive,
        newlyAdded:
          moment().diff(moment(c.createdDate), 'seconds') < 60 ? true : false
      });
    }
    cardDetailsResponse = {
      cardDetails: cardDetails,
      totalElements: data.totalElements
    };
    return cardDetailsResponse;
  }
}
