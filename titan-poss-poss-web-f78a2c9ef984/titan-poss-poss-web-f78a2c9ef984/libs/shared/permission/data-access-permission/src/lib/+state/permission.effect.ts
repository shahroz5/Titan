import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import {
  CustomErrors,
  ElementLevelPermissionItemModel,
  TransactionCodesModel
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { map } from 'rxjs/operators';
import { PermissionDataService } from '../permission-data.service';
import * as PermissionActions from './permission.actions';
import { PermissionActionTypes } from './permission.actions';
import { PermissionState } from './permission.state';

@Injectable()
export class PermissionEffect {
  constructor(
    private service: PermissionDataService,
    private dataPersistence: DataPersistence<PermissionState>,
    private loggerService: LoggerService
  ) {}

  @Effect() loadElementPermissionsForUrl = this.dataPersistence.fetch(
    PermissionActionTypes.LOAD_ELEMENT_PERMISSIONS_FOR_URL,
    {
      run: (action: PermissionActions.LoadElementPermissionsForUrl) => {
        return this.service
          .getPermissionforURL(action.payload)
          .pipe(
            map(
              (permissionData: ElementLevelPermissionItemModel[]) =>
                new PermissionActions.LoadElementPermissionsForUrlSuccess(
                  permissionData
                )
            )
          );
      },

      onError: (
        action: PermissionActions.LoadElementPermissionsForUrl,
        error: HttpErrorResponse
      ) => {
        return new PermissionActions.LoadElementPermissionsForUrlFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadUrlPermissions = this.dataPersistence.fetch(
    PermissionActionTypes.LOAD_URL_PERMISSIONS,
    {
      run: (action: PermissionActions.LoadUrlPermissions) => {
        return this.service.getURLPermissions(action.payload).pipe(
          map((permissionData: TransactionCodesModel[]) => {
            return new PermissionActions.LoadUrlPermissionsSuccess(
              permissionData
            );
          })
        );
      },

      onError: (
        action: PermissionActions.LoadUrlPermissions,
        error: HttpErrorResponse
      ) => {
        return new PermissionActions.LoadUrlPermissionsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadUrlSuggestion = this.dataPersistence.fetch(
    PermissionActionTypes.LOAD_URL_SUGGESTION,
    {
      run: (action: PermissionActions.LoadUrlSuggestion) => {
        return this.service
          .getURLSuggestions(action.payload)
          .pipe(
            map(
              (suggestions: string[]) =>
                new PermissionActions.LoadUrlSuggestionSuccess(suggestions)
            )
          );
      },

      onError: (
        action: PermissionActions.LoadUrlSuggestion,
        error: HttpErrorResponse
      ) => {
        return new PermissionActions.LoadUrlSuggestionFailure(
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
