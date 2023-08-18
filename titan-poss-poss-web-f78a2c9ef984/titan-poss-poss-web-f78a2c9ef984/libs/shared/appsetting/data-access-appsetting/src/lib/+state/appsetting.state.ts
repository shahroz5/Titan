import { AppsettingsState } from '@poss-web/shared/models';

import { createFeatureSelector } from '@ngrx/store';
export const APPSETTING_FEATURE_KEY = 'appsetting';
export const LIGHT_THEME = 'LIGHT-THEME';

export const selectAppsettingState = createFeatureSelector<AppsettingsState>(
  APPSETTING_FEATURE_KEY
);
