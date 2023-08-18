const getEngineBaseUrl = (): string => {
  return `/engine/v2`;
};

const getNotificationsBaseUrl = (): string => {
  return `/notifications`;
};

export const getNotificationsEmitterEndPointUrl = (): string => {
  return getEngineBaseUrl() + getNotificationsBaseUrl() + `/register-user`;
};
