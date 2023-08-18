import {
  InvglobalConfiguration,
  InvglobalConfigurationFiledValue
} from '@poss-web/shared/models';

export class InventoryGlobalConfigAdaptor {
  static getInvGlobalConfigurationList(data: any) {
    const invglobalConfiguration: InvglobalConfiguration[] = [];
    for (const listdata of data.results) {
      invglobalConfiguration.push({
        configId: listdata.ruleId,
        description: listdata.description,
        configType: listdata.ruleType,
        isActive: listdata.isActive
      });
    }
    return invglobalConfiguration;
  }

  static getInvGlobalConfiguration(data: any) {
    const invglobalConfiguration: InvglobalConfiguration[] = [];

    invglobalConfiguration.push({
      configId: data.ruleId,
      description: data.description,
      configType: data.ruleType,
      isActive: data.isActive
    });

    return invglobalConfiguration;
  }

  static getInvGlobalConfigFiledValues(
    data: any
  ): InvglobalConfigurationFiledValue {
    let invConfigField: InvglobalConfigurationFiledValue;
    if (data) {
      console.log(data);
      invConfigField = {
        maxTimeToMoveTranscToHistory: data.ruleDetails
          ? data.ruleDetails.data
            ? data.ruleDetails.data.maxTimeToMovTransHist
            : ''
          : ''
      };
    }

    return invConfigField;
  }
}
