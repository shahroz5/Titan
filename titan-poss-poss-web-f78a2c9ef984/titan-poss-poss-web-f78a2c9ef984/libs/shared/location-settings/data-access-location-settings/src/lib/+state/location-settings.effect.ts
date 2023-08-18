import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';

import { LoggerService } from '@poss-web/shared/util-logger';
import { map } from 'rxjs/operators';

import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationSettingsService } from '../location-settings.service';
import { LocationSettingsActionTypes } from './location-settings.actions';
import * as LocationSettingsActions from './location-settings.actions';
import { CustomErrors, LocationSettingDetails } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class LocationSettingsEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private locationService: LocationSettingsService
  ) {}

  @Effect()
  loadLocationSettings$ = this.dataPersistence.fetch(
    LocationSettingsActionTypes.LOAD_LOCATION_SETTINGS,
    {
      run: (action: LocationSettingsActions.LoadLocationSettings) => {
        return this.locationService
          .loadLocationSettings(action.payload)
          .pipe(
            map(
              (locationSettingsData: LocationSettingDetails) =>
                new LocationSettingsActions.LoadLocationSettingsSuccess(
                  locationSettingsData
                )
            )
          );
      },
      onError: (
        action: LocationSettingsActions.LoadLocationSettings,
        error: HttpErrorResponse
      ) => {
        return new LocationSettingsActions.LoadLocationSettingsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
