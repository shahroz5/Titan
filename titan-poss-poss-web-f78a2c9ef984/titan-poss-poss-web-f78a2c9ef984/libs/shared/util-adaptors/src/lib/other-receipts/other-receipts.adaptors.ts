import * as moment from 'moment';
import {
  OtherReceiptsIssuesEnum,
  OtherReceiptsModel,
  AdjustmentItem,
  OtherReceiptItem,
  LoadOtherReceiptsSTNCountPayload,
  LoadDropDownPayload
} from '@poss-web/shared/models';
export class OtherReceiptsAdaptor {
  static receiptSTNCountFromJson(data: any): LoadOtherReceiptsSTNCountPayload {
    let pendingOtherReceiptsSTNCount = 0;
    const countData = [];
    for (const stnCount of data.results) {
      if (
        stnCount.type === OtherReceiptsIssuesEnum.EXHIBITION_TYPE ||
        stnCount.type === OtherReceiptsIssuesEnum.LOAN
      ) {
        pendingOtherReceiptsSTNCount += stnCount.count;
        countData.push(stnCount);
      }
    }
    return {
      pendingOtherReceiptsSTNCount,
      countData
    };
  }

  static OtherRecieptsDropdownfromJson(data: any): LoadDropDownPayload {
    const dropDownValue = data.results;
    return {
      dropDownValue
    };
  }
  static OtherReceiptsDatafromJson(data: any): OtherReceiptsModel {
    // Thow error if not found
    if (!data) {
      // Throw
      return null;
    }

    const stockTransferNote: OtherReceiptsModel = {
      id: data.id,
      srcDocNo: data.srcDocNo,
      transactionType: data.transactionType,
      carrierDetails: {
        type: data.carrierDetails.type,
        data: data.carrierDetails.data
      },
      otherDetails: {
        type: data.otherDetails.type,
        data: data.otherDetails.data
      },
      srcDocDate: moment(data.srcDocDate),
      currencyCode: data.currencyCode,
      weightUnit: data.weightUnit,
      status: data.status,
      srcFiscalYear: data.srcFiscalYear,
      destDocDate: moment(data.destDocDate),
      destDocNo: data.destDocNo,
      totalAvailableQuantity: data.totalAvailableQuantity,
      totalAvailableValue: data.totalAvailableValue,
      totalAvailableWeight: data.totalAvailableWeight,
      totalMeasuredQuantity: data.totalMeasuredQuantity,
      totalMeasuredValue: data.totalMeasuredValue,
      totalMeasuredWeight: data.totalMeasuredWeight,
      locationCode: data.totalMeasuredWeight,
      orderType: data.orderType,
      remarks: data.remarks
    };
    return stockTransferNote;
  }
  static AdjustementConfirm(item: any): AdjustmentItem {
    const confirmAdjustementItem: AdjustmentItem = {
      id: item.id,
      binCode: item.binCode,
      binGroupCode: item.binGroupCode,
      itemCode: item.itemCode,
      measuredQuantity: item.measuredQuantity,
      measuredWeight: item.measuredWeight,
      productCategory: item.productCategoryDesc,
      productCategoryId: item.productCategory,
      productGroup: item.productGroupDesc,
      productGroupId: item.productGroup,
      stdValue: item.stdValue,
      destDocNo: item.destDocNo,
      imageURL: item.imageURL,
      thumbnailImageURL: item.thumbnailImageURL,
      taxDetails: item.taxDetails,
      isLoadingImage: false,
      isLoadingThumbnailImage: false,
      isHallmarked:item.isHallmarked,
    };

    return confirmAdjustementItem;
  }
  static OtherReceiptItemfromJson(
    item: any,
    studdedProductGroups: string[] = []
  ): OtherReceiptItem {
    return {
      id: item.id,
      binCode: item.binCode,
      itemCode: item.itemCode,
      itemDetails: item.itemDetails,
      itemValue: item.itemValue,
      lotNumber: item.lotNumber,
      mfgDate: moment(item.mfgDate),
      status: item.status,
      totalValue: item.totalValue,
      totalWeight: item.totalWeight,
      currencyCode: item.currencyCode,
      weightUnit: item.weightUnit,
      imageURL: item.imageURL,
      thumbnailImageURL: item.thumbnailImageURL,
      measuredQuantity: item.measuredQuantity,
      measuredWeight: item.measuredWeight,
      binGroupCode: item.binGroupCode,
      totalQuantity: item.totalQuantity,
      orderType: item.orderType,
      productCategory: item.productCategory,
      productGroup: item.productGroup,
      productCategoryDesc: item.productCategoryDesc,
      productGroupDesc: item.productGroupDesc,
      remarks: item.remarks,
      isUpdating: false,
      isUpdatingSuccess: null,
      stdValue: item.stdValue,
      stdWeight: item.stdWeight,
      availableQuantity: item.availableQuantity,
      availableWeight: item.availableWeight,
      availableValue: item.availableValue,
      measuredValue: item.measuredValue,
      isValidating: false,
      isValidatingSuccess: null,
      isValidatingError: false,
      isStudded: studdedProductGroups.includes(item.productGroup),
      taxDetails: item.taxDetails,
      isLoadingImage: false,
      isLoadingThumbnailImage: false,
      isHallmarked:item.isHallmarked
    };
  }
}
