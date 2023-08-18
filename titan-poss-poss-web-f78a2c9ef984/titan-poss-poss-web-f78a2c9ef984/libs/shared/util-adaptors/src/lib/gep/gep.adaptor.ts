import { GEPProductDetails, CancelGepItem, GEPList } from '@poss-web/shared/models';
import * as moment from 'moment';

export class GepAdaptor {

  static gepfromJson(item: any): GEPProductDetails {
    let totalTax = 0;
    console.log(item);
    for (let i = 0; i < item.itemDetails.taxDetails.data.length; i++) {
      totalTax = totalTax + item.itemDetails.taxDetails.data[i].taxValue;
    }

    return {
      id: (item.itemDetails.itemId as String).toUpperCase(),

      itemType: item.itemDetails.itemType,
      metalDetail: null,
      itemDetail: null,
      metalType: item.itemDetails.metalType,
      rate: item.itemDetails.priceDetails.ratePerUnit,
      weight: item.itemDetails.measuredWeight,
      purity: item.itemDetails.measuredPurity,
      karatage: item.itemDetails.priceDetails.karat,
      totalValue: item.itemDetails.finalValue,
      netValue: item.itemDetails.totalValue,
      melted:
        !item.itemDetails.preMeltingDetails ||
        !item.itemDetails.preMeltingDetails.weight
          ? 'Enter Details'
          : 'Pre-Melting Details',
      deductions: item.itemDetails.priceDetails.deductionValue,
      preMeltingDetails: item.itemDetails.preMeltingDetails,
      totalBreakUp: {
        ...item.itemDetails.priceDetails,
        ...item.itemDetails.taxDetails.data,
        ...{totalTax: item.itemDetails.totalTax},
        ...{totalValue: item.itemDetails.totalValue},
        ...{finalValue: item.itemDetails.finalValue},
      },
      isSave: true,
      totaltax: item.totalTax
    };
  }

  static onHoldfromJson(item: any): GEPProductDetails {
    console.log(item, item.itemId, 'hold');
    let totalTax = 0;
    // item.taxDetails.data.forEach((element, i) => {
    //   console.log(element, i);
    //   console.log(element[i].totalTax);
    //   totalTax = +element[i].taxValue;
    // });
    for (let i = 0; i < item.taxDetails.data.length; i++) {
      console.log(item.taxDetails.data[i].totalTax);
      totalTax = totalTax + item.taxDetails.data[i].taxValue;
    }

    return {
      id: (item.itemId as String).toUpperCase(),

      itemType: item.itemType,
      metalDetail: null,
      itemDetail: null,
      metalType: item.metalType,
      rate: item.priceDetails.ratePerUnit,
      weight: item.measuredWeight,
      purity: item.measuredPurity,
      karatage: item.priceDetails.karat,
      totalValue: item.finalValue,
      netValue: item.totalValue,
      melted:
        !item.preMeltingDetails || !item.preMeltingDetails.weight
          ? 'Enter Details'
          : 'Pre-Melting Details',
      deductions: item.priceDetails.deductionValue,
      preMeltingDetails: item.preMeltingDetails,
      totalBreakUp: {
        ...item.priceDetails,
        ...item.taxDetails.data, 
        ...{totalTax: item.totalTax},
        ...{totalValue: item.totalValue},
        ...{finalValue: item.finalValue},
      },
      isSave: true,
      totaltax: 0
    };
  }

  static CancelfromJson(item: any): CancelGepItem {
    console.log(item, 'adaptor');
    return {
      customerName: item.customerName,
      refDocDate: moment(item.refDocDate),
      refDocNo: item.refDocNo,
      refTxnId: item.refTxnId,
      refTxnTime: moment(item.refTxnTime),
      subTxnType: item.subTxnType,
      totalValue: item.totalValue,
      date: item.refDocDate
    };
  }

  static GEPSearchList(data: any): GEPList {
    if (!data) {
      return null;
    }
    return {
      docNo: data.docNo,
      fiscalYear: data.fiscalYear,
      cnDocNo: data.cnDocNo,
      docDate: data.docDate,
      customerName: data.customerName,
      netAmount: data.netAmount,
      status: data.status,
      createdBy: data.createdBy,
      createdDate: data.createdDate,
      txnId: data.txnId,
      txnType: data.txnType,
      subTxnType: data.goodsType
    };
  }

  static GEPHistoryList(data: any): GEPList {
    if (!data) {
      return null;
    }
    return {
      docNo: data.docNo,
      fiscalYear: data.fiscalYear,
      cnDocNo: data.cnDocNo,
      docDate: data.docDate,
      customerName: data.customerName,
      netAmount: data.netAmount,
      status: data.status,
      createdBy: data.createdBy,
      createdDate: data.createdDate,
      txnId: data.txnId ? data.txnId : null,
      txnType: data.txnType ? data.txnType : null,
      subTxnType: data.goodsType ? data.goodsType : null
    };
  }
}
