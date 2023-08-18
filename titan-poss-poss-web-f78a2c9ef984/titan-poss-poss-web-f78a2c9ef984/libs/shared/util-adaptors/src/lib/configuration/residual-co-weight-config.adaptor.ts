import {
  ResidualWeightConfigResponse,
  ResidualWeightRange,
  ResidualWeightToleranceResponse
  // ResidualWeightConfigRanges
} from '@poss-web/shared/models';

export class ResidualCoWeightConfigAdaptor {
  static getResidualWeightConfigListData(
    data: any
  ): { data: ResidualWeightConfigResponse[]; totalElements: number } {
    const residualWeightConfiguration: ResidualWeightConfigResponse[] = [];
    if (data && data.results) {
      for (const listData of data.results) {
        residualWeightConfiguration.push({
          description: listData.description,
          isActive: listData.isActive,
          ruleId: listData.ruleId,
          ruleType: listData.ruleType,
          ruleDetails: listData.ruleDetails
        });
      }
    }

    return {
      data: residualWeightConfiguration,
      totalElements: data.totalElements
    };
  }

  static getResidualWeightConfiguration(
    data: any
  ): ResidualWeightConfigResponse {
    let config: ResidualWeightConfigResponse;
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

  static getResidualRangeWeight(data: any): ResidualWeightRange[] {
    const rangeWeight: ResidualWeightRange[] = [];
    for (const rangeWeightData of data.results) {
      if (rangeWeightData.isActive) {
        rangeWeight.push({
          range: rangeWeightData.fromRange + '-' + rangeWeightData.toRange,
          id: rangeWeightData.id,
          rowId: rangeWeightData.rowId
        });
      }
    }

    return rangeWeight;
  }
  static getWeightValueConfigDetailsNew(): ResidualWeightConfigResponse {
    const weightValueConfigDetails: ResidualWeightConfigResponse = {
      isActive: true,
      description: '',
      ruleId: null,
      ruleType: 'ORDER_CO_RESIDUAL_TOLERANCE_CONFIG',
      ruleDetails: {
        type: 'ORDER_CO_RESIDUAL_TOLERANCE_CONFIG',
        data: {
          valueBased: [
            {
              rowId: '1',
              fromRange: '',
              toRange: '',
              tolerancePercent: ''
            }
          ],
          weightBased: [
            {
              rowId: '1',
              fromRange: '',
              toRange: '',
              toleranceValue: ''
            }
          ]
        }
      }
    };

    return weightValueConfigDetails;
  }
  static getRangeMapping(data: any): ResidualWeightToleranceResponse {
    const range: any = [];
    if (data.results && data.results.length) {
      for (const result of data.results) {
        for (const rule of result.rules) {
          range.push({
            rangeId: rule.rangeId,
            configValue: rule.ruleDetails.data.configValue,
            configPercent: rule.ruleDetails.data.configPercent,
            metalType: rule.ruleDetails.data.metalType,
            id: rule.id
          });
        }
      }
      return { totalElements: data.totalElements, weightTolerance: range };
    }
  }
}
