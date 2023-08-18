import {
  CancellableCashMemoData,
  CashMemoMinimalDetail,
  CpgGroupDescription,
  GcCashMemoCancelResponse,
  GetAddedGiftCardItemResponse,
  GetCreatedGiftCardCmDetails,
  GetDeletedGiftCardItemResponse,
  GetGiftCardItemResponse,
  GetPartiallyUpdatedGcCmResponse,
  GetUpdatedGcCashMemoResponse,
  GiftCardsHistoryListItems,
  GiftCardsHistoryListItemsResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class GiftCardsAdaptor {
  static getCpgGroupDescription(data: any): CpgGroupDescription {
    if (!data) {
      return null;
    }
    return {
      cpgGroupDescription: data.paymentCategoryName
    };
  }

  static getCreatedGiftCardCmDetails(data: any): GetCreatedGiftCardCmDetails {
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      status: data.status,
      docNo: data.docNo
    };
  }

  static getPartiallyUpdatedGiftCardCm(
    data: any
  ): GetPartiallyUpdatedGcCmResponse {
    if (!data) {
      return null;
    }
    return {
      customerId: data.customerId,
      paidValue: data.paidValue,
      id: data.id,
      status: data.status,
      docNo: data.docNo,
      docDate: data.docDate,
      employeeCode: data.employeeCode,
      txnType: data.txnType,
      subTxnType: data.subTxnType
    };
  }

  static getAddedGiftCardItemResponse(data: any): GetAddedGiftCardItemResponse {
    if (!data) {
      return null;
    }
    return {
      customerId: data.customerId,
      totalQuantity: data.totalQuantity,
      totalWeight: data.totalWeight,
      totalValue: data.totalValue,
      totalTax: data.totalTax,
      finalValue: data.finalValue,
      totalDiscount: data.totalDiscount,
      paidValue: data.paidValue,
      id: data.id,
      status: data.status,
      docNo: data.docNo,
      docDate: data.docDate,
      employeeCode: data.employeeCode,
      txnType: data.txnType,
      subTxnType: data.subTxnType,
      giftDetailsDto: {
        itemId: data.giftDetailsDto.itemId,
        instrumentNo: data.giftDetailsDto.instrumentNo,
        vendorCode: data.giftDetailsDto.vendorCode,
        binCode: data.giftDetailsDto.binCode,
        giftType: data.giftDetailsDto.giftType,
        rowId: data.giftDetailsDto.rowId,
        totalValue: data.giftDetailsDto.totalValue,
        finalValue: data.giftDetailsDto.finalValue,
        totalTax: data.giftDetailsDto.totalTax
      }
    };
  }

  static getGiftCardItemResponse(data: any): GetGiftCardItemResponse {
    console.log('DATA ## :', data);
    if (!data) {
      return null;
    }
    return {
      binCode: data.binCode,
      finalValue: data.finalValue,
      giftType: data.giftType,
      instrumentNo: data.instrumentNo,
      itemId: data.itemId,
      rowId: data.rowId,
      totalTax: data.totalTax,
      totalValue: data.totalValue,
      vendorCode: data.vendorCode
    };
  }

  static getDeletedGiftCardItemResponse(
    data: any
  ): GetDeletedGiftCardItemResponse {
    if (!data) {
      return null;
    }
    return {
      customerId: data.customerId,
      totalQuantity: data.totalQuantity,
      totalWeight: data.totalWeight,
      totalValue: data.totalValue,
      totalTax: data.totalTax,
      finalValue: data.finalValue,
      totalDiscount: data.totalDiscount,
      paidValue: data.paidValue,
      id: data.id,
      status: data.status,
      docNo: data.docNo,
      docDate: data.docDate,
      employeeCode: data.employeeCode,
      txnType: data.txnType,
      subTxnType: data.subTxnType
    };
  }

  static getUpdatedGcCashMemoResponse(data: any): GetUpdatedGcCashMemoResponse {
    if (!data) {
      return null;
    }
    return {
      customerId: data.customerId,
      docDate: data.docDate,
      docNo: data.docNo,
      employeeCode: data.employeeCode,
      finalValue: data.finalValue,
      id: data.id,
      paidValue: data.paidValue,
      remarks: data.remarks,
      status: data.status,
      subTxnType: data.subTxnType,
      totalDiscount: data.totalDiscount,
      totalQuantity: data.totalQuantity,
      totalTax: data.totalTax,
      totalValue: data.totalValue,
      txnType: data.txnType
    };
  }

  static getCancellableGcCashMemo(data: any): CancellableCashMemoData[] {
    if (!data || (data && !data.results)) {
      return [];
    }
    const resultSet = data.results.map(
      (resultItem: CancellableCashMemoData) => {
        const aging = moment.duration(
          moment().diff(moment(resultItem.refTxnTime))
        );
        return {
          customerName: resultItem.customerName,
          refDocDate: resultItem.refDocDate,
          refDocNo: resultItem.refDocNo,
          refTxnId: resultItem.refTxnId,
          refTxnTime: `${
            aging.hours().toString().length < 2
              ? '0' + aging.hours().toString()
              : aging.hours().toString()
          }:${
            aging.minutes().toString().length < 2
              ? '0' + aging.minutes().toString()
              : aging.minutes().toString()
          }`,
          subTxnType: resultItem.subTxnType
        };
      }
    );
    return resultSet;
  }

  static getGcCashMemoMinimalData(data: any): CashMemoMinimalDetail {
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      itemIdList: data.itemIdList,
      customerId: data.customerId,
      totalQuantity: data.totalQuantity,
      totalTax: data.totalTax,
      totalValue: data.totalValue,
      confirmedTime: data.confirmedTime,
      docNo: data.docNo,
      employeeCode: data.employeeCode,
      docDate: data.docDate ? Number(data.docDate) : null,
      status: data.status ? data.status : null,
      remarks: data.remarks ? data.remarks : null,
      panCardNumber: data?.custTaxNo,
      oldPanCardNumber: data?.custTaxNoOld
    };
  }

  static getGcCashMemoCancelResponse(data: any): GcCashMemoCancelResponse {
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      docNo: data.docNo,
      cndocNos: data.cndocNos
    };
  }

  static giftCardsHistoryListItems(
    data: any
  ): GiftCardsHistoryListItemsResponse {
    const giftCardsHistoryListItems: GiftCardsHistoryListItems[] = [];
    for (const gcHistoryItem of data.results) {
      giftCardsHistoryListItems.push({
        docNo: gcHistoryItem.docNo,
        fiscalYear: gcHistoryItem.fiscalYear,
        docDate: moment(gcHistoryItem.docDate),
        createdDate: moment(gcHistoryItem.createdDate),
        customerName: gcHistoryItem.customerName,
        totalQuantity: gcHistoryItem.totalQuantity,
        netAmount: gcHistoryItem.netAmount,
        status: gcHistoryItem.status,
        id: gcHistoryItem.id
      });
    }
    return {
      giftCardsHistoryListItems: giftCardsHistoryListItems,
      totalElements: data.totalElements
    };
  }
}
