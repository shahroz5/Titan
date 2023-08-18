const getEngineBaseUrl = (): string => {
  return `/engine/v2`;
};
const getAuthBaseUrl = (): string => {
  return `/auth/v2`;
};
const getUserBaseUrl = (): string => {
  return '/users';
};

export const getACLPermissionsApiUrl = (): string => {
  return `${getAuthBaseUrl()}${getUserBaseUrl()}/urls/acls`;
};

export const getElementLevelPermissionsApiUrl = (): string => {
  return `${getAuthBaseUrl()}${getUserBaseUrl()}/urls/elements/acls`;
};
