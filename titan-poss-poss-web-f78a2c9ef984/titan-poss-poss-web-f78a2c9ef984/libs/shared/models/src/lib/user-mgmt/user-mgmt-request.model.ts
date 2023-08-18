export interface RolesRequest {
  isBTQUser: boolean;
  roleType: string;
  locationCode?: string;
}

export interface UserRequest {
  isBTQUser: boolean;
  employeeCode?: string;
  data?: any;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ActivateAccountPayLoad {
  empCode: string;
  isBTQUser: boolean;
}
