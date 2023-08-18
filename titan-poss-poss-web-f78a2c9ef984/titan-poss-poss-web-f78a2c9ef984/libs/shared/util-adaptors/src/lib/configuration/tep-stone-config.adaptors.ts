import {
  TEPStoneConfigListing,
  TEPStoneConfig,
  TEPStoneConfigDetails,
  TEPStoneConfigDetailsListing,
  TEPStoneConfigRange,
  TEPStoneConfigStoneType,
  TEPStoneConfigQualities,
  TEPStoneDetailsModify
} from '@poss-web/shared/models';

export class TepStoneConfigAdaptors {
  static getTepStoneConfigList(data: any): TEPStoneConfigListing {
    const tepStoneConfigList: TEPStoneConfig[] = [];
    let tepStoneConfigListing: TEPStoneConfigListing;
    for (const tepStoneConfiglistdata of data.results) {
      tepStoneConfigList.push({
        configId: tepStoneConfiglistdata?.configId,
        itemCode: tepStoneConfiglistdata?.itemCode,
        configType: tepStoneConfiglistdata?.configType,
        description: tepStoneConfiglistdata?.description,
        isActive: tepStoneConfiglistdata?.isActive
      });
    }
    tepStoneConfigListing = {
      results: tepStoneConfigList,
      totalElements: data.totalElements
    };

    return tepStoneConfigListing;
  }

  static getTepStoneConfigDetailsList(data: any): TEPStoneConfigDetailsListing {
    const tepStoneConfigDetailsList: TEPStoneConfigDetails[] = [];
    let tepStoneConfigDetailsListing: TEPStoneConfigDetailsListing;
    for (const tepStoneConfigDetailsListdata of data.results) {
      tepStoneConfigDetailsList.push({
        configId: tepStoneConfigDetailsListdata?.configId,
        id: tepStoneConfigDetailsListdata?.id,
        stoneTypeCode: tepStoneConfigDetailsListdata?.stoneTypeCode,
        description: tepStoneConfigDetailsListdata?.description,
        stoneQuality: tepStoneConfigDetailsListdata?.stoneQuality,
        rangeId: tepStoneConfigDetailsListdata?.rangeId,
        dedutionPercent: tepStoneConfigDetailsListdata?.dedutionPercent
      });
    }
    tepStoneConfigDetailsListing = {
      results: tepStoneConfigDetailsList,
      totalElements: data.totalElements
    };

    return tepStoneConfigDetailsListing;
  }
  static removeTepStoneConfigDetailsList(
    data: TEPStoneDetailsModify
  ): string[] {
    return data.removeStones;
  }

  static getTepStoneConfigDetails(data: any): TEPStoneConfig {
    const tepExceptionConfig: TEPStoneConfig = {
      configId: data.configId,
      description: data.description,
      itemCode: data.itemCode,
      configType: data.configType,
      isActive: data.isActive
    };

    return tepExceptionConfig;
  }

  static getTepStoneConfigDetailsNew(): TEPStoneConfig {
    const tepExceptionConfig: TEPStoneConfig = {
      configId: null,
      description: '',
      itemCode: '',
      configType: '',
      isActive: true
    };

    return tepExceptionConfig;
  }

  static getStoneQualitiesList(data: any): TEPStoneConfigQualities[] {
    const tepStoneConfigQualities: TEPStoneConfigQualities[] = [];
    for (const name of data.results) {
      tepStoneConfigQualities.push({
        name
      });
    }
    return tepStoneConfigQualities;
  }

  static getStoneTypeList(data: any): TEPStoneConfigStoneType[] {
    const tepStoneConfigStoneType: TEPStoneConfigStoneType[] = [];
    for (const item of data.results) {
      tepStoneConfigStoneType.push({
        stoneTypeCode: item.stoneTypeCode,
        description: item.description
      });
    }
    return tepStoneConfigStoneType;
  }

  static getRangesList(data: any): TEPStoneConfigRange[] {
    const tepStoneConfigRange: TEPStoneConfigRange[] = [];
    for (const item of data.results) {
      tepStoneConfigRange.push({
        id: item.id,
        range: item.fromRange + ' - ' + item.toRange
      });
    }
    return tepStoneConfigRange;
  }
}
