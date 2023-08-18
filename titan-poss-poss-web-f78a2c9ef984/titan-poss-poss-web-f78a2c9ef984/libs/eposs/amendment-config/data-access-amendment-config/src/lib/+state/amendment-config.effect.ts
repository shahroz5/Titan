import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { CustomErrors } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmendmentConfigService } from '../amendment-config.service';
import * as AmendmentConfigurationActions from './amendment-config.actions';
import { AmendmentConfigurationActionTypes } from './amendment-config.actions';


@Injectable()
export class InventoryGlobalConfigEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private inventoryGlobalConfigService: AmendmentConfigService
  ) {}

  @Effect()
  loadAmendmentConfigurationFiledValue$: Observable<
    Action
  > = this.dataPersistence.fetch(
    AmendmentConfigurationActionTypes.LOAD_AMENDMENT_CONFIGURATION_FILED_VALUE,
    {
      run: (
        action: AmendmentConfigurationActions.LoadAmendmentConfigurationFiledValue
      ) => {
        return this.inventoryGlobalConfigService
          .getAmendmentConfiguration()
          .pipe(
            map(
              (configurationFiledValue: number) =>
                new AmendmentConfigurationActions.LoadAmendmentConfigurationFiledValueSuccess(
                  configurationFiledValue
                )
            )
          );
      },
      onError: (
        action: AmendmentConfigurationActions.LoadAmendmentConfigurationFiledValue,
        error: HttpErrorResponse
      ) => {
        return new AmendmentConfigurationActions.LoadAmendmentConfigurationFiledValueFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveAmendmentConfiguration$: Observable<Action> = this.dataPersistence.fetch(
    AmendmentConfigurationActionTypes.SAVE_AMENDMENT_CONFIGURATION,
    {
      run: (
        action: AmendmentConfigurationActions.SaveAmendmentConfiguration
      ) => {
        return this.inventoryGlobalConfigService
          .saveAmendmentConfiguration(action.payload)
          .pipe(
            map(
              (configurationFiledValue: number) =>
                new AmendmentConfigurationActions.SaveAmendmentConfigurationSuccess(
                  configurationFiledValue
                )
            )
          );
      },
      onError: (
        action: AmendmentConfigurationActions.SaveAmendmentConfiguration,
        error: HttpErrorResponse
      ) => {
        return new AmendmentConfigurationActions.SaveAmendmentConfigurationFailure(
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
