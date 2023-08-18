import { Moment } from 'moment';

export interface UserDetail {
  address: AddressData;
  emailId: string;
  empName: string;
  employeeCode: string;
  hasLoginAccess: boolean;
  isActive: boolean;
  isLocked: boolean;
  isLoginActive: boolean;
  joiningDate: Moment;
  locationCode: string;
  regionCode: string;
  mobileNo: string;
  resignationDate: Moment;
  primaryRole: string;
  userType: string;
  birthDate: Moment;
  roleName: string;
  secondaryRole: string;
  secondaryRoleName: string;
  secondarystarttime: Moment;
  secondaryendtime: Moment;
  resendOTP: boolean;
}

export interface AddressData {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface UserData {
  totalUsers: number;
  users: UserDetail[];
}

export interface UserProfile {
  employeeCode: string;
  employeeType: string;
  empName: string;
  birthDate: Moment;
  mobileNo: string;
  emailId: string;
  address: AddressData;
  roleName: string;
  locationCode: string;
  joiningDate: Moment;
  userType: string;
  validateMobile: boolean;
  regionCode?: string;
}

export interface UsersPage {
  isBTQUser: boolean;
  pageNumber: number;
  pageSize: number;
  employeeCode: string;
  roleCodes: string[];
  locationCodes: string[];
}
