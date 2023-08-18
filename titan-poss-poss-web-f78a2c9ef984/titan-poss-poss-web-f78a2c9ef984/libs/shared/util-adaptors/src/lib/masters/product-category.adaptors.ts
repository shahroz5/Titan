import {
  ProductCategory,
  ProductCategoryMaster
} from '@poss-web/shared/models';

export class ProductCategoryAdaptor2 {
  static productCategoryDataFromJson(data: any): ProductCategory {
    return {
      productCategoryCode: data.productCategoryCode,
      description: data.description
    };
  }
}
export class ProductCategoryMasterAdaptor {
  static productCategoryMasterDataFromJson(data: any): ProductCategoryMaster {
    return {
      configDetails: data.configDetails,
      description: data.description,
      isActive: data.isActive,
      orgCode: data.orgCode,
      productCategoryCode: data.productCategoryCode
    };
  }
}
