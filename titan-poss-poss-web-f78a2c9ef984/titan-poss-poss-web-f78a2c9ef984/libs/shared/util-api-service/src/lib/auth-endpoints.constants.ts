/**
 * Base Url for Authentication API
 */

const getAuthBaseUrl = (environment): string => {
  return `/auth/v2`;
};

/**
 * Retrieve the Url of the API Endpoint for retrieving access token.
 */
export const getLoginEndpointUrl = (environment): string => {
  return getAuthBaseUrl(environment) + `/login`;
};

/**
 * Retrieve the Url of the API Endpoint for creating new user.
 */
export const getCreateUserEndpointUrl = (environment): string => {
  return getAuthBaseUrl(environment) + `/createUser`;
};

/**
 * Retrieve the Url of the API Endpoint for retrieving already existing or created access token.
 */
export const getActiveAccessTokenEndpointUrl = (environment): string => {
  return getAuthBaseUrl(environment) + `/init`;
};

/**
 * Retrieve the Url of the API Endpoint to logout the logged in user.
 */
export const getLogoutEndpointUrl = (environment): string => {
  return getAuthBaseUrl(environment) + `/logout`;
};

/**
 * Retrieve the Url of the API Endpoint to reload the logged in user.
 */
export const getReloadEndpointUrl = (environment): string => {
  return getAuthBaseUrl(environment) + `/reload`;
};

/**
 * Retrieve the Url of the API Endpoint to refresh the access token.
 */

export const getRefreshEndpointUrl = (environment): string => {
  return getAuthBaseUrl(environment) + `/refresh`;
};

export const getRefreshApiBody = (refreshtoken: string) => {
  return {
    grantType: 'refresh_token',
    refreshToken: `${refreshtoken}`
  };
};

export const getSsoLogoutEndpointUrl = (environment): string => {
  return getAuthBaseUrl(environment) + `/adlogouturl`;
};
