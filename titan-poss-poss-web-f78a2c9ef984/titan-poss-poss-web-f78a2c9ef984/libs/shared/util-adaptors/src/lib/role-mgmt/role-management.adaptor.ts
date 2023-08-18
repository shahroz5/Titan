import { RoleDetail } from '@poss-web/shared/models';

export class RoleManagementAdaptor {
  static getRoleData(data: any): RoleDetail {
    return {
      roleCode: data.roleCode,
      isActive: data.isActive,
      roleName: data.roleName,
      roleType: data.roleType,
      description: data.description,
      corpAccess: data.corpAccess,
      accessType: data.accessType,
      isLocationMappingRequired: data.isLocationMappingRequired,
      userLimit: data.userLimit ? data.userLimit : -1,
      assignedUsers: data.assignedUsers ? data.assignedUsers : -1,
      locationFormats:
        !!data.roleToLocationFormats && data.roleToLocationFormats.length > 0
          ? RoleManagementAdaptor.locationFormatsOfRole(
              data.roleToLocationFormats
            )
          : new Map<string, number>()
    };
  }

  static locationFormatsOfRole(
    rolelocationFormats: any[]
  ): Map<string, number> {
    const locationFormats: Map<string, number> = new Map<string, number>();
    rolelocationFormats.forEach(val =>
      locationFormats.set(val.locationFormat, val.userLimit)
    );
    return locationFormats;
  }
}
