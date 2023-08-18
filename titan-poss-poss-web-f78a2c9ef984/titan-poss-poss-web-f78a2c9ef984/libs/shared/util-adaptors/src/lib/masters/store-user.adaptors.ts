import { StoreUser, StoreUserDetails } from '@poss-web/shared/models';
import * as moment from 'moment';
export class StoreUserAdaptor {
  static StoreUserDataFromJson(data: any): StoreUser {
    return {
      empName: data.empName,
      employeeCode: data.employeeCode,
      locationCode: data.locationCode,
      mobileNo: data.mobileNo,
      isLoginActive: data.isLoginActive
    };
  }
  static StoreUserDetailsFromJson(data: any): StoreUserDetails {
    return {
      address: data.address,
      birthDate: moment(data.birthDate),
      emailId: data.emailId,
      empName: data.empName,
      employeeCode: data.employeeCode,
      forcePasswordChange: data.forcePasswordChange,
      hasLoginAccess: data.hasLoginAccess,
      isActive: data.isActive,
      isLocked: data.isLocked,
      isLoginActive: data.isLoginActive,
      joiningDate: moment(data.joiningDate),
      locationCode: data.locationCode,
      mobileNo: data.mobileNo,
      orgCode: data.orgCode,
      regionCode: data.regionCode,
      resignationDate: moment(data.resignationDate),
      roles: data.roles,
      userType: data.userType,
      employeeType: data.employeeType,
      requestedMobileNo: data.requestedMobileNo
    };
  }
}
