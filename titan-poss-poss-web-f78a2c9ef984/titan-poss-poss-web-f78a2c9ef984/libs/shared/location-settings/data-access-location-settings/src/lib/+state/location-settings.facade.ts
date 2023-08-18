import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocationSettingsSelectors } from './location-settings.selectors';
import { LocationSettingsState } from './location-settings.state';
import * as LocationSettingsActions from './location-settings.actions';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * Location Settings Facade for accesing Location-Settings-State
 * */
@Injectable()
export class LocationSettingsFacade {
  constructor(private store: Store<LocationSettingsState>) {}

  private locationSettings$ = this.store.select(
    LocationSettingsSelectors.selectLocationSettings
  );
  private error$ = this.store.select(LocationSettingsSelectors.selectError);

  /**
   * Access for the State selectors
   */

  getError() {
    return this.error$;
  }

  getAllLocationSettings() {
    return this.locationSettings$;
  }

  // Below methods created for implementation of restructured location settings
  getPropertyValueFromObject(
    objectDetails$: Observable<any>,
    propertyKey: string
  ): Observable<string> {
    return objectDetails$.pipe(
      map(objectdetails =>
        this.getRequiredPropertyFromObject(objectdetails, propertyKey)
      )
    );
  }
  getRequiredPropertyFromObject(objectDetails, propertyKey: string): string {
    let responseData = '';

    if (
      !!objectDetails &&
      (objectDetails[propertyKey] || this.isBoolean(objectDetails[propertyKey]))
    ) {
      responseData = objectDetails[propertyKey].toString();
    }
    // console.log(
    //   'propertyKey - locationSettingsResponseData',
    //   `${propertyKey} - ${responseData}`
    // );
    return responseData;
  }

  isBoolean(property): boolean {
    return typeof property === 'boolean' ? true : false;
  }

  getLocationSetting(propertyKey: string): Observable<string> {
    return this.getPropertyValueFromObject(this.locationSettings$, propertyKey);
  }

  /**
   * Dispatch Action for Loading Location Settings
   */

  loadLocationSettings(requestInput: {
    isBTQUser: boolean;
    countryName: string;
  }) {
    this.store.dispatch(
      new LocationSettingsActions.LoadLocationSettings(requestInput)
    );
  }
}
