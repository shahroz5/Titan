import { StockReceiveItem, ItemOrderTypeEnum } from '@poss-web/shared/models';
import * as moment from 'moment';

export class StockRecevieItemAdaptor {
  static fromJson(
    item: any,
    studdedProductGroups: string[] = []
  ): StockReceiveItem {
    return {
      id: item.id,
      binCode: item.binCode,
      itemCode: item.itemCode,
      itemDetails: item.itemDetails,
      stdValue: item.stdValue ? item.stdValue : 0,
      stdWeight: item.stdWeight,
      lotNumber: item.lotNumber,
      mfgDate: item.mfgDate ? moment(item.mfgDate) : null,
      status: item.status,
      availableValue: item.availableValue ? item.availableValue : 0,
      availableWeight: item.availableWeight,
      currencyCode: item.currencyCode,
      weightUnit: item.weightUnit,
      imageURL: item.imageURL,
      thumbnailImageURL: item.thumbnailImageURL,
      measuredQuantity: item.measuredQuantity ? item.measuredQuantity : 0,
      measuredWeight: item.measuredWeight,
      itemLevelDiscount: item.itemLevelDiscount,
      binGroupCode: item.binGroupCode,
      availableQuantity: item.availableQuantity ? item.availableQuantity : 0,
      orderType: item.orderType
        ? item.orderType.toUpperCase()
        : ItemOrderTypeEnum.REGUALR,
      productCategory: item.productCategory,
      productGroup: item.productGroup,
      productCategoryDesc: item.productCategoryDesc,
      productGroupDesc: item.productGroupDesc,
      remarks: item.remarks,
      isUpdating: false,
      isUpdatingSuccess: null,
      isValidating: false,
      isValidatingSuccess: null,
      isValidatingError: false,
      isStudded: studdedProductGroups.includes(item.productGroup),
      taxDetails: item.isacDetails
        ? this.getTaxDetails(item.isacDetails)
        : item.taxDetails,
      isLoadingImage: false,
      isLoadingThumbnailImage: false,
      value: item.value ? item.value : 0,
      finalValue: item.finalValue ? item.finalValue : 0,
      pricePerUnit: item.pricePerUnit ? item.pricePerUnit : 0,
      preTaxValue: item.preTaxValue ? item.preTaxValue : 0,
      totalTax: item.totalTax ? item.totalTax : 0
    };
  }

  static getTaxDetails(isacDetails) {
    const taxDetails = {
      data: {
        SGSTVal: 0,
        CGSTVal: 0,
        IGSTVal: 0,
        UTGSTVal: 0
      }
    };
    for (const item of isacDetails.data.IsacDetails) {
      if (item.glKey === 'SGST') {
        taxDetails.data.SGSTVal = item.amount;
      } else if (item.glKey === 'CGST') {
        taxDetails.data.CGSTVal = item.amount;
      } else if (item.glKey === 'IGST') {
        taxDetails.data.IGSTVal = item.amount;
      } else if (item.glKey === 'UTGST') {
        taxDetails.data.UTGSTVal = item.amount;
      }
    }
    return taxDetails;
  }
}
