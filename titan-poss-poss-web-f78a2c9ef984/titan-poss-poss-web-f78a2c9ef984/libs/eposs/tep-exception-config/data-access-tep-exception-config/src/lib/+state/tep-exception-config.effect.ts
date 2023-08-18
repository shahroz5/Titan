import {
  CustomErrors,
  TEPExceptionConfig,
  TEPExceptiononfigListing
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TepExceptionConfigActionTypes } from './tep-exception-config.actons';
import * as TepExceptionConfigActions from './tep-exception-config.actons';

import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
import { TepExceptionConfigService } from '../tep-exception-config.service';

@Injectable()
export class TepExceptionConfigEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private tepExceptionConfigService: TepExceptionConfigService
  ) {}

  @Effect()
  loadTepExceptionConfigListing$ = this.dataPersistence.fetch(
    TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_LISTING,
    {
      run: (
        action: TepExceptionConfigActions.LoadTepExceptionConfigListing
      ) => {
        return this.tepExceptionConfigService
          .getTepExceptionConfigList(
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (result: TEPExceptiononfigListing) =>
                new TepExceptionConfigActions.LoadTepExceptionConfigListingSuccess(
                  result
                )
            )
          );
      },
      onError: (
        action: TepExceptionConfigActions.LoadTepExceptionConfigListing,
        error: HttpErrorResponse
      ) => {
        return new TepExceptionConfigActions.LoadTepExceptionConfigListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadMaxFlatTepExchangeValue$ = this.dataPersistence.fetch(
    TepExceptionConfigActionTypes.LOAD_TEP_GLOBAL_CONFIG_LISTING,
    {
      run: (action: TepExceptionConfigActions.LoadTepGlobalConfigListing) => {
        return this.tepExceptionConfigService
          .getMaxFlatTepExchangeValue()
          .pipe(
            map(
              (result: number) =>
                new TepExceptionConfigActions.LoadTepGlobalConfigListingSuccess(
                  result
                )
            )
          );
      },
      onError: (
        action: TepExceptionConfigActions.LoadTepGlobalConfigListing,
        error: HttpErrorResponse
      ) => {
        return new TepExceptionConfigActions.LoadTepGlobalConfigListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchTepExceptionConfigDetails$ = this.dataPersistence.fetch(
    TepExceptionConfigActionTypes.SEARCH_TEP_EXCEPTION_CONFIG_DETAILS,
    {
      run: (
        action: TepExceptionConfigActions.SearchTepExceptionConfigDetails
      ) => {
        return this.tepExceptionConfigService
          .searchTepExceptionConfigList(action.payload)
          .pipe(
            map(
              (details: TEPExceptiononfigListing) =>
                new TepExceptionConfigActions.SearchTepExceptionConfigDetailsSuccess(
                  details
                )
            )
          );
      },
      onError: (
        action: TepExceptionConfigActions.SearchTepExceptionConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new TepExceptionConfigActions.SearchTepExceptionConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTepExceptionConfigDetails$ = this.dataPersistence.fetch(
    TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_DETAILS,
    {
      run: (
        action: TepExceptionConfigActions.LoadTepExceptionConfigDetails
      ) => {
        return this.tepExceptionConfigService
          .getTepExceptionConfigDetails(action.payload)
          .pipe(
            map((details: TEPExceptionConfig) => {
              return new TepExceptionConfigActions.LoadTepExceptionConfigDetailsSuccess(
                details
              );
            })
          );
      },
      onError: (
        action: TepExceptionConfigActions.LoadTepExceptionConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new TepExceptionConfigActions.LoadTepExceptionConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveTepExceptionConfigDetails$ = this.dataPersistence.fetch(
    TepExceptionConfigActionTypes.SAVE_TEP_EXCEPTION_CONFIG_DETAILS,
    {
      run: (
        action: TepExceptionConfigActions.SaveTepExceptionConfigDetails
      ) => {
        return this.tepExceptionConfigService
          .saveTepExceptionConfigDetails(action.payload)
          .pipe(
            map((details: TEPExceptionConfig) => {
              return new TepExceptionConfigActions.SaveTepExceptionConfigDetailsSuccess(
                details
              );
            })
          );
      },
      onError: (
        action: TepExceptionConfigActions.SaveTepExceptionConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new TepExceptionConfigActions.SaveTepExceptionConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateTepExceptionConfigDetails$ = this.dataPersistence.pessimisticUpdate(
    TepExceptionConfigActionTypes.UPDATE_TEP_EXCEPTION_CONFIG_DETAILS,
    {
      run: (
        action: TepExceptionConfigActions.UpdateTepExceptionConfigDetails
      ) => {
        return this.tepExceptionConfigService
          .updateTepExceptionConfigDetails(action.payload)
          .pipe(
            map((details: TEPExceptionConfig) => {
              return new TepExceptionConfigActions.UpdateTepExceptionConfigDetailsSuccess(
                details
              );
            })
          );
      },
      onError: (
        action: TepExceptionConfigActions.UpdateTepExceptionConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new TepExceptionConfigActions.UpdateTepExceptionConfigDetailsFailure(
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
