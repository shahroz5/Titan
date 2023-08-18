export interface ProductGroup {
  description: string;
  productGroupCode: string;
}

export interface PriceGroups {
  description: string;
  priceGroup: string;
}


export interface Complexity {
  description: string;
  complexityCode: string;
}
export interface ProductGroupMaster {
  configDetails: {};
  description: string;
  isActive: boolean;
  materialCode: string;
  orgCode: string;
  productGroupCode: string;
  productType: string;
}
