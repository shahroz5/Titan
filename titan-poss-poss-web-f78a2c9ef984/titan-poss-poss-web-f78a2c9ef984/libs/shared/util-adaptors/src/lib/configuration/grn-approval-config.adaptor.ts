import {
  ActiveConfig,
  ActiveConfigs,
  GrnApprovalConfigList,
  GrnApprovalConfigResponse,
  RoleList,
  SelectedLocation
} from '@poss-web/shared/models';

export class GrnApprovalConfigAdaptor {
  static getGrnApprovalConfigList(data: any): GrnApprovalConfigList {
    let grnApprovalConfigList: GrnApprovalConfigList;
    let totalElements;
    const grnApprovalConfigs: GrnApprovalConfigResponse[] = [];
    for (const grnApprovalConfig of data.results) {
      grnApprovalConfigs.push({
        ruleId: grnApprovalConfig.ruleId,
        ruleType: grnApprovalConfig.ruleType,
        description: grnApprovalConfig.description,
        isActive: grnApprovalConfig.isActive,
        config: grnApprovalConfig.ruleDetails
          ? grnApprovalConfig.ruleDetails.data
            ? grnApprovalConfig.ruleDetails.data.config
              ? grnApprovalConfig.ruleDetails.data.config
              : null
            : null
          : null
      });
    }
    totalElements = data.totalElements;

    grnApprovalConfigList = {
      grnApprovalConfigList: grnApprovalConfigs,
      totalElements: totalElements
    };
    return grnApprovalConfigList;
  }

  static getGrnApprovalConfig(data: any): GrnApprovalConfigResponse {
    let grnApprovalConfigs: GrnApprovalConfigResponse;
    if (data) {
      grnApprovalConfigs = {
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
      grnApprovalConfigs = {
        ruleId: 'new',
        ruleType: '',
        description: '',
        isActive: true,
        config: null
      };
    }

    return grnApprovalConfigs;
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
          roleName: role.value,
          isActive: role.isActive
        });
      }
    }
    return roleList;
  }
}
