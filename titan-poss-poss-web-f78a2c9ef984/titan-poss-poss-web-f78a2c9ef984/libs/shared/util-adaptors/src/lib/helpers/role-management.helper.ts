import { RoleManagementAdaptor } from '../role-mgmt/role-management.adaptor';
import { RoleDetail, RoleData, RoleTypesData } from '@poss-web/shared/models';

export class RoleManagementHelper {
  static getRolesData(data: any): RoleData {
    const roles: RoleDetail[] = [];
    for (const item of data.results) {
      roles.push(RoleManagementAdaptor.getRoleData(item));
    }
    return { roles, totalRoles: data.totalElements };
  }

  static getLocationFormats(data: any): Map<string, string> {
    const locationFormats: Map<string, string> = new Map<string, string>();
    for (const item of data) {
      if (item.isActive) {
        locationFormats.set(item.code, item.value);
      }
    }
    return locationFormats;
  }

  static getRoleTypesData(data: any): RoleTypesData[] {
    const dropdowndata: RoleTypesData[] = [];
    for (const item of data) {
      dropdowndata.push({
        code: item.code,
        value: item.value
      });
    }
    return dropdowndata;
  }
}
