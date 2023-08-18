import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { Effect } from '@ngrx/effects';
import * as RegionActions from './region.actions';
import { map } from 'rxjs/operators';

import { RegionActionTypes } from './region.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { RegionService } from '../region.service';
import {
  LoadRegionDetailsListingSuccessPayload,
  RegionsData,
  CustomErrors
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class RegionEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private regionService: RegionService
  ) {}

  @Effect()
  loadRegionDetails$ = this.dataPersistence.fetch(
    RegionActionTypes.LOAD_REGION_DETAILS,
    {
      run: (action: RegionActions.LoadRegionDetails) => {
        return this.regionService
          .getRegionDetails(action.payload)
          .pipe(
            map(
              (region: LoadRegionDetailsListingSuccessPayload) =>
                new RegionActions.LoadRegionDetailsSuccess(region)
            )
          );
      },
      onError: (
        action: RegionActions.LoadRegionDetails,
        error: HttpErrorResponse
      ) => {
        return new RegionActions.LoadRegionDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRegionByCode$ = this.dataPersistence.fetch(
    RegionActionTypes.LOAD_REGION_DETAILS_BY_CODE,
    {
      run: (action: RegionActions.LoadRegionByCode) => {
        return this.regionService
          .getRegionByCode(action.payload)
          .pipe(
            map(
              (townDetailsByTownCode: RegionsData) =>
                new RegionActions.LoadRegionByCodeSuccess(townDetailsByTownCode)
            )
          );
      },
      onError: (
        action: RegionActions.LoadRegionByCode,
        error: HttpErrorResponse
      ) => {
        return new RegionActions.LoadRegionByCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveRegionFormDetails$ = this.dataPersistence.pessimisticUpdate(
    RegionActionTypes.SAVE_REGION_DETAILS,
    {
      run: (action: RegionActions.SaveRegionFormDetails) => {
        return this.regionService.saveRegionFormDetails(action.payload).pipe(
          map((saveData: RegionsData) => {
            return new RegionActions.SaveRegionFormDetailsSuccess(saveData);
          })
        );
      },
      onError: (
        action: RegionActions.SaveRegionFormDetails,
        error: HttpErrorResponse
      ) => {
        return new RegionActions.SaveRegionFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editRegionFormDetails$ = this.dataPersistence.pessimisticUpdate(
    RegionActionTypes.EDIT_REGION_DETAILS,
    {
      run: (action: RegionActions.EditRegionDetails) => {
        return this.regionService.editRegionFormDetails(action.payload).pipe(
          map((saveData: RegionsData) => {
            return new RegionActions.EditRegionDetailsSuccess(saveData);
          })
        );
      },
      onError: (
        action: RegionActions.EditRegionDetails,
        error: HttpErrorResponse
      ) => {
        return new RegionActions.EditRegionDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchRegionByCode$ = this.dataPersistence.fetch(
    RegionActionTypes.SEARCH_REGION_BY_CODE,
    {
      run: (action: RegionActions.SearchRegion) => {
        return this.regionService
          .searchRegionByCode(action.payload)
          .pipe(
            map(
              (binGroupList: LoadRegionDetailsListingSuccessPayload) =>
                new RegionActions.SearchRegionSuccess(binGroupList)
            )
          );
      },
      onError: (
        action: RegionActions.SearchRegion,
        error: HttpErrorResponse
      ) => {
        return new RegionActions.SearchRegionFailure(this.errorHandler(error));
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
