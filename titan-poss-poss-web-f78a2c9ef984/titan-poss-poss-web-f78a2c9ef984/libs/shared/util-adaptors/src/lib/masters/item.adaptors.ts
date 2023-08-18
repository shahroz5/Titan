import { HttpClient } from '@angular/common/http';
import {
  Item,
  ItemSummary,
  ItemSummaryConversion,
  ItemStoneDetails,
  ImageUrlDetails
} from '@poss-web/shared/models';
export class ItemDataAdaptor {
  static ItemFromJson(data: any): Item {
    if (!data) {
      return null;
    }

    const item: Item = {
      brandCode: data.brandCode,
      complexityCode: data.complexityCode,
      configDetails: data.configDetails,
      description: data.description,
      indentTypeCode: data.indentTypeCode,
      isActive: data.isActive,
      itemCode: data.itemCode,
      itemDetails: data.itemDetails,
      leadTime: data.leadTime,
      materialCode: data.itemTypeCode,
      orgCode: data.orgCode,
      parentItemCode: data.parentItemCode,
      pricingGroupType: data.pricingGroupType,
      productCategoryCode: data.productCategoryCode,
      productGroupCode: data.productGroupCode,
      stdValue: data.stdValue,
      stdWeight: data.stdWeight,
      isEditable: data.isEditable
    };
    return item;
  }

  static ItemSummaryFromJson(
    data: any,
    studdedProductGroups?: string[]
  ): ItemSummary {
    if (!data) {
      return null;
    }
    console.log(data);
    const item: ItemSummary = {
      itemCode: data.itemCode,
      id: data?.id,
      productCategoryCode: data.productCategoryCode,
      productGroupCode: data.productGroupCode,
      stdValue: data.stdValue,
      productCategoryDesc: data.productCategoryDesc,
      productGroupDesc: data.productGroupDesc,
      imageURL: data?.imageURL,
      thumbnailImageURL: data?.thumbnailImageURL,
      isStudded: studdedProductGroups.includes(data.productGroupCode),
      taxDetails: data.taxDetails,
      isLoadingImage: false,
      isLoadingThumbnailImage: false,
      isHallmarked: data.isHallmarked,
    };
    return item;
  }

  static ItemSummaryConversionFromJson(data: any): ItemSummaryConversion {
    if (!data) {
      return null;
    }

    const item: ItemSummaryConversion = {
      childItems: data.childItems,
      complexityCode: data.complexityCode,
      description: data.description,
      itemCode: data.itemCode,
      lotNumber: data.lotNumber,
      mfgDate: data.mfgDate,
      parentItemCode: data.parentItemCode,
      productCategory: data.productCategory,
      productGroupCode: data.productGroupCode,
      productType: data.productType,
      stdValue: data.stdValue,
      stdWeight: data.stdWeight,
      stoneDetails: data.stoneDetails,
      productGroupDescription: data.productGroupDescription
    };
    return item;
  }

  static ItemStoneDetailsFromJson(data: any): ItemStoneDetails {
    if (!data) {
      return null;
    }

    const stoneDetails: ItemStoneDetails = {
      color: data.color,
      description: data.description,
      noOfStones: data.noOfStones,
      price: data.price,
      quality: data.quality,
      ratePerCarat: data.ratePerCarat,
      stoneCode: data.stoneCode,
      stoneWeight: data.stoneWeight,
      currencyCode: data.currencyCode,
      weightUnit: data.weightUnit
    };
    return stoneDetails;
  }

  static ImageUrlDetailsFromJson(data, imageData): ImageUrlDetails{
    const imageUrlDetails: ImageUrlDetails = {
      baseurl: data.baseurl + imageData.imageUrl,
      vendorDetails: {
        data: {
          apikey: data.vendorDetails.data.apikey,
          usertoken: data.vendorDetails.data.usertoken,
        }
      }
    }
    return imageUrlDetails;
  }
}
