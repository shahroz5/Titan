import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { FOCBLLService } from '../foc-bll.service';
import { FOCBLLActionTypes } from './foc-bll.actions';
import * as FOCBLLActions from './foc-bll.actions';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CourierSelectedLocations,
  CustomErrors,
  FOCBlockingLocaionLevelListResponse,
  FOCBlockingLocationLevel
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class FOCBLLEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private focbllService: FOCBLLService
  ) {}
  @Effect()
  saveFOCBLLDetails$: Observable<Action> = this.dataPersistence.fetch(
    FOCBLLActionTypes.SAVE_FOC_BLL_DETAILS,
    {
      run: (action: FOCBLLActions.SaveFOCBLLDetails) => {
        return this.focbllService
          .saveFOCBLLDetails(action.payload)
          .pipe(map(() => new FOCBLLActions.SaveFOCBLLDetailsSuccess()));
      },
      onError: (
        action: FOCBLLActions.SaveFOCBLLDetails,
        error: HttpErrorResponse
      ) => {
        return new FOCBLLActions.SaveFOCBLLDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  searchLocation$: Observable<Action> = this.dataPersistence.fetch(
    FOCBLLActionTypes.SEARCH_LOCATION,
    {
      run: (action: FOCBLLActions.SearchLocation) => {
        return this.focbllService
          .searchLocation(action.payload)
          .pipe(
            map(
              (searchResponse: FOCBlockingLocationLevel[]) =>
                new FOCBLLActions.SearchLocationSuccess(searchResponse)
            )
          );
      },
      onError: (
        action: FOCBLLActions.SearchLocation,
        error: HttpErrorResponse
      ) => {
        return new FOCBLLActions.SearchLocationFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadFOCBLLDetails$: Observable<Action> = this.dataPersistence.fetch(
    FOCBLLActionTypes.LOAD_FOC_BLL_DETAILS,
    {
      run: (action: FOCBLLActions.LoadFOCBLLDetails) => {
        return this.focbllService
          .loadFOCBLLDetails(action.payload)
          .pipe(
            map(
              (response: FOCBlockingLocaionLevelListResponse) =>
                new FOCBLLActions.LoadFOCBLLDetailsSuccess(response)
            )
          );
      },
      onError: (
        action: FOCBLLActions.LoadFOCBLLDetails,
        error: HttpErrorResponse
      ) => {
        return new FOCBLLActions.LoadFOCBLLDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadFOCSchemes$: Observable<Action> = this.dataPersistence.fetch(
    FOCBLLActionTypes.LOAD_FOC_SCHEMES,
    {
      run: (action: FOCBLLActions.LoadFOCSchemes) => {
        return this.focbllService
          .loadSchemeId(action.payload)
          .pipe(
            map(
              (schemeId: string) =>
                new FOCBLLActions.LoadFOCSchemesSuccess(schemeId)
            )
          );
      },
      onError: (
        action: FOCBLLActions.LoadFOCSchemes,
        error: HttpErrorResponse
      ) => {
        return new FOCBLLActions.LoadFOCSchemesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadSelectedLocations$: Observable<Action> = this.dataPersistence.fetch(
    FOCBLLActionTypes.LOAD_SELECTED_LOCATIONS,
    {
      run: (action: FOCBLLActions.LoadSelectedLocations) => {
        return this.focbllService
          .getSelectedLocations(action.payload)
          .pipe(
            map(
              (data: CourierSelectedLocations[]) =>
                new FOCBLLActions.LoadSelectedLocationsSuccess(data)
            )
          );
      },
      onError: (
        action: FOCBLLActions.LoadSelectedLocations,
        error: HttpErrorResponse
      ) => {
        return new FOCBLLActions.LoadSelectedLocationsFailure(
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
