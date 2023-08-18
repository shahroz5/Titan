import * as moment from 'moment';
import {
  CreateStockIssueResponse,
  StockIssueItem
} from '@poss-web/shared/models';

export class StockIssueTEPGEPAdaptor {
  static createStockIssueResponseFromJson(data: any): CreateStockIssueResponse {
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      srcLocationCode: data.srcLocationCode,
      destLocationCode: data.destLocationCode,
      status: data.status,
      weightUnit: data.weightUnit,
      currencyCode: data.currencyCode,
      srcDocNo: data.srcDocNo,
      srcFiscalYear: data.srcFiscalYear,
      srcDocDate: moment(data.srcDocDate),
      destDocNo: data.destDocNo,
      destDocDate: moment(data.destDocDate),
      orderType: data.orderType,
      totalAvailableQuantity: data.totalAvailableQuantity
        ? data.totalAvailableQuantity
        : 0,
      totalMeasuredQuantity: data.totalMeasuredQuantity
        ? data.totalMeasuredQuantity
        : 0,
      totalAvailableValue: data.totalAvailableValue
        ? data.totalAvailableValue
        : 0,
      totalMeasuredValue: data.totalMeasuredValue ? data.totalMeasuredValue : 0,
      totalAvailableWeight: data.totalAvailableWeight
        ? data.totalAvailableWeight
        : 0,
      totalMeasuredWeight: data.totalMeasuredWeight
        ? data.totalMeasuredWeight
        : 0,
      // for l1/l2
      transferType: data.transferType,
      // for l3
      invoiceType: data.invoiceType,
      // for l1/l2
      courierReceivedDate: moment(data.courierReceivedDate),
      courierDetails: data.courierDetails,
      // for l3
      issuedRemarks: data.issuedRemarks
    };
  }

  static stockIssueItemFromJson(
    stockIssueItem: any,
    data: any,
    studdedProductGroups: string[] = []
  ): StockIssueItem {
    if (!data) {
      return null;
    }
    return {
      id: stockIssueItem.id,
      itemCode: stockIssueItem.itemCode,
      lotNumber: stockIssueItem.lotNumber,
      mfgDate: stockIssueItem.mfgDate ? moment(stockIssueItem.mfgDate) : null,
      productCategory: stockIssueItem.productCategory,
      productGroup: stockIssueItem.productGroup,
      binCode: stockIssueItem.binCode,
      binGroupCode: stockIssueItem.binGroupCode,
      stdValue: stockIssueItem.stdValue,
      stdWeight: stockIssueItem.stdWeight,
      currencyCode: stockIssueItem.currencyCode,
      weightUnit: stockIssueItem.weightUnit,
      status: stockIssueItem.status,
      imageURL: stockIssueItem.imageURL,
      thumbnailImageURL: stockIssueItem.thumbnailImageURL,
      itemDetails: stockIssueItem.itemDetails,
      ishallmarking: stockIssueItem.ishallmarking,
      availableQuantity: stockIssueItem.availableQuantity,
      availableWeight: stockIssueItem.availableWeight,
      availableValue: stockIssueItem.availableValue,
      measuredQuantity: stockIssueItem.measuredQuantity,
      measuredWeight: stockIssueItem.measuredWeight,
      measuredValue: stockIssueItem.measuredValue,
      orderType: stockIssueItem.orderType,
      inventoryId: stockIssueItem.inventoryId,
      productCategoryDesc: stockIssueItem.productCategoryDesc,
      productGroupDesc: stockIssueItem.productGroupDesc,
      isStudded: studdedProductGroups.includes(stockIssueItem.productGroup),
      refDocDate: stockIssueItem.refDocDate
        ? moment(stockIssueItem.refDocDate)
        : null,
      refDocNumber: stockIssueItem.refDocNumber
        ? stockIssueItem.refDocNumber
        : 0,
      refDocType: stockIssueItem.refDocType ? stockIssueItem.refDocType : null,
      // isStudded: true,
      // for l3
      remarks: stockIssueItem.remarks,
      totalElements: data.totalElements,
      taxDetails: stockIssueItem.taxDetails,
      isLoadingImage: false,
      isLoadingThumbnailImage: false,
      finalValue: stockIssueItem.finalValue,
      karat: stockIssueItem.karat ? stockIssueItem.karat : 0,
      preTaxValue: stockIssueItem.preTaxValue ? stockIssueItem.preTaxValue : 0,
      pricePerUnit: stockIssueItem.pricePerUnit
        ? stockIssueItem.pricePerUnit
        : 0,
      totalTax: stockIssueItem.totalTax ? stockIssueItem.totalTax : 0,
      itemLevelDiscount: stockIssueItem.itemLevelDiscount
        ? stockIssueItem.itemLevelDiscount
        : 0
    };
  }
}
