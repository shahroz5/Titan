/**
 * Report Routing Urls
 */

export const getReportHomeRouteUrl = (): string => {
  return `/reports/home`;
};

export const getReportSettingsRouteUrl = (type): string => {
  return `/reports/settings/` + `${type}`;
};

export const getReportRoleMappingRouteUrl = (): string => {
  return `/reports/role-mapping`;
};

export const getReportManualGenerationRouteUrl = (): string => {
  return `/reports/manual-generation`;
};
export const getReportAutoGenerationRouteUrl = (): string => {
  return `/reports/auto-generation`;
};

export const getGenerateReportRouteUrl = (): string => {
  return `/reports/generate-report`;
};

export const getReportListRouteUrl = (): string => {
  return `/reports/list`;
};
