import {
  ActivateAccountPayLoad,
  ChangePasswordRequest,
  CountryData,
  CustomErrors,
  EmailMobileData,
  LocationData,
  RoleInfo,
  RolesRequest,
  RoleTypesData,
  UserDetail,
  UserProfile,
  UserRequest
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ActivateAccountOTP,
  ActivateAccountOTPFailure,
  ActivateAccountOTPSuccess,
  AddUser,
  AddUserFailure,
  AddUserSuccess,
  ChangePassword,
  ChangePasswordFailure,
  ChangePasswordSuccess,
  ClearSearchedUsers,
  FetchEmailLocation,
  FetchEmailLocationFailure,
  FetchEmailLocationSuccess,
  FetchLocation,
  FetchLocationFailure,
  FetchLocationSuccess,
  FetchUser,
  FetchUserFailure,
  FetchUserSuccess,
  LoadCountry,
  LoadCountryFailure,
  LoadCountrySuccess,
  LoadFilterRoles,
  LoadFilterRolesFailure,
  LoadFilterRolesSuccess,
  LoadRoles,
  LoadRolesFailure,
  LoadRolesSuccess,
  LoadRoleTypes,
  LoadRoleTypesFailure,
  LoadRoleTypesSuccess,
  LoadState,
  LoadStateFailure,
  LoadStateSuccess,
  LoadUserProfile,
  LoadUserProfileFailure,
  LoadUserProfileSuccess,
  LoadUsers,
  LoadUsersFailure,
  LoadUsersSuccess,
  UpdateUser,
  UpdateUserFailure,
  UpdateUserSuccess,
  UserManagementActionTypes,
  ValidateMobileEmail,
  ValidateMobileEmailFailure,
  ValidateMobileEmailSuccess,
  VerifyMobileOTP,
  VerifyMobileOTPFailure,
  VerifyMobileOTPSuccess
} from './user-management.actions';

describe('User Management Action Testing Suite', () => {
  describe('LoadUsers Action Test Cases', () => {
    it('should check correct type is used for LoadUsers action ', () => {
      const payload = {
        isBTQUser: false,
        pageNumber: 1,
        pageSize: 10,
        employeeCode: 'ORG',
        roleCodes: ['BOS', 'Cashier'],
        locationCodes: ['URB', 'PNA']
      };

      const action = new LoadUsers(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_USERS,
        payload
      });
    });

    it('should check correct type is used for LoadUsersSuccess action ', () => {
      const UserDetailArray = [
        {
          address: null,
          emailId: '',
          empName: 'Emp',
          employeeCode: 'E1',
          hasLoginAccess: true,
          isActive: true,
          isLocked: false,
          isLoginActive: true,
          joiningDate: null,
          locationCode: 'URB',
          regionCode: 'REG',
          mobileNo: '987',
          resignationDate: null,
          primaryRole: 'ADMIN',
          userType: 'CORP',
          birthDate: null,
          roleName: 'ORG',
          secondaryRole: '',
          secondaryRoleName: '',
          secondarystarttime: null,
          secondaryendtime: null,
          resendOTP: false
        }
      ];
      const payload = {
        totalUsers: 10,
        users: UserDetailArray
      };
      const action = new LoadUsersSuccess(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_USERS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadUsersFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadUsersFailure(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_USERS_FAILURE,
        payload
      });
    });
  });

  describe('LoadUserProfile Action Test Cases', () => {
    it('should check correct type is used for LoadUserProfile action ', () => {
      const action = new LoadUserProfile();
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_USER_PROFILE
      });
    });

    it('should check correct type is used for LoadUserProfileSuccess action ', () => {
      const payload: UserProfile = {
        employeeCode: 'EMPCODE',
        employeeType: 'ORG',
        empName: 'Name',
        birthDate: null,
        mobileNo: '987',
        emailId: 'em',
        address: null,
        roleName: 'RoleName',
        locationCode: 'TJ',
        joiningDate: null,
        userType: 'CORP',
        validateMobile: false
      };

      const action = new LoadUserProfileSuccess(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_USER_PROFILE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadUserProfileFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadUserProfileFailure(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_USER_PROFILE_FAILURE,
        payload
      });
    });
  });

  describe('FetchUser Action Test Cases', () => {
    it('should check correct type is used for FetchUser action ', () => {
      const payload: UserRequest = {
        isBTQUser: false,
        employeeCode: 'EMP01',
        data: null
      };

      const action = new FetchUser(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.FETCH_USER,
        payload
      });
    });

    it('should check correct type is used for FetchUserSuccess action ', () => {
      const payload: UserDetail = {
        address: null,
        emailId: 'empId',
        empName: 'empName',
        employeeCode: 'empCode',
        hasLoginAccess: true,
        isActive: true,
        isLocked: false,
        isLoginActive: true,
        joiningDate: null,
        locationCode: 'TJ',
        regionCode: 'Reg',
        mobileNo: '987',
        resignationDate: null,
        primaryRole: 'CORP',
        userType: 'ORG',
        birthDate: null,
        roleName: 'Admin',
        secondaryRole: '',
        secondaryRoleName: '',
        secondarystarttime: null,
        secondaryendtime: null,
        resendOTP: false
      };

      const action = new FetchUserSuccess(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.FETCH_USER_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for FetchUserFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FetchUserFailure(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.FETCH_USER_FAILURE,
        payload
      });
    });
  });

  describe('LoadState Action Test Cases', () => {
    it('should check correct type is used for LoadState action ', () => {
      const payload = '';
      const action = new LoadState(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_STATE,
        payload
      });
    });
    it('should check correct type is used for LoadStateSuccess action ', () => {
      const payload = ['One', 'Two'];
      const action = new LoadStateSuccess(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_STATE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadStateFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStateFailure(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_STATE_FAILURE,
        payload
      });
    });
  });

  describe('LoadCountry Action Test Cases', () => {
    it('should check correct type is used for LoadCountry action ', () => {
      const action = new LoadCountry();
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_COUNTRY
      });
    });
    it('should check correct type is used for LoadCountrySuccess action ', () => {
      const payload: CountryData[] = [
        {
          description: 'description',
          countryCode: 'IND'
        }
      ];
      const action = new LoadCountrySuccess(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_COUNTRY_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadCountryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCountryFailure(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_COUNTRY_FAILURE,
        payload
      });
    });
  });

  describe('FetchLocation Action Test Cases', () => {
    it('should check correct type is used for FetchLocation action ', () => {
      const payload = 'TJ';
      const action = new FetchLocation(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.FETCH_LOCATION,
        payload
      });
    });
    it('should check correct type is used for FetchLocationSuccess action ', () => {
      const payload: LocationData = {
        locationCode: 'TJ',
        countryCode: 'IND',
        ownerTypeCode: 'NAG'
      };
      const action = new FetchLocationSuccess(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.FETCH_LOCATION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for FetchLocationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FetchLocationFailure(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.FETCH_LOCATION_FAILURE,
        payload
      });
    });
  });

  describe('FetchEmailLocation Action Test Cases', () => {
    it('should check correct type is used for FetchEmailLocation action ', () => {
      const payload = 'TJ';
      const action = new FetchEmailLocation(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.FETCH_EMAIL_LOCATION,
        payload
      });
    });
    it('should check correct type is used for FetchEmailLocationSuccess action ', () => {
      const payload: LocationData = {
        locationCode: 'TJ',
        countryCode: 'IND',
        ownerTypeCode: 'NAG'
      };
      const action = new FetchEmailLocationSuccess(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.FETCH_EMAIL_LOCATION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for FetchEmailLocationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FetchEmailLocationFailure(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.FETCH_EMAIL_LOCATION_FAILURE,
        payload
      });
    });
  });

  describe('ValidateMobileEmail Action Test Cases', () => {
    it('should check correct type is used for ValidateMobileEmail action ', () => {
      const payload: EmailMobileData = {
        fieldtype: 'input',
        value: 'value'
      };
      const action = new ValidateMobileEmail(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.VALIDATE_MOBILE_EMAIL,
        payload
      });
    });
    it('should check correct type is used for ValidateMobileEmailSuccess action ', () => {
      const payload = true;
      const action = new ValidateMobileEmailSuccess(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.VALIDATE_MOBILE_EMAIL_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for ValidateMobileEmailFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ValidateMobileEmailFailure(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.VALIDATE_MOBILE_EMAIL_FAILURE,
        payload
      });
    });
  });

  describe('LoadRoles Action Test Cases', () => {
    it('should check correct type is used for LoadRoles action ', () => {
      const payload: RolesRequest = {
        isBTQUser: false,
        roleType: 'CORP',
        locationCode: 'TJ'
      };
      const action = new LoadRoles(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_ROLES,
        payload
      });
    });
    it('should check correct type is used for LoadRolesSuccess action ', () => {
      const payload = null;
      const action = new LoadRolesSuccess(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_ROLES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadRolesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRolesFailure(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_ROLES_FAILURE,
        payload
      });
    });
  });

  describe('Other Action Test Cases', () => {
    it('should check correct type is used for ClearSearchedUsers action ', () => {
      const action = new ClearSearchedUsers();
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.CLEAR_SEARCHED_USERS
      });
    });
  });

  describe('LoadRoleTypes Action Test Cases', () => {
    it('should check correct type is used for LoadRoleTypes action ', () => {
      const action = new LoadRoleTypes();
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_ROLE_TYPES
      });
    });
    it('should check correct type is used for LoadRoleTypesSuccess action ', () => {
      // Map<string, string>
      const payload: RoleTypesData[] = [
        {
          code: 'code',
          value: 'value'
        }
      ];
      const action = new LoadRoleTypesSuccess(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_ROLE_TYPES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadRoleTypesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRoleTypesFailure(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_ROLE_TYPES_FAILURE,
        payload
      });
    });
  });

  describe('LoadFilterRoles Action Test Cases', () => {
    it('should check correct type is used for LoadFilterRoles action ', () => {
      const payload = true;
      const action = new LoadFilterRoles(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_FILTER_ROLES,
        payload
      });
    });
    it('should check correct type is used for LoadFilterRolesSuccess action ', () => {
      const payload: RoleInfo = null;
      const action = new LoadFilterRolesSuccess(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_FILTER_ROLES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadFilterRolesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadFilterRolesFailure(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.LOAD_FILTER_ROLES_FAILURE,
        payload
      });
    });
  });

  describe('UpdateUser Action Test Cases', () => {
    it('should check correct type is used for UpdateUser action ', () => {
      const payload: UserRequest = {
        isBTQUser: false,
        employeeCode: 'eCode',
        data: null
      };
      const action = new UpdateUser(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.UPDATE_USER,
        payload
      });
    });
    it('should check correct type is used for UpdateUserSuccess action ', () => {
      const action = new UpdateUserSuccess();
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.UPDATE_USER_SUCCESS
      });
    });
    it('should check correct type is used for UpdateUserFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateUserFailure(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.UPDATE_USER_FAILURE,
        payload
      });
    });
  });

  describe('AddUser Action Test Cases', () => {
    it('should check correct type is used for AddUser action ', () => {
      const payload: UserRequest = {
        isBTQUser: false,
        employeeCode: 'eCode',
        data: null
      };
      const action = new AddUser(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.ADD_USER,
        payload
      });
    });
    it('should check correct type is used for AddUserSuccess action ', () => {
      const action = new AddUserSuccess();
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.ADD_USER_SUCCESS
      });
    });
    it('should check correct type is used for AddUserFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddUserFailure(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.ADD_USER_FAILURE,
        payload
      });
    });
  });

  describe('ChangePassword Action Test Cases', () => {
    it('should check correct type is used for ChangePassword action ', () => {
      const payload: ChangePasswordRequest = {
        oldPassword: 'welcome123',
        newPassword: 'Welcome@123'
      };
      const action = new ChangePassword(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.CHANGE_PASSWORD,
        payload
      });
    });
    it('should check correct type is used for ChangePasswordSuccess action ', () => {
      const action = new ChangePasswordSuccess();
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.CHANGE_PASSWORD_SUCCESS
      });
    });
    it('should check correct type is used for ChangePasswordFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ChangePasswordFailure(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.CHANGE_PASSWORD_FAILURE,
        payload
      });
    });
  });

  describe('VerifyMobileOTP Action Test Cases', () => {
    it('should check correct type is used for VerifyMobileOTP action ', () => {
      const payload = 'abcdef';
      const action = new VerifyMobileOTP(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.VERIFY_OTP_FOR_MOBILE,
        payload
      });
    });
    it('should check correct type is used for VerifyMobileOTPSuccess action ', () => {
      const action = new VerifyMobileOTPSuccess();
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.VERIFY_OTP_FOR_MOBILE_SUCCESS
      });
    });
    it('should check correct type is used for VerifyMobileOTPFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new VerifyMobileOTPFailure(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.VERIFY_OTP_FOR_MOBILE_FAILURE,
        payload
      });
    });
  });

  describe('ActivateAccountOTP Action Test Cases', () => {
    it('should check correct type is used for ActivateAccountOTP action ', () => {
      const payload: ActivateAccountPayLoad = {
        empCode: 'ec2',
        isBTQUser: false
      };
      const action = new ActivateAccountOTP(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.ACTIVATE_ACCOUNT_OTP,
        payload
      });
    });
    it('should check correct type is used for ActivateAccountOTPSuccess action ', () => {
      const action = new ActivateAccountOTPSuccess();
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.ACTIVATE_ACCOUNT_OTP_SUCCESS
      });
    });
    it('should check correct type is used for ActivateAccountOTPFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ActivateAccountOTPFailure(payload);
      expect({ ...action }).toEqual({
        type: UserManagementActionTypes.ACTIVATE_ACCOUNT_OTP_FAILURE,
        payload
      });
    });
  });
});
