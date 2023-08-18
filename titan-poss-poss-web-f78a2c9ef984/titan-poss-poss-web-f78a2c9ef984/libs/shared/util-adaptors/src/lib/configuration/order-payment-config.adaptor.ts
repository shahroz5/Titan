import {
  OrderPaymentConfigPayload,
  OrderPaymentConfigList,
  RequestApprovalEnum,
  OrderpyamentRulesResponse
} from '@poss-web/shared/models';

export class OrderPaymentConfigAdaptor {
  static getConfigDetailsListData(data: any): OrderPaymentConfigList {
    const configDetalis: OrderPaymentConfigPayload[] = [];
    let configDetailsList;
    for (const configData of data.results) {
      configDetalis.push({
        ruleId: configData.ruleId,
        description: configData.description,
        ruleType: configData.ruleType,
        isActive: configData.isActive,
        ruleDetails: configData.ruleDetails
      });
    }
    configDetailsList = {
      configList: configDetalis,
      totalElements: data.totalElements
    };
    return configDetailsList;
  }

  static getSelectedConfigData(data: any): OrderPaymentConfigPayload {
    let configData;
    configData = {
      ruleId: data.configId,
      description: data.description,
      ruleType: data.configType,
      isActive: data.isActive,
      ruleDetails: data.ruleTypes
    };
    return configData;
  }
  //name change
  static getOrderPaymentDetails(data: any): OrderpyamentRulesResponse {
    const result: any[] = [];
    console.log('data', data);

    if (data.results && data.results.length) {
      for (const response of data.results) {
        for (const rule of response.rules) {
          result.push({
            rangeId: rule.rangeId,
            productGroupCode: rule.productGroupCode,
            productCategoryCode: rule.productCategoryCode,
            id: rule.id,
            ruleDetails: rule.ruleDetails,
            metalRateFrozenPercent:
              rule.ruleDetails.data.metalRateFrozenPercent,
            metalRateNonFrozenPercent:
              rule.ruleDetails.data.metalRateNonFrozenPercent,
            bestRatePercent: rule.ruleDetails.data.bestRatePercent
          });
        }
      }
      return {
        response: result,
        totalElements: data.totalElements
      };
    }
    else{
      return {response: [], totalElements: 0};
    }
  }
}
