import {
  ProductCategory,
  ProductCategoryMaster
} from '@poss-web/shared/models';
import {
  ProductCategoryAdaptor2,
  ProductCategoryMasterAdaptor
} from '../masters/product-category.adaptors';

export class ProductCategoryHelper {
  static getProductCategorys(data: any): ProductCategory[] {
    const productCategorys: ProductCategory[] = [];
    for (const productCategory of data) {
      productCategorys.push(
        ProductCategoryAdaptor2.productCategoryDataFromJson(productCategory)
      );
    }
    return productCategorys;
  }
}
export class ProductCategoryMasterHelper {
  static getProductCategorysMaster(data: any): ProductCategoryMaster[] {
    const productCategorys: ProductCategoryMaster[] = [];
    for (const productCategory of data) {
      productCategorys.push(
        ProductCategoryMasterAdaptor.productCategoryMasterDataFromJson(
          productCategory
        )
      );
    }
    return productCategorys;
  }
}
