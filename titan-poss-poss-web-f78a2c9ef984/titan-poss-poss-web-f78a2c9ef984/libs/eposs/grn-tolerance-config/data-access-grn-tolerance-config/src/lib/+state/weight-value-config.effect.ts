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
import { GRNWeightValueConfigService } from '../weight-value-config.service';

@Injectable()
export class GRNWeightValueConfigEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private weightValueConfigService: GRNWeightValueConfigService
  ) {}

  @Effect()
  loadWeightValueConfigListing$ = this.dataPersistence.fetch(
    WeightValueConfigActions.GRNWeightValueConfigActionTypes
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
    WeightValueConfigActions.GRNWeightValueConfigActionTypes
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
    WeightValueConfigActions.GRNWeightValueConfigActionTypes
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
    WeightValueConfigActions.GRNWeightValueConfigActionTypes
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
    WeightValueConfigActions.GRNWeightValueConfigActionTypes
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

  @Effect()
  loadMappedLocationsCount$ = this.dataPersistence.fetch(
    WeightValueConfigActions.GRNWeightValueConfigActionTypes
      .LOAD_MAPPED_LOCATIONS_COUNT,
    {
      run: (action: WeightValueConfigActions.LoadMappedLocationsCount) => {
        return this.weightValueConfigService
          .getMappedLocationsCount(action.payload)
          .pipe(
            map(
              (count: number) =>
                new WeightValueConfigActions.LoadMappedLocationsCountSuccess(
                  count
                )
            )
          );
      },
      onError: (
        action: WeightValueConfigActions.LoadMappedLocationsCount,
        error: HttpErrorResponse
      ) => {
        return new WeightValueConfigActions.LoadMappedLocationsCountFailure(
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
