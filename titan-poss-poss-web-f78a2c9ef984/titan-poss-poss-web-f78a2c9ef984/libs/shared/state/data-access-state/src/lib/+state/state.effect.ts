import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { Effect } from '@ngrx/effects';
import * as StateActions from './state.actions';
import { map } from 'rxjs/operators';

import { StateActionTypes } from './state.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { StateService } from '../state.service';
import {
  LoadStatesDetailsListingSuccessPayload,
  StateData,
  CustomErrors,
  LoadCountryDetailsListingSuccessPayload,
  SaveStateDetailsPayload,

} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class StateEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private stateService: StateService
  ) { }

  @Effect()
  loadStateDetails$ = this.dataPersistence.fetch(
    StateActionTypes.LOAD_STATE_DETAILS,
    {
      run: (action: StateActions.LoadStateDetails) => {
        return this.stateService
          .getStateDetails(action.payload)
          .pipe(
            map(
              (state: LoadStatesDetailsListingSuccessPayload) =>
                new StateActions.LoadStateDetailsSuccess(state)
            )
          );
      },
      onError: (
        action: StateActions.LoadStateDetails,
        error: HttpErrorResponse
      ) => {
        return new StateActions.LoadStateDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCountryDetails$ = this.dataPersistence.fetch(
    StateActionTypes.LOAD_COUNTRY_DETAILS,
    {
      run: (action: StateActions.LoadCountryDetails) => {
        return this.stateService
          .getCountryDetails()
          .pipe(
            map(
              (state: LoadCountryDetailsListingSuccessPayload) =>
                new StateActions.LoadCountryDetailsSuccess(state)
            )
          );
      },
      onError: (
        action: StateActions.LoadCountryDetails,
        error: HttpErrorResponse
      ) => {
        return new StateActions.LoadCountryDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadStateByCode$ = this.dataPersistence.fetch(
    StateActionTypes.LOAD_STATE_DETAILS_BY_CODE,
    {
      run: (action: StateActions.LoadStateByCode) => {
        return this.stateService
          .getStateByCode(action.payload)
          .pipe(
            map(
              (townDetailsByTownCode: StateData) =>
                new StateActions.LoadStateByCodeSuccess(townDetailsByTownCode)
            )
          );
      },
      onError: (
        action: StateActions.LoadStateByCode,
        error: HttpErrorResponse
      ) => {
        return new StateActions.LoadStateByCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );


  @Effect()
  saveStateFormDetails$ = this.dataPersistence.pessimisticUpdate(
    StateActionTypes.SAVE_STATE_DETAILS,
    {
      run: (action: StateActions.SaveStateFormDetails) => {
        return this.stateService.saveStateFormDetails(action.payload).pipe(
          map((saveData: SaveStateDetailsPayload) => {
            return new StateActions.SaveStateFormDetailsSuccess(saveData);
          })
        );
      },
      onError: (
        action: StateActions.SaveStateFormDetails,
        error: HttpErrorResponse
      ) => {
        return new StateActions.SaveStateFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editStateFormDetails$ = this.dataPersistence.pessimisticUpdate(
    StateActionTypes.EDIT_STATE_DETAILS,
    {
      run: (action: StateActions.EditStateDetails) => {
        return this.stateService.editStateFormDetails(action.payload).pipe(
          map((saveData: SaveStateDetailsPayload) => {
            return new StateActions.EditStateDetailsSuccess(saveData);
          })
        );
      },
      onError: (
        action: StateActions.EditStateDetails,
        error: HttpErrorResponse
      ) => {
        return new StateActions.EditStateDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchStateByCode$ = this.dataPersistence.fetch(
    StateActionTypes.SEARCH_STATE_BY_CODE,
    {
      run: (action: StateActions.SearchState) => {
        return this.stateService
          .searchStateByCode(action.payload)
          .pipe(
            map(
              (stateDetails: LoadStatesDetailsListingSuccessPayload) =>
                new StateActions.SearchStateSuccess(stateDetails)
            )
          );
      },
      onError: (action: StateActions.SearchState, error: HttpErrorResponse) => {
        return new StateActions.SearchStateFailure(this.errorHandler(error));
      }
    }
  );




  @Effect()
  updateIsActive$ = this.dataPersistence.fetch(
    StateActionTypes.UPDATE_IS_ACTIVE,
    {
      run: (action: StateActions.UpdateIsActive) => {
        return this.stateService
          .updateIsActive(action.payload.stateId, action.payload.isActive)
          .pipe(
            map(
              (locationCodes: { id: string; description: string }[]) =>
                new StateActions.UpdateIsActiveSuccess('')
            )
          );
      },
      onError: (
        action: StateActions.UpdateIsActive,
        error: HttpErrorResponse
      ) => {
        return new StateActions.UpdateIsActiveFailure(
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
