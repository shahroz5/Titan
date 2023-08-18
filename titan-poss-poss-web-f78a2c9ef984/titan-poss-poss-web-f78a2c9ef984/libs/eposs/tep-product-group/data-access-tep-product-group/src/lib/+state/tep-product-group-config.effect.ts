import {
  CustomErrors,
  TEPProductGroupConfigDetails,
  TEPProductGroupConfigListing,
  TEPProductGroupMappingListing
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TepProductGroupConfigActionTypes } from './tep-product-group-config.actons';
import * as TepProductGroupConfigActions from './tep-product-group-config.actons';

import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
import { TepProductGroupConfigService } from '../tep-product-group-config.service';

@Injectable()
export class TepProductGroupConfigEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private tepProductGroupConfigService: TepProductGroupConfigService
  ) {}

  @Effect()
  loadTepProductGroupConfigListing$ = this.dataPersistence.fetch(
    TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_LISTING,
    {
      run: (
        action: TepProductGroupConfigActions.LoadTepProductGroupConfigListing
      ) => {
        return this.tepProductGroupConfigService
          .getTepProductGroupConfigList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.description
          )
          .pipe(
            map((result: TEPProductGroupConfigListing) => {
              return new TepProductGroupConfigActions.LoadTepProductGroupConfigListingSuccess(
                result
              );
            })
          );
      },
      onError: (
        action: TepProductGroupConfigActions.LoadTepProductGroupConfigListing,
        error: HttpErrorResponse
      ) => {
        return new TepProductGroupConfigActions.LoadTepProductGroupConfigListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchTepProductConfigDetails$ = this.dataPersistence.fetch(
    TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_CONFIG_DETAILS,
    {
      run: (
        action: TepProductGroupConfigActions.SearchTepProductConfigDetails
      ) => {
        return this.tepProductGroupConfigService
          .searchTepProductGroupConfigList(action.payload)
          .pipe(
            map(
              (details: TEPProductGroupConfigListing) =>
                new TepProductGroupConfigActions.SearchTepProductConfigDetailsSuccess(
                  details
                )
            )
          );
      },
      onError: (
        action: TepProductGroupConfigActions.SearchTepProductConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new TepProductGroupConfigActions.SearchTepProductConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTepProductGroupConfigDetails$ = this.dataPersistence.fetch(
    TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_DETAILS,
    {
      run: (
        action: TepProductGroupConfigActions.LoadTepProductGroupConfigDetails
      ) => {
        return this.tepProductGroupConfigService
          .getTepProductGroupConfigDetails(action.payload)
          .pipe(
            map((details: TEPProductGroupConfigDetails) => {
              return new TepProductGroupConfigActions.LoadTepProductGroupConfigDetailsSuccess(
                details
              );
            })
          );
      },
      onError: (
        action: TepProductGroupConfigActions.LoadTepProductGroupConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new TepProductGroupConfigActions.LoadTepProductGroupConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveTepProductGroupConfigDetails$ = this.dataPersistence.fetch(
    TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_CONFIG_DETAILS,
    {
      run: (
        action: TepProductGroupConfigActions.SaveTepProductGroupConfigDetails
      ) => {
        return this.tepProductGroupConfigService
          .saveTepProductGroupConfigDetails(action.payload)
          .pipe(
            map((details: TEPProductGroupConfigDetails) => {
              return new TepProductGroupConfigActions.SaveTepProductGroupConfigDetailsSuccess(
                details
              );
            })
          );
      },
      onError: (
        action: TepProductGroupConfigActions.SaveTepProductGroupConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new TepProductGroupConfigActions.SaveTepProductGroupConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateTepProductGroupConfigDetails$ = this.dataPersistence.pessimisticUpdate(
    TepProductGroupConfigActionTypes.UPDATE_TEP_PRODUCT_GROUP_CONFIG_DETAILS,
    {
      run: (
        action: TepProductGroupConfigActions.UpdateTepProductGroupConfigDetails
      ) => {
        return this.tepProductGroupConfigService
          .updateTepProductGroupConfigDetails(action.payload)
          .pipe(
            map((details: TEPProductGroupConfigDetails) => {
              return new TepProductGroupConfigActions.UpdateTepProductGroupConfigDetailsSuccess(
                details
              );
            })
          );
      },
      onError: (
        action: TepProductGroupConfigActions.UpdateTepProductGroupConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new TepProductGroupConfigActions.UpdateTepProductGroupConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTepProductGroupMappingListing$ = this.dataPersistence.fetch(
    TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_MAPPING_LISTING,
    {
      run: (
        action: TepProductGroupConfigActions.LoadTepProductGroupMappintListing
      ) => {
        return this.tepProductGroupConfigService
          .getTepProductGroupMappingList(
            action.payload.configId,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.sort
          )
          .pipe(
            map((result: TEPProductGroupMappingListing) => {
              return new TepProductGroupConfigActions.LoadTepProductGroupMappintListingSuccess(
                result
              );
            })
          );
      },
      onError: (
        action: TepProductGroupConfigActions.LoadTepProductGroupMappintListing,
        error: HttpErrorResponse
      ) => {
        return new TepProductGroupConfigActions.LoadTepProductGroupMappintListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchTepProductGroupMappinglist$ = this.dataPersistence.fetch(
    TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_MAPPING_LISTING,
    {
      run: (
        action: TepProductGroupConfigActions.SearchTepProductGroupMappintListing
      ) => {
        return this.tepProductGroupConfigService
          .searchTepProductGroupMappingList(
            action.payload.configId,
            action.payload.filter
          )
          .pipe(
            map(
              (details: TEPProductGroupMappingListing) =>
                new TepProductGroupConfigActions.SearchTepProductGroupMappintListingSuccess(
                  details
                )
            )
          );
      },
      onError: (
        action: TepProductGroupConfigActions.SearchTepProductGroupMappintListing,
        error: HttpErrorResponse
      ) => {
        return new TepProductGroupConfigActions.SearchTepProductGroupMappintListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveTepExceptionMappingDetails$ = this.dataPersistence.fetch(
    TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_MAPPING,
    {
      run: (
        action: TepProductGroupConfigActions.SaveTepProductGroupMapping
      ) => {
        return this.tepProductGroupConfigService
          .saveTepExceptionMappingDetails(
            action.payload.configId,
            action.payload.addTEPProductGroupsMapping
          )
          .pipe(
            map((details: TEPProductGroupMappingListing) => {
              return new TepProductGroupConfigActions.SaveTepProductGroupMappingSuccess(
                details
              );
            })
          );
      },
      onError: (
        action: TepProductGroupConfigActions.SaveTepProductGroupMapping,
        error: HttpErrorResponse
      ) => {
        return new TepProductGroupConfigActions.SaveTepProductGroupMappingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  /* @Effect()
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




  */

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
