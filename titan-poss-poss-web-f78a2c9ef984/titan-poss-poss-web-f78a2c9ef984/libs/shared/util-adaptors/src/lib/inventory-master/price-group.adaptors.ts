import {
  PriceGroupListing,
  PriceGroupMaster} from '@poss-web/shared/models';

export class PriceGroupAdaptor {
  static getPriceGroupMasterList(data: any): PriceGroupListing {
    let priceGrouplist: PriceGroupListing;
    let totalElements: number;
    const priceGroup: PriceGroupMaster[] = [];
    for (const priceGroupItem of data.results) {
      priceGroup.push({
        priceGroup: priceGroupItem.priceGroup,
        description: priceGroupItem.description,
        isActive: priceGroupItem.isActive
      });

    }
    totalElements = data.totalElements;
    priceGrouplist = {
      results: priceGroup,
      totalElements: totalElements
    };
    return priceGrouplist;
  }

  static getPriceGroupByPriceGroupCode(data): PriceGroupMaster {
    let priceGroup: PriceGroupMaster;
    priceGroup = {
      priceGroup: data.priceGroup,
      description: data.description,
      isActive: data.isActive
    };
    return priceGroup;
  }

  static getSearchResult(data: any): PriceGroupListing {
    let priceGrouplist: PriceGroupListing;
    let totalElements: number;
    const priceGroup: PriceGroupMaster[] = [];

    priceGroup.push({
      priceGroup: data.priceGroup,
      description: data.description,
      isActive: data.isActive
    });

    if (data) {
      totalElements = 1;
    } else {
      totalElements = 0;
    }
    priceGrouplist = {
      results: priceGroup,
      totalElements: totalElements
    };
    return priceGrouplist;
  }
}
