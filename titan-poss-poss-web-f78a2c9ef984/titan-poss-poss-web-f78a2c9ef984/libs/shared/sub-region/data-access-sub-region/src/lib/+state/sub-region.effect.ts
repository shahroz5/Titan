import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { Effect } from '@ngrx/effects';
import * as SubRegionActions from './sub-region.actions';
import { map } from 'rxjs/operators';
import { SubRegionActionTypes } from './sub-region.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import {
  CustomErrors,
  LoadSubRegionListingSuccessPayload,
  SubRegion,
  LoadRegionDetailsListingSuccessPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { SubRegionService } from '../sub-region.service';

@Injectable()
export class SubRegionEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private subRegionService: SubRegionService
  ) {}

  @Effect()
  loadRegionDetails$ = this.dataPersistence.fetch(
    SubRegionActionTypes.LOAD_REGION_DETAILS,
    {
      run: (action: SubRegionActions.LoadRegionDetails) => {
        return this.subRegionService
          .getRegionDetails()
          .pipe(
            map(
              (region: LoadRegionDetailsListingSuccessPayload) =>
                new SubRegionActions.LoadRegionDetailsSuccess(region)
            )
          );
      },
      onError: (
        action: SubRegionActions.LoadRegionDetails,
        error: HttpErrorResponse
      ) => {
        return new SubRegionActions.LoadRegionDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSubRegionDetails$ = this.dataPersistence.fetch(
    SubRegionActionTypes.LOAD_SUB_REGION_DETAILS,
    {
      run: (action: SubRegionActions.LoadSubRegionDetails) => {
        return this.subRegionService
          .getSubRegionDetails(action.payload)
          .pipe(
            map(
              (region: LoadSubRegionListingSuccessPayload) =>
                new SubRegionActions.LoadSubRegionDetailsSuccess(region)
            )
          );
      },
      onError: (
        action: SubRegionActions.LoadSubRegionDetails,
        error: HttpErrorResponse
      ) => {
        return new SubRegionActions.LoadSubRegionDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSubRegionByCode$ = this.dataPersistence.fetch(
    SubRegionActionTypes.LOAD_SUB_REGION_DETAILS_BY_CODE,
    {
      run: (action: SubRegionActions.LoadSubRegionByCode) => {
        return this.subRegionService
          .getSubRegionByCode(action.payload)
          .pipe(
            map(
              (townDetailsByTownCode: SubRegion) =>
                new SubRegionActions.LoadSubRegionByCodeSuccess(
                  townDetailsByTownCode
                )
            )
          );
      },
      onError: (
        action: SubRegionActions.LoadSubRegionByCode,
        error: HttpErrorResponse
      ) => {
        return new SubRegionActions.LoadSubRegionByCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveSubRegionFormDetails$ = this.dataPersistence.pessimisticUpdate(
    SubRegionActionTypes.SAVE_SUB_REGION_DETAILS,
    {
      run: (action: SubRegionActions.SaveSubRegionFormDetails) => {
        return this.subRegionService
          .saveSubRegionFormDetails(action.payload)
          .pipe(
            map((saveData: SubRegion) => {
              return new SubRegionActions.SaveSubRegionFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: SubRegionActions.SaveSubRegionFormDetails,
        error: HttpErrorResponse
      ) => {
        return new SubRegionActions.SaveSubRegionFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editSubTownFormDetails$ = this.dataPersistence.pessimisticUpdate(
    SubRegionActionTypes.EDIT_SUB_REGION_DETAILS,
    {
      run: (action: SubRegionActions.EditSubRegionDetails) => {
        return this.subRegionService
          .editSubRegionFormDetails(action.payload)
          .pipe(
            map((saveData: SubRegion) => {
              return new SubRegionActions.EditSubRegionDetailsSuccess(saveData);
            })
          );
      },
      onError: (
        action: SubRegionActions.EditSubRegionDetails,
        error: HttpErrorResponse
      ) => {
        return new SubRegionActions.EditSubRegionDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchSubRegionByCode$ = this.dataPersistence.fetch(
    SubRegionActionTypes.SEARCH_SUB_REGION_BY_CODE,
    {
      run: (action: SubRegionActions.SearchSubRegion) => {
        return this.subRegionService
          .searchSubRegionByCode(
            action.payload.regionCode,
            action.payload.parentRegionCode
          )
          .pipe(
            map(
              (binGroupList: LoadSubRegionListingSuccessPayload) =>
                new SubRegionActions.SearchSubRegionSuccess(binGroupList)
            )
          );
      },
      onError: (
        action: SubRegionActions.SearchSubRegion,
        error: HttpErrorResponse
      ) => {
        return new SubRegionActions.SearchSubRegionFailure(
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
