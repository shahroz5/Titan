export interface RoleDetail {
  roleCode: string;
  roleName: string;
  isActive: boolean;
  roleType: string;
  description: string;
  corpAccess: boolean;
  userLimit: number;
  assignedUsers: number;
  isLocationMappingRequired?: boolean;
  locationFormats: Map<string, number>;
  accessType?: string;
}

export interface RoleData {
  totalRoles: number;
  roles: RoleDetail[];
}

export interface RoleInfo {
  roles: Map<string, string>;
  rolesDetails: RoleDetail[];
}
