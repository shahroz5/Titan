import {
  GrnReqStatusListResponse,
  GrnReqStatus,
  GrnReqDetails,
  GrnProductDetails,
  GrnInitResponse,
  GrnApproverSuccessList,
  GrnHistoryDetails,
  GrnHistoryResponse,
  grnRequestEnum,
  GrnPriceDetailsSuccess,
  TcsCollectedResponse
} from '@poss-web/shared/models';

import * as moment from 'moment';
export class GrnAdaptor {
  static getGrnReqStatusData(data: any): GrnReqStatusListResponse {
    let grnReqStatusListResponse: GrnReqStatusListResponse = null;
    const grnReqStatus: GrnReqStatus[] = [];

    for (const req of data.results) {
      grnReqStatus.push({
        defectType:
          req.headerData.data.cancelType === grnRequestEnum.REGULAR
            ? 'Regular Grn'
            : 'Mfg Defect',
        customerName: req.headerData.data.customerName,
        grnNumber: req.headerData.data.docNo,
        cmNumber: req.headerData.data.refDocNo,
        time: moment(req.requestedDate).format('HH:mm A'),
        reqDate: moment(req?.requestedDate),
        srcBoutiqueCode: req.headerData.data.srcLocationCode,
        destBoutiqueCode: req.headerData.data.destLocationCode,
        approverRemarks: req.approverRemarks,
        products: req.headerData.data.totalQuantity,
        productValue: req.headerData.data.totalValue,
        status: req.approvalStatus,
        reqNumber: req.docNo,
        grnId: req.headerData.data.id,
        processId: req.processId
      });
    }

    grnReqStatusListResponse = {
      grnReqStatus: grnReqStatus,
      totalElement: data.totalElements
    };
    return grnReqStatusListResponse;
  }

  static getGrnHistoryDetails(data: any): GrnHistoryResponse {
    const grnHistoryDetails: GrnHistoryDetails[] = [];
    for (const grnReq of data.results) {
      grnHistoryDetails.push({
        customerName: grnReq.customerName,
        cmLocation: grnReq.srcLocationCode,
        createdDate: moment(grnReq.createdDate),
        docDate: moment(grnReq.docDate),
        grnNo: grnReq.docNo,
        status: grnReq.status,
        createdBy: grnReq.createdBy,
        cnNumber: grnReq.cnDocNo,
        fiscalYear: grnReq.fiscalYear,
        grnId: grnReq.id,
        netAmount: grnReq.netAmount,
        creditNoteType: grnReq.creditNoteType
      });
    }
    return {
      grnHistoryDetails: grnHistoryDetails,
      totalElements: data.totalElements
    };
  }
  static getGrnDetails(grnDetails, grnApprovalDetails = null): GrnReqDetails {
    const grnProductDetails: GrnProductDetails[] = [];
    let encirclePoints;
    for (const grnProduct of grnDetails.items) {
      grnProductDetails.push({
        id: grnProduct.id,
        itemCode: grnProduct.itemCode,
        lotNumber: grnProduct.lotNumber,
        unitWeight: grnProduct.inventoryWeight,
        totalWeight: grnProduct.totalWeight,
        totalDiscount: grnProduct.totalDiscount,
        pricePerUnit: grnProduct.unitValue,
        productGroupCode: grnProduct.productGroupCode,
        finalValue: grnProduct.finalValue,
        unitValue: grnProduct.unitValue,
        employeeCode: grnProduct.employeeCode,
        totalValue: grnProduct.totalValue,
        totalQuantity: grnProduct.totalQuantity,
        priceDetails: grnProduct.priceDetails,
        taxDetails: grnProduct.taxDetails,
        productCategoryCode: grnProduct.productCategoryCode,
        binCode: grnProduct.binCode,
        selected: false
      });
      encirclePoints = grnProduct?.legacyCmDetails?.encirclePoints;
    }

    const grnReqDetails: GrnReqDetails = {
      tcsTobeRefund: grnDetails?.tcsTobeRefund
        ? grnDetails.tcsTobeRefund
        : '0.00',
      txnType: grnDetails.txnType,
      subTxnType: grnDetails.subTxnType,
      boutiqueCode: grnDetails?.srcLocationCode,
      fiscalYear: grnDetails?.refFiscalYear,
      grnType:
        grnDetails.cancelType === grnRequestEnum.REGULAR
          ? 'Regular Grn'
          : 'Mfg Defect',
      reasonForCancellation: grnDetails?.reasonForCancellation
        ? grnDetails?.reasonForCancellation
        : '-',
      cmNumber: grnDetails.refDocNo,
      cnDocDetails: grnDetails.cnDocDetails,
      cmDate: moment(grnDetails?.refDocDate),
      customerId: grnDetails.grnCustomerId,
      invoicedGoldRate: grnDetails?.metalRateList?.metalRates?.J?.ratePerUnit,
      invoicedPlatinumRate:
        grnDetails?.metalRateList?.metalRates?.L?.ratePerUnit,
      productDetails: grnProductDetails,
      cmNetAmount: grnDetails.cmFinalValue,
      otherCharges: grnDetails.otherCharges,
      encirclePoints: encirclePoints ? encirclePoints : 0,
      loyaltyPoints: grnDetails?.loyaltyPoints ? grnDetails.loyaltyPoints : 0,
      focRecoveredValue: grnDetails.focRecoverValue,
      status: grnDetails.status,
      approver: grnApprovalDetails?.approvedby
        ? grnApprovalDetails?.approvedby
        : '',
      reason: grnApprovalDetails?.approverRemarks
        ? grnApprovalDetails?.approverRemarks
        : '',
      time: grnApprovalDetails?.approvedDate
        ? moment(grnApprovalDetails?.approvedDate).format('DD-MMM-YYYY') +
          '  ' +
          moment(grnApprovalDetails?.approvedDate).format('HH:mm A')
        : '',
      approvalStatus: grnApprovalDetails?.approvalStatus
        ? grnApprovalDetails?.approvalStatus
        : '',
      isCmGoldRate: grnApprovalDetails?.approvedData?.data?.isCMGoldRate
        ? grnApprovalDetails?.approvedData?.data?.isCMGoldRate
        : '',
      totalReturnGrn: grnDetails.totalValue ? grnDetails.totalValue : '',
      totalReturnProduct: grnDetails.totalQuantity
        ? grnDetails.totalQuantity
        : '',
      cashmemoId: grnApprovalDetails?.headerData.data.refId
        ? grnApprovalDetails?.headerData.data.refId
        : '',
      processId: grnDetails.processId ? grnApprovalDetails?.processId : '',

      tcsAmountCollected: grnDetails?.tcsCollected
        ? grnDetails.tcsCollected
        : 0.0,
      txnSource: grnDetails?.txnSource ? grnDetails?.txnSource : null
    };
    return grnReqDetails;
  }

  static getTcsCollectedAmount(data: any): TcsCollectedResponse {
    if (data) {
      return {
        tcsAmountCollected: data?.tcsCollected
      };
    }
  }

  static getInitiateGrnResponse(data): GrnInitResponse {
    const grnProductDetails: GrnProductDetails[] = [];
    let encirclePoints;
    for (const grnProduct of data.items) {
      grnProductDetails.push({
        id: grnProduct.id,
        itemCode: grnProduct.itemCode,
        lotNumber: grnProduct.lotNumber,
        unitWeight: grnProduct.inventoryWeight,
        totalWeight: grnProduct.totalWeight,
        totalDiscount: grnProduct.totalDiscount,
        pricePerUnit: grnProduct.unitValue,
        productGroupCode: grnProduct.productGroupCode,
        finalValue: grnProduct.finalValue,
        employeeCode: grnProduct.employeeCode,
        unitValue: grnProduct.unitValue,
        totalValue: grnProduct.totalValue,
        totalQuantity: grnProduct.totalQuantity,
        priceDetails: grnProduct.priceDetails,
        taxDetails: grnProduct.taxDetails,
        productCategoryCode: grnProduct.productCategoryCode,
        binCode: grnProduct.binCode,
        selected: false
      });
      encirclePoints = grnProduct?.legacyCmDetails?.encirclePoints;
    }
    const initGrnDetails = {
      id: data.id,
      refCustomerId: data.refCustomerId,
      refDocDate: moment(data.refDocDate),
      refFiscalYear: data.refFiscalYear,
      refDocNo: data.refDocNo,
      focValue: data.focValue,
      grnCustomerId: data.grnCustomerId,
      items: grnProductDetails,
      invoicedGoldRate: data?.metalRateList?.metalRates?.J?.ratePerUnit,
      invoicedPlatinumRate: data?.metalRateList?.metalRates?.L?.ratePerUnit,
      invoicedSilverRate: data?.metalRateList?.metalRates?.P?.ratePerUnit,
      // metalRateList: data.metalRateList,
      encirclePoints: encirclePoints ? encirclePoints : 0,
      loyaltyPoints: data?.loyaltyPoints ? data.loyaltyPoints : 0,
      otherCharges: data.otherCharges,
      status: data.status,
      totalValue: data.totalValue,
      returnableItemIds: data.returnableItemIds,
      returnedItemIds: data.returnedItems ? data.returnedItems : null,
      txnType: data.txnType,
      subTxnType: data.subTxnType,
      cmNetAmount: data.cmFinalValue,
      tcsAmountCollected: data?.tcsCollected ? data.tcsCollected : 0.0,
      txnSource: data?.txnSource ? data?.txnSource : null,
      isVoid: data.isVoid ? data.isVoid : false
    };
    return initGrnDetails;
  }

  static getItemDetails(data, selected): GrnProductDetails {
    const itemDetails = {
      id: data.itemId,
      itemCode: data.itemCode,
      lotNumber: data.lotNumber,
      unitWeight: data.inventoryWeight,
      totalWeight: data.totalWeight,
      totalDiscount: data.totalDiscount,
      pricePerUnit: data.unitValue,
      productGroupCode: data.productGroupCode,
      finalValue: data.finalValue,
      employeeCode: data.employeeCode,
      totalValue: data.totalValue,
      totalQuantity: data.totalQuantity,
      priceDetails: data.priceDetails,
      unitValue: data.unitValue,
      taxDetails: data.taxDetails,
      productCategoryCode: data.productCategoryCode,
      binCode: data.binCode,
      selected: selected
    };
    return itemDetails;
  }

  static getGrnApprovers(data: any): GrnApproverSuccessList[] {
    const grnApproverSuccessList: GrnApproverSuccessList[] = [];

    for (const approver of data.config) {
      grnApproverSuccessList.push({
        value: approver.roleCode,
        description: approver.roleCode,
        processType: approver.processType
      });
    }

    return grnApproverSuccessList;
  }
  static getGrnFinalPriceDetails(data: any): GrnPriceDetailsSuccess {
    const grnPriceDetails: GrnPriceDetailsSuccess = {
      totalItemsValue: data.totalItemsValue,
      focDeductionValue: data.focDeductionValue,
      finalValue: data.finalValue,
      totalReturnQuantity: data.totalReturnQuantity,
      encirclePoints: data.encriclePointValue,
      tcsAmountToBeRefund: data.tcsAmountToBeRefund
    };

    return grnPriceDetails;
  }
}
