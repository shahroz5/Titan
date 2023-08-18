import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  ActivateAccountPayLoad,
  AddressData,
  ChangePasswordRequest,
  CountryData,
  EmailMobileData,
  LocationData,
  RoleInfo,
  RolesRequest,
  RoleTypesData,
  UserData,
  UserDetail,
  UserProfile,
  UserRequest
} from '@poss-web/shared/models';
import { OneTimePasswordService } from '@poss-web/shared/one-time-password/data-access-one-time-password';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { UserManagementService } from '../userManagement.service';
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
  LoadUsersSuccess,
  UpdateUser,
  UpdateUserFailure,
  UpdateUserSuccess,
  ValidateMobileEmail,
  ValidateMobileEmailFailure,
  ValidateMobileEmailSuccess,
  VerifyMobileOTP,
  VerifyMobileOTPFailure,
  VerifyMobileOTPSuccess
} from './user-management.actions';
import { UserManagmentEffect } from './user-management.effect';

describe('User Management Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: UserManagmentEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const userManagementServiceSpy = jasmine.createSpyObj<UserManagementService>(
    'UserManagementService',
    [
      'getUsersList',
      'getUser',
      'getUserProfile',
      'loadStates',
      'loadCountries',
      'loadlocations',
      'loadUserRoles',
      'loadUserRoleTypes',
      'loadActiveRoles',
      'updateUser',
      'addUser',
      'changePassword',
      'checkMobileEmail'
    ]
  );
  const otpServiceSpy = jasmine.createSpyObj<OneTimePasswordService>(
    'OneTimePasswordService',
    ['verifyUserMobileNoOtp', 'resendActivateAccountOtp']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserManagmentEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: UserManagementService,
          useValue: userManagementServiceSpy
        },
        {
          provide: OneTimePasswordService,
          useValue: otpServiceSpy
        }
      ]
    });
    effect = TestBed.inject(UserManagmentEffect);
  });

  describe('loadUsers', () => {
    const usersPage = {
      isBTQUser: false,
      pageNumber: 1,
      pageSize: 10,
      employeeCode: 'ORG',
      roleCodes: ['BOS', 'Cashier'],
      locationCodes: ['URB', 'PNA']
    };
    it('should load Users', () => {
      const addressData: AddressData = {
        line1: 'Line 1',
        line2: 'Line 2',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560098',
        country: 'India'
      };
      const userDetailArray: UserDetail[] = [
        {
          address: addressData,
          emailId: 'test@email.com',
          empName: 'system',
          employeeCode: 'EC2',
          hasLoginAccess: true,
          isActive: true,
          isLocked: false,
          isLoginActive: true,
          joiningDate: null,
          locationCode: 'TJ',
          regionCode: '',
          mobileNo: '7892643859',
          resignationDate: null,
          primaryRole: 'Admin',
          userType: 'CORP',
          birthDate: null,
          roleName: 'System Admin',
          secondaryRole: '',
          secondaryRoleName: '',
          secondarystarttime: null,
          secondaryendtime: null,
          resendOTP: false
        }
      ];
      const userData: UserData = {
        totalUsers: 6,
        users: userDetailArray
      };
      const action = new LoadUsers(usersPage);
      const outCome = new LoadUsersSuccess(userData);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: userData });
      userManagementServiceSpy.getUsersList.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadUsers$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadUsers(usersPage);
      const error = new Error('some error');

      const outCome = new LoadUsersSuccess({
        users: [],
        totalUsers: 0
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      userManagementServiceSpy.getUsersList.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.loadUsers$).toBeObservable(expected);
    });
  });

  describe('fetchUser', () => {
    const userRequest: UserRequest = {
      isBTQUser: false,
      employeeCode: 'EC2',
      data: ''
    };
    it('should Fetch User Details', () => {
      const addressData: AddressData = {
        line1: 'Line 1',
        line2: 'Line 2',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560098',
        country: 'India'
      };
      const userDetail: UserDetail = {
        address: addressData,
        emailId: 'test@email.com',
        empName: 'system',
        employeeCode: 'EC2',
        hasLoginAccess: true,
        isActive: true,
        isLocked: false,
        isLoginActive: true,
        joiningDate: null,
        locationCode: 'TJ',
        regionCode: '',
        mobileNo: '7892643859',
        resignationDate: null,
        primaryRole: 'Admin',
        userType: 'CORP',
        birthDate: null,
        roleName: 'System Admin',
        secondaryRole: '',
        secondaryRoleName: '',
        secondarystarttime: null,
        secondaryendtime: null,
        resendOTP: false
      };

      const action = new FetchUser(userRequest);
      const outCome = new FetchUserSuccess(userDetail);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: userDetail });
      userManagementServiceSpy.getUser.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.fetchUser$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new FetchUser(userRequest);
      const error = new Error('some error');
      const outCome = new FetchUserFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      userManagementServiceSpy.getUser.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.fetchUser$).toBeObservable(expected);
    });
  });

  describe('userProfile', () => {
    it('should load User Profile data', () => {
      const addressData: AddressData = {
        line1: 'Line 1',
        line2: 'Line 2',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560098',
        country: 'India'
      };
      const userProfile: UserProfile = {
        employeeCode: 'EC2',
        employeeType: 'ORG',
        empName: 'Test Name',
        birthDate: null,
        mobileNo: '9876543210',
        emailId: 'email@titan.com',
        address: addressData,
        roleName: 'System Admin',
        locationCode: 'ADMIN',
        joiningDate: null,
        userType: 'CORP',
        validateMobile: false
      };
      const action = new LoadUserProfile();
      const outCome = new LoadUserProfileSuccess(userProfile);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: userProfile });
      userManagementServiceSpy.getUserProfile.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.userProfile$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadUserProfile();
      const error = new Error('some error');
      const outCome = new LoadUserProfileFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      userManagementServiceSpy.getUserProfile.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.userProfile$).toBeObservable(expected$);
    });
  });

  describe('loadStates', () => {
    it('should load States for the country', () => {
      const states = [
        'Karnataka',
        'Andhra Pradesh',
        'Kerala',
        'Tamil Nadu',
        'Telangana'
      ];
      const action = new LoadState('IND');
      const outCome = new LoadStateSuccess(states);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: states });
      userManagementServiceSpy.loadStates.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadStates$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadState('IND');
      const error = new Error('some error');
      const outCome = new LoadStateFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      userManagementServiceSpy.loadStates.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadStates$).toBeObservable(expected$);
    });
  });

  describe('loadCountries', () => {
    it('should load Countries', () => {
      const countryData: CountryData[] = [
        {
          description: 'India',
          countryCode: 'IND'
        },
        {
          description: 'United States of America',
          countryCode: 'US'
        },
        {
          description: 'Australia',
          countryCode: 'AUS'
        }
      ];
      const action = new LoadCountry();
      const outCome = new LoadCountrySuccess(countryData);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: countryData });
      userManagementServiceSpy.loadCountries.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadCountries$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCountry();
      const error = new Error('some error');
      const outCome = new LoadCountryFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      userManagementServiceSpy.loadCountries.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadCountries$).toBeObservable(expected$);
    });
  });

  describe('FetchLocation', () => {
    it('should Fetch Locations', () => {
      const locationData: LocationData = {
        locationCode: 'TJ',
        countryCode: 'IND',
        ownerTypeCode: 'CORP'
      };
      const action = new FetchLocation('TJ');
      const outCome = new FetchLocationSuccess(locationData);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: locationData });
      userManagementServiceSpy.loadlocations.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.validateLocation$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new FetchLocation('TJ');
      const error = new Error('some error');
      const outCome = new FetchLocationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      userManagementServiceSpy.loadlocations.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.validateLocation$).toBeObservable(expected$);
    });
  });

  describe('FetchEmailLocation', () => {
    it('should Fetch Email Location', () => {
      const locationData: LocationData = {
        locationCode: 'TJ',
        countryCode: 'IND',
        ownerTypeCode: 'CORP'
      };
      const action = new FetchEmailLocation('TJ');
      const outCome = new FetchEmailLocationSuccess(locationData);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: locationData });
      userManagementServiceSpy.loadlocations.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.validateEmailLocation$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new FetchEmailLocation('TJ');
      const error = new Error('some error');
      const outCome = new FetchEmailLocationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      userManagementServiceSpy.loadlocations.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.validateEmailLocation$).toBeObservable(expected$);
    });
  });

  describe('ValidateMobileEmail', () => {
    const emailMobileData: EmailMobileData = {
      fieldtype: 'email',
      value: 'testemail@titan.com'
    };
    it('should Validate Email Address & return its validity', () => {
      const action = new ValidateMobileEmail(emailMobileData);
      const outCome = new ValidateMobileEmailSuccess(true);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: true });
      userManagementServiceSpy.checkMobileEmail.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.validateEmailMobile$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ValidateMobileEmail(emailMobileData);
      const error = new Error('some error');
      const outCome = new ValidateMobileEmailFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      userManagementServiceSpy.checkMobileEmail.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.validateEmailMobile$).toBeObservable(expected$);
    });
  });

  describe('LoadRoles', () => {
    const rolesRequest: RolesRequest = {
      isBTQUser: false,
      roleType: 'CORP',
      locationCode: 'TJ'
    };
    it('should load Roles', () => {
      const responsedata: RoleInfo = {
        rolesDetails: [],
        roles: new Map()
      };
      // responsedata.set('key', 'value');

      const action = new LoadRoles(rolesRequest);
      const outCome = new LoadRolesSuccess(responsedata);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsedata });
      userManagementServiceSpy.loadUserRoles.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRoles$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRoles(rolesRequest);
      const error = new Error('some error');
      const outCome = new LoadRolesFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      userManagementServiceSpy.loadUserRoles.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRoles$).toBeObservable(expected$);
    });
  });

  describe('LoadRoleTypes', () => {
    it('should get Roles Types', () => {
      const roleTypesDataArray: RoleTypesData[] = [
        {
          code: 'code',
          value: 'value'
        }
      ];
      const action = new LoadRoleTypes();
      const outCome = new LoadRoleTypesSuccess(roleTypesDataArray);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: roleTypesDataArray });
      userManagementServiceSpy.loadUserRoleTypes.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRoleTypes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRoleTypes();
      const error = new Error('some error');
      const outCome = new LoadRoleTypesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      userManagementServiceSpy.loadUserRoleTypes.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRoleTypes$).toBeObservable(expected$);
    });
  });

  describe('LoadFilterRoles', () => {
    it('should get Filtered Roles', () => {
      const responsedata :RoleInfo = {
        rolesDetails: [],
        roles: new Map()
      };
      // responsedata.set('key', 'value');

      const action = new LoadFilterRoles(true);
      const outCome = new LoadFilterRolesSuccess(responsedata);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsedata });
      userManagementServiceSpy.loadActiveRoles.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadFilterRoles$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadFilterRoles(true);
      const error = new Error('some error');
      const outCome = new LoadFilterRolesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      userManagementServiceSpy.loadActiveRoles.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadFilterRoles$).toBeObservable(expected$);
    });
  });

  describe('UpdateUser', () => {
    const userRequest: UserRequest = {
      isBTQUser: false,
      employeeCode: 'EC2',
      data: ''
    };
    it('should Update User details', () => {
      const action = new UpdateUser(userRequest);
      const outCome = new UpdateUserSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: null });
      userManagementServiceSpy.updateUser.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.UpdateUser$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateUser(userRequest);
      const error = new Error('some error');
      const outCome = new UpdateUserFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      userManagementServiceSpy.updateUser.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.UpdateUser$).toBeObservable(expected$);
    });
  });

  describe('AddUser', () => {
    const userRequest: UserRequest = {
      isBTQUser: false,
      employeeCode: 'EC2',
      data: ''
    };
    it('should Add User details', () => {
      const action = new AddUser(userRequest);
      const outCome = new AddUserSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: null });
      userManagementServiceSpy.addUser.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.AddUser$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new AddUser(userRequest);
      const error = new Error('some error');
      const outCome = new AddUserFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      userManagementServiceSpy.addUser.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.AddUser$).toBeObservable(expected$);
    });
  });

  describe('ChangePassword', () => {
    const changePasswordRequest: ChangePasswordRequest = {
      oldPassword: 'Welcome@12',
      newPassword: 'Welcome@123'
    };

    it('should Change User Password', () => {
      const action = new ChangePassword(changePasswordRequest);
      const outCome = new ChangePasswordSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: null });
      userManagementServiceSpy.changePassword.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.ChangePassword$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ChangePassword(changePasswordRequest);
      const error = new Error('some error');
      const outCome = new ChangePasswordFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      userManagementServiceSpy.changePassword.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.ChangePassword$).toBeObservable(expected$);
    });
  });

  describe('VerifyMobileOTP', () => {
    it('should Verify mobile Otp', () => {
      const action = new VerifyMobileOTP('abcdef');
      const outCome = new VerifyMobileOTPSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: null });
      otpServiceSpy.verifyUserMobileNoOtp.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.VerifyMobileOTP$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new VerifyMobileOTP('abcdef');
      const error = new Error('some error');
      const outCome = new VerifyMobileOTPFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otpServiceSpy.verifyUserMobileNoOtp.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.VerifyMobileOTP$).toBeObservable(expected$);
    });
  });

  describe('ActivateAccountOTP', () => {
    const activateAccountPayLoad: ActivateAccountPayLoad = {
      empCode: 'EC2',
      isBTQUser: false
    };

    it('should Activate the user Account', () => {
      const action = new ActivateAccountOTP(activateAccountPayLoad);
      const outCome = new ActivateAccountOTPSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: null });
      otpServiceSpy.resendActivateAccountOtp.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.ActivateAccountOTP$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ActivateAccountOTP(activateAccountPayLoad);
      const error = new Error('some error');
      const outCome = new ActivateAccountOTPFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otpServiceSpy.resendActivateAccountOtp.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.ActivateAccountOTP$).toBeObservable(expected$);
    });
  });
});
