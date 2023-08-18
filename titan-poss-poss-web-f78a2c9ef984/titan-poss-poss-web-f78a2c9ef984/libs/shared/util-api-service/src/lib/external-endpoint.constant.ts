const localhostBaseUrl = (): string => {
  return `http://localhost`;
};

const UAPort = (): string => {
  return `:4201`;
};

export const getEncrytedptedHostnameUrl = (): string => {
  return localhostBaseUrl() + UAPort() + `/sysInfo/hostname`;
};
