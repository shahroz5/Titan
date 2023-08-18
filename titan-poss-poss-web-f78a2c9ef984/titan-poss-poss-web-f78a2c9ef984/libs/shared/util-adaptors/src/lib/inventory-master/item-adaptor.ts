import {
  LoadItemListingSuccessPayload,
  ListingPageData,
  ItemStones
} from '@poss-web/shared/models';
import { ItemDetails } from '@poss-web/shared/models';

export class ItemAdaptor {
  static itelDetailsListing: LoadItemListingSuccessPayload;

  static getItemDetailsListing(data: any): LoadItemListingSuccessPayload {
    const itemDetailsListing: ListingPageData[] = [];
    for (const listItem of data.results) {
      itemDetailsListing.push({
        itemCode: listItem.itemCode,
        description: listItem.description
      });
    }

    this.itelDetailsListing = {
      itemListing: itemDetailsListing,
      totalElements: data.totalElements
    };
    return this.itelDetailsListing;
  }

  static getItemDetailsByItemCode(data: any): ItemDetails {
    for (const listItem of data.results) {
      const itemByItemCode: ItemDetails = {
        isEditable: listItem.isEditable ? listItem.isEditable : false,
        itemCode: listItem.itemCode ? listItem.itemCode : '',
        description: listItem.description ? listItem.description : '',
        stdWeight: listItem.stdWeight ? listItem.stdWeight.toFixed(3) : '',
        stdPrice: listItem.stdValue ? listItem.stdValue.toFixed(2) : '',
        complexityCode: listItem.complexityCode ? listItem.complexityCode : '',
        CFAproductCode: listItem.productGroupCode
          ? listItem.productGroupCode
          : '',
        productCode: listItem.productCategoryCode
          ? listItem.productCategoryCode
          : '',
        brandCode: listItem.brandCode ? listItem.brandCode : '',
        leadTime: listItem.leadTime ? listItem.leadTime : '',
        isActive: listItem.isActive,
        materialCode: listItem.itemTypeCode ? listItem.itemTypeCode : '',
        stoneCharges: listItem.stoneCharges
          ? listItem.stoneCharges.toFixed(2)
          : '',
        purity: listItem.purity ? listItem.purity : '',
        pricingType: listItem.pricingType ? listItem.pricingType : '',
        taxClass: listItem.taxClassCode ? listItem.taxClassCode : '',
        pricingGroupType: listItem.pricingGroupType
          ? listItem.pricingGroupType
          : '',
        priceFactor: listItem.priceFactor
          ? listItem.priceFactor.toFixed(3)
          : '',
        ...ItemAdaptor.getItemDetails(listItem.itemDetails),
        ...ItemAdaptor.getConfigDetails(listItem.configDetails),
        karatage: listItem.karat ? listItem.karat : '',
        saleable: listItem.isSaleable,
        returnable: listItem.isReturnable
      };

      return itemByItemCode;
    }
  }

  static getItemDetails(item) {
    const itemDetails = {
      indentType: '',
      inventoryType: '',
      stoneWeight: '',
      supplyChainCode: '',
      maxWeightDeviation: '',
      hsnSacCode: '',
      productType: '',
      itemNature: '',
      finishing: '',
      findingCode: '',
      size: '',
      diamondKaratage: '',
      diamondClarity: '',
      diamondColour: ''
    };
    if (!item) return itemDetails;
    else {
      return {
        stoneWeight: item.data.stoneWeight ? item.data.stoneWeight : '',
        indentType: item.data.indentType ? item.data.indentType : '',
        inventoryType: item.data.inventoryType ? item.data.inventoryType : '',
        supplyChainCode: item.data.supplyChainCode
          ? item.data.supplyChainCode
          : '',
        maxWeightDeviation: item.data.maxWeightDeviation
          ? item.data.maxWeightDeviation
          : '',
        hsnSacCode: item.data.HSN_SAC_Code ? item.data.HSN_SAC_Code : '',
        productType: item.data.productType ? item.data.productType : '',
        itemNature: item.data.itemNature ? item.data.itemNature : '',
        finishing: item.data.finishing ? item.data.finishing : '',
        findingCode: item.data.findingCode ? item.data.findingCode : '',
        size: item.data.size ? item.data.size : '',
        diamondKaratage: item.data.diamondCaratage
          ? item.data.diamondCaratage
          : '',
        diamondClarity: item.data.diamondClarity
          ? item.data.diamondClarity
          : '',
        diamondColour: item.data.diamondColor ? item.data.diamondColor : ''
      };
    }
  }
  static getConfigDetails(configData) {
    const configDetails = {
      perGram: false,
      indentable: false,
      isConsignable: false,
      interBrandAcceptable: false
    };
    if (!configData) return configDetails;
    else {
      return {
        perGram: configData.data.isPerGram,
        isConsignable: configData.data.ConsignmentFlag
          ? configData.data.ConsignmentFlag === 0
            ? false
            : true
          : false,
        indentable: configData.data.isForIndent
        // interBrandAcceptable: configData.data.IsInterBrandAcceptance
      };
    }
  }

  static getSearchItem(data: any): ListingPageData[] {
    const Item: ListingPageData[] = [];
    for (const listItem of data.results) {
      Item.push({
        itemCode: listItem.itemCode,
        description: listItem.description
      });
    }
    return Item;
  }
  static getItemStones(data: any): ItemStones[] {
    const itemStones: ItemStones[] = [];
    for (const stoneData of data.results) {
      itemStones.push({
        stoneCode: stoneData.stoneCode,
        id: stoneData.id,
        isActive: true,
        itemCode: stoneData.itemCode,
        noOfStones: stoneData.noOfStones
      });
    }
    return itemStones;
  }
  // static getCFAProductCode(data: any): CFAProductCodesData[] {
  //   const CFAProductCodes: CFAProductCodesData[] = [];
  //   for (const CFAProductCode of data.results) {
  //     CFAProductCodes.push({
  //       id: CFAProductCode.productGroupCode,
  //       name: CFAProductCode.description
  //     });
  //   }
  //   return CFAProductCodes;
  // }
}
