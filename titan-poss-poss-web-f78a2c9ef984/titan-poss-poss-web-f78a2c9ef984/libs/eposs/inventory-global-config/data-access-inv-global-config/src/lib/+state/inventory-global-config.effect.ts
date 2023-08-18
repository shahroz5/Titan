import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '@poss-web/shared/util-logger';

import * as InvGlobalConfigurationActions from './inventory-global-config.actions';
import { InventoryGlobalConfigService } from '../inventory-global-config.service';
import { InvGlobalConfigurationActionTypes } from './inventory-global-config.actions';
import {
  CustomErrors,
  InvglobalConfiguration,
  InvglobalConfigurationFiledValue
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';

@Injectable()
export class InventoryGlobalConfigEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private inventoryGlobalConfigService: InventoryGlobalConfigService
  ) {}

  @Effect()
  loadGlobalConfigurationList$: Observable<Action> = this.dataPersistence.fetch(
    InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_LIST,
    {
      run: (
        action: InvGlobalConfigurationActions.LoadInvGlobalConfigurationList
      ) => {
        return this.inventoryGlobalConfigService
          .getInvGlobalConfigurationList()
          .pipe(
            map(
              (invglobalConfiguration: InvglobalConfiguration[]) =>
                new InvGlobalConfigurationActions.LoadInvGlobalConfigurationListSuccess(
                  invglobalConfiguration
                )
            )
          );
      },
      onError: (
        action: InvGlobalConfigurationActions.LoadInvGlobalConfigurationList,
        error: HttpErrorResponse
      ) => {
        return new InvGlobalConfigurationActions.LoadInvGlobalConfigurationListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadGlobalConfigurationFiledValue$: Observable<
    Action
  > = this.dataPersistence.fetch(
    InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_FILED_VALUE,
    {
      run: (
        action: InvGlobalConfigurationActions.LoadInvGlobalConfigurationFiledValue
      ) => {
        return this.inventoryGlobalConfigService
          .getInvGlobalConfigurationFiledValue(action.payload)
          .pipe(
            map(
              (
                invglobalConfigurationFiledValue: InvglobalConfigurationFiledValue
              ) =>
                new InvGlobalConfigurationActions.LoadInvGlobalConfigurationFiledValueSuccess(
                  invglobalConfigurationFiledValue
                )
            )
          );
      },
      onError: (
        action: InvGlobalConfigurationActions.LoadInvGlobalConfigurationFiledValue,
        error: HttpErrorResponse
      ) => {
        return new InvGlobalConfigurationActions.LoadInvGlobalConfigurationFiledValueFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveGlobalConfiguration$: Observable<Action> = this.dataPersistence.fetch(
    InvGlobalConfigurationActionTypes.SAVE_INV_GLOBAL_CONFIGURATION,
    {
      run: (
        action: InvGlobalConfigurationActions.SaveInvGlobalConfiguration
      ) => {
        return this.inventoryGlobalConfigService
          .saveInvGlobalConfiguration()
          .pipe(
            map(
              (invglobalConfiguration: InvglobalConfiguration[]) =>
                new InvGlobalConfigurationActions.SaveInvGlobalConfigurationSuccess(
                  invglobalConfiguration
                )
            )
          );
      },
      onError: (
        action: InvGlobalConfigurationActions.SaveInvGlobalConfiguration,
        error: HttpErrorResponse
      ) => {
        return new InvGlobalConfigurationActions.SaveInvGlobalConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateInvGlobalConfigurationFieldValue$: Observable<
    Action
  > = this.dataPersistence.fetch(
    InvGlobalConfigurationActionTypes.UPDATE_INV_GLOBAL_CONFIGURATION_FIELD_VALUE,
    {
      run: (
        action: InvGlobalConfigurationActions.UpdateInvGlobalConfigurationFieldValue
      ) => {
        return this.inventoryGlobalConfigService
          .updateInvGlobalonfigurationFieldValue(action.payload)
          .pipe(
            map(
              (
                invglobalConfigurationFiledValue: InvglobalConfigurationFiledValue
              ) =>
                new InvGlobalConfigurationActions.UpdateInvGlobalConfigurationFieldValueSuccess(
                  invglobalConfigurationFiledValue
                )
            )
          );
      },
      onError: (
        action: InvGlobalConfigurationActions.UpdateInvGlobalConfigurationFieldValue,
        error: HttpErrorResponse
      ) => {
        return new InvGlobalConfigurationActions.UpdateInvGlobalConfigurationFieldValueFailure(
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
