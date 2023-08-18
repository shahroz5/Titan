import { Moment } from 'moment';

export interface StoreUser {
  empName: string;
  employeeCode: string;
  locationCode: string;
  mobileNo: string;
  isLoginActive: boolean;
}

export interface StoreUserDetails {
  address: {};
  birthDate: Moment;
  emailId: string;
  empName: string;
  employeeCode: string;
  forcePasswordChange: boolean;
  hasLoginAccess: boolean;
  isActive: boolean;
  isLocked: boolean;
  isLoginActive: boolean;
  joiningDate: Moment;
  locationCode: string;
  mobileNo: string;
  orgCode: string;
  regionCode: string;
  resignationDate: Moment;
  roles: UserRole[];
  userType: string;
  employeeType: string;
  requestedMobileNo: string;
}
export interface UserRole {
  corpAccess: boolean;
  description: string;
  expiryTime: Moment;
  isPrimary: boolean;
  roleCode: string;
  roleName: string;
  startTime: Moment;
}
