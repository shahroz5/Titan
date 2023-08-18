import * as moment from 'moment';

import {
  RoleDetail,
  RoleCountRequestList,
  RequestedRole
} from '@poss-web/shared/models';

export class RoleConfigAdaptor {
  static getRoleData(data: any): RoleDetail {
    return {
      roleCode: data.roleCode,
      isActive: data.isActive,
      roleName: data.roleName,
      roleType: data.roleType,
      description: data.description,
      corpAccess: data.corpAccess,
      userLimit: !!data.userLimit ? data.userLimit : 0,
      assignedUsers: !!data.assignedUsers ? data.assignedUsers : 0,
      locationFormats: new Map<string, number>()
    };
  }

  static getRoleCountRequestListData(data: any): RoleCountRequestList {
    return {
      id: data.id,
      ownerType: data.ownerType,
      reqDocNo: data.reqDocNo,
      requestRemarks: data.requestRemarks,
      requesterName: data.requesterName,
      status: data.status,
      address: data.address,
      reqDocDate: moment(data.reqDocDate),
      roleName: data.roleName,
      locationCode: data.reqLocationCode
    };
  }

  static getRequestedRoleData(data: any): RequestedRole {
    return {
      roleCode: data.roleCode,
      reqValue: data.reqValue,
      userLimit: data.userLimit,
      assignedUsers: data.assignedUsers,
      roleName: data.roleName
    };
  }
}
