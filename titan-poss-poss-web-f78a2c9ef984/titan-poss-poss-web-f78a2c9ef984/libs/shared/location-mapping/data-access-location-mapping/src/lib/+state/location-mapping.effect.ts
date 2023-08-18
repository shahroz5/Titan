import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  LocationDataService,
  TownDataService,
  StateDataService,
  CountryDataService,
  LovDataService,
  RegionDataService,
  BrandDataService
} from '@poss-web/shared/masters/data-access-masters';
import { LoggerService } from '@poss-web/shared/util-logger';
import {
  Lov,
  CustomErrors,
  BrandSummary,
  RegionSummary,
  CountrySummary,
  StateSummary,
  LocationSummaryList,
  TownSummary,
  ActiveConfig,
  LocationMappingOption
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import * as LocationMappingActions from './location-mapping.actions';
import { LocationMappingActionTypes } from './location-mapping.actions';
import { LocationMappingDataAccessService } from '../location-mapping-data-access.service';

/**
 * Location Master Effects
 */
@Injectable()
export class LocationMappingEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private brandDataService: BrandDataService,
    private regionDataService: RegionDataService,
    private lovDataService: LovDataService,
    private countryDataService: CountryDataService,
    private stateDataService: StateDataService,
    private townDataService: TownDataService,
    private locationDataService: LocationDataService,
    private locationMappingDataAccessService: LocationMappingDataAccessService
  ) {}
  /**
   *  The effect which handles the loadPendingFactorySTN Action
   */
  @Effect()
  searchLocations$ = this.dataPersistence.fetch(
    LocationMappingActionTypes.SEARCH_LOCAITONS,
    {
      run: (action: LocationMappingActions.SearchLocations) => {
        const filter = action.payload
          ? {
              brands: action.payload.brands,
              regions: action.payload.regions,
              levels: action.payload.levels,
              countries: action.payload.countries,
              states: action.payload.states,
              towns: action.payload.towns
            }
          : null;
        return this.locationDataService
          .getLocationSummaryList(
            { ...filter, locationTypes: ['BTQ'] },
            false,
            null,
            null,
            ['locationCode,ASC']
          )
          .pipe(
            map(
              (data: LocationSummaryList[]) =>
                new LocationMappingActions.SearchLocationsSuccess(data)
            )
          );
      },
      onError: (
        action: LocationMappingActions.SearchLocations,
        error: HttpErrorResponse
      ) => {
        return new LocationMappingActions.SearchLocationsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadActiveConfigs$ = this.dataPersistence.fetch(
    LocationMappingActionTypes.LOAD_ACTIVE_CONFIGS,
    {
      run: (action: LocationMappingActions.LoadActiveConfigs) => {
        return this.locationMappingDataAccessService
          .loadActiveConfigs(action.payload)
          .pipe(
            map(
              (data: ActiveConfig[]) =>
                new LocationMappingActions.LoadActiveConfigsSuccess(data)
            )
          );
      },
      onError: (
        action: LocationMappingActions.LoadActiveConfigs,
        error: HttpErrorResponse
      ) => {
        return new LocationMappingActions.LoadActiveConfigsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateLocationMapping$ = this.dataPersistence.fetch(
    LocationMappingActionTypes.UPDATE_LOCATION_MAPPING,
    {
      run: (action: LocationMappingActions.UpdateLocationMapping) => {
        return this.locationMappingDataAccessService
          .updateLocationMapping(action.payload)
          .pipe(
            map(() => new LocationMappingActions.UpdateLocationMappingSuccess())
          );
      },
      onError: (
        action: LocationMappingActions.UpdateLocationMapping,
        error: HttpErrorResponse
      ) => {
        return new LocationMappingActions.UpdateLocationMappingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadMappedLocations$ = this.dataPersistence.fetch(
    LocationMappingActionTypes.LOAD_MAPPED_LOCATIONS,
    {
      run: (action: LocationMappingActions.LoadMappedLocations) => {
        return this.locationMappingDataAccessService
          .getMappedLocations(action.payload)
          .pipe(
            map(
              (selectedLocations: LocationMappingOption[]) =>
                new LocationMappingActions.LoadMappedLocationsSuccess(
                  selectedLocations
                )
            )
          );
      },
      onError: (
        action: LocationMappingActions.LoadMappedLocations,
        error: HttpErrorResponse
      ) => {
        const errorData = this.errorHandler(error);
        if (errorData.code === ErrorEnums.ERR_CONFIG_002) {
          return new LocationMappingActions.LoadMappedLocationsSuccess([]);
        } else {
          return new LocationMappingActions.LoadMappedLocationsFailure(
            errorData
          );
        }
      }
    }
  );

  @Effect()
  loadBrands$ = this.dataPersistence.fetch(
    LocationMappingActionTypes.LOAD_BRANDS,
    {
      run: (action: LocationMappingActions.LoadBrands) => {
        return this.brandDataService
          .getBrandSummary(false, null, null, null, ['brandCode,ASC'])
          .pipe(
            map(
              (data: BrandSummary[]) =>
                new LocationMappingActions.LoadBrandsSuccess(data)
            )
          );
      },
      onError: (
        action: LocationMappingActions.LoadBrands,
        error: HttpErrorResponse
      ) => {
        return new LocationMappingActions.LoadBrandsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRegions$ = this.dataPersistence.fetch(
    LocationMappingActionTypes.LOAD_REGIONS,
    {
      run: (action: LocationMappingActions.LoadRegions) => {
        return this.regionDataService
          .getRegionSummary(false, null, null, null, ['regionCode,ASC'])
          .pipe(
            map(
              (data: RegionSummary[]) =>
                new LocationMappingActions.LoadRegionsSuccess(data)
            )
          );
      },
      onError: (
        action: LocationMappingActions.LoadRegions,
        error: HttpErrorResponse
      ) => {
        return new LocationMappingActions.LoadRegionsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadLevels$ = this.dataPersistence.fetch(
    LocationMappingActionTypes.LOAD_LEVELS,
    {
      run: (action: LocationMappingActions.LoadLevels) => {
        return this.lovDataService
          .getLocationLovs('OWNERTYPE')
          .pipe(
            map(
              (data: Lov[]) =>
                new LocationMappingActions.LoadLevelsSuccess(data)
            )
          );
      },
      onError: (
        action: LocationMappingActions.LoadLevels,
        error: HttpErrorResponse
      ) => {
        return new LocationMappingActions.LoadLevelsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCountries$ = this.dataPersistence.fetch(
    LocationMappingActionTypes.LOAD_COUNTRIES,
    {
      run: (action: LocationMappingActions.LoadCountries) => {
        return this.countryDataService
          .getCountrySummary(null, null, false, ['description,ASC'])
          .pipe(
            map(
              (data: CountrySummary[]) =>
                new LocationMappingActions.LoadCountriesSuccess(data)
            )
          );
      },
      onError: (
        action: LocationMappingActions.LoadCountries,
        error: HttpErrorResponse
      ) => {
        return new LocationMappingActions.LoadCountriesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadStates$ = this.dataPersistence.fetch(
    LocationMappingActionTypes.LOAD_STATES,
    {
      run: (action: LocationMappingActions.LoadStates) => {
        return this.stateDataService
          .getStatesFromLocationMaster(
            action.payload.countryCode,
            action.payload.regionCodes,
            false
          )
          .pipe(
            map(
              (data: StateSummary[]) =>
                new LocationMappingActions.LoadStatesSuccess(data)
            )
          );
      },
      onError: (
        action: LocationMappingActions.LoadStates,
        error: HttpErrorResponse
      ) => {
        return new LocationMappingActions.LoadStatesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTowns$ = this.dataPersistence.fetch(
    LocationMappingActionTypes.LOAD_TOWNS,
    {
      run: (action: LocationMappingActions.LoadTowns) => {
        return this.townDataService
          .getTownsSummary(action.payload, null, null, false, [
            'description,ASC'
          ])
          .pipe(
            map(
              (data: TownSummary[]) =>
                new LocationMappingActions.LoadTownsSuccess(data)
            )
          );
      },
      onError: (
        action: LocationMappingActions.LoadTowns,
        error: HttpErrorResponse
      ) => {
        return new LocationMappingActions.LoadTownsFailure(
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
