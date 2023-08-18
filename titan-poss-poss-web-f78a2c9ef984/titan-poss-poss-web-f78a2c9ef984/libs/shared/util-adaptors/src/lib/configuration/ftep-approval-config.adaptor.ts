import {
  ActiveConfig,
  ActiveConfigs,
  FtepApprovalConfigList,
  FtepApprovalConfigResponse,
  RoleList,
  SelectedLocation
} from '@poss-web/shared/models';

export class FtepApprovalConfigAdaptor {
  static getFtepApprovalConfigList(data: any): FtepApprovalConfigList {
    let ftepApprovalConfigList: FtepApprovalConfigList;
    let totalElements;
    const ftepApprovalConfigs: FtepApprovalConfigResponse[] = [];
    for (const ftepApprovalConfig of data.results) {
      ftepApprovalConfigs.push({
        ruleId: ftepApprovalConfig.ruleId,
        ruleType: ftepApprovalConfig.ruleType,
        description: ftepApprovalConfig.description,
        isActive: ftepApprovalConfig.isActive,
        config: ftepApprovalConfig.ruleDetails
          ? ftepApprovalConfig.ruleDetails.data
            ? ftepApprovalConfig.ruleDetails.data.config
              ? ftepApprovalConfig.ruleDetails.data.config
              : null
            : null
          : null
      });
    }
    if (ftepApprovalConfigs.length === 1) {
      totalElements = 1;
    } else {
      totalElements = data.totalElements;
    }
    ftepApprovalConfigList = {
      ftepApprovalConfigList: ftepApprovalConfigs,
      totalElements: totalElements
    };
    return ftepApprovalConfigList;
  }

  static getFtepApprovalConfig(data: any): FtepApprovalConfigResponse {
    let ftepApprovalConfigs: FtepApprovalConfigResponse;
    if (data) {
      ftepApprovalConfigs = {
        ruleId: data.ruleId ? data.ruleId : '',
        ruleType: data.ruleType ? data.ruleType : '',
        description: data.description ? data.description : '',
        isActive: data.isActive,
        config: data
          ? data.ruleDetails
            ? data.ruleDetails.data
              ? data.ruleDetails.data.config
                ? data.ruleDetails.data.config
                : null
              : null
            : null
          : null
      };
    } else {
      ftepApprovalConfigs = {
        ruleId: 'new',
        ruleType: '',
        description: '',
        isActive: true,
        config: null
      };
    }

    return ftepApprovalConfigs;
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

  static getRoleList(data: any): RoleList[] {
    const roleList: RoleList[] = [];
    if (data && data.results) {
      for (const role of data.results) {
        roleList.push({
          roleCode: role.code,
          roleName: role.value
        });
      }
    }
    return roleList;
  }
}
