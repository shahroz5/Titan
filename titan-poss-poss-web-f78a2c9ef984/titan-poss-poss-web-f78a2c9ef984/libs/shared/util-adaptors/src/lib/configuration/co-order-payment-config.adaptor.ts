import {
  CoOrderPaymentConfigPayload,
  CoOrderPaymentConfigList,
  RequestApprovalEnum,
  CoOrderpyamentRulesResponse
} from '@poss-web/shared/models';

export class CoOrderPaymentConfigAdaptor {
  static getConfigDetailsListData(data: any): CoOrderPaymentConfigList {
    const configDetalis: CoOrderPaymentConfigPayload[] = [];
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

  static getSelectedConfigData(data: any): CoOrderPaymentConfigPayload {
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
  static getCoOrderPaymentDetails(data: any): CoOrderpyamentRulesResponse {
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
            ibtMetalRateFrozenPercentforGold:
              rule?.ruleDetails?.data?.ibt?.gold?.metalRateFrozenPercent,
            ibtMetalRateFrozenPercentforPlatinum:
              rule?.ruleDetails?.data?.ibt?.platinum?.metalRateFrozenPercent,
            ibtMetalRateNonFrozenPercentforGold:
              rule?.ruleDetails?.data?.ibt?.gold?.metalRateNonFrozenPercent,
            ibtMetalRateNonFrozenPercentforPlatinum:
              rule?.ruleDetails?.data?.ibt?.platinum?.metalRateNonFrozenPercent,
            ibtBestRatePercentforGold:
              rule?.ruleDetails?.data?.ibt?.gold?.bestRatePercent,
            ibtBestRatePercentforPlatinum:
              rule?.ruleDetails?.data?.ibt?.platinum?.bestRatePercent,
            mtrMetalRateFrozenPercentforGold:
              rule?.ruleDetails?.data?.mtr?.gold?.metalRateFrozenPercent,
            mtrMetalRateFrozenPercentforPlatinum:
              rule?.ruleDetails?.data?.mtr?.platinum?.metalRateFrozenPercent,
            mtrMetalRateNonFrozenPercentforGold:
              rule?.ruleDetails?.data?.mtr?.gold?.metalRateNonFrozenPercent,
            mtrMetalRateNonFrozenPercentforPlatinum:
              rule?.ruleDetails?.data?.mtr?.platinum?.metalRateNonFrozenPercent,
            mtrBestRatePercentforGold:
              rule?.ruleDetails?.data?.mtr?.gold?.bestRatePercent,
            mtrBestRatePercentforPlatinum:
              rule?.ruleDetails?.data?.mtr?.platinum?.bestRatePercent,
            prodMetalRateFrozenPercentforGold:
              rule?.ruleDetails?.data?.prod?.gold?.metalRateFrozenPercent,
            prodMetalRateFrozenPercentforPlatinum:
              rule?.ruleDetails?.data?.prod?.platinum?.metalRateFrozenPercent,
            prodMetalRateNonFrozenPercentforGold:
              rule?.ruleDetails?.data?.prod?.gold?.metalRateNonFrozenPercent,
            prodMetalRateNonFrozenPercentforPlatinum:
              rule?.ruleDetails?.data?.prod?.platinum
                ?.metalRateNonFrozenPercent,
            prodBestRatePercentforGold:
              rule?.ruleDetails?.data?.prod?.gold?.bestRatePercent,
            prodBestRatePercentforPlatinum:
              rule?.ruleDetails?.data?.prod?.platinum?.bestRatePercent,
            comMetalRateFrozenPercentforGold:
              rule?.ruleDetails?.data?.com?.gold?.metalRateFrozenPercent,
            comMetalRateFrozenPercentforPlatinum:
              rule?.ruleDetails?.data?.com?.platinum?.metalRateFrozenPercent,
            comMetalRateNonFrozenPercentforGold:
              rule?.ruleDetails?.data?.com?.gold?.metalRateNonFrozenPercent,
            comMetalRateNonFrozenPercentforPlatinum:
              rule?.ruleDetails?.data?.com?.platinum?.metalRateNonFrozenPercent,
            comBestRatePercentforGold:
              rule?.ruleDetails?.data?.com?.gold?.bestRatePercent,
            comBestRatePercentforPlatinum:
              rule?.ruleDetails?.data?.com?.platinum?.bestRatePercent,
            autoApprovalFrozenPercentforGold:
              rule?.ruleDetails?.data?.autoApproval?.gold
                ?.metalRateFrozenPercent,
            autoApprovalFrozenPercentforPlatinum:
              rule?.ruleDetails?.data?.autoApproval?.platinum
                ?.metalRateFrozenPercent,
            autoApprovalNonFrozenPercentforGold:
              rule?.ruleDetails?.data?.autoApproval?.gold
                ?.metalRateNonFrozenPercent,
            autoApprovalNonFrozenPercentforPlatinum:
              rule?.ruleDetails?.data?.autoApproval?.platinum
                ?.metalRateNonFrozenPercent,
            autoApprovalBestRatePercentforGold:
              rule?.ruleDetails?.data?.autoApproval?.gold?.bestRatePercent,
            autoApprovalBestRatePercentforPlatinum:
              rule?.ruleDetails?.data?.autoApproval?.platinum?.bestRatePercent
          });
        }
      }
      return {
        response: result,
        totalElements: data.totalElements
      };
    } else {
      return { response: [], totalElements: 0 };
    }
  }
}
