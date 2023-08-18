import { IssueInventoryItem } from '@poss-web/shared/models';
import * as moment from 'moment';

export class IssueItemAdaptor {
  static fromJson(
    issueItem: any,
    studdedProductGroups: string[] = [],
    showAcDetailsAsTax?: boolean
  ): IssueInventoryItem {
    return {
      availableQuantity: issueItem.availableQuantity,
      availableValue: issueItem.availableValue,
      availableWeight: issueItem.availableWeight,
      binCode: issueItem.binCode,
      binGroupCode: issueItem.binGroupCode,
      currencyCode: issueItem.currencyCode,
      finalValue: issueItem?.finalValue ? issueItem.finalValue : 0,
      id: issueItem.id,
      imageURL: issueItem.imageURL,
      thumbnailImageURL: issueItem.thumbnailImageURL,
      inventoryId: issueItem.inventoryId,
      itemCode: issueItem.itemCode,
      itemDetails: issueItem.itemDetails,
      lotNumber: issueItem.lotNumber,
      measuredQuantity: issueItem.measuredQuantity,
      measuredValue: issueItem.measuredValue,
      measuredWeight: issueItem.measuredWeight,
      mfgDate: moment(issueItem.mfgDate),
      orderType: issueItem.orderType,
      productCategory: issueItem.productCategory,
      productCategoryDesc: issueItem.productCategoryDesc,
      productGroup: issueItem.productGroup,
      productGroupDesc: issueItem.productGroupDesc,
      status: issueItem.status,
      stdValue: issueItem.stdValue,
      stdWeight: issueItem.stdWeight,
      weightUnit: issueItem.weightUnit,
      isUpdating: null,
      isUpdatingSuccess: null,
      isValidating: false,
      isValidatingSuccess: null,
      isValidatingError: false,
      isStudded: studdedProductGroups.includes(issueItem.productGroup),
      refDocDate: issueItem.refDocDate ? moment(issueItem.refDocDate) : null,
      refDocNumber: issueItem.refDocNumber ? issueItem.refDocNumber : 0,
      karatage: issueItem.karatage ? issueItem.karatage : null,
      refDocType: issueItem.refDocType ? issueItem.refDocType : null,
      taxDetails:
        showAcDetailsAsTax && issueItem.isacDetails
          ? this.getTaxDetails(issueItem.isacDetails)
          : issueItem.taxDetails,
      totalTax: issueItem?.totalTax ? issueItem.totalTax : 0,
      discount: issueItem?.itemLevelDiscount ? issueItem.itemLevelDiscount : 0,
      isLoadingImage: false,
      isLoadingThumbnailImage: false,
      preTaxValue: issueItem.preTaxValue ? issueItem.preTaxValue : 0,
      pricePerUnit: issueItem.pricePerUnit ? issueItem.pricePerUnit : 0
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
    if (isacDetails?.data?.IsacDetails?.length) {
      for (const item of isacDetails?.data?.IsacDetails) {
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
    }
    return taxDetails;
  }
}
