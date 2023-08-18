import {
  CustomErrors,
  TEPValidationConfigListing,
  TEPValidationConfigResult
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as TepValidationConfigActions from './tep-validation-config.actons';

import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
import { TepValidationConfigService } from '../tep-validation-config.service';

@Injectable()
export class TepValidationConfigEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private tepValidationConfigService: TepValidationConfigService
  ) {}

  @Effect()
  loadTepValidationConfigListing$ = this.dataPersistence.fetch(
    TepValidationConfigActions.TepValidationConfigActionTypes
      .LOAD_TEP_VALIDATION_CONFIG_LISTING,
    {
      run: (
        action: TepValidationConfigActions.LoadTepValidationConfigListing
      ) => {
        return this.tepValidationConfigService
          .getTepValidationConfigList(
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map((result: TEPValidationConfigListing) => {
              return new TepValidationConfigActions.LoadTepValidationConfigListingSuccess(
                result
              );
            })
          );
      },
      onError: (
        action: TepValidationConfigActions.LoadTepValidationConfigListing,
        error: HttpErrorResponse
      ) => {
        return new TepValidationConfigActions.LoadTepValidationConfigListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchTepValidationDetails$ = this.dataPersistence.fetch(
    TepValidationConfigActions.TepValidationConfigActionTypes
      .SEARCH_TEP_VALIDATION_CONFIG_DETAILS,
    {
      run: (
        action: TepValidationConfigActions.SearchTepValidationConfigDetails
      ) => {
        return this.tepValidationConfigService
          .searchTepValidationConfigList(action.payload)
          .pipe(
            map(
              (details: TEPValidationConfigListing) =>
                new TepValidationConfigActions.SearchTepValidationConfigDetailsSuccess(
                  details
                )
            )
          );
      },
      onError: (
        action: TepValidationConfigActions.SearchTepValidationConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new TepValidationConfigActions.SearchTepValidationConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTepValidationConfigDetails$ = this.dataPersistence.fetch(
    TepValidationConfigActions.TepValidationConfigActionTypes
      .LOAD_TEP_VALIDATION_CONFIG_DETAILS,
    {
      run: (
        action: TepValidationConfigActions.LoadTepValidationConfigDetails
      ) => {
        return this.tepValidationConfigService
          .getTepValidationConfigDetails(action.payload)
          .pipe(
            map((details: TEPValidationConfigResult) => {
              return new TepValidationConfigActions.LoadTepValidationConfigDetailsSuccess(
                details
              );
            })
          );
      },
      onError: (
        action: TepValidationConfigActions.LoadTepValidationConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new TepValidationConfigActions.LoadTepValidationConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveTepValidationConfigDetails$ = this.dataPersistence.fetch(
    TepValidationConfigActions.TepValidationConfigActionTypes
      .SAVE_TEP_VALIDATION_CONFIG_DETAILS,
    {
      run: (
        action: TepValidationConfigActions.SaveTepValidationConfigDetails
      ) => {
        return this.tepValidationConfigService
          .saveTepValidationConfigDetails(action.payload)
          .pipe(
            map((details: TEPValidationConfigResult) => {
              return new TepValidationConfigActions.SaveTepValidationConfigDetailsSuccess(
                details
              );
            })
          );
      },
      onError: (
        action: TepValidationConfigActions.SaveTepValidationConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new TepValidationConfigActions.SaveTepValidationConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateTepValidationConfigDetails$ = this.dataPersistence.pessimisticUpdate(
    TepValidationConfigActions.TepValidationConfigActionTypes
      .UPDATE_TEP_VALIDATION_CONFIG_DETAILS,
    {
      run: (
        action: TepValidationConfigActions.UpdateTepValidationConfigDetails
      ) => {
        return this.tepValidationConfigService
          .updateTepValidationConfigDetails(action.payload)
          .pipe(
            map((details: TEPValidationConfigResult) => {
              return new TepValidationConfigActions.UpdateTepValidationConfigDetailsSuccess(
                details
              );
            })
          );
      },
      onError: (
        action: TepValidationConfigActions.UpdateTepValidationConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new TepValidationConfigActions.UpdateTepValidationConfigDetailsFailure(
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
