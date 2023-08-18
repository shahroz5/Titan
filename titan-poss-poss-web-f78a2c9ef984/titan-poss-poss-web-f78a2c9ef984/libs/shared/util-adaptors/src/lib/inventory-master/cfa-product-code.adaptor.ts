import {
  LoadCFAProductCodeListingSuccessPayload,
  CFAProductsResponse,
  ItemTypesResponse,
  ProductGroupDetails
} from '@poss-web/shared/models';

export class CFAProductCodeAdaptor {
  static CFAProductCodeListingData: LoadCFAProductCodeListingSuccessPayload;
  static getCFAProductCodeListing(
    data: any
  ): LoadCFAProductCodeListingSuccessPayload {
    const CFAProductCodeListing: CFAProductsResponse[] = [];
    for (const listItem of data.results) {
      CFAProductCodeListing.push({
        productGroupCode: listItem.productGroupCode,
        description: listItem.description,
        isActive: listItem.isActive
      });
    }
    this.CFAProductCodeListingData = {
      CFAProductCodeListing: CFAProductCodeListing,
      totalElements: data.totalElements
    };
    return this.CFAProductCodeListingData;
  }
  static getCFAProductsBasdedOnProductGroupCode(): ProductGroupDetails {
    const productGroupDetails: ProductGroupDetails = {
      productGroupCode: '',
      hallmarkingExcludeGrams: 0,
      description: '',
      itemTypeCode: '',
      orgCode: '',
      isEligibleForLoyaltyPoints: false,
      printGuranteeCard: false,
      isGRNEnabled: false,
      isConversionEnabled: false,
      isAllowedForTCS: false,
      isHallmarked: false,
      isSolitaireStudded: false,
      isBestGoldRateEnabled: false,
      isGoldPriceMandatory: false,
      isMakingChargeMandatory: false,
      isAllowedForDigiGoldMandatory: false,
      isPlatinumPriceMandatory: false,
      isSilverPriceMandatory: false,
      isStonePriceMandatory: false,
      isActive: true,
      isMia: false,
      plainStudded: '',
      plainStuddedTep: '',
      plainStuddedGrn: '',
      hallmarkingExcludeKarat: '',
      plainStuddedGrf: '',
      pricingType: ''
    };
    return productGroupDetails;
  }
  static getProductGroupDetails(data): ProductGroupDetails {
    const productGroupDetails: ProductGroupDetails = {
      productGroupCode: data.productGroupCode,
      hallmarkingExcludeGrams:
        data?.configDetails?.data?.hallmarkingExcludeGrams,
      description: data.description,
      itemTypeCode: data.itemTypeCode,
      orgCode: data.orgCode,
      isEligibleForLoyaltyPoints:
        data?.configDetails?.data?.isEligibleForLoyaltyPoints,
      printGuranteeCard: data?.configDetails?.data?.printGuranteeCard,
      isGRNEnabled: data?.configDetails?.data?.isGRNEnabled,
      isConversionEnabled: data?.configDetails?.data?.isConversionEnabled,
      isAllowedForTCS: data?.configDetails?.data?.isAllowedForTCS,
      isHallmarked: data?.configDetails?.data?.isHallmarked,
      isSolitaireStudded: data?.configDetails?.data?.isSolitaireStudded,
      isBestGoldRateEnabled: data?.configDetails?.data?.isBestGoldRateEnabled,
      isGoldPriceMandatory: data?.pricingDetails?.data?.isGoldPriceMandatory,
      isSilverPriceMandatory:
        data?.pricingDetails?.data?.isSilverPriceMandatory,
      isPlatinumPriceMandatory:
        data?.pricingDetails?.data?.isPlatinumPriceMandatory,
      isStonePriceMandatory: data?.pricingDetails?.data?.isStonePriceMandatory,
      isMakingChargeMandatory:
        data?.pricingDetails?.data?.isMakingChargeMandatory,
      isAllowedForDigiGoldMandatory:
        data?.pricingDetails?.data?.isAllowedForDigiGoldMandatory,
      isActive: data.isActive,
      isMia: data.isMia,
      plainStudded: data ? data.plainStudded : '',
      plainStuddedTep: data ? data.plainStuddedTep : '',
      plainStuddedGrn: data ? data.plainStuddedGrn : '',
      plainStuddedGrf: data ? data.plainStuddedGrf : '',
      pricingType: data ? data.pricingType : '',
      hallmarkingExcludeKarat:
        data?.configDetails?.data?.hallmarkingExcludeKarat
    };
    return productGroupDetails;
  }
  static getCFASearchProduct(data: any): CFAProductsResponse[] {
    const CFAProduct: CFAProductsResponse[] = [];
    CFAProduct.push({
      productGroupCode: data.productGroupCode,
      description: data.description,
      isActive: data.isActive
    });
    return CFAProduct;
  }

  static getItemTypes(data: any): any {
    const itemTypes: ItemTypesResponse[] = [];
    for (const itemType of data.results) {
      itemTypes.push({
        id: itemType.itemTypeCode,
        name: itemType.description
      });
    }
    return itemTypes;
  }
}
