import { DataPersistence } from '@nrwl/angular';

import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as BgrConfigActions from './bgr-config.actions';
import {
  CustomErrors,
  BgrConfigListingResult,
  BgrConfigDetails,
  UpdateLocationMappingPayload,
  ConfigTypeEnum
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { BgrConfigService } from '../bgr-config.service';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';

@Injectable()
export class BgrConfigEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private bgrConfigService: BgrConfigService,
    private locationMappingFacade: LocationMappingFacade
  ) {}

  @Effect()
  loadBgrConfigListing$ = this.dataPersistence.fetch(
    BgrConfigActions.BgrConfigActionTypes.LOAD_BGR_CONFIG_LISTING,
    {
      run: (action: BgrConfigActions.LoadBgrConfigListing) => {
        return this.bgrConfigService
          .getBgrConfigList(action.params, action.requestPayload)
          .pipe(
            map(
              (listingData: BgrConfigListingResult) =>
                new BgrConfigActions.LoadBgrConfigListingSuccess(listingData)
            )
          );
      },
      onError: (
        action: BgrConfigActions.LoadBgrConfigListing,
        error: HttpErrorResponse
      ) => {
        return new BgrConfigActions.LoadBgrConfigListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchBgrConfigListing$ = this.dataPersistence.fetch(
    BgrConfigActions.BgrConfigActionTypes.SEARCH_BGR_CONFIG_LISTING,
    {
      run: (action: BgrConfigActions.SearchBgrConfigListing) => {
        return this.bgrConfigService
          .getBgrConfigSearch(action.payload)
          .pipe(
            map(
              (listingData: BgrConfigListingResult) =>
                new BgrConfigActions.SearchBgrConfigListingSuccess(listingData)
            )
          );
      },
      onError: (
        action: BgrConfigActions.SearchBgrConfigListing,
        error: HttpErrorResponse
      ) => {
        return new BgrConfigActions.SearchBgrConfigListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadBgrConfigDetails$ = this.dataPersistence.fetch(
    BgrConfigActions.BgrConfigActionTypes.LOAD_BGR_CONFIG_DETAILS,
    {
      run: (action: BgrConfigActions.LoadBgrConfigDetails) => {
        return this.bgrConfigService
          .getBgrConfigDetails(action.payload)
          .pipe(
            map(
              (listingData: BgrConfigDetails) =>
                new BgrConfigActions.LoadBgrConfigDetailsSuccess(listingData)
            )
          );
      },
      onError: (
        action: BgrConfigActions.LoadBgrConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new BgrConfigActions.LoadBgrConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveBgrConfigDetails$ = this.dataPersistence.pessimisticUpdate(
    BgrConfigActions.BgrConfigActionTypes.SAVE_BGR_CONFIG_DETAILS,
    {
      run: (action: BgrConfigActions.SaveBgrConfigDetails) => {
        let saveBgrConfigDetailsResponse;
        return this.bgrConfigService.saveBgrConfigDetails(action.payload).pipe(
          map((responseData: BgrConfigDetails) => {
            saveBgrConfigDetailsResponse = responseData;
            const locationDetailsPayload: UpdateLocationMappingPayload = {
              ruleID: responseData.ruleId.toString(),
              ruleType: responseData.ruleType,
              data: action.locationMappingDetails
            };
            this.locationMappingFacade.updateLocationMapping(
              locationDetailsPayload
            );
            return new BgrConfigActions.SaveBgrConfigDetailsSuccess(
              responseData
            );
          })
        );
      },
      onError: (
        action: BgrConfigActions.SaveBgrConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new BgrConfigActions.SaveBgrConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editBgrConfigDetails$ = this.dataPersistence.pessimisticUpdate(
    BgrConfigActions.BgrConfigActionTypes.EDIT_BGR_CONFIG_DETAILS,
    {
      run: (action: BgrConfigActions.EditBgrConfigDetails) => {
        return this.bgrConfigService.editBgrConfigDetails(action.payload).pipe(
          map((responseData: BgrConfigDetails) => {
            return new BgrConfigActions.EditBgrConfigDetailsSuccess(
              responseData
            );
          })
        );
      },
      onError: (
        action: BgrConfigActions.EditBgrConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new BgrConfigActions.EditBgrConfigDetailsFailure(
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
