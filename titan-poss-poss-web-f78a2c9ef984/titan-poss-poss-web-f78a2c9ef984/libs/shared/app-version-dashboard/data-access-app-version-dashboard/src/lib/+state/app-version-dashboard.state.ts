import {
  CustomErrors,
  GetAppVersionData,
  GetAppVersionDataByStatus,
  SelectDropDownOption
} from '@poss-web/shared/models';

export interface AppVersionDashboardState {
  isLoading: boolean;
  error: CustomErrors;

  appVersions: GetAppVersionData[];
  possUiVersionsList: SelectDropDownOption[];
  apiVersionsList: SelectDropDownOption[];
  dbVersionsList: SelectDropDownOption[];
  appVersionDataByStatus: GetAppVersionDataByStatus[];
  totalElements: number;
  newAppVersionAdded: boolean;
  appVersionStatusList: SelectDropDownOption[];
  appVersionsPublished: boolean;
  appVersionDeleted: boolean;

  allPossUiVersionsList: SelectDropDownOption[];
  allEpossUiVersionsList: SelectDropDownOption[];
  allApiVersionsList: SelectDropDownOption[];
  allDbVersionsList: SelectDropDownOption[];
}
