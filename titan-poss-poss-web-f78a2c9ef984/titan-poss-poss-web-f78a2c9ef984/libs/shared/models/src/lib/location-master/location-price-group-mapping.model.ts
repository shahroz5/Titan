export interface LocationPriceGroupMappingEmit {
  locationCode: string;
  priceGroupMapping: LocationPriceGroupMapping;
}

export interface LocationPriceGroupMapping {
  addPriceGroup: AddLocationPriceGroup[];
  removePriceGroup: string[];
}

export interface AddLocationPriceGroup {
  priceGroup: string;
  pricingGroupType: string;
}

export interface LocationPriceGroupMappingList {
  id: string;
  priceGroup: string;
  pricingGroupType: string;
}
