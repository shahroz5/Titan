import {
  AbToleranceConfigResponse,
  AbToleranceWeightRange,
  AbToleranceConfigMetalType,
  AbToleranceConfigDetailsResPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class AbToleranceConfigAdaptor {
  static getAbToleranceConfigListData(
    data: any
  ): { data: AbToleranceConfigResponse[]; totalElements: number } {
    const residualWeightConfiguration: AbToleranceConfigResponse[] = [];
    if (data && data.results) {
      for (const listData of data.results) {
        residualWeightConfiguration.push({
          description: listData.description.trim(),
          isActive: listData.isActive,
          ruleId: listData.ruleId,
          ruleType: listData.ruleType,
          ruleDetails: listData.ruleDetails,
          createdDate: listData.createdDate? moment(listData.createdDate): '',
          lastModifiedDate: listData.lastModifiedDate? moment(listData.lastModifiedDate): ''
        });
      }
    }

    return {
      data: residualWeightConfiguration,
      totalElements: data.totalElements
    };
  }
  static getSelectedConfigData(data: any): AbToleranceConfigResponse {
    let configData;
    configData = {
      ruleId: data.ruleId,
      description: data.description.replace(/ {2,}/g, ' ').trim(),
      ruleType: data.ruleType,
      isActive: data.isActive,
      ruleDetails: data.ruleDetails
    };
    return configData;
  }
  static getAbToleranceConfiguration(data: any): AbToleranceConfigResponse {
    let config: AbToleranceConfigResponse;
    if (data) {
      config = {
        ruleId: data.ruleId ? data.ruleId : '',
        ruleType: data.ruleType ? data.ruleType : '',
        description: data.description ? data.description : '',
        isActive: data.isActive,
        ruleDetails: data.ruleDetails ? data.ruleDetails : ''
      };
    } else {
      config = null;
      // {
      //   configId: 'new',
      //   configType: '',
      //   description: '',
      //   isActive: true,
      //   maxProductsPerStn: '',
      //   maxReqPerMonth: '',
      //   maxValPerStn: '',
      //   validRequestTime: ''
      // };
    }

    return config;
  }

  static getAbToleranceRangeWeight(data: any): AbToleranceWeightRange[] {
    const rangeWeight: AbToleranceWeightRange[] = [];
    for (const rangeWeightData of data.results) {
      // if (rangeWeightData.isActive) {
      rangeWeight.push({
        range: rangeWeightData.fromRange + '-' + rangeWeightData.toRange,
        id: rangeWeightData.id,
        rowId: rangeWeightData.rowId
      });
      // }
    }

    return rangeWeight;
  }
  // static getWeightValueConfigDetailsNew(): AbToleranceConfigResponse {
  //   const weightValueConfigDetails: AbToleranceConfigResponse = {
  //     isActive: true,
  //     description: '',
  //     ruleId: null,
  //     ruleType: 'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG',
  //     ruleDetails: {
  //       type: 'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG',
  //       data: {
  //         valueBased: [
  //           {
  //             rowId: '1',
  //             fromRange: '',
  //             toRange: '',
  //             tolerancePercent: ''
  //           }
  //         ],
  //         weightBased: [
  //           {
  //             rowId: '1',
  //             fromRange: '',
  //             toRange: '',
  //             toleranceValue: ''
  //           }
  //         ]
  //       }
  //     }
  //   };

  //   return weightValueConfigDetails;
  // }
  static getConfigMapping(data: any): AbToleranceConfigDetailsResPayload {
    const range: any = [];
    if (data.results && data.results.length) {
      for (const result of data.results) {
        for (const rule of result.rules) {
          range.push({
            rangeId: rule.rangeId,
            configValue: rule.ruleDetails.data.configValue
              ? rule.ruleDetails.data.configValue
              : '',
            configPercent: rule.ruleDetails.data.configPercent
              ? rule.ruleDetails.data.configPercent
              : '',
            metalType: rule.metalType,
            id: rule.id
          });
        }
      }
      return { ruleDetails: range, totalElements: data.totalElements };
    }
    else{
      return { ruleDetails: [], totalElements: 0 };
    }
  }

  static getBgrRangeMapping(data: any) {
    const ranges = [];
    if (data && data.results) {
      data.results.forEach((result: any) => {
        const configObject = {
          rangeId: result.rules[0].rangeId,
          id: result.rules[0].id,
          configPercent: result.rules[0].ruleDetails.data.configPercent,
          configValue: result.rules[0].ruleDetails.data.configValue,
          metalType: result.rules[0].metalType
        };
        ranges.push(configObject);
      });
    }
    return ranges;
  }

  static getConfigMappingNew() {
    const range: any = [];
    range.push({
      rangeId: '',
      configValue: '',
      configPercent: '',
      metalType: '',
      id: ''
    });

    return range;
  }

  static getAbToleranceConfigMetalTypes(
    data: any
  ): AbToleranceConfigMetalType[] {
    const metalTypes: AbToleranceConfigMetalType[] = [];
    for (const metal of data.results) {
      metalTypes.push({
        materialTypeCode: metal.itemTypeCode,
        description: metal.description
      });
    }
    return metalTypes;
  }
}
