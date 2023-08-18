import {
  SearchProductList,
  ProductDetails,
  MetalPrices,
  MetalPriceDetails,
  MakingChargeDetails,
  CashMemoItemDetailsResponse,
  StonePriceDetails,
  CashMemoItemDetails,
  ProductPriceDetails,
  PriceDetails,
  CessTax,
  CashMemoTaxDetails,
  CashMemoTaxData,
  CreateCashMemoResponse,
  OtherChargesList,
  OtherCharges,
  OtherChargesData,
  ManualBillDetails,
  InventoryWeightDetails,
  MetalRates,
  CoinDetails,
  AdvanceBookingDetailsResponse,
  CashMemoHistoryResponse,
  CashMemoHistoryDetails,
  TcsList,
  TcsDataResponse,
  ItemHallmarkDetails,
  CNDetailsResponsePayload,
  MaterialDetails
} from '@poss-web/shared/models';
import * as moment from 'moment';

const coinCode = '73';
export class CashMemoAdaptor {
  /**
   * The function maps the json data to respective model type
   */

  static searchProductFromJson(product: any): SearchProductList {
    if (!product) {
      return null;
    }
    return {
      itemCode: product.itemCode,
      totalQuantity: product.totalQuantity,
      productGroupCode: product.productGroupCode
    };
  }
  static searchTEPProductFromJson(product: any): SearchProductList {
    if (!product) {
      return null;
    }
    return {
      itemCode: product.itemCode,
      totalQuantity: null,
      productGroupCode: product.productGroupCode
    };
  }

  static getProductDetails(data: any): ProductDetails[] {
    if (!data) {
      return null;
    }
    const productDetails: ProductDetails[] = [];
    for (const productDetail of data.results) {
      productDetails.push(
        CashMemoAdaptor.productDetailsFromJson(productDetail)
      );
    }

    return productDetails;
  }

  static productDetailsFromJson(productDetail: any): ProductDetails {
    if (!productDetail) {
      return null;
    }

    return {
      binCode: productDetail.binCode,
      inventoryId: productDetail.inventoryId,
      lotNumber: productDetail.lotNumber,
      karatage: productDetail.karatage,
      totalQuantity: productDetail.totalQuantity,
      stdWeight: productDetail.stdWeight,
      unitWeight: productDetail.unitWeight,
      productCategoryCode: productDetail.productCategoryCode,
      productCategoryDescription: productDetail.productCategoryDescription,
      productGroupCode: productDetail.productGroupCode,
      productGroupDescription: productDetail.productGroupDescription,
      totalWeightDetails: this.getWeightDetails(
        productDetail.totalWeightDetails
      ),
      itemCode: productDetail.itemCode,
      imageUrl: productDetail.imageUrl,
      binGroupCode: productDetail.binGroupCode,
      itemDescription: productDetail.itemDescription,
      stdValue: productDetail.stdValue
    };
  }

  static priceDetailsFromJson(
    data: any,
    productData?: any,
    availableLotNumbers?: any
  ): ProductPriceDetails {
    if (!data) {
      return null;
    }
    return {
      itemCode: data.itemCode,
      lotNumber: data.lotNumber,
      productGroupDesc: data.productGroupDesc,
      binCode: data.binCode,
      inventoryId: data.inventoryId,
      productDesc: data.productDesc,
      itemQuantity: data.itemQuantity,
      priceGroup: data.priceGroup,
      complexityCode: data.complexityCode,
      currencyCode: data.currencyCode,
      productCategoryCode: data.productCategoryCode,
      productGroupCode: data.productGroupCode,
      stdWeight: data.stdWeight,
      finalValue: data.finalValue,
      priceDetails: this.priceDetails(data.priceDetails),
      isUcp: data.isUcp,
      ignoreUcpRecalculate: data.ignoreUcpRecalculate
        ? data.ignoreUcpRecalculate
        : false,
      productDetails: productData,
      availableLotNumbers: availableLotNumbers
    };
  }

  static priceDetails(data: any): PriceDetails {
    if (!data) {
      return null;
    }
    return {
      isUcp: data.isUcp,
      printGuranteeCard: data?.printGuranteeCard,
      metalPriceDetails: this.metalPriceDetails(data.metalPriceDetails),
      stonePriceDetails: this.stonePriceDetails(data.stonePriceDetails),
      makingChargeDetails: this.makingChargeDetails(data.makingChargeDetails),
      materialDetails: this.materialDetails(data.materialDetails),
      itemHallmarkDetails: this.itemHallmarkDetails(data.itemHallmarkDetails),
      netWeight: data.netWeight
    };
  }

  static metalPriceDetails(data: any): MetalPriceDetails {
    if (!data) {
      return null;
    }
    return {
      preDiscountValue: data.preDiscountValue,
      metalPrices: this.getMetalPrices(data.metalPrices)
    };
  }

  static stonePriceDetails(data: any): StonePriceDetails {
    if (!data) {
      return null;
    }
    return {
      numberOfStones: data.numberOfStones,
      preDiscountValue: data.preDiscountValue,
      stoneWeight: data.stoneWeight,
      weightUnit: data.weightUnit,
      stoneWeightForView: data.stoneWeightForView,
      weightUnitForView: data.weightUnitForView
    };
  }

  static makingChargeDetails(data: any): MakingChargeDetails {
    if (!data) {
      return null;
    }
    return {
      preDiscountValue: data.preDiscountValue,
      makingChargePercentage: data.makingChargePercentage,
      isDynamicPricing: data.isDynamic,
      makingChargePct: data.makingChargePct,
      makingChargePgram: data.makingChargePgram,
      makingChargePunit: data.makingChargePunit,
      wastagePct: data.wastagePct
    };
  }

  static materialDetails(data: any): MaterialDetails {
    if (!data) {
      return null;
    }
    return { materialWeight: data.materialWeight };
  }

  static itemHallmarkDetails(data: any): ItemHallmarkDetails {
    if (!data) {
      return null;
    }
    return {
      hallmarkGstPct: data.hallmarkGstPct,
      hallmarkingCharges: data.hallmarkingCharges,
      hmQuantity: data.hmQuantity,
      isFOCForHallmarkingCharges: data.isFOCForHallmarkingCharges,
      isHallmarked: data.isHallmarked
    };
  }

  static getMetalPrices(data: any): MetalPrices[] {
    if (!data) {
      return null;
    }
    const metalPrices: MetalPrices[] = [];
    for (const metalPrice of data) {
      metalPrices.push(this.metalPrices(metalPrice));
    }

    return metalPrices;
  }

  static metalPrices(data: any): MetalPrices {
    if (!data) {
      return null;
    }
    return {
      weightUnit: data.weightUnit,
      netWeight: data.netWeight,
      metalValue: data.metalValue,
      type: data.type,
      ratePerUnit: data.ratePerUnit,
      karat: data.karat,
      purity: data.purity,
      metalTypeCode: data.metalTypeCode
    };
  }

  static taxDetails(data: any): CashMemoTaxDetails {
    if (!data) {
      return null;
    }
    return {
      cess: data.cess,
      data: data.data,
      taxClass: data.taxClass,
      taxType: data.taxType
    };
  }

  static getCessTaxValues(data: any): CessTax[] {
    if (!data) {
      return null;
    }
    const cessTaxes: CessTax[] = [];
    for (const cessTax of data) {
      cessTaxes.push(this.cessTaxData(cessTax));
    }

    return cessTaxes;
  }

  static cessTaxData(data: any): CessTax {
    if (!data) {
      return null;
    }
    return {
      cessCode: data.cessCode,
      cessOnTax: data.cessOnTax,
      cessPercentage: data.cessPercentage,
      cessValue: data.cessValue
    };
  }

  static getCashMemoTaxValues(data: any): CashMemoTaxData[] {
    if (!data) {
      return null;
    }
    const cashMemoTaxes: CashMemoTaxData[] = [];
    for (const cashMemoTax of data) {
      cashMemoTaxes.push(this.cashMemoTaxData(cashMemoTax));
    }

    return cashMemoTaxes;
  }

  static cashMemoTaxData(data: any): CashMemoTaxData {
    if (!data) {
      return null;
    }
    return {
      taxCode: data.taxCode,
      taxPercentage: data.taxPercentage,
      taxValue: data.taxValue
    };
  }

  static createCashMemoResponseFromJson(data: any): CreateCashMemoResponse {
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
        ? this.getManualBillDetails(
            data.manualBillDetails?.manualBillDetails,
            data.manualBillDetails?.validationType
          )
        : null
    };
  }

  static cashMemoItemDetailsFromJson(data: any): CashMemoItemDetails {
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
      priceDetails: this.priceDetails(data.priceDetails),
      taxDetails: data.taxDetails,
      inventoryWeightDetails: this.getWeightDetails(
        data.inventoryWeightDetails
      ),
      isFoc: data.isFoc,
      measuredWeightDetails: this.getWeightDetails(data.measuredWeightDetails),
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
      hallmarkDiscount: data.hallmarkDiscount
    };
  }

  static cashMemoItemDetailsResponseFromJson(
    data: any,
    availableLotNumbers: any,
    productDetails?: any
  ): CashMemoItemDetailsResponse {
    if (!data) {
      return null;
    }

    return {
      customerId: data.customerId,
      docNo: data.docNo,
      firstHoldTime: data.firstHoldTime,
      fiscalYear: data.fiscalYear,
      id: data.id,
      itemDetails: this.cashMemoItemDetailsFromJson(data.itemDetailsDto),
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
      availableLotNumbers: availableLotNumbers,
      productDetails: productDetails,
      txnType: data.txnType,
      subTxnType: data.subTxnType,
      manualBillDetails: this.getManualBillDetails(
        data.manualBillDetails?.manualBillDetails,
        data.validationType
      ),
      discountDetails: data.discountDetails,
      discountTxnDetails: data?.discountTxnDetails,
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
      hallmarkDiscount: data.hallmarkDiscount
    };
  }

  static getCashMemoItemDetailsResponseFromJson(
    itemData: any,
    headerData: any,
    productDetails: any
  ): CashMemoItemDetailsResponse {
    if (!itemData) {
      return null;
    }
    const availableLotNumbers = [];
    let productDetail: ProductDetails;
    productDetails.results.forEach((element: ProductDetails) => {
      if (element.productGroupCode === coinCode) {
        if (itemData.inventoryWeight === element.unitWeight) {
          productDetail = element;
        }
      } else {
        availableLotNumbers.push({
          lotNumber: element.lotNumber,
          inventoryId: element.inventoryId,
          totalQuantity: element.totalQuantity
        });
        if (itemData.inventoryId === element.inventoryId) {
          productDetail = element;
        }
      }
    });

    if (itemData.itemInStock === false) {
      productDetail = itemData;
      availableLotNumbers.push({
        lotNumber: itemData.lotNumber,
        inventoryId: itemData.inventoryId,
        totalQuantity: itemData.totalQuantity
      });
    }

    return {
      customerId: headerData.customerId,
      docNo: headerData.docNo,
      firstHoldTime: headerData.firstHoldTime,
      fiscalYear: headerData.fiscalYear,
      id: headerData.id,
      itemDetails: this.cashMemoItemDetailsFromJson(itemData),
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
      availableLotNumbers: availableLotNumbers,
      productDetails: productDetail,
      product: this.getProductDetails(productDetails),
      txnType: headerData.txnType,
      subTxnType: headerData.subTxnType,
      manualBillDetails: this.getManualBillDetails(
        headerData.manualBillDetails?.manualBillDetails,
        headerData.validationType
      ),
      discountDetails: headerData.discountDetails,
      docDate: headerData.docDate,
      employeeCode: headerData.employeeCode,
      focdetails: headerData.focDetails,
      txnTime: headerData.confirmedTime,
      minValue: headerData.minValue,
      isFrozenRate: headerData.isFrozenRate,
      isFrozenAmount: headerData.minPaymentDetails?.data?.frozenMinPayment,
      hallmarkCharges: headerData.hallmarkCharges,
      hallmarkDiscount: headerData.hallmarkDiscount
    };
  }

  static cashMemoDetailsResponseFromJson(
    data: any
  ): AdvanceBookingDetailsResponse {
    if (!data) {
      return null;
    }
    return {
      customerId: data.customerId,
      cancelTxnId: data.cancelTxnId,
      docNo: data.docNo,
      isRivaah: data.isRivaah,
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
      manualBillDetails: this.getManualBillDetails(
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
      cnDocNoList: data.cnDocNoMap,
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
      panCardNumber: data?.custTaxNo,
      oldPanCardNumber: data?.custTaxNoOld,
      isIGST: data.isIGST !== null ? data.isIGST : false,
      txnSource: data?.txnSource ? data?.txnSource : null,
      collectedBy: data?.collectedBy ? data?.collectedBy : null
    };
  }

  static getTcsDataFromJson(data: any): TcsDataResponse {
    if (!data) {
      return null;
    } else {
      if (data.customerTcsDetailsDtos.length !== 0) {
        const currentTransaction = data.customerTcsDetailsDtos.find(txn => {
          return txn.currentTransaction === true;
        });
        if (currentTransaction) {
          return {
            tcsCollected: currentTransaction.tcsCollected,
            tcsToBeCollected: currentTransaction.tcsToBeCollected,
            tcsEligibleAmount: currentTransaction.tcsEligibleAmount
          };
        }
      } else {
        return null;
      }
    }
  }

  static getOtherChargesList(data: any): OtherChargesList {
    if (!data) {
      return null;
    }
    return {
      otherCharges: this.getOtherCharges(data.otherCharges)
    };
  }

  static getOtherCharges(data: any): OtherCharges[] {
    if (!data) {
      return null;
    }
    const otherCharges: OtherCharges[] = [];
    for (const otherCharge of data) {
      otherCharges.push(this.getOtherChargesArray(otherCharge));
    }

    return otherCharges;
  }

  static getOtherChargesArray(data: any): OtherCharges {
    if (!data) {
      return null;
    }
    return {
      data: this.getOtherChargesData(data.value),
      type: data.type
    };
  }

  static getOtherChargesData(data: any): OtherChargesData {
    if (!data) {
      return null;
    }
    return {
      value: data.value,
      remarks: data.remarks,
      reasonId: data.reasonId
    };
  }

  static getManualBillDetails(
    data: any,
    validationType: string
  ): ManualBillDetails {
    if (!data) {
      return null;
    }
    return {
      approvedBy: data.approvedBy,
      manualBillDate: data.manualBillDate,
      manualBillNo: data.manualBillNo,
      manualBillValue: data.manualBillValue,
      metalRates: data.metalRates,
      password: data.password,
      remarks: data.remarks,
      validationType: validationType,
      requestNo: data.requestNo,
      frozenRateDate: data.frozenRateDate,
      isFrozenRate: data.isFrozenRate,
      performedBy: data.performedBy,
      processId: data.processId,
      requestStatus: data.requestStatus,
      isBimetal: data.isBimetal
    };
  }

  static getWeightDetails(value: any): InventoryWeightDetails {
    if (!value) {
      return null;
    }
    return {
      data: value.data
        ? {
            goldWeight: value.data.goldWeight,
            materialWeight: value.data.materialWeight,
            platinumWeight: value.data.platinumWeight,
            silverWeight: value.data.silverWeight,
            stoneWeight: value.data.stoneWeight,
            diamondWeight: value.data.diamondWeight
          }
        : null,
      type: value.type
    };
  }

  static getMetalRates(data: any): MetalRates {
    if (!data) {
      return null;
    }
    return {
      priceType: data.priceType,
      metalTypeCode: data.metalTypeCode,
      ratePerUnit: data.ratePerUnit
    };
  }

  static coinDetailsFromJson(coinDetail: any): CoinDetails {
    if (!coinDetail) {
      return null;
    }
    return {
      itemDescription: coinDetail.itemDescription,
      itemCode: coinDetail.itemCode,
      karatage: coinDetail.karatage,
      stdWeight: coinDetail.stdWeight,
      totalQuantity: coinDetail.totalQuantity,
      unit: coinDetail.unit,
      unitWeight: coinDetail.unitWeight,
      productGroupCode: coinDetail.productGroupCode,
      productCategoryCode: coinDetail.productCategoryCode,
      stdValue: coinDetail.stdValue,
      totalWeightDetails: coinDetail.totalWeightDetails
    };
  }

  static getCashMemoHistoryDetails(data: any): CashMemoHistoryResponse {
    const cashMemoHistoryDetails: CashMemoHistoryDetails[] = [];
    for (const cmHisReq of data.results) {
      cashMemoHistoryDetails.push({
        customerName: cmHisReq.customerName,
        docNo: cmHisReq.docNo,
        createdDate: moment(cmHisReq.createdDate),
        docDate: moment(cmHisReq.docDate),
        createdBy: cmHisReq.createdBy,
        fiscalYear: cmHisReq.fiscalYear,
        netAmount: cmHisReq.netAmount,
        id: cmHisReq.id,
        status: cmHisReq.status
      });
    }
    return {
      cashMemoHistoryDetails: cashMemoHistoryDetails,
      totalElements: data.totalElements
    };
  }

  static getTcsFromJson(data: any): TcsList[] {
    const tcsDetail: TcsList[] = [];
    for (const item of data.customerTcsDetailsDtos) {
      tcsDetail.push({
        brandCode: item.brandCode,
        currentTransaction: item.currentTransaction,
        ownerType: item.ownerType,
        locationCode: item.locationCode,
        docNo: item.currentTransaction === true ? '' : item.docNo,
        transactionDate: item.transactionDate
          ? moment(item.transactionDate)
          : null,
        fiscalYear: item.fiscalYear,
        netInvoiceValue: item.netInvoiceAmount,
        tcsApplicableAmount: item.tcsApplicableAmount,
        tcsPercentage: item.tcsPercentage,
        tcsAmountPaid: item.tcsToBeCollected,
        tcsCollected: item.tcsCollected,
        tcsToBeCollected: item.tcsToBeCollected
      });
    }

    return tcsDetail;
  }

  static getDiscDetails(item: any, discount: any): any {
    console.log('item', item);
    console.log('discount', discount);
    if (!item && !discount) {
      return null;
    }

    if (!item) {
      return {
        itemDetails: null,
        discountDetails: discount
      };
    }

    if (!discount) {
      return {
        itemDetails: item,
        discountDetails: null
      };
    }

    const a = { ...item[0], discountDetails: discount };

    return [a];
  }

  static getCnDetailResponse(data: any): CNDetailsResponsePayload {
    if (!data) {
      return null;
    }
    return {
      amount: Number(data.amount.toFixed(2)),
      creditNoteType: data.creditNoteType,
      customerName: data.customerName,
      goldRateAmount: Number(
        data.frozenRateDetails.data.ratePerUnit.toFixed(2)
      ),
      goldWeight: Number(data.frozenRateDetails.data.weight.toFixed(2)),
      fiscalYear: data.fiscalYear,
      id: data.id,
      mobileNumber: data.mobileNumber,
      status: data.status,
      locationCode: data.locationCode,
      linkedTxnType: data.linkedTxnType,
      linkedTxnId: data.linkedTxnId,
      docNo: data.docNo,
      docDate: data.docDate ? moment(data.docDate) : null,
      isAdded: false,
      eghsDetails: data.eghsDetails,
      cashCollected: data.cashCollected ? data.cashCollected : 0
    };
  }
}
