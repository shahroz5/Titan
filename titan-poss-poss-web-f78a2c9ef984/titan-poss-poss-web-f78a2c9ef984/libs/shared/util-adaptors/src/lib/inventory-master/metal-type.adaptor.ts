import {
  MetalTypeListing,
  ProductCodeListPayload,
  ProductGroup,
  MaterialType,
  MaterialTypelov
} from '@poss-web/shared/models';

export class MetalTypeAdaptor {
  static getMetalTypeListData(data: any): MetalTypeListing {
    const metalTypeData: MaterialType[] = [];
    let metalTypeList: MetalTypeListing;
    for (const metalTypeItem of data.results) {
      metalTypeData.push({
        materialCode: metalTypeItem.materialTypeCode,
        description: metalTypeItem.description,
        isActive: metalTypeItem.isActive
      });
    }

    metalTypeList = {
      results: metalTypeData,
      totalElements: data.totalElements
    };

    return metalTypeList;
  }

  static getUpdatedMetalType(data: any) {
    const metalTypeData: MaterialType = {
      materialCode: data.materialTypeCode,
      description: data.description,
      isActive: data.isActive
    };

    return metalTypeData;
  }

  static getLoadMetalTypeByMaterialCodeData(data: any) {
    const metalType: MaterialType = {
      materialCode: data.materialTypeCode,
      description: data.description,
      isActive: data.isActive
    };
    return metalType;
  }
  static getMaterialTypeLovData(data: any) {
    const materialTypeLov: MaterialTypelov[] = [];
    for (const Materialdata of data) {
      materialTypeLov.push({
        code: Materialdata.code,
        value: Materialdata.code
      });
    }
    return materialTypeLov;
  }
  static getSearchMetalTypeListData(data: any): MetalTypeListing {
    const metalTypeData: MaterialType[] = [];
    let metalTypeList: MetalTypeListing;

    metalTypeData.push({
      materialCode: data ? data.materialTypeCode : '',

      description: data ? data.description : '',
      isActive: data.isActive
    });

    let totalElements;
    if (data) {
      totalElements = 1;
    } else {
      totalElements = 0;
    }

    metalTypeList = {
      results: metalTypeData,
      totalElements: totalElements
    };

    return metalTypeList;
  }

  static getProductGroupCode(data: any): ProductCodeListPayload {
    const productGroupCode: ProductGroup[] = [];
    let productCodeList: ProductCodeListPayload;
    for (const productGroupCodeData of data.results) {
      productGroupCode.push({
        productGroupCode: productGroupCodeData.productGroupCode,
        description: productGroupCodeData.description
      });
    }
    productCodeList = {
      productGroup: productGroupCode,
      totalProductGroup: data.totalElements
    };
    return productCodeList;
  }
}
