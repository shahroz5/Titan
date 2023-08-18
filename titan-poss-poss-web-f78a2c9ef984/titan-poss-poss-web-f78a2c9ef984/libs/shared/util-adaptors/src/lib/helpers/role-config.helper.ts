import { RoleConfigAdaptor } from '../role-config/role-config.adaptor';
import {
  RoleDetail,
  RoleData,
  RoleCountRequestList,
  RoleCountRequestListDetail,
  RequestedRole,
  LoadLocationFormatPayload
} from '@poss-web/shared/models';

export class RoleConfigHelper {
  static getRolesData(data: any): RoleData {
    const roles: RoleDetail[] = [];
    for (const item of data.results) {
      roles.push(RoleConfigAdaptor.getRoleData(item));
    }
    return { roles, totalRoles: data.totalElements };
  }

  static getRoleCountRequestListData(data: any): RoleCountRequestListDetail {
    const roleCountRequestList: RoleCountRequestList[] = [];
    for (const item of data.results) {
      roleCountRequestList.push(
        RoleConfigAdaptor.getRoleCountRequestListData(item)
      );
    }
    return {
      isFilter: '',
      isSearch: '',
      requests: roleCountRequestList,
      totalrequests: data.totalElements
    };
  }

  static getRequestedRoles(
    data: any
  ): { requestedRoles: RequestedRole[]; requestdata: RoleCountRequestList } {
    const requestedRoles: RequestedRole[] = [];
    for (const item of data.requestedRoleDetails) {
      requestedRoles.push(RoleConfigAdaptor.getRequestedRoleData(item));
    }
    return {
      requestedRoles,
      requestdata: RoleConfigAdaptor.getRoleCountRequestListData(data)
    };
  }

  static getLocationFormats(data: any): LoadLocationFormatPayload[] {
    const locationFormats: LoadLocationFormatPayload[] = [];
    for (const item of data) {
      locationFormats.push({ code: item.code, value: item.value });
    }
    return locationFormats;
  }
}
