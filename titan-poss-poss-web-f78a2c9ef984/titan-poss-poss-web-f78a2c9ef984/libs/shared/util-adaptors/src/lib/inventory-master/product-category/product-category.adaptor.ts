import {
  LoadProductCategoryListingSuccessPayload,
  ProductCategory,
  ProductCategoryDetails
} from '@poss-web/shared/models';

export class ProductCategoryAdaptor {
  static binGroupDetailsListing: LoadProductCategoryListingSuccessPayload;

  static getProductCategoryDetailsListing(
    data: any
  ): LoadProductCategoryListingSuccessPayload {
    const productCategoryDetailsListing: ProductCategory[] = [];
    for (const listItem of data.results) {
      productCategoryDetailsListing.push({
        productCategoryCode: listItem.productCategoryCode,
        description: listItem.description,
        isActive: listItem.isActive
      });
    }

    this.binGroupDetailsListing = {
      productCategoryListing: productCategoryDetailsListing,
      totalElements: data.totalElements
    };
    return this.binGroupDetailsListing;
  }
  static getProductCategoryDetails(data: any): ProductCategoryDetails {
    const productCategoryDetails: ProductCategoryDetails = {
      description: data.description,
      orgCode: data.orgCode,
      productCategoryCode: data.productCategoryCode,
      isActive: data.isActive,
      hallmarkDetails: data.hallmarkDetails,
      isConversionEnabled: data.isConversionEnabled,
      hallmarkQuantity: data.hallmarkQuantity
    };

    return productCategoryDetails;
  }

  static getProductCategoryDetailsSearch(data: any): ProductCategoryDetails[] {
    const productCategoryDetails: ProductCategoryDetails[] = [];
    productCategoryDetails.push({
      description: data.description,
      orgCode: data.orgCode,
      productCategoryCode: data.productCategoryCode,
      isActive: data.isActive,
      hallmarkDetails: data.hallmarkDetails,
      isConversionEnabled: data.isConversionEnabled,
      hallmarkQuantity: data.hallmarkQuantity
    });

    return productCategoryDetails;
  }
}
