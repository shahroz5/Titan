import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { MaxFlatTepConfigActionTypes } from './max-flat-tep-config.actions';
import * as MaxFlatTepConfigActions from './max-flat-tep-config.actions';
import { MaxFlatTepConfigService } from '../max-flat-tep-config.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrors, MaxFlatTepConfigDetails } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';

@Injectable()
export class MaxFlatTepConfigEffects {
  constructor(
    private dataPersistence: DataPersistence<MaxFlatTepConfigEffects>,
    private maxFlatTepConfigService: MaxFlatTepConfigService,
    private loggerService: LoggerService
  ) {}

  @Effect() loadMaxFlatTepConfig$: Observable<
    Action
  > = this.dataPersistence.fetch(
    MaxFlatTepConfigActionTypes.LOAD_MAX_FLAT_TEP_CONFIG,
    {
      run: (action: MaxFlatTepConfigActions.LoadMaxFlatTepConfig) => {
        return this.maxFlatTepConfigService
          .getMaxFlatTepConfig()
          .pipe(
            map(
              (data: MaxFlatTepConfigDetails) =>
                new MaxFlatTepConfigActions.LoadMaxFlatTepConfigSuccess(data)
            )
          );
      },
      onError: (
        action: MaxFlatTepConfigActions.LoadMaxFlatTepConfig,
        error: HttpErrorResponse
      ) => {
        return new MaxFlatTepConfigActions.LoadMaxFlatTepConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() updateMaxFlatTepConfig$: Observable<
    Action
  > = this.dataPersistence.fetch(
    MaxFlatTepConfigActionTypes.UPDATE_MAX_FLAT_TEP_CONFIG,
    {
      run: (action: MaxFlatTepConfigActions.UpdateMaxFlatTepConfig) => {
        return this.maxFlatTepConfigService
          .updateMaxFlatTepConfig(action.configId, action.payload)
          .pipe(
            map(
              (data: MaxFlatTepConfigDetails) =>
                new MaxFlatTepConfigActions.UpdateMaxFlatTepConfigSuccess(data)
            )
          );
      },
      onError: (
        action: MaxFlatTepConfigActions.UpdateMaxFlatTepConfig,
        error: HttpErrorResponse
      ) => {
        return new MaxFlatTepConfigActions.UpdateMaxFlatTepConfigFailure(
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
