import {
  SaveComplexityPriceGroupFormPayload,
  LoadComplexityPriceGroupListingSuccessPayload,
  ComplexityPriceGroupDetails,
  ComplexityCodeData,
  PriceGroupData
} from '@poss-web/shared/models';


export class ComplexityPricegroupAdaptor {
  static complexityPricegroupDetailsListing: LoadComplexityPriceGroupListingSuccessPayload;

  static saveComplexityPricegroupDetails: SaveComplexityPriceGroupFormPayload;

  static getComplexityPricegroupDetailsListing(
    data: any
  ): LoadComplexityPriceGroupListingSuccessPayload {
    const complexityPricegroupDetailsListing: ComplexityPriceGroupDetails[] = [];
    for (const listItem of data.results) {
      complexityPricegroupDetailsListing.push({
        id: listItem.id,
        complexityCode: listItem.complexityCode ? listItem.complexityCode : '',
        priceGroup: listItem.priceGroup ? listItem.priceGroup : '',
        makingChargesPerUnit: listItem.makingChargePunit
          ? listItem.makingChargePunit
          : '',
        makingChargesPerGram: listItem.makingChargePgram
          ? listItem.makingChargePgram
          : '',
        wastagePercentage: listItem.wastagePct ? listItem.wastagePct : '',
        makingChargesPercentage: listItem.makingChargePct
          ? listItem.makingChargePct
          : '',
        isActive: listItem.isActive,
      });
    }
    this.complexityPricegroupDetailsListing = {
      complexityPricegroupListing: complexityPricegroupDetailsListing,
      totalElements: data.totalElements
    };

    return this.complexityPricegroupDetailsListing;
  }

  static getComplexityPricegroupById(data: any): ComplexityPriceGroupDetails {
    const complexityPriceGroupDetails: ComplexityPriceGroupDetails = {
      id: data.id,
      complexityCode: data.complexityCode ? data.complexityCode : '',
      priceGroup: data.priceGroup ? data.priceGroup : '',
      makingChargesPerUnit: data.makingChargePunit
        ? data.makingChargePunit
        : '',
      makingChargesPerGram: data.makingChargePgram
        ? data.makingChargePgram
        : '',
      wastagePercentage: data.wastagePct ? data.wastagePct : '',
      makingChargesPercentage: data.makingChargePct ? data.makingChargePct : '',
      isActive: data.isActive ? data.isActive : ''
    };
    return complexityPriceGroupDetails;
  }

  static getComplexityCode(data: any): ComplexityCodeData[] {
    console.log(data);
    const complexityCodes: ComplexityCodeData[] = [];
    for (const complexityCode of data.results) {
      complexityCodes.push({
        id: complexityCode.complexityCode,
        name: complexityCode.complexityCode
      });
    }
    console.log(complexityCodes);
    return complexityCodes;
  }

  static getPriceGroup(Data: any): PriceGroupData[] {
    console.log(Data);
    const pricegroups: PriceGroupData[] = [];
    for (const pricegroup of Data.results) {
      pricegroups.push({
        id: pricegroup.priceGroup,
        name: pricegroup.priceGroup
      });
    }
    console.log(pricegroups);
    return pricegroups;
  }
}
