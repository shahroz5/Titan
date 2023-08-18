import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivateAccountPayLoad, UsersPage } from '@poss-web/shared/models';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import * as UserManagementActions from './user-management.actions';
import { UserManagementSelectors } from './user-management.selectors';
import { UserManagementState } from './user-management.state';

@Injectable()
export class UserManagementFacade {
  private UsersList$ = this.store.select(UserManagementSelectors.UsersList);

  private StatesList$ = this.store.select(UserManagementSelectors.fetchStates);

  private CountriesList$ = this.store.select(
    UserManagementSelectors.fetchCountries
  );

  private fetchLocation$ = this.store.select(
    UserManagementSelectors.fetchLocation
  );

  private fetchEmailLocation$ = this.store.select(
    UserManagementSelectors.fetchEmailLocation
  );

  private EmailMobileValidation$ = this.store.select(
    UserManagementSelectors.fetchEmailMobileValidation
  );

  private RolesList$ = this.store.select(
    UserManagementSelectors.RolesListSelector
  );

  private RegionsList$ = this.store.select(
    UserManagementSelectors.RegionsSelector
  );

  private RolesDetails$ = this.store.select(
    UserManagementSelectors.RolesDetailsSelector
  );

  private RoleTypesList$ = this.store.select(
    UserManagementSelectors.RoleTypesListSelector
  );

  private UsersListSize$ = this.store.select(
    UserManagementSelectors.totalUsers
  );

  private selectError$ = this.store.select(UserManagementSelectors.selectError);

  private userUpdated$ = this.store.select(UserManagementSelectors.UserUpdated);

  private verifiedOtp$ = this.store.select(UserManagementSelectors.verifiedOtp);

  private resendOtp$ = this.store.select(UserManagementSelectors.resendOtp);

  private passwordUpdated$ = this.store.select(
    UserManagementSelectors.PasswordUpdated
  );

  private fetchSelectedUser$ = this.store.select(
    UserManagementSelectors.fetchSelectedUser
  );

  private fetchUserProfile$ = this.store.select(
    UserManagementSelectors.fetchUserProfile
  );

  private isLocationsMapped$ = this.store.select(
    UserManagementSelectors.isLocationsMapped
  );

  private isLoading$ = this.store.select(UserManagementSelectors.isLoading);

  private mappedLocations$ = this.store.select(UserManagementSelectors.mappedLocations);

  getCountry$ = id =>
    this.store.select(UserManagementSelectors.fetchCountry(id));

  constructor(private store: Store<UserManagementState>) {}

  getUsersList = () => this.UsersList$;

  getStatesList = () => this.StatesList$;

  getCountriesList = () => this.CountriesList$;

  getCountry = (id: string) => this.getCountry$(id);

  getLocation = () => this.fetchLocation$;

  getEmailLocation = () => this.fetchEmailLocation$;

  getEmailMobileValidation = () => this.EmailMobileValidation$;

  getRolesList = () => this.RolesList$;

  getRegionsList = () => this.RegionsList$;

  getRolesDetails = () => this.RolesDetails$

  getRoleTypesList = () => this.RoleTypesList$;

  getTotalUsers = () => this.UsersListSize$;

  getError = () => this.selectError$;

  getSelectedUser = () => this.fetchSelectedUser$;

  getUserProfile = () => this.fetchUserProfile$;

  getMappedLocations = () => this.mappedLocations$;

  getLocationMappingStatus = () => this.isLocationsMapped$;

  isLoading = () => this.isLoading$;

  isOtpSent = () => this.resendOtp$;

  userUpdated = () => this.userUpdated$;

  passwordUpdated = () => this.passwordUpdated$;

  getOtpVerified = () => this.verifiedOtp$;

  loadUsers = (pageinfo: UsersPage) =>
    this.store.dispatch(new UserManagementActions.LoadUsers(pageinfo));

  loadSelectedUser = (isBTQUser: boolean, employeeCode: string) =>
    this.store.dispatch(
      new UserManagementActions.FetchUser({ isBTQUser, employeeCode })
    );

  loadUserProfile = () =>
    this.store.dispatch(new UserManagementActions.LoadUserProfile());

  loadCountrylist = () =>
    this.store.dispatch(new UserManagementActions.LoadCountry());

  loadStatelist = (countryCode: string) =>
    this.store.dispatch(new UserManagementActions.LoadState(countryCode));

  loadRoles = (isBTQUser: boolean, roleType: string, locationCode?: string) =>
    this.store.dispatch(
      new UserManagementActions.LoadRoles({ isBTQUser, roleType, locationCode })
    );
  loadRegions = () =>
  this.store.dispatch(
    new UserManagementActions.LoadRegions()
  );

  clearSearchedUsers() {
    this.store.dispatch(new UserManagementActions.ClearSearchedUsers());
  }

  loadRoleTypes = () =>
    this.store.dispatch(new UserManagementActions.LoadRoleTypes());

  loadFilterRoles = (isBTQUser: boolean) =>
    this.store.dispatch(new UserManagementActions.LoadFilterRoles(isBTQUser));

  validateLocation = (locatiocode: string) =>
    this.store.dispatch(new UserManagementActions.FetchLocation(locatiocode));

  validateEmailLocation = (locatiocode: string) =>
    this.store.dispatch(
      new UserManagementActions.FetchEmailLocation(locatiocode)
    );

  validateEmailMobile = (fieldtype: string, value: string) =>
    this.store.dispatch(
      new UserManagementActions.ValidateMobileEmail({ fieldtype, value })
    );

  updateUser = (isBTQUser: boolean, employeeCode: string, data: any) =>
    this.store.dispatch(
      new UserManagementActions.UpdateUser({ isBTQUser, employeeCode, data })
    );

  updatePassword = (oldPassword: string, newPassword: string) =>
    this.store.dispatch(
      new UserManagementActions.ChangePassword({ oldPassword, newPassword })
    );

  addUser = (isBTQUser: boolean, data: any) =>
    this.store.dispatch(
      new UserManagementActions.AddUser({
        isBTQUser,
        employeeCode: undefined,
        data
      })
    );

  verifyOtp = (otp: string) =>
    this.store.dispatch(new UserManagementActions.VerifyMobileOTP(otp));

  resendOtp = (userData: ActivateAccountPayLoad) =>
    this.store.dispatch(new UserManagementActions.ActivateAccountOTP(userData));

  loadMappedLocations(isBTQUser: boolean, empCode: string) {
    this.store.dispatch(new UserManagementActions.LoadMappedLocations(isBTQUser, empCode));
  }

  updateMappedLocations(isBTQUser: boolean, empCode: string, payload: any) {
    this.store.dispatch(new UserManagementActions.UpdateMappedLocations(isBTQUser, empCode, payload));
  }
}
