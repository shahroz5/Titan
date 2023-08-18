import { inject, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  ActivateAccountOTP,
  AddUser,
  ChangePassword,
  ClearSearchedUsers,
  FetchEmailLocation,
  FetchLocation,
  FetchUser,
  LoadCountry,
  LoadFilterRoles,
  LoadRoles,
  LoadRoleTypes,
  LoadState,
  LoadUserProfile,
  LoadUsers,
  UpdateUser,
  ValidateMobileEmail,
  VerifyMobileOTP
} from './user-management.actions';
import { UserManagementFacade } from './user-management.facade';
import { UserManagementState } from './user-management.state';

describe('User Management facade Testing Suite', () => {
  const initialState: UserManagementState = {
    users: [],
    totalUsers: 0,
    selectedUser: null,
    states: [],
    countries: null,
    location: null,
    emailLocation: null,
    roles: null,
    roleTypes: [],
    updateUser: false,
    checkMobileEmail: true,
    error: null,
    isLoading: false,
    userProfile: null,
    changePassword: false,
    verifyMobileOTP: false,
    OTPsent: false,
    isLocationsMapped: false,
    mappedLocations: [],
    regions: []
  };
  let userManagementFacade: UserManagementFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), UserManagementFacade]
    });

    userManagementFacade = TestBed.inject(UserManagementFacade);
  });

  describe('Load Users', () => {
    it('should dispatch Load Users action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const pageinfo = {
        isBTQUser: false,
        pageNumber: 1,
        pageSize: 10,
        employeeCode: 'ADMIN',
        roleCodes: ['ORG'],
        locationCodes: ['TJ']
      };
      const expectedAction = new LoadUsers(pageinfo);
      userManagementFacade.loadUsers(pageinfo);
      userManagementFacade.getUsersList();
      userManagementFacade.getTotalUsers();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('load SelectedUser', () => {
    it('should dispatch Load SelectedUser action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const isBTQUser = false;
      const employeeCode = 'ADMIN';
      const expectedAction = new FetchUser({ isBTQUser, employeeCode });
      userManagementFacade.loadSelectedUser(isBTQUser, employeeCode);
      userManagementFacade.getSelectedUser();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('load UserProfile', () => {
    it('should dispatch load UserProfile action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadUserProfile();
      userManagementFacade.loadUserProfile();
      userManagementFacade.getUserProfile();
      userManagementFacade.getError();
      userManagementFacade.isLoading();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('load Country', () => {
    it('should dispatch load Country action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadCountry();
      const countryId = 'IND';
      userManagementFacade.loadCountrylist();
      userManagementFacade.getCountriesList();
      userManagementFacade.getCountry(countryId);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('load State List', () => {
    it('should dispatch load State action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const countryCode = 'IND';
      const expectedAction = new LoadState(countryCode);
      userManagementFacade.loadStatelist(countryCode);
      userManagementFacade.getStatesList();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('load Roles', () => {
    it('should dispatch load Roles action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const isBTQUser = false;
      const roleType = 'ORG';
      const locationCode = 'TJ';
      const expectedAction = new LoadRoles({
        isBTQUser,
        roleType,
        locationCode
      });
      userManagementFacade.loadRoles(isBTQUser, roleType, locationCode);
      userManagementFacade.getRolesList();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Clear Selected User', () => {
    it('should dispatch Clear Selected User action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearSearchedUsers();
      userManagementFacade.clearSearchedUsers();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Load Role Types', () => {
    it('should dispatch Load Role Types action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadRoleTypes();
      userManagementFacade.loadRoleTypes();
      userManagementFacade.getRoleTypesList();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Load Filtered Roles', () => {
    it('should dispatch Load Filtered Roles action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const isBTQUser = false;
      const expectedAction = new LoadFilterRoles(isBTQUser);
      userManagementFacade.loadFilterRoles(isBTQUser);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Validate Location', () => {
    it('should dispatch FetchLocation action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const locatiocode = 'TJ';
      const expectedAction = new FetchLocation(locatiocode);
      userManagementFacade.validateLocation(locatiocode);
      userManagementFacade.getLocation();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Validate Email Location', () => {
    it('should dispatch FetchEmailLocation action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const locatiocode = 'TJ';
      const expectedAction = new FetchEmailLocation(locatiocode);
      userManagementFacade.validateEmailLocation(locatiocode);
      userManagementFacade.getEmailLocation();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Validate Email Mobile', () => {
    it('should dispatch ValidateMobileEmail action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const fieldtype = 'fieldType';
      const value = 'value';
      const expectedAction = new ValidateMobileEmail({ fieldtype, value });
      userManagementFacade.validateEmailMobile(fieldtype, value);
      userManagementFacade.getEmailMobileValidation();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Update User', () => {
    it('should dispatch UpdateUser action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const isBTQUser = false;
      const employeeCode = 'EC';
      const data = '';
      const expectedAction = new UpdateUser({ isBTQUser, employeeCode, data });
      userManagementFacade.updateUser(isBTQUser, employeeCode, data);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Update Password', () => {
    it('should dispatch ChangePassword action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const oldPassword = 'Welcome@12';
      const newPassword = 'Welcome@123';
      const expectedAction = new ChangePassword({
        oldPassword,
        newPassword
      });
      userManagementFacade.updatePassword(oldPassword, newPassword);
      userManagementFacade.passwordUpdated();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Add User', () => {
    it('should dispatch AddUser action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const isBTQUser = false;
      const data = '';

      const expectedAction = new AddUser({
        isBTQUser,
        employeeCode: undefined,
        data
      });
      userManagementFacade.addUser(isBTQUser, data);

      userManagementFacade.userUpdated();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Verify Otp', () => {
    it('should dispatch VerifyMobileOTP action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const otp = 'otpotp';
      const expectedAction = new VerifyMobileOTP(otp);
      userManagementFacade.verifyOtp(otp);
      userManagementFacade.getOtpVerified();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Resend Otp', () => {
    it('should dispatch ActivateAccountOTP action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const userData = {
        empCode: 'EC',
        isBTQUser: false
      };
      const expectedAction = new ActivateAccountOTP(userData);
      userManagementFacade.resendOtp(userData);
      userManagementFacade.isOtpSent();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
