import { Injectable } from '@angular/core';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { Observable } from 'rxjs';

@Injectable()
export class LocationSettingsFeatureService {
  constructor(
    private authFacade: AuthFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private profileDataFacade: ProfileDataFacade
  ) {
    this.locationSettingsFacade
      .getError()
      .pipe(filter(error => !!error))
      .subscribe(_ => {
        this.authFacade.logOut();
      });
  }

  loadLocationSettings() {
    this.authFacade
      .getAccessToken()
      .pipe(
        filter(token => !!token),
        switchMap(_ =>
          this.profileDataFacade
            .isBTQUser()
            .pipe(filter(isBTQUser => isBTQUser !== null))
        ),
        withLatestFrom(this.profileDataFacade.getUserCountryName())
      )
      .subscribe(response => {
        if (!!response) {
          const requestInput = {
            isBTQUser: response[0],
            countryName: response[1]
          };

          this.locationSettingsFacade.loadLocationSettings(requestInput);
        }
      });
  }

  getLocationSetting(propertyKey: string): Observable<string> {
    return this.locationSettingsFacade.getLocationSetting(propertyKey);
  }
}
