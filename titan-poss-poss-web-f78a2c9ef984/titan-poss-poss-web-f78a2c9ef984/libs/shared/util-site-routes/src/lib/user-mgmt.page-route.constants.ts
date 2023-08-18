/**
 * User mgmt Routing Urls
 */
export const getUserMgmtHomeRouteUrl = (): string => {
  return `uam/home`;
};

export const getRoleLimitRequestsRouteUrl = (): string => {
  return `uam/role-limit-requests`;
};
export const getRoleLimitRequestsIdRouteUrl = (id: any): string => {
  return `uam/role-limit-requests/${id}`;
};
export const getRoleLimtiRequestsApprovalsRouteUrl = (): string => {
  return `approvals/uam/role-limit-requests`;
};
export const getRoleLimtiRequestsApprovalsIdRouteUrl = (id: any): string => {
  return `approvals/uam/role-limit-requests/${id}`;
};
export const getUamUsersListRouteUrl = (): string => {
  return `uam/users`;
};
export const getRoleAllowedRouteUrl = (): string => {
  return `uam`;
};
export const getAccessControlRouteUrl = (): string => {
  return `uam/access-control`;
};
export const getEpossBaseUrl = (): string => {
  return 'eposs';
};
export const getPossBaseUrl = (): string => {
  return 'poss';
};
export const getUamHomeRouteUrl = (): string => {
  return '/uam/home';
};
