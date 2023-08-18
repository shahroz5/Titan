import { DataPersistence } from '@nrwl/angular';

import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as TaxClassActions from './tax-class.actions';
import {
  CustomErrors,
  LoadTaxClassListingSuccessPayload,
  TaxClassDetails
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { TaxClassService } from '../tax-class.service';

@Injectable()
export class TaxClassEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private taxClassService: TaxClassService
  ) { }

  @Effect()
  loadTaxClassListing$ = this.dataPersistence.fetch(
    TaxClassActions.TaxClassActionTypes.LOAD_TAX_CLASS_LISTING,
    {
      run: (action: TaxClassActions.LoadTaxClassListing) => {
        return this.taxClassService
          .getTaxClassList(action.payload)
          .pipe(
            map((taxMasterListing: LoadTaxClassListingSuccessPayload) =>
              new TaxClassActions.LoadTaxClassListingSuccess(taxMasterListing)
            )
          );
      },
      onError: (
        action: TaxClassActions.LoadTaxClassListing,
        error: HttpErrorResponse
      ) => {
        return new TaxClassActions.LoadTaxClassListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTaxClassDetailsByTaxClassCode$ = this.dataPersistence.fetch(
    TaxClassActions.TaxClassActionTypes.LOAD_TAX_CLASS_DETAILS_BY_TAXCLASSCODE,
    {
      run: (
        action: TaxClassActions.LoadTaxClassDetailsByTaxClassCode
      ) => {
        return this.taxClassService
          .getTaxClassDetailsByTaxClassCode(action.payload)
          .pipe(
            map((TaxMasterDetailsByTaxMasterCode: TaxClassDetails) =>
              new TaxClassActions.LoadTaxClassDetailsByTaxClassCodeSuccess(
                TaxMasterDetailsByTaxMasterCode
              )
            )
          );
      },
      onError: (
        action: TaxClassActions.LoadTaxClassDetailsByTaxClassCode,
        error: HttpErrorResponse
      ) => {
        return new TaxClassActions.LoadTaxClassDetailsByTaxClassCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveTaxClassFormDetails$ = this.dataPersistence.pessimisticUpdate(
    TaxClassActions.TaxClassActionTypes.SAVE_TAX_CLASS_FORM_DETAILS,
    {
      run: (action: TaxClassActions.SaveTaxClassFormDetails) => {
        return this.taxClassService
          .saveTaxClassFormDetails(action.payload)
          .pipe(
            map((saveData: TaxClassDetails) => {
              return new TaxClassActions.SaveTaxClassFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: TaxClassActions.SaveTaxClassFormDetails,
        error: HttpErrorResponse
      ) => {
        return new TaxClassActions.SaveTaxClassFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editTaxClassFormDetails$ = this.dataPersistence.pessimisticUpdate(
    TaxClassActions.TaxClassActionTypes.EDIT_TAX_CLASS_FORM_DETAILS,
    {
      run: (action: TaxClassActions.EditTaxClassFormDetails) => {
        return this.taxClassService
          .editTaxClassFormDetails(action.payload)
          .pipe(
            map((saveData: TaxClassDetails) => {
              return new TaxClassActions.EditTaxClassFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: TaxClassActions.EditTaxClassFormDetails,
        error: HttpErrorResponse
      ) => {
        return new TaxClassActions.EditTaxClassFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchTaxClassDetails$ = this.dataPersistence.fetch(
    TaxClassActions.TaxClassActionTypes.SEARCH_TAX_CLASS_DETAILS,
    {
      run: (action: TaxClassActions.SearchTaxClassCode) => {
        return this.taxClassService
          .getTaxClassDetailsByTaxClassCode(action.payload)
          .pipe(
            map(
              (SearchResult: TaxClassDetails) =>
                new TaxClassActions.SearchTaxClassCodeSuccess(
                  [SearchResult]
                )
            )
          );
      },
      onError: (
        action: TaxClassActions.SearchTaxClassCode,
        error: HttpErrorResponse
      ) => {
        return new TaxClassActions.SearchTaxClassCodeFailure(
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
