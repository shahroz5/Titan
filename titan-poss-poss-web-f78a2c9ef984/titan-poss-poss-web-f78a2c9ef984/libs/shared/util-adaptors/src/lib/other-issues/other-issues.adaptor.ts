import * as moment from 'moment';
import {
  OtherReceiptsIssuesEnum,
  OtherIssueModel,
  OtherIssuesItem,
  OtherIssuesCreateStockResponse,
  RequestOtherIssueStockTransferNote,
  LoadOtherIssuesSTNCountPayload,
  AdjustmentSearchItemPayloadSuccess,
  ConfirmOtherStockIssueResponse,
  OtherIssuesHistoryItem
} from '@poss-web/shared/models';
export class OtherIssuesAdaptor {
  static issuesSTNCountFromJson(data: any): LoadOtherIssuesSTNCountPayload {
    let pendingOtherIssuesSTNCount = 0;
    const countData = [];
    for (const stnCount of data.results) {
      if (
        stnCount.type === OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE ||
        stnCount.type === OtherReceiptsIssuesEnum.EXHIBITION_TYPE ||
        stnCount.type === OtherReceiptsIssuesEnum.LOAN ||
        stnCount.type === OtherReceiptsIssuesEnum.LOSS_TYPE ||
        stnCount.type === OtherReceiptsIssuesEnum.PSV ||
        stnCount.type === OtherReceiptsIssuesEnum.FOC
      ) {
        pendingOtherIssuesSTNCount += stnCount.count;
        countData.push(stnCount);
      }
    }

    return {
      pendingOtherIssuesSTNCount,
      countData
    };
  }
  static OtherIssueDatafromJson(data: any): OtherIssueModel {
    // Thow error if not found
    if (!data) {
      // Throw
      return null;
    }

    const OtherIssueData: OtherIssueModel = {
      id: data.id,
      srcLocationCode: data.srcLocationCode,
      requestType: data.requestType,
      reqDocDate: moment(data.reqDocDate),
      currencyCode: data.currencyCode,
      weightUnit: data.weightUnit,
      status: data.status,
      reqLocationCode: data.reqLocationCode,
      reqDocNo: data.reqDocNo,
      destLocationCode: data.destLocationCode,
      totalAvailableQuantity: data.totalAvailableQuantity,
      totalAvailableValue: data.totalAvailableValue,
      totalAvailableWeight: data.totalAvailableWeight,
      totalMeasuredQuantity: data.totalMeasuredQuantity,
      totalMeasuredValue: data.totalMeasuredValue,
      totalMeasuredWeight: data.totalMeasuredWeight,
      carrierDetails: data.carrierDetails,
      otherDetails: data.otherDetails,
      orderType: data.orderType,
      destDocDate: moment(data.destDocDate),
      destDocNo: data.destDocNo,
      srcDocDate: moment(data.srcDocDate),
      srcDocNo: data.srcDocNo,
      srcFiscalYear: data.srcFiscalYear,
      remarks: data.remarks
    };
    return OtherIssueData;
  }

  static OtherIssueItemfromJson(
    data: any,
    studdedProductGroups: string[]
  ): OtherIssuesItem[] {
    if (data) {
      const items: OtherIssuesItem[] = [];
      for (const issueItem of data.results) {
        items.push({
          approvedQuantity: issueItem.approvedQuantity,
          binCode: issueItem.binCode,
          binGroupCode: issueItem.binGroupCode,
          id: issueItem.id,
          imageURL: issueItem.imageURL,
          issuedQuantity: issueItem.issuedQuantity,
          itemCode: issueItem.itemCode,
          itemDetails: {},
          itemValue: issueItem.itemValue,
          lotNumber: issueItem.lotNumber,
          mfgDate: moment(issueItem.mfgDate),
          orderType: issueItem.orderType,
          productCategory: issueItem.productCategoryDesc,
          productCategoryId: issueItem.productCategory,
          productGroup: issueItem.productGroupDesc,
          productGroupId: issueItem.productGroup,
          requestedQuantity: issueItem.requestedQuantity,
          status: issueItem.status,
          totalQuantity: issueItem.totalQuantity,
          totalValue: issueItem.totalValue,
          totalWeight: issueItem.totalWeight,
          weightUnit: issueItem.weightUnit,
          isUpdating: null,
          isUpdatingSuccess: null,
          itemWeight: issueItem.itemWeight,
          currencyCode: issueItem.currencyCode,
          totalElements: data.totalElements,
          inventoryId: issueItem.inventoryId,
          measuredWeight: issueItem.measuredWeight,
          availableQuantity: issueItem.availableQuantity,
          availableValue: issueItem.availableValue,
          availableWeight: issueItem.availableWeight,
          measuredQuantity: issueItem.measuredQuantity,
          measuredValue: issueItem.measuredValue,
          stdWeight: issueItem.stdWeight,
          stdValue: issueItem.stdValue,
          isStudded: studdedProductGroups.includes(issueItem.productGroup),
          taxDetails: issueItem.taxDetails,
          isHallmarked:issueItem.isHallmarked
        });
      }
      return items;
    }
  }
  static createOtherIssueStockRequestFromJson(
    data: any
  ): OtherIssuesCreateStockResponse {
    if (!data) {
      return null;
    }
    const response: OtherIssuesCreateStockResponse = {
      id: data.id,
      reqDocNo: data.reqDocNo,
      srcLocationCode: data.srcLocationCode,
      destLocationCode: data.destLocationCode,
      totalQuantity: data.totalQuantity,
      status: data.status,
      reqDocDate: moment(data.reqDocDate)
    };
    return response;
  }
  static searchedAdjustmentItems(
    data: any,
    studdedProductGroups: string[]
  ): AdjustmentSearchItemPayloadSuccess {
    let searchItemPayloadSuccess: AdjustmentSearchItemPayloadSuccess;
    const items: OtherIssuesItem[] = [];
    let count: number = null;
    count = data.totalElements;
    for (const item of data?.results.items) {
      items.push({
        id: item.id,
        currencyCode: item.currencyCode,
        binCode: item.binCode,
        binGroupCode: item.binGroupCode,
        imageURL: item.imageURL,
        itemCode: item.itemCode,
        itemValue: item.itemValue,
        lotNumber: item.lotNumber,
        mfgDate: moment(item.mfgDate),
        orderType: item.orderType,
        productCategory: item.productCategoryDesc,
        productCategoryId: item.productCategory,
        productGroup: item.productGroupDesc,
        productGroupId: item.productGroup,
        status: item.status,
        totalQuantity: item.totalQuantity,
        totalValue: item.totalValue,
        totalWeight: item.totalWeight,
        weightUnit: item.weightUnit,
        itemWeight: item.itemWeight,
        availableQuantity: item.availableQuantity,
        issuedQuantity: item.issuedQuantity,
        itemDetails: {},
        isUpdating: null,
        isUpdatingSuccess: null,
        approvedQuantity: item.approvedQuantity,
        requestedQuantity: item.requestedQuantity,
        availableValue: item.availableValue,
        availableWeight: item.availableWeight,
        measuredWeight: item.availableWeight,
        measuredQuantity: item.availableQuantity,
        measuredValue: item.measuredValue,
        stdWeight: item.stdWeight,
        stdValue: item.stdValue,
        isStudded: studdedProductGroups.includes(item.productGroup),
        taxDetails: item.taxDetails
      });
    }

    searchItemPayloadSuccess = { items: items, count: count };

    return searchItemPayloadSuccess;
  }
  static requestStockTransferNoteFromJson(
    data: any
  ): RequestOtherIssueStockTransferNote {
    if (!data && data.results && data.results.length === 0) {
      return null;
    }
    const requestStockTransferNoteData = data.results[0];
    const requestStockTransferNote: RequestOtherIssueStockTransferNote = {
      currencyUnit: requestStockTransferNoteData.currencyUnit,
      destLocationCode: requestStockTransferNoteData.destLocationCode,
      id: requestStockTransferNoteData.id,
      reqDocDate: moment(requestStockTransferNoteData.reqDocDate),
      reqDocNo: requestStockTransferNoteData.reqDocNo,
      reqLocationCode: requestStockTransferNoteData.reqLocationCode,
      requestType: requestStockTransferNoteData.requestType,
      srcLocationCode: requestStockTransferNoteData.srcLocationCode,
      status: requestStockTransferNoteData.status,
      totalQuantity: requestStockTransferNoteData.totalQuantity,
      totalValue: requestStockTransferNoteData.totalValue,
      totalWeight: requestStockTransferNoteData.totalWeight,
      weightUnit: requestStockTransferNoteData.weightUnit,
      carrierDetails: {
        type: requestStockTransferNoteData.carrierDetails.type,
        data: requestStockTransferNoteData.carrierDetails.data
      },
      otherDetails: {
        type: requestStockTransferNoteData.otherDetails.type,
        data: requestStockTransferNoteData.otherDetails.data
      },
      totalAvailableValue: requestStockTransferNoteData.totalAvailableValue,
      totalAvailableWeight: requestStockTransferNoteData.totalAvailableWeight,
      totalAvailableQuantity:
        requestStockTransferNoteData.totalAvailableQuantity
    };
    return requestStockTransferNote;
  }

  static confirmOtherStockIssueResponseFromJson(
    data: any
  ): ConfirmOtherStockIssueResponse {
    if (!data) {
      return null;
    }
    const response: ConfirmOtherStockIssueResponse = {
      id: data.id,
      srcLocationCode: data.srcLocationCode,
      destLocationCode: data.destLocationCode,
      status: data.status,
      weightUnit: data.weightUnit,
      currencyCode: data.currencyCode,
      srcLocationDescription: data.srcLocationDescription,
      destLocationDescription: data.destLocationDescription,
      srcDocNo: data.srcDocNo,
      srcFiscalYear: data.srcFiscalYear,
      srcDocDate: data.srcDocDate,
      destDocNo: data.destDocNo,
      destDocDate: data.destDocDate,
      orderType: data.orderType,
      totalAvailableQuantity: data.totalAvailableQuantity,
      totalMeasuredQuantity: data.totalMeasuredQuantity,
      totalAvailableValue: data.totalAvailableValue,
      totalMeasuredValue: data.totalMeasuredValue,
      totalAvailableWeight: data.totalAvailableWeight,
      totalMeasuredWeight: data.totalMeasuredWeight,
      transferType: data.transferType,
      courierReceivedDate: data.courierReceivedDate,
      courierDetails: data.courierDetails
    };
    return response;
  }

  static getHistoryItem(
    issueItem: any,
    studdedProductGroups: string[] = []
  ): OtherIssuesHistoryItem {
    return {
      approvedQuantity: issueItem.approvedQuantity,
      binCode: issueItem.binCode,
      binGroupCode: issueItem.binGroupCode,
      id: issueItem.id,
      imageURL: issueItem.imageURL,
      issuedQuantity: issueItem.issuedQuantity,
      itemCode: issueItem.itemCode,
      itemDetails: {},
      itemValue: issueItem.itemValue,
      lotNumber: issueItem.lotNumber,
      mfgDate: moment(issueItem.mfgDate),
      orderType: issueItem.orderType,
      productCategory: issueItem.productCategory,
      productCategoryDesc: issueItem.productCategoryDesc,
      productGroup: issueItem.productGroup,
      productGroupDesc: issueItem.productGroupDesc,
      requestedQuantity: issueItem.requestedQuantity,
      status: issueItem.status,
      totalQuantity: issueItem.totalQuantity,
      totalValue: issueItem.totalValue,
      totalWeight: issueItem.totalWeight,
      weightUnit: issueItem.weightUnit,
      isUpdating: null,
      isUpdatingSuccess: null,
      itemWeight: issueItem.itemWeight,
      currencyCode: issueItem.currencyCode,
      inventoryId: issueItem.inventoryId,
      measuredWeight: issueItem.measuredWeight,
      availableQuantity: issueItem.availableQuantity,
      availableValue: issueItem.availableValue,
      availableWeight: issueItem.availableWeight,
      measuredQuantity: issueItem.measuredQuantity,
      measuredValue: issueItem.measuredValue,
      stdWeight: issueItem.stdWeight,
      stdValue: issueItem.stdValue,
      isStudded: studdedProductGroups.includes(issueItem.productGroup),
      isHallmarked:issueItem.isHallmarked,
    };
  }
}
