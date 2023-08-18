
import {
  LoadMarketCodeListingSuccessPayload,
  MarketCodeDetails,
  MarketCodeEnums,
  MarketMaterialFactors,
  MetalTypeEnum
} from '@poss-web/shared/models';
export class MarketCodeAdaptor {
  static marketCodeListing: LoadMarketCodeListingSuccessPayload;
  static getMarketCodeListing(data: any): LoadMarketCodeListingSuccessPayload {
    const marketCodes: MarketCodeDetails[] = [];
    for (const listItem of data.results) {
      marketCodes.push({
        marketCode: listItem.marketCode,
        description: listItem.description,
        isActive: listItem.isActive
      });
    }
    this.marketCodeListing = {
      marketCodeListing: marketCodes,
      totalElements: data.totalElements
    };
    return this.marketCodeListing;
  }
  static getMarketMaterialFacators(data: any): MarketMaterialFactors {
    let materialDetails: any = {};

    if (data.marketMarkupFactors) {
      for (const materialFactorsDetails of data.marketMarkupFactors) {
        if (materialFactorsDetails.metalTypeCode === MetalTypeEnum.GOLD) {
          materialDetails = {
            goldAddAmount: materialFactorsDetails.addAmount,
            goldDeductAmount: materialFactorsDetails.deductAmount,
            goldMarkupFactor: materialFactorsDetails.markupFactor,
            silverAddAmount: materialDetails.silverAddAmount,
            silverDeductAmount: materialDetails.silverDeductAmount,
            silverMarkupFactor: materialDetails.silverMarkupFactor,
            platinumAddAmount: materialDetails.platinumAddAmount,
            platinumDeductAmount: materialDetails.platinumDeductAmount,
            platinumMarkupFactor: materialDetails.platinumMarkupFactor,
            f1MarkupFactor: materialDetails.f1MarkupFactor,
            f2MarkupFactor: materialDetails.f2MarkupFactor
          };
        } else if (
          materialFactorsDetails.metalTypeCode === MetalTypeEnum.PLATINUM
        ) {
          materialDetails = {
            goldAddAmount: materialDetails.goldAddAmount,
            goldDeductAmount: materialDetails.goldDeductAmount,
            goldMarkupFactor: materialDetails.goldMarkupFactor,
            silverAddAmount: materialDetails.silverAddAmount,
            silverDeductAmount: materialDetails.silverDeductAmount,
            silverMarkupFactor: materialDetails.silverMarkupFactor,
            platinumAddAmount: materialFactorsDetails.addAmount,
            platinumDeductAmount: materialFactorsDetails.deductAmount,
            platinumMarkupFactor: materialFactorsDetails.markupFactor,
            f1MarkupFactor: materialDetails.f1MarkupFactor,
            f2MarkupFactor: materialDetails.f2MarkupFactor
          };
        } else if (
          materialFactorsDetails.metalTypeCode === MetalTypeEnum.SILVER
        ) {
          materialDetails = {
            goldAddAmount: materialDetails.goldAddAmount,
            goldDeductAmount: materialDetails.goldDeductAmount,
            goldMarkupFactor: materialDetails.goldMarkupFactor,
            silverAddAmount: materialFactorsDetails.addAmount,
            silverDeductAmount: materialFactorsDetails.deductAmount,
            silverMarkupFactor: materialFactorsDetails.markupFactor,
            platinumAddAmount: materialDetails.platinumAddAmount,
            platinumDeductAmount: materialDetails.platinumDeductAmount,
            platinumMarkupFactor: materialDetails.platinumMarkupFactor,
            f1MarkupFactor: materialDetails.f1MarkupFactor,
            f2MarkupFactor: materialDetails.f2MarkupFactor
          };
        } else if (
          materialFactorsDetails.metalTypeCode === MarketCodeEnums.f1
        ) {
          materialDetails = {
            goldAddAmount: materialDetails.goldAddAmount,
            goldDeductAmount: materialDetails.goldDeductAmount,
            goldMarkupFactor: materialDetails.goldMarkupFactor,
            silverAddAmount: materialDetails.silverAddAmount,
            silverDeductAmount: materialDetails.silverDeductAmount,
            silverMarkupFactor: materialDetails.silverMarkupFactor,
            platinumAddAmount: materialDetails.platinumAddAmount,
            platinumDeductAmount: materialDetails.platinumDeductAmount,
            platinumMarkupFactor: materialDetails.platinumMarkupFactor,
            f1MarkupFactor: materialFactorsDetails.markupFactor,
            f2MarkupFactor: materialDetails.f2MarkupFactor
          };
        } else if (
          materialFactorsDetails.metalTypeCode === MarketCodeEnums.f2
        ) {
          materialDetails = {
            goldAddAmount: materialDetails.goldAddAmount,
            goldDeductAmount: materialDetails.goldDeductAmount,
            goldMarkupFactor: materialDetails.goldMarkupFactor,
            silverAddAmount: materialDetails.silverAddAmount,
            silverDeductAmount: materialDetails.silverDeductAmount,
            silverMarkupFactor: materialDetails.silverMarkupFactor,
            platinumAddAmount: materialDetails.platinumAddAmount,
            platinumDeductAmount: materialDetails.platinumDeductAmount,
            platinumMarkupFactor: materialDetails.platinumMarkupFactor,
            f1MarkupFactor: materialDetails.f1MarkupFactor,
            f2MarkupFactor: materialFactorsDetails.markupFactor
          };
        }
      }
    } else {
      materialDetails = {
        goldAddAmount: '',
        goldDeductAmount: '',
        goldMarkupFactor: '',
        silverAddAmount: '',
        silverDeductAmount: '',
        silverMarkupFactor: '',
        platinumAddAmount: '',
        platinumDeductAmount: '',
        platinumMarkupFactor: '',
        f1MarkupFactor: '',
        f2MarkupFactor: ''
      };
    }
    return materialDetails;
  }

  static getMarketCodeSearchResult(data: any): MarketCodeDetails[] {
    const marketCodeDetails: MarketCodeDetails[] = [];
    marketCodeDetails.push({
      marketCode: data.marketCode,
      description: data.description,
      isActive: data.isActive
    });

    return marketCodeDetails;
  }
  static getMarketCodeDetails(data: any): MarketCodeDetails {
    const marketCodeDetails: MarketCodeDetails = {
      marketCode: data.marketCode,
      description: data.description,
      isActive: data.isActive
    };
    return marketCodeDetails;
  }
  static getMarketCodeDetailsBasedOnMarketCode(data: any): MarketCodeDetails {
    const marketCodeDetails: MarketCodeDetails = {
      marketCode: MarketCodeEnums.NEW,
      description: '',
      isActive: false,
      marketMaterialFacators: {
        goldAddAmount: '',
        goldDeductAmount: '',
        goldMarkupFactor: '',
        silverAddAmount: '',
        silverDeductAmount: '',
        silverMarkupFactor: '',
        platinumAddAmount: '',
        platinumDeductAmount: '',
        platinumMarkupFactor: '',
        f1MarkupFactor: '',
        f2MarkupFactor: ''
      }
    };
    return marketCodeDetails;
  }
}
