import { createSelector } from '@ngrx/store';
import { countrySelector } from './user-management.entity';
import { selectUserManagementState } from './user-management.reducer';
import { UserManagementState } from './user-management.state';

const selectUserManagement = createSelector(
  selectUserManagementState,
  (state: UserManagementState) => state
);

const UsersList = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.users
);

const RolesListSelector = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.roles?.roles
);

const RegionsSelector = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.regions
);

const RolesDetailsSelector = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.roles?.rolesDetails
);

const RoleTypesListSelector = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.roleTypes
);

const fetchStates = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.states
);

const CountrySelector = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.countries
);

const fetchCountries = createSelector(
  CountrySelector,
  countrySelector.selectAll
);

const CountryEntities = createSelector(
  CountrySelector,
  countrySelector.selectEntities
);

const fetchCountry = id =>
  createSelector(CountryEntities, entities => entities[id]);

const fetchLocation = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.location
);

const fetchEmailLocation = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.emailLocation
);

const fetchEmailMobileValidation = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.checkMobileEmail
);

const selectError = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.error
);

const totalUsers = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.totalUsers
);

const fetchSelectedUser = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.selectedUser
);

const fetchUserProfile = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.userProfile
);

const UserUpdated = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.updateUser
);

const PasswordUpdated = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.changePassword
);

const verifiedOtp = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.verifyMobileOTP
);

const resendOtp = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.OTPsent
);

const isLoading = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.isLoading
);

const mappedLocations = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.mappedLocations
);

const isLocationsMapped = createSelector(
  selectUserManagement,
  (state: UserManagementState) => state.isLocationsMapped
);

export const UserManagementSelectors = {
  UsersList,
  totalUsers,
  selectError,
  fetchSelectedUser,
  fetchCountries,
  fetchStates,
  fetchLocation,
  fetchEmailLocation,
  RolesListSelector,
  UserUpdated,
  fetchEmailMobileValidation,
  isLoading,
  fetchCountry,
  fetchUserProfile,
  PasswordUpdated,
  verifiedOtp,
  resendOtp,
  RoleTypesListSelector,
  mappedLocations,
  RolesDetailsSelector,
  isLocationsMapped,
  RegionsSelector
};
