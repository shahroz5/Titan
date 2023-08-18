import { DataPersistence } from '@nrwl/angular';

import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as CatchmentActions from './catchment.actions';
import {
  CatchmentDetails,
  CustomErrors,
  LoadCatchmentListingSuccessPayload
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CatchmentService } from '../catchment.service';

@Injectable()
export class CatchmentEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private catchmentService: CatchmentService
  ) {}

  @Effect()
  loadCatchmentListing$ = this.dataPersistence.fetch(
    CatchmentActions.CatchmentActionTypes.LOAD_CATCHMENT_LISTING,
    {
      run: (action: CatchmentActions.LoadCatchmentListing) => {
        return this.catchmentService
          .getCatchmentListing(action.payload)
          .pipe(
            map(
              (listing: LoadCatchmentListingSuccessPayload) =>
                new CatchmentActions.LoadCatchmentListingSuccess(listing)
            )
          );
      },
      onError: (
        action: CatchmentActions.LoadCatchmentListing,
        error: HttpErrorResponse
      ) => {
        return new CatchmentActions.LoadCatchmentListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchTaxClassDetails$ = this.dataPersistence.fetch(
    CatchmentActions.CatchmentActionTypes.SEARCH_CATCHMENT_DETAILS,
    {
      run: (action: CatchmentActions.SearchCatchmentCode) => {
        return this.catchmentService
          .searchCatchmentDetails(action.payload)
          .pipe(
            map(
              (SearchResult: LoadCatchmentListingSuccessPayload) =>
                new CatchmentActions.SearchCatchmentCodeSuccess(SearchResult)
            )
          );
      },
      onError: (
        action: CatchmentActions.SearchCatchmentCode,
        error: HttpErrorResponse
      ) => {
        return new CatchmentActions.SearchCatchmentCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCatchmentDetails$ = this.dataPersistence.fetch(
    CatchmentActions.CatchmentActionTypes.LOAD_CATCHMENT_DETAILS,
    {
      run: (action: CatchmentActions.LoadCatchmentDetails) => {
        return this.catchmentService
          .getCatchmentDetails(action.payload)
          .pipe(
            map(
              (details: CatchmentDetails) =>
                new CatchmentActions.LoadCatchmentDetailsSuccess(details)
            )
          );
      },
      onError: (
        action: CatchmentActions.LoadCatchmentDetails,
        error: HttpErrorResponse
      ) => {
        return new CatchmentActions.LoadCatchmentDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveCatchmentFormDetails$ = this.dataPersistence.pessimisticUpdate(
    CatchmentActions.CatchmentActionTypes.SAVE_CATCHMENT_DETAILS,
    {
      run: (action: CatchmentActions.SaveCatchmentFormDetails) => {
        return this.catchmentService
          .saveCatchmentFormDetails(action.payload)
          .pipe(
            map((saveData: CatchmentDetails) => {
              return new CatchmentActions.SaveCatchmentFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: CatchmentActions.SaveCatchmentFormDetails,
        error: HttpErrorResponse
      ) => {
        return new CatchmentActions.SaveCatchmentFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editCatchmentFormDetails$ = this.dataPersistence.pessimisticUpdate(
    CatchmentActions.CatchmentActionTypes.EDIT_CATCHMENT_DETAILS,
    {
      run: (action: CatchmentActions.EditCatchmentFormDetails) => {
        return this.catchmentService
          .editCatchmentFormDetails(action.payload)
          .pipe(
            map((saveData: CatchmentDetails) => {
              return new CatchmentActions.EditCatchmentFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: CatchmentActions.EditCatchmentFormDetails,
        error: HttpErrorResponse
      ) => {
        return new CatchmentActions.EditCatchmentFormDetailsFailure(
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
