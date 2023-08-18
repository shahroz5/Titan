import {
  ProductGroup,
  ProductGroupMappingOption,
  ProductGroupMappingResponse
} from '@poss-web/shared/models';

export class EncircleProductGroupMappingAdaptor {
  static getSelectedProductGroups(data: any): ProductGroupMappingResponse {
    let productMapping: ProductGroupMappingResponse;
    const productGroup: ProductGroupMappingOption[] = [];
    for (const pros of data.results) {
      productGroup.push({
        uuid: pros.id,
        id: pros.productGroupCode,
        description: pros.productGroupCode
      });
    }

    productMapping = {
      response: productGroup,
      totalElements: data.totalElements
    };
    return productMapping;
  }
  static getProductGroups(data: any): ProductGroupMappingOption[] {
    const productGroup: ProductGroupMappingOption[] = [];
    productGroup.push({
      uuid: data.id,
      id: data.productGroupCode,
      description: data.productGroupCode
    });
    return productGroup;
  }
}
