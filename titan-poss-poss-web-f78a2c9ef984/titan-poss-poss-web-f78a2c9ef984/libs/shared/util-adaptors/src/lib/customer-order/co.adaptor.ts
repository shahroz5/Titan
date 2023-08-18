import {
  CODetailsResponse,
  COItemDetails,
  COItemDetailsResponse,
  COMOrders,
  CreateCOResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { CashMemoAdaptor } from '../cash-memo/cash-memo.adaptor';

export class COAdaptor {
  /**
   * The function maps the json data to respective model type
   */

  static comOrdersFromJson(order: any): COMOrders {
    if (!order) {
      return null;
    }
    return {
      autostn: order.autostn ? (order.autostn === 'Y' ? true : false) : null,
      cfaCode: order.cfaCode,
      coStatus: order.coStatus,
      comOrderDateTime: order.comOrderDateTime
        ? moment(order.comOrderDateTime)
        : null,
      comOrderNumber: order.comOrderNumber,
      customerName: order.customerName,
      dateOfOccasion: order.dateOfOccasion
        ? moment(order.dateOfOccasion)
        : null,
      deliveryDateTime: order.deliveryDateTime
        ? moment(order.deliveryDateTime)
        : null,
      ecelesteFlag: order.ecelesteFlag,
      goldCharges: order.goldCharges,
      goldRate: order.goldRate,
      grossWeight: order.grossWeight,
      isDummyCode: order.isDummyCode,
      isItemCodeAvailable: order.isItemCodeAvailable,
      isOccassion: order.isOccassion,
      isSizing: order.isSizing,
      itemCode: order.itemCode,
      lotNumber: order.lotNumber,
      makingCharges: order.makingCharges,
      mobileNumber: order.mobileNumber,
      netWeight: order.netWeight,
      orderValue: order.orderValue,
      quantity: order.quantity,
      requestBtq: order.requestBtq,
      requestBy: order.requestBy,
      requestType: order.requestType,
      rsoName: order.rsoName,
      specialOccasion: order.specialOccasion,
      status: order.status,
      stoneCharges: order.stoneCharges,
      stoneWt: order.stoneWt,
      subType: order.subType,
      wtPerUnit: order.wtPerUnit
    };
  }

  static createCOResponseFromJson(data: any): CreateCOResponse {
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      status: data.status,
      docNo: data.docNo,
      txnType: data.txnType,
      subTxnType: data.subTxnType,
      manualBillDetails: data.manualBillDetails
        ? CashMemoAdaptor.getManualBillDetails(
            data.manualBillDetails?.manualBillDetails,
            data.manualBillDetails?.validationType
          )
        : null
    };
  }

  static CODetailsResponseFromJson(data: any): CODetailsResponse {
    if (!data) {
      return null;
    }
    return {
      customerId: data.customerId,
      cancelTxnId: data.cancelTxnId,
      docNo: data.docNo,
      firstHoldTime: data.firstHoldTime,
      fiscalYear: data.fiscalYear,
      id: data.id,
      lastHoldTime: data.lastHoldTime,
      metalRateList: data.metalRateList,
      finalValue: data.finalValue,
      occasion: data.occasion,
      otherChargesList: data.otherCharges,
      paidValue: data.paidValue,
      discountDetails: data.discountTxnDetails,
      focDetails: data.focDetails,
      refTxnId: data.refTxnId ? data.refTxnId : null,
      refTxnType: data.refTxnType,
      refSubTxnType: data.refSubTxnType,
      remarks: data.remarks,
      roundingVariance: data.roundingVariance,
      status: data.status,
      taxDetails: data.taxDetails,
      totalDiscount: data.totalDiscount,
      totalQuantity: data.totalQuantity,
      totalTax: data.totalTax,
      totalValue: data.totalValue,
      totalWeight: data.totalWeight,
      itemIdList: data.itemIdList,
      txnType: data.txnType,
      subTxnType: data.subTxnType,
      isFrozenRate: data.isFrozenRate,
      isFrozenAmount: data.minPaymentDetails?.data?.frozenMinPayment,
      minPaymentDetails: data.minPaymentDetails,
      isBestRate: data.isBestRate,
      manualBillDetails: CashMemoAdaptor.getManualBillDetails(
        data.manualBillDetails?.manualBillDetails,
        data.manualBillDetails?.validationType
      ),
      docDate: data.docDate,
      employeeCode: data.employeeCode,
      txnTime: data.confirmedTime,
      activationDetails: data.activationDetails,
      cancellationDetails: data.cancellationDetails,
      minValue:
        data.minOrderPayment > data.minDiscountPayment
          ? data.minOrderPayment
          : data.minDiscountPayment,
      customerName: data.customerName,
      confirmedTime: data.confirmedTime,
      locationCode: data.locationCode,
      cndocNos: data.cndocNos,
      creditNotes: data.creditNotes,
      orderWeightDetails: data.orderWeightDetails,
      deliveredWeightDetails: data.deliveredWeightDetails,
      totalDeliveredWeight: data.totalDeliveredWeight,
      customerDocDetails: data.customerDocDetails,
      tcsCollectedAmount: data.tcsCollected,
      hallmarkCharges: data.hallmarkCharges,
      hallmarkDiscount: data.hallmarkDiscount,
      tcsToBeCollected: data?.tcsCollected,
      refDocNo: data.refDocNo,
      refFiscalYear: data.refFiscalYear,
      cancelRemarks: data.cancelRemarks,
      bestRateConfigDetails: data.bestRateConfigDetails,
      currencyCode: data.currencyCode,
      discountTxnDetails: data.discountTxnDetails,
      invokeCount: data.invokeCount,
      invokeTime: data.invokeTime,
      lastInvokeTime: data.lastInvokeTime,
      manualBillId: data.manualBillId,
      minDiscountPayment: data.minDiscountPayment,
      minOrderPayment: data.minOrderPayment,
      previousStatus: data.previousStatus,
      rateFrozenDate: data.rateFrozenDate,
      requestType: data.requestType,
      requestedDate: data.requestedDate,
      weightUnit: data.weightUnit,
      nomineeDetails: data.nomineeDetails,
      totalGrossWeight: data.totalGrossWeight,
      totalOrderValue: data.totalOrderValue,
      collectedBy: data.collectedBy
    };
  }

  static COItemDetailsResponseFromJson(data: any): COItemDetailsResponse {
    if (!data) {
      return null;
    }

    return {
      customerId: data.customerId,
      docNo: data.docNo,
      firstHoldTime: data.firstHoldTime,
      fiscalYear: data.fiscalYear,
      id: data.id,
      itemDetails: this.COItemDetailsFromJson(data.itemDetailsDto),
      lastHoldTime: data.lastHoldTime,
      metalRateList: data.metalRateList,
      finalValue: data.finalValue,
      occasion: data.occasion,
      otherChargesList: data.otherCharges,
      paidValue: data.paidValue,
      refTxnId: data.refTxnId ? data.refTxnId : null,
      refTxnType: data.refTxnType,
      refSubTxnType: data.refSubTxnType,
      remarks: data.remarks,
      roundingVariance: data.roundingVariance,
      status: data.status,
      taxDetails: data.taxDetails,
      totalDiscount: data.totalDiscount,
      totalQuantity: data.totalQuantity,
      totalTax: data.totalTax,
      totalValue: data.totalValue,
      totalWeight: data.totalWeight,
      itemId: (data.itemDetailsDto.itemId as string).toUpperCase(),
      txnType: data.txnType,
      subTxnType: data.subTxnType,
      manualBillDetails: CashMemoAdaptor.getManualBillDetails(
        data.manualBillDetails?.manualBillDetails,
        data.validationType
      ),
      discountDetails: data.discountDetails,
      docDate: data.docDate,
      employeeCode: data.employeeCode,
      focdetails: data.focDetails,
      txnTime: data.confirmedTime,
      minValue:
        data.minOrderPayment > data.minDiscountPayment
          ? data.minOrderPayment
          : data.minDiscountPayment,
      orderWeightDetails: data.orderWeightDetails,
      isFrozenRate: data.isFrozenRate,
      isFrozenAmount: data.minPaymentDetails?.data?.frozenMinPayment,
      hallmarkCharges: data.hallmarkCharges,
      hallmarkDiscount: data.hallmarkDiscount,
      totalGrossWeight: data.totalGrossWeight,
      totalOrderValue: data.totalOrderValue
    };
  }

  static COItemDetailsFromJson(data: any): COItemDetails {
    if (!data) {
      return null;
    }
    return {
      employeeCode: data.employeeCode,
      inventoryId: data.inventoryId,
      itemCode: data.itemCode,
      itemId: (data.itemId as string).toUpperCase(),
      lotNumber: data.lotNumber,
      binCode: data.binCode,
      finalValue: data.finalValue,
      remarks: data.remarks,
      totalDiscount: data.totalDiscount,
      totalQuantity: data.totalQuantity,
      totalTax: data.totalTax,
      totalValue: data.totalValue,
      totalWeight: data.totalWeight,
      unitValue: data.unitValue,
      unitWeight: data.inventoryWeight,
      discountDetails: data.discountDetails,
      focDetails: data.focDetails,
      priceDetails: CashMemoAdaptor.priceDetails(data.priceDetails),
      taxDetails: data.taxDetails,
      inventoryWeightDetails: CashMemoAdaptor.getWeightDetails(
        data.inventoryWeightDetails
      ),
      isFoc: data.isFoc,
      measuredWeightDetails: CashMemoAdaptor.getWeightDetails(
        data.measuredWeightDetails
      ),
      productCategoryCode: data.productCategoryCode,
      productGroupCode: data.productGroupCode,
      refTxnId: data.refTxnId ? data.refTxnId : null,
      refTxnType: data.refTxnType,
      refSubTxnType: data.refSubTxnType,
      rowId: data.rowId,
      stdWeight: data.inventoryStdWeight,
      itemInStock: data.itemInStock === false ? false : true,
      reason: data.reason,
      itemDetails: data.itemDetails,
      orderItemId: data.orderItemId,
      hallmarkCharges: data.hallmarkCharges,
      hallmarkDiscount: data.hallmarkDiscount,
      comOrderNumber: data.comOrderNumber,
      deliveryDate: data.deliveryDate ? moment(data.deliveryDate) : null,
      isAutoStn: data.isAutoStn,
      grossWeight: data.grossWeight,
      orderDate: data.orderDate ? moment(data.orderDate) : null,
      requestBtq: data.requestBtq,
      requestType: data.requestType,
      requestedBy: data.requestedBy,
      isCOMOrder: true,
      priceBreakUp: null,
      isAdd: false,
      subType: data.subType,
      wtPerUnit: data.wtPerUnit,
      specialOccasion: data.specialOccasion,
      ecelesteFlag: data.ecelesteFlag,
      isOccassion: data.isOccassion,
      isSizing: data.isSizing,
      dateOfOccasion: data.dateOfOccasion ? moment(data.dateOfOccasion) : null
    };
  }

  static getCOItemDetailsResponseFromJson(
    itemData: any,
    headerData: any
  ): COItemDetailsResponse {
    if (!itemData) {
      return null;
    }

    return {
      customerId: headerData.customerId,
      docNo: headerData.docNo,
      firstHoldTime: headerData.firstHoldTime,
      fiscalYear: headerData.fiscalYear,
      id: headerData.id,
      itemDetails: this.COItemDetailsFromJson(itemData),
      lastHoldTime: headerData.lastHoldTime,
      metalRateList: headerData.metalRateList,
      finalValue: headerData.finalValue,
      occasion: headerData.occasion,
      otherChargesList: headerData.otherCharges,
      paidValue: headerData.paidValue,
      refTxnId: headerData.refTxnId ? headerData.refTxnId : null,
      refTxnType: headerData.refTxnType,
      refSubTxnType: headerData.refSubTxnType,
      remarks: headerData.remarks,
      roundingVariance: headerData.roundingVariance,
      status: headerData.status,
      taxDetails: headerData.taxDetails,
      totalDiscount: headerData.totalDiscount,
      totalQuantity: headerData.totalQuantity,
      totalTax: headerData.totalTax,
      totalValue: headerData.totalValue,
      totalWeight: headerData.totalWeight,
      itemId: (itemData.itemId as string).toUpperCase(),
      txnType: headerData.txnType,
      subTxnType: headerData.subTxnType,
      manualBillDetails: CashMemoAdaptor.getManualBillDetails(
        headerData.manualBillDetails?.manualBillDetails,
        headerData.validationType
      ),
      discountDetails: headerData.discountDetails,
      docDate: headerData.docDate,
      employeeCode: headerData.employeeCode,
      focdetails: headerData.focDetails,
      txnTime: headerData.confirmedTime,
      minValue:
        headerData.minOrderPayment > headerData.minDiscountPayment
          ? headerData.minOrderPayment
          : headerData.minDiscountPayment,
      isFrozenRate: headerData.isFrozenRate,
      isFrozenAmount: headerData.minPaymentDetails?.data?.frozenMinPayment,
      hallmarkCharges: headerData.hallmarkCharges,
      hallmarkDiscount: headerData.hallmarkDiscount,
      totalGrossWeight: headerData.totalGrossWeight,
      totalOrderValue: headerData.totalOrderValue
    };
  }
}
