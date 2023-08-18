import { createSelector } from '@ngrx/store';
import { AppsettingsState } from '@poss-web/shared/models';
import { selectAppsettingState } from './appsetting.state';

export const selectSettings = createSelector(
  selectAppsettingState,
  (state: AppsettingsState) => state
);

export const selectLanguage = createSelector(
  selectSettings,
  (state: AppsettingsState) => state.language
);

export const selectStoreType = createSelector(
  selectSettings,
  (state: AppsettingsState) => state.storeType
);

export const selectDateFormat = createSelector(
  selectSettings,
  (state: AppsettingsState) => state.dateFormat
);

export const selectTimeFormat = createSelector(
  selectSettings,
  (state: AppsettingsState) => state.timeFormat
);

export const selectPageSize = createSelector(
  selectSettings,
  (state: AppsettingsState) => state.pageSize
);

export const selectPageSizeOptions = createSelector(
  selectSettings,
  (state: AppsettingsState) => state.pageSizeOptions
);

export const selectMaxFilterLimit = createSelector(
  selectSettings,
  (state: AppsettingsState) => state.maxFilterLimit
);

export const selectMaxSortLimit = createSelector(
  selectSettings,
  (state: AppsettingsState) => state.maxSortLimit
);

export const selectMaxProductInList = createSelector(
  selectSettings,
  (state: AppsettingsState) => state.maxProductInList
);

export const selectMobileMaxlength = createSelector(
  selectSettings,
  (state: AppsettingsState) => state.mobileNoMaxLength
);

export const selectmaxLimitForCheckboxGrid = createSelector(
  selectSettings,
  (state: AppsettingsState) => state.maxLimitForCheckboxGrid
);

export const selectHostName = createSelector(
  selectSettings,
  (state: AppsettingsState) => state.hostName
);

export const selectBlockSetting = createSelector(
  selectSettings,
  (state: AppsettingsState) => state.blockSetting
);

export const appQuery = {
  selectSettings,
  selectLanguage,
  selectStoreType,
  selectPageSize,
  selectPageSizeOptions,
  selectMaxFilterLimit,
  selectMaxSortLimit,
  selectMaxProductInList,
  selectDateFormat,
  selectMobileMaxlength,
  selectmaxLimitForCheckboxGrid,
  selectHostName,
  selectTimeFormat,
  selectBlockSetting
};
