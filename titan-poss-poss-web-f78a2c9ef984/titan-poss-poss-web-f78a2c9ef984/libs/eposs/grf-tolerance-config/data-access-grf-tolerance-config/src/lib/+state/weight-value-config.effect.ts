import { DataPersistence } from '@nrwl/angular';

import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as WeightValueConfigActions from './weight-value-config.actions';
import {
  CustomErrors,
  WeightValueConfigListingResult,
  WeightValueConfigDetails
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { WeightValueConfigService } from '../weight-value-config.service';

@Injectable()
export class WeightValueConfigEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private weightValueConfigService: WeightValueConfigService
  ) {}

  @Effect()
  loadWeightValueConfigListing$ = this.dataPersistence.fetch(
    WeightValueConfigActions.WeightValueConfigActionTypes
      .LOAD_WEIGHT_VALUE_CONIG_LISTING,
    {
      run: (action: WeightValueConfigActions.LoadWeightValueConfigListing) => {
        return this.weightValueConfigService
          .getWeightValueConfigList(action.payload)
          .pipe(
            map(
              (listingData: WeightValueConfigListingResult) =>
                new WeightValueConfigActions.LoadWeightValueConfigListingSuccess(
                  listingData
                )
            )
          );
      },
      onError: (
        action: WeightValueConfigActions.LoadWeightValueConfigListing,
        error: HttpErrorResponse
      ) => {
        return new WeightValueConfigActions.LoadWeightValueConfigListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchWeightValueConfigListing$ = this.dataPersistence.fetch(
    WeightValueConfigActions.WeightValueConfigActionTypes
      .SEARCH_WEIGHT_VALUE_CONIG_LISTING,
    {
      run: (
        action: WeightValueConfigActions.SearchWeightValueConfigListing
      ) => {
        return this.weightValueConfigService
          .getWeightValueConfigSearch(action.payload)
          .pipe(
            map(
              (listingData: WeightValueConfigListingResult) =>
                new WeightValueConfigActions.SearchWeightValueConfigListingSuccess(
                  listingData
                )
            )
          );
      },
      onError: (
        action: WeightValueConfigActions.SearchWeightValueConfigListing,
        error: HttpErrorResponse
      ) => {
        return new WeightValueConfigActions.SearchWeightValueConfigListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadWeightValueConfigDetails$ = this.dataPersistence.fetch(
    WeightValueConfigActions.WeightValueConfigActionTypes
      .LOAD_WEIGHT_VALUE_CONIG_DETAILS,
    {
      run: (action: WeightValueConfigActions.LoadWeightValueConfigDetails) => {
        return this.weightValueConfigService
          .getWeightValueConfigDetails(action.payload)
          .pipe(
            map(
              (listingData: WeightValueConfigDetails) =>
                new WeightValueConfigActions.LoadWeightValueConfigDetailsSuccess(
                  listingData
                )
            )
          );
      },
      onError: (
        action: WeightValueConfigActions.LoadWeightValueConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new WeightValueConfigActions.LoadWeightValueConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveWeightValueConfigDetails$ = this.dataPersistence.pessimisticUpdate(
    WeightValueConfigActions.WeightValueConfigActionTypes
      .SAVE_WEIGHT_VALUE_CONIG_DETAILS,
    {
      run: (action: WeightValueConfigActions.SaveWeightValueConfigDetails) => {
        return this.weightValueConfigService
          .saveWeightValueConfigDetails(action.payload)
          .pipe(
            map(
              (responseData: WeightValueConfigDetails) =>
                new WeightValueConfigActions.SaveWeightValueConfigDetailsSuccess(
                  responseData
                )
            )
          );
      },
      onError: (
        action: WeightValueConfigActions.SaveWeightValueConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new WeightValueConfigActions.SaveWeightValueConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editWeightValueConfigDetails$ = this.dataPersistence.pessimisticUpdate(
    WeightValueConfigActions.WeightValueConfigActionTypes
      .EDIT_WEIGHT_VALUE_CONIG_DETAILS,
    {
      run: (action: WeightValueConfigActions.EditWeightValueConfigDetails) => {
        return this.weightValueConfigService
          .editWeightValueConfigDetails(action.payload)
          .pipe(
            map(
              (responseData: WeightValueConfigDetails) =>
                new WeightValueConfigActions.EditWeightValueConfigDetailsSuccess(
                  responseData
                )
            )
          );
      },
      onError: (
        action: WeightValueConfigActions.EditWeightValueConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new WeightValueConfigActions.EditWeightValueConfigDetailsFailure(
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
