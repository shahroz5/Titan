import { DataPersistence } from '@nrwl/angular';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import {
  CustomErrors,
  LoadStoneTypeListingSuccessPayload
} from '@poss-web/shared/models';
import * as StoneTypeActions from './stone-type.actions';
import { StoneTypeService } from '../stone-type.service';
import { StoneTypeDetails } from '@poss-web/shared/models';

@Injectable()
export class StoneTypeEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private stoneTypeService: StoneTypeService
  ) {}

  @Effect()
  loadStoneTypeDetails$ = this.dataPersistence.fetch(
    StoneTypeActions.StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS,
    {
      run: (action: StoneTypeActions.LoadStoneTypeDetails) => {
        return this.stoneTypeService
          .getStoneTypeDetails(action.payload)
          .pipe(
            map(
              (stoneTypeDetails: LoadStoneTypeListingSuccessPayload) =>
                new StoneTypeActions.LoadStoneTypeDetailsSuccess(
                  stoneTypeDetails
                )
            )
          );
      },
      onError: (
        action: StoneTypeActions.LoadStoneTypeDetails,
        error: HttpErrorResponse
      ) => {
        return new StoneTypeActions.LoadStoneTypeDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadStoneTypeDetailsByStoneTypeCode$ = this.dataPersistence.fetch(
    StoneTypeActions.StoneTypeActionTypes
      .LOAD_STONE_TYPE_DETAILS_BY_STONE_TYPECODE,
    {
      run: (action: StoneTypeActions.LoadStoneTypeByStoneTypeCode) => {
        return this.stoneTypeService
          .getStoneTypeDetailsByStoneTypeCode(action.payload)
          .pipe(
            map(
              (StoneTypeDetailsByStoneTypeCode: StoneTypeDetails) =>
                new StoneTypeActions.LoadStoneTypeByStoneTypeCodeSuccess(
                  StoneTypeDetailsByStoneTypeCode
                )
            )
          );
      },
      onError: (
        action: StoneTypeActions.LoadStoneTypeByStoneTypeCode,
        error: HttpErrorResponse
      ) => {
        return new StoneTypeActions.LoadStoneTypeByStoneTypeCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveStoneTypeFormDetails$ = this.dataPersistence.pessimisticUpdate(
    StoneTypeActions.StoneTypeActionTypes.SAVE_STONE_TYPE_FORM_DETAILS,
    {
      run: (action: StoneTypeActions.SaveStoneTypeFormDetails) => {
        return this.stoneTypeService
          .saveStoneTypeFormDetails(action.payload)
          .pipe(
            map((saveData: StoneTypeDetails) => {
              return new StoneTypeActions.SaveStoneTypeFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: StoneTypeActions.SaveStoneTypeFormDetails,
        error: HttpErrorResponse
      ) => {
        return new StoneTypeActions.SaveStoneTypeFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editStoneTypeFormDetails$ = this.dataPersistence.pessimisticUpdate(
    StoneTypeActions.StoneTypeActionTypes.EDIT_STONE_TYPE_FORM_DETAILS,
    {
      run: (action: StoneTypeActions.EditStoneTypeFormDetails) => {
        return this.stoneTypeService
          .editStoneTypeFormDetails(action.payload)
          .pipe(
            map((saveData: StoneTypeDetails) => {
              return new StoneTypeActions.EditStoneTypeFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: StoneTypeActions.EditStoneTypeFormDetails,
        error: HttpErrorResponse
      ) => {
        return new StoneTypeActions.EditStoneTypeFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchStoneTypeFormDetails$ = this.dataPersistence.fetch(
    StoneTypeActions.StoneTypeActionTypes.SEARCH_STONE_TYPE_DETAILS,
    {
      run: (action: StoneTypeActions.SearchStoneTypeCode) => {
        return this.stoneTypeService
          .getStoneTypeSearchResult(action.payload)
          .pipe(
            map(
              (SearchResult: StoneTypeDetails[]) =>
                new StoneTypeActions.SearchStoneTypeCodeSuccess(SearchResult)
            )
          );
      },
      onError: (
        action: StoneTypeActions.SearchStoneTypeCode,
        error: HttpErrorResponse
      ) => {
        return new StoneTypeActions.SearchStoneTypeCodeFailure(
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
