import { HttpParams } from '@angular/common/http';
import { getLiteProductGroupUrl } from './masters-data-endpoints.constants';

/**
 * Base Url for User Role Management API
 */
const getLocationBaseUrl = (): string => {
  return '/location/v2';
};
const getLiteDataBaseUrl = (): string => {
  return '/lite-data';
};
const getUserRoleMgmntBaseUrl = (): string => '/user/v2';
const getUserProfileDetailsBaseUrl = (): string => '/engine/v2';
const getUserUrlbyRoleType = (isBTQUser: boolean): string =>
  isBTQUser ? '/location/users' : '/corp/users';

export const getUsersListUrl = (
  isBTQUser: boolean,
  page: number,
  pageSize: number,
  employeeCode: string,
  roleCodes?: string[],
  locationCodes?: string[]
): { path: string; params: HttpParams } => {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', pageSize.toString())
    .set('sort', 'isActive,desc');
  if (roleCodes && roleCodes.length > 0) {
    params = params.append('roleCodes', roleCodes.join(', '));
  }
  if (locationCodes && locationCodes.length > 0) {
    for (let i = 0; i < locationCodes.length; i++)
      params = params.append('locationCodes', locationCodes[i]);
  }
  if (employeeCode) {
    params = params.append('searchField', employeeCode);
  }
  return {
    path: getUserRoleMgmntBaseUrl() + getUserUrlbyRoleType(isBTQUser),
    params
  };
};

export const getUserDataUrl = (
  isBTQUser: boolean,
  employeeCode: string
): string =>
  getUserRoleMgmntBaseUrl() +
  getUserUrlbyRoleType(isBTQUser) +
  `/${employeeCode}`;

export const getMappedLocationsDataUrl = (
  isBTQUser: boolean,
  employeeCode: string
): string => {
  return getUserRoleMgmntBaseUrl() +
  getUserUrlbyRoleType(isBTQUser) +
  `/${employeeCode}` + '/locations';
}

export const getRegionsDataUrl = (): string => {
  return getLocationBaseUrl() + getLiteDataBaseUrl() + '/regions';
}

export const addUserDataUrl = (isBTQUser: boolean): string => {
  return getUserRoleMgmntBaseUrl() + getUserUrlbyRoleType(isBTQUser);
};

export const getEmailMobileCheckUrl = (
  type: string,
  value: string
): { path: string; params: HttpParams } => {
  const params = new HttpParams().set('value', value).set('uniqueType', type);
  return { path: getUserRoleMgmntBaseUrl() + '/users/unique-checks', params };
};

export const getRoleDetailsUrl = (roleCode: string): string => {
  return getUserRoleMgmntBaseUrl() + `/corp/roles/${roleCode}`;
};

export const addRoleUrl = (): string => {
  return getUserRoleMgmntBaseUrl() + `/corp/roles`;
};

// API URL to Load roles for Roles Drop Down in User Creation form
export const getUserRoleUrl = (
  isBTQUser?: boolean,
  roleType?: string,
  locationCode?: string
): { path: string; params: HttpParams } => {
  let params = new HttpParams()
    .set('isActive', 'true')
    .set('corpAccess', `${!isBTQUser}`);
  if (roleType === 'CORP' || roleType === 'REG') {
    params = params.append('roleType', roleType);
  }
  if (locationCode) {
    params = params.append('locationCode', locationCode);
  }
  return {
    path:
      getUserRoleMgmntBaseUrl() +
      (isBTQUser ? '/location/roles' : '/corp/roles'),
    params
  };
};

// API URL to Load roles for Filter PopUp in User's List Page and for Roles Count Request
export const getActiveRolesUrl = (
  isBTQUser: boolean,
  roleType?: string,
  locationCode?: string,
  locationFormat?: string
): { path: string; params: HttpParams } => {
  let params = new HttpParams();
  if (!isBTQUser) {
    params = params.append('isActive', 'true');
  }
  if (roleType) {
    params = params.append('roleType', 'BTQ');
  }
  if (locationCode) {
    params = params.append('locationCode', locationCode);
  }
  if (locationFormat) {
    params = params.append('locationFormat', locationFormat);
  }

  return {
    path:
      getUserRoleMgmntBaseUrl() +
      (isBTQUser ? `/location/roles` : `/corp/roles`),
    params
  };
};

// API URL to Load all Roles for Roles List Page
export const getAllRolesUrl = (
  page: number,
  pageSize: number,
  roleCode: string,
  roleType: string,
  locationFormat: string
): { path: string; params: HttpParams } => {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', pageSize.toString())
    .set('sort', 'roleCode,asc');
  if (roleCode) {
    params = params.append('roleCode', roleCode);
  }
  if (roleType) {
    params = params.append('roleType', roleType);
  }
  if (locationFormat) {
    params = params.append('locationFormat', locationFormat);
  }
  return { path: getUserRoleMgmntBaseUrl() + '/corp/roles', params };
};

export const getUpdateRoleUrl = (roleCode: string): string => {
  return getUserRoleMgmntBaseUrl() + `/corp/roles/${roleCode}`;
};

export const getRolesForAclUrl = (): { path: string; params: HttpParams } => ({
  path: getUserRoleMgmntBaseUrl() + `/corp/roles`,
  params: new HttpParams()
    .set('isActive', 'true')
    .set('isPageable', 'false')
    .set('sort', 'roleName,ASC')
});

export const getACLModulesUrl = (
  role: string
): { path: string; params: HttpParams } => {
  let params = new HttpParams()
    .set('isPageable', 'false')
    .set('sort', 'description,ASC');
  if (role) {
    params = params.append('roleCode', role);
  }
  return {
    path: getUserRoleMgmntBaseUrl() + `/acls`,
    params
  };
};
export const getACLSubModulesUrl = (
  parentAclGroupCode: string,
  role: string
): { path: string; params: HttpParams } => {
  let params = new HttpParams()
    .set('isPageable', 'false')
    .set('sort', 'description,ASC');
  if (role) {
    params = params.append('roleCode', role);
  }
  return {
    path: getUserRoleMgmntBaseUrl() + `/acls/${parentAclGroupCode}`,
    params
  };
};

export const getACLLoadUrl = (
  aclGroupCode: string,
  roleCode: string
): { path: string; params: HttpParams } => {
  let params = new HttpParams()
    .set('isPageable', 'false')
    .set('sort', 'aclCode,ASC');
  if (roleCode) {
    params = params.append('roleCode', roleCode);
  }
  return {
    path: getUserRoleMgmntBaseUrl() + `/acls/${aclGroupCode}/acls`,
    params
  };
};

// API URL to Request Role Count Change by SM/ by Admin for location Code/ by Admin for request id
export const getChangeRoleCountUrl = (
  locationCode?: string,
  requestId?: string
): string => {
  let url = getUserRoleMgmntBaseUrl();

  if (locationCode) {
    url = url + `/corp/role-limits/locations/${locationCode}`;
  } else if (requestId) {
    url = url + `/corp/role-limits/requests/${requestId}`;
  } else {
    url = url + '/location/role-limits/requests';
  }
  return url;
};

export const getRoleCountRequestListUrl = (
  pageNumber: number,
  pageSize: number,
  isBTQUser?: boolean,
  locationCodes?: string[],
  requestSearch?: string
): { path: string; params: HttpParams } => {
  let params = new HttpParams()
    .set('page', pageNumber.toString())
    .set('size', pageSize.toString())
    .set('sort', 'reqDocDate,desc');
  if (locationCodes) {
    locationCodes.forEach(
      locCode => (params = params.append('locationCode', locCode))
    );
  }
  if (requestSearch) {
    params = params.append('docNo', requestSearch);
  }
  return {
    path:
      getUserRoleMgmntBaseUrl() +
      (isBTQUser ? '/location/role-limits' : '/corp/role-limits'),
    params
  };
};

export const getRoleCountRequestUrl = (
  requestId: string,
  isBTQUser: boolean
): string =>
  getUserRoleMgmntBaseUrl() +
  (isBTQUser ? '/location' : '/corp') +
  `/role-limits/${requestId}/requests`;

export const getUserProfileDataUrl = (): string => {
  return getUserProfileDetailsBaseUrl() + '/users/profile';
};
export const getRequestedMobileNoDataUrl = (): string => {
  return '/user/v2/users/mobile-number';
};

export const changeUserPasswordUrl = (): string => {
  return getUserRoleMgmntBaseUrl() + '/users/change-password';
};

export const generateForgotPasswordOTPUrl = (): string => {
  return getUserRoleMgmntBaseUrl() + '/users/forgot-password';
};

export const verifyGuestUserOTPUrl = (): string => {
  return getUserRoleMgmntBaseUrl() + '/users/verify-otp';
};

export const verifyUserMobileNoOTPUrl = (): string => {
  return getUserRoleMgmntBaseUrl() + '/users/validate-mobile-number';
};

export const resendActivateAccountOTPUrl = (isBTQUser: boolean): string => {
  return (
    getUserRoleMgmntBaseUrl() +
    (isBTQUser ? '/location' : '/corp') +
    '/users/generate-otps'
  );
};
export const getTitanADSamlLoginUrl = (): string => {
  return '/auth/v2/sso/samlLogin';
};
