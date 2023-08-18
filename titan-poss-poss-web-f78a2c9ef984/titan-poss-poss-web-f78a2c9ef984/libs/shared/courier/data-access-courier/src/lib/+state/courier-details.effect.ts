import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { CourierDetailsActionTypes } from './courier-details.actions';
import { HttpErrorResponse } from '@angular/common/http';
import * as CourierDetailsActions from './courier-details.actions';
import { map } from 'rxjs/operators';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CourierDetailsService } from '../courier-details.service';
import {
  LoadCourireDetailsListingSuccessPayload,
  CustomErrors,
  CourierDetailsListing,
  CourierSelectedLocations,
  Country,
  State
} from '@poss-web/shared/models';
import {
  CourierDetailsAdaptor,
  CustomErrorAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  CountryDataService,
  StateDataService
} from '@poss-web/shared/masters/data-access-masters';
@Injectable()
export class CourierDetailsEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private courierDetailsService: CourierDetailsService,
    private countryDataService: CountryDataService,
    private stateDataService: StateDataService
  ) {}
  @Effect()
  loadCourierDetails$ = this.dataPersistence.fetch(
    CourierDetailsActionTypes.LOAD_COURIER_DETAILS,
    {
      run: (action: CourierDetailsActions.LoadCourierDetails) => {
        return this.courierDetailsService
          .getCourierDetails(action.payload)
          .pipe(
            map(
              (courierDetails: LoadCourireDetailsListingSuccessPayload) =>
                new CourierDetailsActions.LoadCourierDetailsSuccess(
                  courierDetails
                )
            )
          );
      },
      onError: (
        action: CourierDetailsActions.LoadCourierDetails,
        error: HttpErrorResponse
      ) => {
        return new CourierDetailsActions.LoadCourierDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadCourierDetailsBasedOnCourierName$ = this.dataPersistence.fetch(
    CourierDetailsActionTypes.LOAD_COURIER_DETAILS_BASED_ON_COURIERNAME,
    {
      run: (
        action: CourierDetailsActions.LoadCourierDetailsBasedOnCourierName
      ) => {
        return this.courierDetailsService
          .getCourierDetailsBasedOnCourierName(action.payload)
          .pipe(
            map(
              courierDetails =>
                new CourierDetailsActions.LoadCourierDetailsBasedOnCourierNameSuccess(
                  courierDetails
                )
            )
          );
      },
      onError: (
        action: CourierDetailsActions.LoadCourierDetailsBasedOnCourierName,
        error: HttpErrorResponse
      ) => {
        return new CourierDetailsActions.LoadCourierDetailsBasedOnCourierNameFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  saveCourierDetails$ = this.dataPersistence.pessimisticUpdate(
    CourierDetailsActionTypes.SAVE_COURIER_DETAILS,
    {
      run: (action: CourierDetailsActions.SaveCourierDetails) => {
        return this.courierDetailsService
          .saveCourierDetails(action.payload)
          .pipe(
            map(
              courierDetails =>
                new CourierDetailsActions.SaveCourierDetailsSuccess(
                  courierDetails
                )
            )
          );
      },
      onError: (
        action: CourierDetailsActions.SaveCourierDetails,
        error: HttpErrorResponse
      ) => {
        return new CourierDetailsActions.SaveCourierDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateCourierDetails$ = this.dataPersistence.pessimisticUpdate(
    CourierDetailsActionTypes.UPDATE_COURIER_DETAILS,
    {
      run: (action: CourierDetailsActions.UpdateCourierDetails) => {
        return this.courierDetailsService
          .updateCourierDetails(action.payload)
          .pipe(
            map(
              courierDetails =>
                new CourierDetailsActions.UpdateCourierDetailsSuccess(
                  courierDetails
                )
            )
          );
      },
      onError: this.dispatchCourierDetailsFailure()
    }
  );
  @Effect()
  searchCourierName$ = this.dataPersistence.fetch(
    CourierDetailsActionTypes.SEARCH_COURIER_NAME,
    {
      run: (action: CourierDetailsActions.SearchCourierName) => {
        return this.courierDetailsService
          .searchCourierName(action.payload)
          .pipe(
            map(
              (courierDetails: CourierDetailsListing[]) =>
                new CourierDetailsActions.SearchCourierNameSuccess(
                  courierDetails
                )
            )
          );
      },
      onError: (
        action: CourierDetailsActions.SearchCourierName,
        error: HttpErrorResponse
      ) => {
        return new CourierDetailsActions.SearchCourierNameFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  selectedLocations$ = this.dataPersistence.fetch(
    CourierDetailsActionTypes.SELECTED_LOCATIONS,
    {
      run: (action: CourierDetailsActions.SelectedLocations) => {
        return this.courierDetailsService
          .selectedLocations(action.payload)
          .pipe(
            map(
              (selectedLocations: CourierSelectedLocations[]) =>
                new CourierDetailsActions.SelectedLocationsSuccess(
                  selectedLocations
                )
            )
          );
      },
      onError: (
        action: CourierDetailsActions.SelectedLocations,
        error: HttpErrorResponse
      ) => {
        return new CourierDetailsActions.SelectedLocationsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadCountry$ = this.dataPersistence.fetch(
    CourierDetailsActionTypes.LOAD_COUNTRY,
    {
      run: () => {
        return this.countryDataService
          .getCountries(null, null, true, false, ['description,asc'])
          .pipe(
            map(
              (countries: Country[]) =>
                new CourierDetailsActions.LoadCountrySuccess(
                  CourierDetailsAdaptor.getCountry(countries)
                )
            )
          );
      },
      onError: (
        action: CourierDetailsActions.LoadCountry,
        error: HttpErrorResponse
      ) => {
        return new CourierDetailsActions.LoadCountryFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadStates$ = this.dataPersistence.fetch(
    CourierDetailsActionTypes.LOAD_STATES,
    {
      run: (action: CourierDetailsActions.LoadStates) => {
        return this.stateDataService
          .getStates(null, null, true, action.payload, false, [
            'description,asc'
          ])
          .pipe(
            map(
              (states: State[]) =>
                new CourierDetailsActions.LoadStatesSuccess(
                  CourierDetailsAdaptor.getStates(states)
                )
            )
          );
      },
      onError: (
        action: CourierDetailsActions.LoadStates,
        error: HttpErrorResponse
      ) => {
        return new CourierDetailsActions.LoadStatesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  locationMapping$ = this.dataPersistence.fetch(
    CourierDetailsActionTypes.LOCATION_MAPPING,
    {
      run: (action: CourierDetailsActions.LocationMapping) => {
        return this.courierDetailsService
          .locationMapping(action.payload)
          .pipe(map(() => new CourierDetailsActions.LocationMappingSuccess()));
      },
      onError: (
        action: CourierDetailsActions.LocationMapping,
        error: HttpErrorResponse
      ) => {
        return new CourierDetailsActions.LocationMappingFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateCourierStatus$ = this.dataPersistence.fetch(
    CourierDetailsActionTypes.UPDATE_COURIER_STATUS,
    {
      run: (action: CourierDetailsActions.UpdateCourierStatus) => {
        return this.courierDetailsService
          .updateCourierStatus(action.payload)
          .pipe(
            map(() => new CourierDetailsActions.UpdateCourierStatusSuccess())
          );
      },
      onError: (
        action: CourierDetailsActions.UpdateCourierStatus,
        error: HttpErrorResponse
      ) => {
        return new CourierDetailsActions.UpdateCourierStatusFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  private dispatchCourierDetailsFailure(): (a: any, e: any) => any {
    return (action: any, error: HttpErrorResponse) => {
      return new CourierDetailsActions.UpdateCourierDetailsFailure(
        this.errorHandler(error)
      );
    };
  }

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
