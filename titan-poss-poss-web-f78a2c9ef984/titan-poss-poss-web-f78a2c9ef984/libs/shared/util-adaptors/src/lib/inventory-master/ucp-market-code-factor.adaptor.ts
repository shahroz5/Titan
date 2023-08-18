import {
  UcpMarketCode,
  UcpMarketCodeListing,
  MarketCode,
  UcpProductGroup
} from '@poss-web/shared/models';

export class UcpMarketCodeFactorAdaptor {
  static getUcpMarketCodeFactorList(data: any): UcpMarketCodeListing {
    let ucpMarketCodeListing: UcpMarketCodeListing;
    let totalElements: number;
    const ucpMarketCode: UcpMarketCode[] = [];
    for (const ucpMarketCodeItem of data.results) {
      ucpMarketCode.push({
        marketCode: ucpMarketCodeItem.marketCode,
        ucpCfa: ucpMarketCodeItem.productGroupCode,
        ucpFactor: ucpMarketCodeItem.markupFactor,
        id: ucpMarketCodeItem.id
      });
    }
    totalElements = data.totalElements;
    ucpMarketCodeListing = {
      results: ucpMarketCode,
      totalElements: totalElements
    };
    return ucpMarketCodeListing;
  }

  static getUcpMarketCodeFactorByCodeData(data): UcpMarketCode {
    let ucpMarketCode: UcpMarketCode;
    ucpMarketCode = {
      id: data.id,
      marketCode: data.marketCode,
      ucpFactor: data.markupFactor,
      ucpCfa: data.productGroupCode
    };
    return ucpMarketCode;
  }

  static getMarketCodeData(data: any): MarketCode[] {
    const marketCode: MarketCode[] = [];
    for (const marketCodeItem of data.results) {
      marketCode.push({
        id: marketCodeItem.marketCode,
        name: marketCodeItem.marketCode
      });
    }
    return marketCode;
  }

  static getUcpProductGroupData(data: any): UcpProductGroup[] {
    const ucpProductGroup: UcpProductGroup[] = [];
    for (const ucpProductGroupItem of data.results) {
      ucpProductGroup.push({
        id: ucpProductGroupItem.productGroupCode,
        name: ucpProductGroupItem.productGroupCode
      });
    }
    return ucpProductGroup;
  }
  // static getSearchResult(data: any): PriceGroupListing {
  //   let priceGrouplist: PriceGroupListing;
  //   let totalElements: number;
  //   const priceGroup: PriceGroupMaster[] = [];

  //   priceGroup.push({
  //     priceGroup: data.priceGroup,
  //     description: data.description,
  //     isActive: data.isActive
  //   });

  //   if (data) {
  //     totalElements = 1;
  //   } else {
  //     totalElements = 0;
  //   }
  //   priceGrouplist = {
  //     results: priceGroup,
  //     totalElements: totalElements
  //   };
  //   return priceGrouplist;
  // }
}
