import { LocationPriceGroupMappingList } from '@poss-web/shared/models';

export class PriceGroupMappingAdaptor {
  static getPriceGroupMappingList(data: any): LocationPriceGroupMappingList[] {
    const locationPriceGroupMappingList: LocationPriceGroupMappingList[] = [];
    for (const resdata of data.results) {
      locationPriceGroupMappingList.push({
        id: resdata.id,
        priceGroup: resdata.priceGroup,
        pricingGroupType: resdata.pricingGroupType
      });
    }

    return locationPriceGroupMappingList;
  }
}
