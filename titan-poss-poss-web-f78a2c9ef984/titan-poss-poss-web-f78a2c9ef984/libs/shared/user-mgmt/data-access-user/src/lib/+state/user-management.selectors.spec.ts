import {
  AddressData,
  CustomErrors,
  LocationData,
  RoleInfo,
  RoleTypesData,
  UserDetail,
  UserProfile
} from '@poss-web/shared/models';
import { initialState } from './user-management.reducer';
import * as selectors from './user-management.selectors';
import { UserManagementState } from './user-management.state';

describe('User management Selector Testing Suite', () => {
  it('Testing UsersList selector', () => {
    const addressData: AddressData = {
      line1: 'line1',
      line2: 'line2',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560098',
      country: 'India'
    };
    const userDetailArray: UserDetail[] = [
      {
        address: addressData,
        emailId: 'email@email.com',
        empName: 'Test name',
        employeeCode: 'E1',
        hasLoginAccess: true,
        isActive: true,
        isLocked: false,
        isLoginActive: true,
        joiningDate: null,
        locationCode: 'TJ',
        regionCode: '',
        mobileNo: '9876543210',
        resignationDate: null,
        primaryRole: 'ADMIN',
        userType: 'CORP',
        birthDate: null,
        roleName: 'ADMIN',
        secondaryRole: '',
        secondaryRoleName: '',
        secondarystarttime: null,
        secondaryendtime: null,
        resendOTP: false
      }
    ];
    const state: UserManagementState = {
      ...initialState,
      users: userDetailArray
    };
    expect(
      selectors.UserManagementSelectors.UsersList.projector(state)
    ).toEqual(userDetailArray);
  });

  it('Testing totalUsers selector', () => {
    const totalUser = 10;
    const state: UserManagementState = {
      ...initialState,
      totalUsers: totalUser
    };
    expect(
      selectors.UserManagementSelectors.totalUsers.projector(state)
    ).toEqual(totalUser);
  });

  it('Testing selectError selector', () => {
    const customError: CustomErrors = {
      code: 'ERR-99',
      message: 'Error occured',
      traceId: '2434',
      timeStamp: 'WED-23-20 22:54',
      error: null
    };

    const state: UserManagementState = {
      ...initialState,
      error: customError
    };
    expect(
      selectors.UserManagementSelectors.selectError.projector(state)
    ).toEqual(customError);
  });

  it('Testing fetchSelectedUser selector', () => {
    const addressData: AddressData = {
      line1: 'line1',
      line2: 'line2',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560098',
      country: 'India'
    };
    const userDetail: UserDetail = {
      address: addressData,
      emailId: 'email@email.com',
      empName: 'Test name',
      employeeCode: 'E1',
      hasLoginAccess: true,
      isActive: true,
      isLocked: false,
      isLoginActive: true,
      joiningDate: null,
      locationCode: 'TJ',
      regionCode: '',
      mobileNo: '9876543210',
      resignationDate: null,
      primaryRole: 'ADMIN',
      userType: 'CORP',
      birthDate: null,
      roleName: 'ADMIN',
      secondaryRole: '',
      secondaryRoleName: '',
      secondarystarttime: null,
      secondaryendtime: null,
      resendOTP: false
    };

    const state: UserManagementState = {
      ...initialState,
      selectedUser: userDetail
    };
    expect(
      selectors.UserManagementSelectors.fetchSelectedUser.projector(state)
    ).toEqual(userDetail);
  });

  it('Testing fetchStates selector', () => {
    const stateData: string[] = ['KA', 'AP'];

    const state: UserManagementState = {
      ...initialState,
      states: stateData
    };
    expect(
      selectors.UserManagementSelectors.fetchStates.projector(state)
    ).toEqual(stateData);
  });

  it('Testing fetchLocation selector', () => {
    const locationData: LocationData = {
      locationCode: 'TJ',
      countryCode: 'IND',
      ownerTypeCode: 'ORG'
    };
    const state: UserManagementState = {
      ...initialState,
      location: locationData
    };
    expect(
      selectors.UserManagementSelectors.fetchLocation.projector(state)
    ).toEqual(locationData);
  });

  it('Testing fetchEmailLocation selector', () => {
    const state: UserManagementState = {
      ...initialState,
      emailLocation: 'karnataka'
    };
    expect(
      selectors.UserManagementSelectors.fetchEmailLocation.projector(state)
    ).toEqual('karnataka');
  });

  it('Testing RolesListSelector selector', () => {
    const mapData :RoleInfo = {
      rolesDetails: [],
      roles: new Map()
    };
    const rolesData = mapData.roles.set('mapKey', 'mapValue');
    const state: UserManagementState = {
      ...initialState,
      roles: mapData
    };
    expect(
      selectors.UserManagementSelectors.RolesListSelector.projector(state)
    ).toEqual(rolesData);
  });

  it('Testing RolesListSelector selector 2', () => {
    const mapData  = {
      rolesDetails: [],
    };
    const state: UserManagementState = {
      ...initialState
    };
    expect(
      selectors.UserManagementSelectors.RolesListSelector.projector(state)
    ).toBeUndefined();
  });

  it('Testing UserUpdated selector', () => {
    const state: UserManagementState = {
      ...initialState,
      updateUser: false
    };
    expect(
      selectors.UserManagementSelectors.UserUpdated.projector(state)
    ).toEqual(false);
  });

  it('Testing fetchEmailMobileValidation selector', () => {
    const state: UserManagementState = {
      ...initialState,
      checkMobileEmail: false
    };
    expect(
      selectors.UserManagementSelectors.fetchEmailMobileValidation.projector(
        state
      )
    ).toEqual(false);
  });

  it('Testing isLoading selector', () => {
    const state: UserManagementState = {
      ...initialState,
      isLoading: false
    };
    expect(
      selectors.UserManagementSelectors.isLoading.projector(state)
    ).toEqual(false);
  });

  it('Testing fetchUserProfile selector', () => {
    const addressData: AddressData = {
      line1: 'line1',
      line2: 'line2',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560098',
      country: 'India'
    };
    const userProfile: UserProfile = {
      employeeCode: 'EC2',
      employeeType: 'Permanent',
      empName: 'Test Name',
      birthDate: null,
      mobileNo: '9876543211',
      emailId: 'email@email.com',
      address: addressData,
      roleName: 'Test Role',
      locationCode: 'TJ',
      joiningDate: null,
      userType: 'CORP',
      validateMobile: false
    };
    const state: UserManagementState = {
      ...initialState,
      userProfile: userProfile
    };
    expect(
      selectors.UserManagementSelectors.fetchUserProfile.projector(state)
    ).toEqual(userProfile);
  });

  it('Testing PasswordUpdated selector', () => {
    const state: UserManagementState = {
      ...initialState,
      changePassword: false
    };
    expect(
      selectors.UserManagementSelectors.PasswordUpdated.projector(state)
    ).toEqual(false);
  });

  it('Testing verifiedOtp selector', () => {
    const state: UserManagementState = {
      ...initialState,
      verifyMobileOTP: false
    };
    expect(
      selectors.UserManagementSelectors.verifiedOtp.projector(state)
    ).toEqual(false);
  });

  it('Testing resendOtp selector', () => {
    const state: UserManagementState = {
      ...initialState,
      OTPsent: true
    };
    expect(
      selectors.UserManagementSelectors.resendOtp.projector(state)
    ).toEqual(true);
  });

  it('Testing RoleTypesListSelector selector', () => {
    const roleTypesDataArray: RoleTypesData[] = [
      {
        code: 'BOS',
        value: 'Boutique Operations Specialist'
      }
    ];
    const state: UserManagementState = {
      ...initialState,
      roleTypes: roleTypesDataArray
    };
    expect(
      selectors.UserManagementSelectors.RoleTypesListSelector.projector(state)
    ).toEqual(roleTypesDataArray);
  });

  it('Testing isLocationsMapped selector', () => {

    const state: UserManagementState = {
      ...initialState,
      isLocationsMapped: false
    };
    expect(
      selectors.UserManagementSelectors.isLocationsMapped.projector(state.isLocationsMapped)
    ).toBeFalsy();
  });
  it('Testing mappedLocations selector', () => {

    const state: UserManagementState = {
      ...initialState,
      mappedLocations: []
    };
    expect(
      selectors.UserManagementSelectors.mappedLocations.projector(state.mappedLocations)
    ).toBeUndefined();
  });

  it('Testing RolesDetailsSelector selector', () => {

    const mapData :RoleInfo = {
      rolesDetails: [],
      roles: new Map()
    };

    const state: UserManagementState = {
      ...initialState,
      roles : mapData
    };
    expect(
      selectors.UserManagementSelectors.RolesDetailsSelector.projector(state.roles.rolesDetails)
    ).toBeUndefined();
  });

  it('Testing RolesDetailsSelector selector 2', () => {

    const mapData  = {
      roles: new Map([])
    };

    const state: UserManagementState = {
      ...initialState,
      roles : mapData as any
    };
    expect(
      selectors.UserManagementSelectors.RolesDetailsSelector.projector(state)
    ).toBeUndefined();
  });

  it('Testing RegionsSelector selector', () => {
    const state: UserManagementState = {
      ...initialState,
     regions: []
    };
    expect(
      selectors.UserManagementSelectors.RegionsSelector.projector(state.regions)
    ).toBeUndefined();
  });



});
