import {
  IbtConfigurationList,
  ActiveConfig,
  SelectedLocation,
  ActiveConfigs,
  IbtConfigurationResponse
} from '@poss-web/shared/models';

export class IbtConfigurationAdaptor {
  static getIbtConfigurationList(data: any): IbtConfigurationList {
    let ibtConfigurationList: IbtConfigurationList;
    let totalElements;
    const ibtConfigurations: IbtConfigurationResponse[] = [];
    for (const ibtConfigs of data.results) {
      ibtConfigurations.push({
        configId: ibtConfigs.ruleId,
        configType: ibtConfigs.ruleType,
        description: ibtConfigs.description,
        isActive: ibtConfigs.isActive,
        maxProductsPerStn: ibtConfigs
          ? ibtConfigs.ruleDetails
            ? ibtConfigs.ruleDetails.data
              ? ibtConfigs.ruleDetails.data.maxProductsPerStn
              : ''
            : ''
          : '',
        maxReqPerMonth: ibtConfigs
          ? ibtConfigs.ruleDetails
            ? ibtConfigs.ruleDetails.data
              ? ibtConfigs.ruleDetails.data.maxReqPerMonth
              : ''
            : ''
          : '',
        maxValPerStn: ibtConfigs
          ? ibtConfigs.ruleDetails
            ? ibtConfigs.ruleDetails.data
              ? ibtConfigs.ruleDetails.data.maxValPerStn
              : ''
            : ''
          : '',
        validRequestTime: ibtConfigs
          ? ibtConfigs.ruleDetails
            ? ibtConfigs.ruleDetails.data
              ? ibtConfigs.ruleDetails.data.validRequestTime
              : ''
            : ''
          : ''
      });
    }

    totalElements = data.totalElements;

    ibtConfigurationList = {
      ibtConfigList: ibtConfigurations,
      totalElements: totalElements
    };
    return ibtConfigurationList;
  }
  static getIbtConfiguration(data: any): IbtConfigurationResponse {
    let ibtConfigs: IbtConfigurationResponse;
    if (data) {
      ibtConfigs = {
        configId: data.ruleId ? data.ruleId : '',
        configType: data.ruleType ? data.ruleType : '',
        description: data.description ? data.description : '',
        isActive: data.isActive,
        maxProductsPerStn: data.ruleDetails
          ? data.ruleDetails.data
            ? data.ruleDetails.data.maxProductsPerStn
              ? data.ruleDetails.data.maxProductsPerStn.toString()
                ? data.ruleDetails.data.maxProductsPerStn
                : ''
              : ''
            : ''
          : '',
        maxReqPerMonth: data.ruleDetails
          ? data.ruleDetails.data
            ? data.ruleDetails.data.maxReqPerMonth
              ? data.ruleDetails.data.maxReqPerMonth.toString()
                ? data.ruleDetails.data.maxReqPerMonth
                : ''
              : ''
            : ''
          : '',
        maxValPerStn: data.ruleDetails
          ? data.ruleDetails.data
            ? data.ruleDetails.data.maxValPerStn
              ? data.ruleDetails.data.maxValPerStn.toString()
                ? data.ruleDetails.data.maxValPerStn
                : ''
              : ''
            : ''
          : '',
        validRequestTime: data.ruleDetails
          ? data.ruleDetails.data
            ? data.ruleDetails.data.validRequestTime
              ? data.ruleDetails.data.validRequestTime.toString()
                ? data.ruleDetails.data.validRequestTime
                : ''
              : ''
            : ''
          : ''
      };
    } else {
      ibtConfigs = {
        configId: 'new',
        configType: '',
        description: '',
        isActive: true,
        maxProductsPerStn: '',
        maxReqPerMonth: '',
        maxValPerStn: '',
        validRequestTime: ''
      };
    }

    return ibtConfigs;
  }

  static getSelectedLocations(data: any): SelectedLocation[] {
    const selectedLocations: SelectedLocation[] = [];
    for (const locations of data.results) {
      selectedLocations.push({
        id: locations.locationCode,
        description: locations.locationCode
      });
    }

    return selectedLocations;
  }

  static getActiveConfigs(data: any): ActiveConfigs[] {
    const activeConfigs: ActiveConfig[] = [];
    if (data) {
      for (const activeConfig of data.error.errorCause) {
        activeConfigs.push({
          configId: activeConfig.configId,
          locationCode: activeConfig.locationCode,
          configName: activeConfig.configName
        });
      }
    }

    return activeConfigs;
  }
}
