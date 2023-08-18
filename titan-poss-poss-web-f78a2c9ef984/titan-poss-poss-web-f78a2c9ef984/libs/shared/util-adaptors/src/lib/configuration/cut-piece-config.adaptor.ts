import { ProductCategoryMappingList } from '@poss-web/shared/models';

export class CutPieceConfigAdaptor {
  static getConfigId(data: any): string {
    if(data && data.results && data.results.length > 0) {
      return data.results[0].configId;
    } else {
      return '';
    }
  }

  static getProductCategoryMappingList(
    data: any
  ): {
    response: ProductCategoryMappingList[];
    totalElements: number;
  } {
    const productCategoryMappingList: ProductCategoryMappingList[] = [];
    let cutPieceConfigList: {
      response: ProductCategoryMappingList[];
      totalElements: number;
    };
    for (const listItem of data.results) {
      productCategoryMappingList.push({
        id: listItem.id,
        productCategoryCode: listItem.productCategoryCode,
        cutPieceTepPercent: listItem.configDetails.data.cutPieceTepPercent
      });
    }
    cutPieceConfigList = {
      response: productCategoryMappingList,
      totalElements: data.totalElements
    };
    return cutPieceConfigList;
  }

  static getProductCategorySearchResult(
    data: any
  ): ProductCategoryMappingList[] {
    const productCategoryMappingList: ProductCategoryMappingList[] = [];

    for (const listItem of data.results) {
      productCategoryMappingList.push({
        id: listItem.id,
        productCategoryCode: listItem.productCategoryCode,
        cutPieceTepPercent: listItem.configDetails.data.cutPieceTepPercent
      });
    }
    return productCategoryMappingList;
  }
}
