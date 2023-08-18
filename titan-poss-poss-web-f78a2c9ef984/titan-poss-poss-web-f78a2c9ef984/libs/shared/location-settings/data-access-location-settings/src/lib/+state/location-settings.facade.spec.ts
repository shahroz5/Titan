import { Store } from '@ngrx/store';
import { inject, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { LocationSettingsState } from './location-settings.state';
import { LocationSettingsFacade } from './location-settings.facade';
import { LocationSettingAttributesEnum } from '@poss-web/shared/models';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadLocationSettings } from './location-settings.actions';

describe('Location Settings Facade Testing Suite', () => {
  const initialState: LocationSettingsState = {
    locationSettingsData: null,
    error: null
  };
  const propertyKey = LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE;

  let locationSettingsFacade: LocationSettingsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), LocationSettingsFacade]
    });

    locationSettingsFacade = TestBed.inject(LocationSettingsFacade);
  });

  it('should access  getError() selector action', () => {
    expect(locationSettingsFacade.getError()).toEqual(
      locationSettingsFacade['error$']
    );
  });

  it('should access  getAllLocationSettings() selector action', () => {
    expect(locationSettingsFacade.getAllLocationSettings()).toEqual(
      locationSettingsFacade['locationSettings$']
    );
  });

  // it('should get Location Settings for the property Key', () => {
  //   expect(locationSettingsFacade.getLocationSetting(propertyKey)).toEqual(
  //     locationSettingsFacade.getPropertyValueFromObject(
  //       locationSettingsFacade.getAllLocationSettings(),
  //       propertyKey
  //     )
  //   );
  // });

  // it('should get Property Value for the property Key', () => {
  //   const responseData: Observable<string> = of('INR');

  //   expect(
  //     locationSettingsFacade.getPropertyValueFromObject(
  //       locationSettingsFacade.getAllLocationSettings(),
  //       propertyKey
  //     )
  //   ).toEqual(responseData);
  // });

  // it('should get Property From location settings Object', () => {
  //   let objectDetails;
  //   let locationSettings$ = locationSettingsFacade.getAllLocationSettings();

  //   locationSettings$.pipe(
  //     map(data => {
  //       objectDetails = data;
  //     })
  //   );

  //   expect(
  //     locationSettingsFacade.getRequiredPropertyFromObject(
  //       objectDetails,
  //       propertyKey
  //     )
  //   ).toEqual('INR');
  // });

  it('should check the type of value & return true if its boolean', () => {
    expect(
      locationSettingsFacade.isBoolean(
        locationSettingsFacade
          .getAllLocationSettings()
          .pipe(map(objectDetails => objectDetails[propertyKey]))
      )
    ).toEqual(false);
  });

  describe('Load Location Settings From Api', () => {
    const requestData = {
      isBTQUser: true,
      countryName: 'IND'
    };

    it('should dispatch loadLocationSettings action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadLocationSettings(requestData);
      locationSettingsFacade.loadLocationSettings(requestData);
      locationSettingsFacade.getLocationSetting(propertyKey);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
