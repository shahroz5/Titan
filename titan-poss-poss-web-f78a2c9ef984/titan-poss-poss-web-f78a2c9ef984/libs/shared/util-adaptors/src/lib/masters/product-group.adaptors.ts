import {
  Complexity,
  PriceGroups,
  ProductGroup,
  ProductGroupMaster
} from '@poss-web/shared/models';

export class ProductGroupAdaptor {
  static productGroupDataFromJson(data: any): ProductGroup {
    return {
      productGroupCode: data.productGroupCode,
      description: data.description
    };
  }

  static priceGroupDataFromJson(data: any): PriceGroups {
    return {
      priceGroup: data.priceGroup,
      description: data.description
    };
  }

  static complexityDataFromJson(data: any): Complexity {
    return {
      complexityCode: data.complexityCode,
      description: data.description
    };
  }
}
export class ProductGroupMasterAdaptor {
  static productGroupMasterDataFromJson(data: any): ProductGroupMaster {
    return {
      configDetails: data.configDetails,
      description: data.description,
      isActive: data.isActive,
      orgCode: data.orgCode,
      productGroupCode: data.productGroupCode,
      productType: data.productType,
      materialCode: data.itemTypeCode
    };
  }
}
