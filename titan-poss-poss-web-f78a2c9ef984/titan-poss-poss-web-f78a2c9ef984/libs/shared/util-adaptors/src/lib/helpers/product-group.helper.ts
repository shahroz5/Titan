import {
  Complexity,
  PriceGroups,
  ProductGroup,
  ProductGroupMaster
} from '@poss-web/shared/models';
import {
  ProductGroupAdaptor,
  ProductGroupMasterAdaptor
} from '../masters/product-group.adaptors';

export class ProductGroupHelper {
  static getProductGroups(data: any): ProductGroup[] {
    const productGroups: ProductGroup[] = [];
    for (const productGroup of data) {
      productGroups.push(
        ProductGroupAdaptor.productGroupDataFromJson(productGroup)
      );
    }
    return productGroups;
  }

  static getPriceGroups(data: any): PriceGroups[] {
    const priceGroups: PriceGroups[] = [];
    for (const productGroup of data) {
      priceGroups.push(
        ProductGroupAdaptor.priceGroupDataFromJson(productGroup)
      );
    }
    return priceGroups;
  }

  static getComplexity(data: any): Complexity[] {
    const complexity: Complexity[] = [];
    for (const productGroup of data) {
      complexity.push(
        ProductGroupAdaptor.complexityDataFromJson(productGroup)
      );
    }
    return complexity;
  }
}
export class ProductGroupMasterHelper {
  static getProductGroupsMaster(data: any): ProductGroupMaster[] {
    const productGroups: ProductGroupMaster[] = [];
    for (const productGroup of data) {
      productGroups.push(
        ProductGroupMasterAdaptor.productGroupMasterDataFromJson(productGroup)
      );
    }
    return productGroups;
  }
}
