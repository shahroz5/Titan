import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { FOCBCLService } from '../foc-bcl.service';
import { FOCBCLActionTypes } from './foc-bcl.actions';
import * as FOCBCLActions from './foc-bcl.actions';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CourierSelectedLocations,
  CustomErrors,
  FOCBlockingCustomerLevel,
  FOCBlockingCustomerLevelListResponse,
} from '@poss-web/shared/models';
import {
  CustomErrorAdaptor
} from '@poss-web/shared/util-adaptors';
@Injectable()
export class FOCBCLEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private focbclService: FOCBCLService
  ) {}
  @Effect()
  saveFOCBCLDetails$: Observable<Action> = this.dataPersistence.fetch(
    FOCBCLActionTypes.SAVE_FOC_BCL_DETAILS,
    {
      run: (action: FOCBCLActions.SaveFOCBCLDetails) => {
        return this.focbclService
          .saveFOCBCLDetails(action.payload)
          .pipe(map(() => new FOCBCLActions.SaveFOCBCLDetailsSuccess()));
      },
      onError: (
        action: FOCBCLActions.SaveFOCBCLDetails,
        error: HttpErrorResponse
      ) => {
        return new FOCBCLActions.SaveFOCBCLDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  searchLocation$: Observable<Action> = this.dataPersistence.fetch(
    FOCBCLActionTypes.SEARCH_LOCATION,
    {
      run: (action: FOCBCLActions.SearchLocation) => {
        return this.focbclService
          .searchLocation(action.payload)
          .pipe(
            map(
              (searchResponse: FOCBlockingCustomerLevel[]) =>
                new FOCBCLActions.SearchLocationSuccess(searchResponse)
            )
          );
      },
      onError: (
        action: FOCBCLActions.SearchLocation,
        error: HttpErrorResponse
      ) => {
        return new FOCBCLActions.SearchLocationFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadFOCBCLDetails$: Observable<Action> = this.dataPersistence.fetch(
    FOCBCLActionTypes.LOAD_FOC_BCL_DETAILS,
    {
      run: (action: FOCBCLActions.LoadFOCBCLDetails) => {
        return this.focbclService
          .loadFOCBCLDetails(action.payload)
          .pipe(
            map(
              (response: FOCBlockingCustomerLevelListResponse) =>
                new FOCBCLActions.LoadFOCBCLDetailsSuccess(response)
            )
          );
      },
      onError: (
        action: FOCBCLActions.LoadFOCBCLDetails,
        error: HttpErrorResponse
      ) => {
        return new FOCBCLActions.LoadFOCBCLDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadFOCSchemes$: Observable<Action> = this.dataPersistence.fetch(
    FOCBCLActionTypes.LOAD_FOC_SCHEMES,
    {
      run: (action: FOCBCLActions.LoadFOCSchemes) => {
        return this.focbclService
          .loadSchemeId(action.payload)
          .pipe(
            map(
              (schemeId: string) =>
                new FOCBCLActions.LoadFOCSchemesSuccess(schemeId)
            )
          );
      },
      onError: (
        action: FOCBCLActions.LoadFOCSchemes,
        error: HttpErrorResponse
      ) => {
        return new FOCBCLActions.LoadFOCSchemesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSelectedLocations$: Observable<Action> = this.dataPersistence.fetch(
    FOCBCLActionTypes.LOAD_SELECTED_LOCATIONS,
    {
      run: (action: FOCBCLActions.LoadSelectedLocations) => {
        return this.focbclService
          .getSelectedLocations(action.payload)
          .pipe(
            map(
              (data: CourierSelectedLocations[]) =>
                new FOCBCLActions.LoadSelectedLocationsSuccess(data)
            )
          );
      },
      onError: (
        action: FOCBCLActions.LoadSelectedLocations,
        error: HttpErrorResponse
      ) => {
        return new FOCBCLActions.LoadSelectedLocationsFailure(
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
