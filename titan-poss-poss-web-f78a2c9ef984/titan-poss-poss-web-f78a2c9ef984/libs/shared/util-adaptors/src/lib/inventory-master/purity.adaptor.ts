import {
  PurityListResult,
  Purity,
  MaterialType
} from '@poss-web/shared/models';

export class PurityAdaptor {
  static getPurityListData(data: any): PurityListResult {
    let purityListResult: PurityListResult;
    const purityList: Purity[] = [];
    for (const purityData of data.results) {
      purityList.push({
        id: purityData.id,
        materialCode: purityData.itemTypeCode,
        description: purityData.description,
        purity: purityData.purity,
        karat: purityData.karat,
        offset: purityData.offset,
        isActive: purityData.isActive,
        isDisplayed: purityData.isDisplayed
      });
    }
    purityListResult = {
      purityList: purityList,
      totalElements: data.totalElements
    };
    return purityListResult;
  }

  static getSearchPurityByMaterialCode(data: any): PurityListResult {
    const purity: Purity[] = [];
    let purityListResult: PurityListResult;
    let totalElements: number;
    for (const purityData of data.results) {
      purity.push({
        id: purityData.id,
        materialCode: purityData.itemTypeCode,
        description: purityData.description,
        purity: purityData.purity,
        karat: purityData.karat,
        offset: purityData.offset,
        isActive: purityData.isActive
      });
    }

    if (!data) {
      totalElements = 0;
    } else {
      totalElements = data.totalElements;
    }

    purityListResult = {
      purityList: purity,
      totalElements: totalElements
    };
    return purityListResult;
  }

  static getMetalTypes(data: any): MaterialType[] {
    const metalType: MaterialType[] = [];
    for (const metalTypeData of data.results) {
      metalType.push({
        materialCode: metalTypeData.itemTypeCode,

        description: metalTypeData.description
      });
    }

    return metalType;
  }

  static getPurityByMaterialCodeAndPurity(data: any): Purity[] {
    const purity: Purity[] = [];
    for (const purityData of data.results) {
      purity.push({
        id: purityData.id,
        materialCode: purityData.itemTypeCode,
        purity: purityData.purity,
        karat: purityData.karat ? purityData.karat : 0,
        offset: purityData.offset,
        description: purityData.description,
        isActive: purityData.isActive,
        isDisplayed: purityData.isDisplayed
      });
    }

    return purity;
  }
}
