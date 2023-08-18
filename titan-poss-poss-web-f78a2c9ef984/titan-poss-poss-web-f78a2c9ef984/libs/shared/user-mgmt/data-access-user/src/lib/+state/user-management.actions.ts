import { Action } from '@ngrx/store';
import {
  ActivateAccountPayLoad,
  ChangePasswordRequest,
  CountryData,
  CustomErrors,
  EmailMobileData,
  LocationData,
  LocationMappingData,
  RoleInfo,
  RolesRequest,
  RoleTypesData,
  SelectDropDownOption,
  UserData,
  UserDetail,
  UserProfile,
  UserRequest,
  UsersPage
} from '@poss-web/shared/models';

export enum UserManagementActionTypes {
  LOAD_USERS = '[ user-management ] Load Users',
  LOAD_USERS_SUCCESS = '[ user-management ] Load Users Success',
  LOAD_USERS_FAILURE = '[ user-management ]  Load Users Failure',

  LOAD_USER_PROFILE = '[ user-management ] Load User Profile',
  LOAD_USER_PROFILE_SUCCESS = '[ user-management ] Load User Profile Success',
  LOAD_USER_PROFILE_FAILURE = '[ user-management ] Load User Profile Failure',

  FETCH_USER = '[ user-management ] Fetch User',
  FETCH_USER_SUCCESS = '[ user-management ] Fetch User Success',
  FETCH_USER_FAILURE = '[ user-management ]  Fetch User Failure',

  UPDATE_USER = '[ user-management ] Update User',
  UPDATE_USER_SUCCESS = '[ user-management ] Update User Success',
  UPDATE_USER_FAILURE = '[ user-management ] Update User Failure',

  ADD_USER = '[ user-management ] Add User',
  ADD_USER_SUCCESS = '[ user-management ] Add User Success',
  ADD_USER_FAILURE = '[ user-management ] Add User Failure',

  LOAD_ROLES = '[ user-management ] Load User Roles',
  LOAD_ROLES_SUCCESS = '[ user-management ] Load User Roles Success',
  LOAD_ROLES_FAILURE = '[ user-management ]  Load User Roles Failure',

  LOAD_REGIONS = '[ user-management ] Load User Regions',
  LOAD_REGIONS_SUCCESS = '[ user-management ] Load User Regions Success',
  LOAD_REGIONS_FAILURE = '[ user-management ]  Load User Regions Failure',

  CLEAR_SEARCHED_USERS = '[user-management ] Clear Searched Roles',

  LOAD_ROLE_TYPES = '[ user-management ] Load User Role Types',
  LOAD_ROLE_TYPES_SUCCESS = '[ user-management ] Load User Role Types Success',
  LOAD_ROLE_TYPES_FAILURE = '[ user-management ] Load User Role Types Failure',

  LOAD_FILTER_ROLES = '[ user-management ] Load Filter Roles',
  LOAD_FILTER_ROLES_SUCCESS = '[ user-management ] Load Filter Roles Success',
  LOAD_FILTER_ROLES_FAILURE = '[ user-management ]  Load Filter Roles Failure',

  LOAD_STATE = '[ user-management ] Load State',
  LOAD_STATE_SUCCESS = '[ user-management ] Load State Success',
  LOAD_STATE_FAILURE = '[ user-management ]  Load State Failure',

  LOAD_COUNTRY = '[ user-management ] Load Country',
  LOAD_COUNTRY_SUCCESS = '[ user-management ] Load Country Success',
  LOAD_COUNTRY_FAILURE = '[ user-management ]  Load Country Failure',

  FETCH_LOCATION = '[ user-management ] Validate Location',
  FETCH_LOCATION_SUCCESS = '[ user-management ] Validate Location Success',
  FETCH_LOCATION_FAILURE = '[ user-management ] Validate Location Failure',

  FETCH_EMAIL_LOCATION = '[ user-management ] Validate Email Location',
  FETCH_EMAIL_LOCATION_SUCCESS = '[ user-management ] Validate Email Location Success',
  FETCH_EMAIL_LOCATION_FAILURE = '[ user-management ] Validate Email Location Failure',

  VALIDATE_MOBILE_EMAIL = '[ user-management ] Validate Mobile & Email',
  VALIDATE_MOBILE_EMAIL_SUCCESS = '[ user-management ] Validate Mobile & Email Success',
  VALIDATE_MOBILE_EMAIL_FAILURE = '[ user-management ] Validate Mobile & Email Failure',

  CHANGE_PASSWORD = '[ user-management ] Change Password',
  CHANGE_PASSWORD_SUCCESS = '[ user-management ] Change Password Success',
  CHANGE_PASSWORD_FAILURE = '[ user-management ] Change Password Failure',

  VERIFY_OTP_FOR_MOBILE = '[ user-management ] Verify OTP for Mobile',
  VERIFY_OTP_FOR_MOBILE_SUCCESS = '[ user-management ] Verify OTP for Mobile Success',
  VERIFY_OTP_FOR_MOBILE_FAILURE = '[ user-management ] Verify OTP for mobile Failure',

  ACTIVATE_ACCOUNT_OTP = '[ user-management ] Activate Account OTP',
  ACTIVATE_ACCOUNT_OTP_SUCCESS = '[ user-management ] Activate Account OTP Success',
  ACTIVATE_ACCOUNT_OTP_FAILURE = '[ user-management ] Activate Account OTP Failure',

  LOAD_MAPPED_LOCATIONS = '[ user-management ] Load Mapped Locations',
  LOAD_MAPPED_LOCATIONS_SUCCESS = '[ user-management ] Load Mapped Locations Success',
  LOAD_MAPPED_LOCATIONS_FAILURE = '[ user-management ] Load Mapped Locations Failure',

  UPDATE_MAPPED_LOCATIONS = '[ user-management ] Update Mapped Locations',
  UPDATE_MAPPED_LOCATIONS_SUCCESS = '[ user-management ] Update Mapped Locations Success',
  UPDATE_MAPPED_LOCATIONS_FAILURE = '[ user-management ] Update Mapped Locations Failure',

}

export class LoadUsers implements Action {
  readonly type = UserManagementActionTypes.LOAD_USERS;
  constructor(public readonly payload: UsersPage) {}
}

export class LoadUsersSuccess implements Action {
  readonly type = UserManagementActionTypes.LOAD_USERS_SUCCESS;
  constructor(public readonly payload: UserData) {}
}
export class LoadUsersFailure implements Action {
  readonly type = UserManagementActionTypes.LOAD_USERS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadUserProfile implements Action {
  readonly type = UserManagementActionTypes.LOAD_USER_PROFILE;
}

export class LoadUserProfileSuccess implements Action {
  readonly type = UserManagementActionTypes.LOAD_USER_PROFILE_SUCCESS;
  constructor(public readonly payload: UserProfile) {}
}
export class LoadUserProfileFailure implements Action {
  readonly type = UserManagementActionTypes.LOAD_USER_PROFILE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FetchUser implements Action {
  readonly type = UserManagementActionTypes.FETCH_USER;
  constructor(public readonly payload: UserRequest) {}
}

export class FetchUserSuccess implements Action {
  readonly type = UserManagementActionTypes.FETCH_USER_SUCCESS;
  constructor(public readonly payload: UserDetail) {}
}

export class FetchUserFailure implements Action {
  readonly type = UserManagementActionTypes.FETCH_USER_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadState implements Action {
  readonly type = UserManagementActionTypes.LOAD_STATE;
  constructor(public readonly payload: string) {}
}

export class LoadStateSuccess implements Action {
  readonly type = UserManagementActionTypes.LOAD_STATE_SUCCESS;
  constructor(public readonly payload: string[]) {}
}

export class LoadStateFailure implements Action {
  readonly type = UserManagementActionTypes.LOAD_STATE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCountry implements Action {
  readonly type = UserManagementActionTypes.LOAD_COUNTRY;
}

export class LoadCountrySuccess implements Action {
  readonly type = UserManagementActionTypes.LOAD_COUNTRY_SUCCESS;
  constructor(public readonly payload: CountryData[]) {}
}

export class LoadCountryFailure implements Action {
  readonly type = UserManagementActionTypes.LOAD_COUNTRY_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FetchLocation implements Action {
  readonly type = UserManagementActionTypes.FETCH_LOCATION;
  constructor(public readonly payload: string) {}
}

export class FetchLocationSuccess implements Action {
  readonly type = UserManagementActionTypes.FETCH_LOCATION_SUCCESS;
  constructor(public readonly payload: LocationData) {}
}

export class FetchLocationFailure implements Action {
  readonly type = UserManagementActionTypes.FETCH_LOCATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FetchEmailLocation implements Action {
  readonly type = UserManagementActionTypes.FETCH_EMAIL_LOCATION;
  constructor(public readonly payload: string) {}
}

export class FetchEmailLocationSuccess implements Action {
  readonly type = UserManagementActionTypes.FETCH_EMAIL_LOCATION_SUCCESS;
  constructor(public readonly payload: LocationData) {}
}

export class FetchEmailLocationFailure implements Action {
  readonly type = UserManagementActionTypes.FETCH_EMAIL_LOCATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ValidateMobileEmail implements Action {
  readonly type = UserManagementActionTypes.VALIDATE_MOBILE_EMAIL;
  constructor(public readonly payload: EmailMobileData) {}
}

export class ValidateMobileEmailSuccess implements Action {
  readonly type = UserManagementActionTypes.VALIDATE_MOBILE_EMAIL_SUCCESS;
  constructor(public readonly payload: boolean) {}
}

export class ValidateMobileEmailFailure implements Action {
  readonly type = UserManagementActionTypes.VALIDATE_MOBILE_EMAIL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRoles implements Action {
  readonly type = UserManagementActionTypes.LOAD_ROLES;
  constructor(public readonly payload: RolesRequest) {}
}

export class LoadRolesSuccess implements Action {
  readonly type = UserManagementActionTypes.LOAD_ROLES_SUCCESS;
  constructor(public readonly payload: RoleInfo) {}
}

export class LoadRolesFailure implements Action {
  readonly type = UserManagementActionTypes.LOAD_ROLES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRegions implements Action {
  readonly type = UserManagementActionTypes.LOAD_REGIONS;
}

export class LoadRegionsSuccess implements Action {
  readonly type = UserManagementActionTypes.LOAD_REGIONS_SUCCESS;
  constructor(public readonly payload: SelectDropDownOption[]) {}
}

export class LoadRegionsFailure implements Action {
  readonly type = UserManagementActionTypes.LOAD_REGIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearSearchedUsers implements Action {
  readonly type = UserManagementActionTypes.CLEAR_SEARCHED_USERS;
}
export class LoadRoleTypes implements Action {
  readonly type = UserManagementActionTypes.LOAD_ROLE_TYPES;
}

export class LoadRoleTypesSuccess implements Action {
  readonly type = UserManagementActionTypes.LOAD_ROLE_TYPES_SUCCESS;
  constructor(public readonly payload: RoleTypesData[]) {}
}

export class LoadRoleTypesFailure implements Action {
  readonly type = UserManagementActionTypes.LOAD_ROLE_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadFilterRoles implements Action {
  readonly type = UserManagementActionTypes.LOAD_FILTER_ROLES;
  constructor(public readonly payload: boolean) {}
}

export class LoadFilterRolesSuccess implements Action {
  readonly type = UserManagementActionTypes.LOAD_FILTER_ROLES_SUCCESS;
  constructor(public readonly payload: RoleInfo) {}
}

export class LoadFilterRolesFailure implements Action {
  readonly type = UserManagementActionTypes.LOAD_FILTER_ROLES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateUser implements Action {
  readonly type = UserManagementActionTypes.UPDATE_USER;
  constructor(public readonly payload: UserRequest) {}
}

export class UpdateUserSuccess implements Action {
  readonly type = UserManagementActionTypes.UPDATE_USER_SUCCESS;
}

export class UpdateUserFailure implements Action {
  readonly type = UserManagementActionTypes.UPDATE_USER_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddUser implements Action {
  readonly type = UserManagementActionTypes.ADD_USER;
  constructor(public readonly payload: UserRequest) {}
}

export class AddUserSuccess implements Action {
  readonly type = UserManagementActionTypes.ADD_USER_SUCCESS;
}

export class AddUserFailure implements Action {
  readonly type = UserManagementActionTypes.ADD_USER_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ChangePassword implements Action {
  readonly type = UserManagementActionTypes.CHANGE_PASSWORD;
  constructor(public readonly payload: ChangePasswordRequest) {}
}

export class ChangePasswordSuccess implements Action {
  readonly type = UserManagementActionTypes.CHANGE_PASSWORD_SUCCESS;
}

export class ChangePasswordFailure implements Action {
  readonly type = UserManagementActionTypes.CHANGE_PASSWORD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class VerifyMobileOTP implements Action {
  readonly type = UserManagementActionTypes.VERIFY_OTP_FOR_MOBILE;
  constructor(public readonly payload: string) {}
}

export class VerifyMobileOTPSuccess implements Action {
  readonly type = UserManagementActionTypes.VERIFY_OTP_FOR_MOBILE_SUCCESS;
}

export class VerifyMobileOTPFailure implements Action {
  readonly type = UserManagementActionTypes.VERIFY_OTP_FOR_MOBILE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ActivateAccountOTP implements Action {
  readonly type = UserManagementActionTypes.ACTIVATE_ACCOUNT_OTP;
  constructor(public readonly payload: ActivateAccountPayLoad) {}
}

export class ActivateAccountOTPSuccess implements Action {
  readonly type = UserManagementActionTypes.ACTIVATE_ACCOUNT_OTP_SUCCESS;
}

export class ActivateAccountOTPFailure implements Action {
  readonly type = UserManagementActionTypes.ACTIVATE_ACCOUNT_OTP_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadMappedLocations implements Action {
  readonly type = UserManagementActionTypes.LOAD_MAPPED_LOCATIONS;
  constructor(public readonly isBTQUser: boolean, public readonly empCode: string) {}
}

export class LoadMappedLocationsSuccess implements Action {
  readonly type = UserManagementActionTypes.LOAD_MAPPED_LOCATIONS_SUCCESS;
  constructor(public readonly payload: LocationMappingData[]) {}
}

export class LoadMappedLocationsFailure implements Action {
  readonly type = UserManagementActionTypes.LOAD_MAPPED_LOCATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateMappedLocations implements Action {
  readonly type = UserManagementActionTypes.UPDATE_MAPPED_LOCATIONS;
  constructor(public readonly isBTQUser: boolean, public readonly empCode: string, public readonly payload: any) {}
}

export class UpdateMappedLocationsSuccess implements Action {
  readonly type = UserManagementActionTypes.UPDATE_MAPPED_LOCATIONS_SUCCESS;
}

export class UpdateMappedLocationsFailure implements Action {
  readonly type = UserManagementActionTypes.UPDATE_MAPPED_LOCATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type UserManagementActions =
  | LoadUsers
  | LoadUsersSuccess
  | LoadUsersFailure
  | LoadUserProfile
  | LoadUserProfileSuccess
  | LoadUserProfileFailure
  | FetchUser
  | FetchUserSuccess
  | FetchUserFailure
  | LoadState
  | LoadStateSuccess
  | LoadStateFailure
  | LoadCountry
  | LoadCountrySuccess
  | LoadCountryFailure
  | LoadRolesSuccess
  | LoadRolesFailure
  | LoadFilterRoles
  | LoadFilterRolesSuccess
  | LoadFilterRolesFailure
  | LoadRoleTypes
  | LoadRoleTypesSuccess
  | LoadRoleTypesFailure
  | UpdateUser
  | UpdateUserSuccess
  | UpdateUserFailure
  | AddUser
  | AddUserSuccess
  | AddUserFailure
  | ChangePassword
  | ChangePasswordSuccess
  | ChangePasswordFailure
  | FetchLocationSuccess
  | FetchLocationFailure
  | FetchEmailLocationSuccess
  | FetchEmailLocationFailure
  | ValidateMobileEmailSuccess
  | ValidateMobileEmailFailure
  | VerifyMobileOTP
  | VerifyMobileOTPFailure
  | VerifyMobileOTPSuccess
  | ActivateAccountOTP
  | ActivateAccountOTPFailure
  | ActivateAccountOTPSuccess
  | ClearSearchedUsers
  | LoadMappedLocations
  | LoadMappedLocationsSuccess
  | LoadMappedLocationsFailure
  | UpdateMappedLocations
  | UpdateMappedLocationsSuccess
  | UpdateMappedLocationsFailure
  | LoadRegions
  | LoadRegionsSuccess
  | LoadRegionsFailure;
