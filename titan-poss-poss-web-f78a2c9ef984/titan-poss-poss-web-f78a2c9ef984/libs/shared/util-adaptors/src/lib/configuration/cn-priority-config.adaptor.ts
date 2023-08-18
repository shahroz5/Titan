import {
  ActiveConfig,
  SelectedLocation,
  ActiveConfigs,
  CnPriorityConfigList,
  CnPriorityConfigResponse,
  CnTypeList
} from '@poss-web/shared/models';

export class CnPriorityConfigAdaptor {
  static getCnPriorityConfigList(data: any): CnPriorityConfigList {
    let cnPriorityConfigList: CnPriorityConfigList;
    let totalElements;
    const cnPriorityConfigs: CnPriorityConfigResponse[] = [];
    for (const cnPriorityConfig of data.results) {
      cnPriorityConfigs.push({
        configId: cnPriorityConfig.ruleId,
        configType: cnPriorityConfig.ruleType,
        description: cnPriorityConfig.description,
        isActive: cnPriorityConfig.isActive,
        priorityDetails: cnPriorityConfig.ruleDetails
          ? cnPriorityConfig.ruleDetails.data
            ? cnPriorityConfig.ruleDetails.data.priorityDetails
              ? cnPriorityConfig.ruleDetails.data.priorityDetails
              : null
            : null
          : null
      });
    }
    if (cnPriorityConfigs.length === 1) {
      totalElements = 1;
    } else {
      totalElements = data.totalElements;
    }
    cnPriorityConfigList = {
      cnPriorityConfigList: cnPriorityConfigs,
      totalElements: totalElements
    };
    return cnPriorityConfigList;
  }
  static getCnPriorityConfig(data: any): CnPriorityConfigResponse {
    let cnPriorityConfig: CnPriorityConfigResponse;
    if (data) {
      cnPriorityConfig = {
        configId: data.ruleId ? data.ruleId : '',
        configType: data.ruleType ? data.ruleType : '',
        description: data.description ? data.description : '',
        isActive: data.isActive,
        priorityDetails: data.ruleDetails
          ? data.ruleDetails.data
            ? data.ruleDetails.data.priorityDetails
              ? data.ruleDetails.data.priorityDetails
              : null
            : null
          : null
      };
    } else {
      cnPriorityConfig = {
        configId: 'new',
        configType: '',
        description: '',
        isActive: true,
        priorityDetails: null
      };
    }

    return cnPriorityConfig;
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

  static getCnTypeList(data: any): CnTypeList[] {
    const cnTypeList: CnTypeList[] = [];
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          cnTypeList.push({
            id: key,
            description: data[key]
          });
        }
      }
    }

    return cnTypeList;
  }
}
