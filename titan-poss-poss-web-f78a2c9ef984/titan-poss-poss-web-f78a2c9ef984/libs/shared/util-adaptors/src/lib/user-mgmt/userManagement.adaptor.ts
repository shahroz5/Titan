import * as moment from 'moment';

import { UserDetail, AddressData, UserProfile } from '@poss-web/shared/models';

export class UserManagementAdaptor {
  static usersfromJson(user: any): UserDetail {
    const address: AddressData =
      user && user.address ? user.address['data'] : '';
    const roledetails: any = this.userPrimaryRole(
      user && user.roles ? user.roles : []
    );

    if (address) {
      address.line1 = user.address['data'].line1;
      address.line2 = user.address['data'].line2;
      address.city = user.address['data'].city;
      address.state = user.address['data'].state;
      address.pincode = user.address['data'].pincode;
      address.country = user.address['data'].country;
    }

    return {
      emailId: user.emailId ? user.emailId : '',
      empName: user.empName ? user.empName : '',
      employeeCode: user.employeeCode ? user.employeeCode : '',
      hasLoginAccess: user.hasLoginAccess ? user.hasLoginAccess : false,
      isActive: user.isActive ? user.isActive : false,
      isLocked: user.isLocked ? user.isLocked : false,
      isLoginActive: user.isLoginActive ? user.isLoginActive : false,
      locationCode: user.locationCode ? user.locationCode : '',
      regionCode: user.regionCode ? user.regionCode : '',
      mobileNo: user.mobileNo ? user.mobileNo : '',
      userType: user.userType ? user.userType : '',
      address: address,
      birthDate: moment(user.birthDate),
      joiningDate: moment(user.joiningDate),
      resignationDate: moment(user.resignationDate),
      primaryRole: roledetails.primaryroledetails.role
        ? roledetails.primaryroledetails.role
        : '',
      roleName: roledetails.primaryroledetails.roleName
        ? roledetails.primaryroledetails.roleName
        : user.primaryRoleName,
      secondaryRole: roledetails.secondaryroledetails.role
        ? roledetails.secondaryroledetails.role
        : '',
      secondaryRoleName: roledetails.secondaryroledetails.roleName
        ? roledetails.secondaryroledetails.roleName
        : '',
      secondaryendtime: moment(
        roledetails.secondaryroledetails
          ? roledetails.secondaryroledetails.endtime
          : ''
      ),
      secondarystarttime: moment(
        roledetails.secondaryroledetails
          ? roledetails.secondaryroledetails.starttime
          : ''
      ),
      resendOTP: user.forcePasswordChange
    };
  }

  static userProfilefromJson(user: any): UserProfile {
    const address: AddressData =
      user && user.address ? user.address['data'] : '';
    const roledetails: any = this.userPrimaryRole(
      user && user.roles ? user.roles : []
    );

    if (address) {
      address.line1 =
        user.address['data'].line1 + ', ' + user.address['data'].line2;
      address.city = user.address['data'].city;
      address.state = user.address['data'].state;
      address.pincode = user.address['data'].pincode;
      address.country = user.address['data'].country;
    }

    return {
      emailId: user.emailId ? user.emailId : '',
      empName: user.empName ? user.empName : '',
      employeeCode: user.employeeCode ? user.employeeCode : '',
      locationCode: user.locationCode ? user.locationCode : '',
      mobileNo: user.requestedMobileNo
        ? user.requestedMobileNo
        : user.mobileNo
        ? user.mobileNo
        : '',
      userType: user.userType ? user.userType : '',
      address: address,
      birthDate: moment(user.birthDate),
      joiningDate: moment(user.joiningDate),
      roleName: roledetails.primaryroledetails
        ? `${roledetails.primaryroledetails.role} (${roledetails.primaryroledetails.roleName})`
        : '',
      employeeType: user.employeeType ? user.employeeType : '',
      validateMobile: !!user.requestedMobileNo,
      regionCode: user.regionCode ? user.regionCode: null
    };
  }

  static userPrimaryRole(roles: any[]): any {
    const primaryroledetails = {};
    const secondaryroledetails = {};
    for (const role of roles) {
      if (role.isPrimary) {
        primaryroledetails['role'] = role.roleCode;
        primaryroledetails['roleName'] = role.roleName;
      } else {
        secondaryroledetails['role'] = role.roleCode;
        secondaryroledetails['roleName'] = role.roleName;
        secondaryroledetails['starttime'] = role.startDate
          ? role.startDate
          : role.startTime;
        secondaryroledetails['endtime'] = role.expiryDate
          ? role.expiryDate
          : role.expiryTime;
      }
    }
    return { secondaryroledetails, primaryroledetails };
  }
}
