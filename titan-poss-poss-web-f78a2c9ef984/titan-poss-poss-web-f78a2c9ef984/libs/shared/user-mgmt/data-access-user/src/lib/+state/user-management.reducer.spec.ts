import {
  ActivateAccountPayLoad,
  ChangePasswordRequest,
  CountryData,
  LocationData,
  RoleInfo,
  RoleTypesData,
  UserData,
  UserDetail,
  UserProfile,
  UserRequest,
  UsersPage
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './user-management.actions';
import { countryAdapter } from './user-management.entity';
import { initialState, UserManagementReducer } from './user-management.reducer';
import { UserManagementState } from './user-management.state';

describe('User management reducer Testing Suite', () => {
  describe('Testing Load Users Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_USERS', () => {
      const usersPage: UsersPage = {
        isBTQUser: false,
        pageNumber: 1,
        pageSize: 10,
        employeeCode: 'CORP',
        roleCodes: ['CORP', 'REG', 'L1', 'L2', 'L3'],
        locationCodes: ['URB', 'PNA']
      };

      const action = new actions.LoadUsers(usersPage);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.updateUser).toBe(false);
      expect(result.error).toBe(null);
    });
    it('LOAD_USERS_SUCCESS should return Users response', () => {
      const userDetail: UserDetail[] = [
        {
          address: null,
          emailId: '',
          empName: 'ec2',
          employeeCode: 'E1',
          hasLoginAccess: true,
          isActive: true,
          isLocked: false,
          isLoginActive: true,
          joiningDate: null,
          locationCode: 'TJ',
          regionCode: '',
          mobileNo: '9576561234',
          resignationDate: null,
          primaryRole: 'Admin',
          userType: 'ORG',
          birthDate: null,
          roleName: 'Admin',
          secondaryRole: '',
          secondaryRoleName: '',
          secondarystarttime: null,
          secondaryendtime: null,
          resendOTP: false
        }
      ];
      const userData: UserData = {
        totalUsers: 10,
        users: userDetail
      };
      const action = new actions.LoadUsersSuccess(userData);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.users).toBe(action.payload.users);
      expect(result.totalUsers).toBe(action.payload.totalUsers);
      expect(result.isLoading).toBe(false);
    });
    it('LOAD_USERS_FAILURE should return error', () => {
      const action = new actions.LoadUsersFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing Fetch Users Functionality', () => {
    beforeEach(() => {});
    it('Testing FETCH_USER', () => {
      const userRequest: UserRequest = {
        isBTQUser: false,
        employeeCode: 'EC2',
        data: null
      };
      const action = new actions.FetchUser(userRequest);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.selectedUser).toBe(null);
      expect(result.error).toBe(null);
    });
    it('FETCH_USER_SUCCESS should return Users response', () => {
      const userDetail: UserDetail = {
        address: null,
        emailId: '',
        empName: 'ec2',
        employeeCode: 'E1',
        hasLoginAccess: true,
        isActive: true,
        isLocked: false,
        isLoginActive: true,
        joiningDate: null,
        locationCode: 'TJ',
        regionCode: '',
        mobileNo: '9576561234',
        resignationDate: null,
        primaryRole: 'Admin',
        userType: 'ORG',
        birthDate: null,
        roleName: 'Admin',
        secondaryRole: '',
        secondaryRoleName: '',
        secondarystarttime: null,
        secondaryendtime: null,
        resendOTP: false
      };

      const action = new actions.FetchUserSuccess(userDetail);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.selectedUser).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
    it('FETCH_USER_FAILURE should return error', () => {
      const action = new actions.FetchUserFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing Load UserProfile Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_USER_PROFILE', () => {
      const action = new actions.LoadUserProfile();
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.userProfile).toBe(null);
      expect(result.verifyMobileOTP).toBe(false);
      expect(result.error).toBe(null);
    });
    it('LOAD_USER_PROFILE_SUCCESS should return User profile data', () => {
      const userProfile: UserProfile = {
        employeeCode: 'Ec2',
        employeeType: 'ORG',
        empName: 'Admin',
        birthDate: null,
        mobileNo: '9123456789',
        emailId: 'email@titan.com',
        address: null,
        roleName: 'CORP',
        locationCode: 'TJ',
        joiningDate: null,
        userType: 'CORP',
        validateMobile: false
      };

      const action = new actions.LoadUserProfileSuccess(userProfile);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.userProfile).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
    it('LOAD_USER_PROFILE_FAILURE should return error', () => {
      const action = new actions.LoadUserProfileFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing Load State Functionality', () => {
    beforeEach(() => {});

    it('LOAD_STATE_SUCCESS should return States for the given country', () => {
      const action = new actions.LoadStateSuccess(['IND']);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.states).toBe(action.payload);

      expect(result.error).toBe(null);
    });
    it('LOAD_STATE_FAILURE should return error', () => {
      const action = new actions.LoadStateFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.states).toEqual([]);
    });
  });

  describe('Testing Fetch Location Functionality', () => {
    beforeEach(() => {});

    it('FETCH_LOCATION_SUCCESS should return State list', () => {
      const locationData: LocationData = {
        locationCode: 'TJ',
        countryCode: 'IND',
        ownerTypeCode: 'CORP'
      };
      const action = new actions.FetchLocationSuccess(locationData);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.location).toBe(action.payload);
      expect(result.error).toBe(null);
    });
    it('FETCH_LOCATION_FAILURE should return error', () => {
      const action = new actions.FetchLocationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.location).toEqual({
        countryCode: '',
        locationCode: '',
        ownerTypeCode: ''
      });
    });
  });

  describe('Testing Fetch Email Location Functionality', () => {
    beforeEach(() => {});

    it('FETCH_EMAIL_LOCATION_SUCCESS should return States for the given country', () => {
      const locationData: LocationData = {
        locationCode: 'TJ',
        countryCode: 'IND',
        ownerTypeCode: 'CORP'
      };

      const action = new actions.FetchEmailLocationSuccess(locationData);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.emailLocation).toBe(action.payload.locationCode);
      expect(result.error).toBe(null);
    });
    it('FETCH_EMAIL_LOCATION_FAILURE should return error', () => {
      const action = new actions.FetchEmailLocationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.emailLocation).toBe('');
    });
  });

  describe('Testing Update User Functionality', () => {
    beforeEach(() => {});
    it('Testing UPDATE_USER', () => {
      const userRequest: UserRequest = {
        isBTQUser: false,
        employeeCode: 'EC2',
        data: null
      };
      const action = new actions.UpdateUser(userRequest);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.updateUser).toBe(false);
      expect(result.error).toBe(null);
    });
    it('UPDATE_USER_SUCCESS should set UpdateUser flag to true', () => {
      const action = new actions.UpdateUserSuccess();
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.updateUser).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('UPDATE_USER_FAILURE should return error', () => {
      const action = new actions.UpdateUserFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing Add User Functionality', () => {
    beforeEach(() => {});
    it('Testing ADD_USER', () => {
      const userRequest: UserRequest = {
        isBTQUser: false,
        employeeCode: 'EC2',
        data: null
      };
      const action = new actions.AddUser(userRequest);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.updateUser).toBe(false);
      expect(result.error).toBe(null);
    });
    it('ADD_USER_SUCCESS should set UpdateUser flag to true', () => {
      const action = new actions.AddUserSuccess();
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.updateUser).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('ADD_USER_FAILURE should return error', () => {
      const action = new actions.AddUserFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadCountry Functionality', () => {
    beforeEach(() => {});
    it('LOAD_COUNTRY_SUCCESS should load countries data', () => {
      const countryData: CountryData[] = [
        {
          description: 'India',
          countryCode: 'IND'
        }
      ];
      const action = new actions.LoadCountrySuccess(countryData);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.countries).toEqual(
        countryAdapter.setAll(action.payload, result.countries)
      );
      expect(result.error).toBe(null);
    });
    it('LOAD_COUNTRY_FAILURE should return error', () => {
      const action = new actions.LoadCountryFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.countries).toEqual(
        countryAdapter.setAll([], result.countries)
      );
    });
  });

  describe('Testing ValidateMobileEmail Functionality', () => {
    beforeEach(() => {});

    it('VALIDATE_MOBILE_EMAIL_SUCCESS should update check mobile emeil flag', () => {
      const action = new actions.ValidateMobileEmailSuccess(true);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.checkMobileEmail).toBe(action.payload);
      expect(result.error).toBe(null);
    });
    it('VALIDATE_MOBILE_EMAIL_FAILURE should return error', () => {
      const action = new actions.ValidateMobileEmailFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.checkMobileEmail).toBe(false);
    });
  });

  describe('Testing LoadFilterRoles Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_FILTER_ROLES', () => {
      const action = new actions.LoadFilterRoles(true);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.roles).toBe(null);
      expect(result.error).toBe(null);
    });
    it('LOAD_FILTER_ROLES_SUCCESS should load Filtered Roles', () => {
      const mapData :RoleInfo = {
        rolesDetails: [],
        roles: new Map()
      };;
      // mapData.set('key', 'value');
      const action = new actions.LoadFilterRolesSuccess(mapData);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.roles).toBe(action.payload);
      expect(result.error).toBe(null);
    });
  });

  describe('Testing LoadRoles Functionality', () => {
    beforeEach(() => {});

    it('LOAD_ROLES_SUCCESS should load roles', () => {
      const mapData :RoleInfo = {
        rolesDetails: [],
        roles: new Map()
      };
      // mapData.set('key', 'value');
      const action = new actions.LoadRolesSuccess(mapData);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.roles).toBe(action.payload);
      expect(result.error).toBe(null);
    });
    it('LOAD_ROLES_FAILURE should return error', () => {
      const action = new actions.LoadRolesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.roles).toBe(null);
    });
  });
  describe('Testing Clear Searched users Functionality', () => {
    beforeEach(() => {});
    it('Testing CLEAR_SEARCHED_USERS', () => {
      const action = new actions.ClearSearchedUsers();
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.users).toEqual([]);
      expect(result.totalUsers).toBe(0);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing LoadRoleTypes Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_ROLE_TYPES', () => {
      const action = new actions.LoadRoleTypes();
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.roleTypes).toEqual([]);
      expect(result.error).toBe(null);
    });
    it('LOAD_ROLE_TYPES_SUCCESS should load Role Types', () => {
      const roleTypesData: RoleTypesData[] = [
        {
          code: 'BTQ',
          value: 'Boutique'
        },
        {
          code: 'CORP',
          value: 'Corporate'
        }
      ];
      const action = new actions.LoadRoleTypesSuccess(roleTypesData);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.roleTypes).toBe(action.payload);
    });
    it('LOAD_ROLE_TYPES_FAILURE should return error', () => {
      const action = new actions.LoadRoleTypesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.roleTypes).toEqual([]);
    });
  });

  describe('Testing ActivateAccountOTP Functionality', () => {
    beforeEach(() => {});
    it('Testing ACTIVATE_ACCOUNT_OTP', () => {
      const activateAccountPayLoad: ActivateAccountPayLoad = {
        empCode: 'EMP',
        isBTQUser: false
      };
      const action = new actions.ActivateAccountOTP(activateAccountPayLoad);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.OTPsent).toBe(false);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('ACTIVATE_ACCOUNT_OTP_SUCCESS should return OTPSent flag status', () => {
      const action = new actions.ActivateAccountOTPSuccess();
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.OTPsent).toBe(true);
    });
    it('ACTIVATE_ACCOUNT_OTP_FAILURE should return error', () => {
      const action = new actions.ActivateAccountOTPFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ChangePassword Functionality', () => {
    beforeEach(() => {});
    it('Testing CHANGE_PASSWORD', () => {
      const changePasswordRequest: ChangePasswordRequest = {
        oldPassword: 'welcome123',
        newPassword: 'Welcome@123'
      };
      const action = new actions.ChangePassword(changePasswordRequest);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.changePassword).toBe(false);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('CHANGE_PASSWORD_SUCCESS should return changePassword flag status', () => {
      const action = new actions.ChangePasswordSuccess();
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.changePassword).toBe(true);
    });
    it('CHANGE_PASSWORD_FAILURE should return error', () => {
      const action = new actions.ChangePasswordFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing VerifyMobileOTP Functionality', () => {
    beforeEach(() => {});
    it('Testing VERIFY_OTP_FOR_MOBILE', () => {
      const action = new actions.VerifyMobileOTP('otpotp');
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.verifyMobileOTP).toBe(false);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('VERIFY_OTP_FOR_MOBILE_SUCCESS should return changePassword flag status', () => {
      const action = new actions.VerifyMobileOTPSuccess();
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.verifyMobileOTP).toBe(true);
      expect(result.userProfile).toEqual({
        ...result.userProfile,
        validateMobile: false
      });
    });
    it('VERIFY_OTP_FOR_MOBILE_FAILURE should return error', () => {
      const action = new actions.VerifyMobileOTPFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toEqual('some error');
    });

    it('LOAD_REGIONS_SUCCESS should return error', () => {
      const action = new actions.LoadRegionsSuccess({} as any);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      // expect(result.error.message).toEqual('some error');
    });

    it('LOAD_REGIONS_FAILURE should return error', () => {
      const action = new actions.LoadRegionsFailure({} as any);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      // expect(result.error.message).toEqual('some error');
    });

    it('LOAD_MAPPED_LOCATIONS should return error', () => {
      const action = new actions.LoadMappedLocations(true, 'abc');
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      // expect(result.error.message).toEqual('some error');
    });

    it('LOAD_MAPPED_LOCATIONS_SUCCESS should return error', () => {
      const action = new actions.LoadMappedLocationsSuccess({} as any);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
    });

    it('LOAD_MAPPED_LOCATIONS_FAILURE should return error', () => {
      const action = new actions.LoadMappedLocationsSuccess({} as any);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
    });

    it('UPDATE_MAPPED_LOCATIONS should return error', () => {
      const action = new actions.UpdateMappedLocations(true, 'abc',{});
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });

    it('UPDATE_MAPPED_LOCATIONS_SUCCESS should return error', () => {
      const action = new actions.UpdateMappedLocationsSuccess();
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
    });

    it('UPDATE_MAPPED_LOCATIONS_FAILURE should return error', () => {
      const action = new actions.UpdateMappedLocationsFailure({} as any);
      const result: UserManagementState = UserManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
    });
  });
});
