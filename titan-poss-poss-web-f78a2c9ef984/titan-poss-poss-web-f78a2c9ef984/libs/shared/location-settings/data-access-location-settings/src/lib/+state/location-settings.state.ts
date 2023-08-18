import { CustomErrors, LocationSettingDetails } from '@poss-web/shared/models';

export interface LocationSettingsState {
  locationSettingsData: LocationSettingDetails;
  error: CustomErrors;
}
