import { DataPersistence } from '@nrwl/angular';

import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as TaxMasterActions from './tax-master.actions';
import {
  CustomErrors,
  LoadTaxMasterListingSuccessPayload,
  TaxMasterDetails
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { TaxMasterService } from '../tax-master.service';

@Injectable()
export class TaxMasterEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private taxMasterService: TaxMasterService
  ) { }

  @Effect()
  loadTaxMasterListing$ = this.dataPersistence.fetch(
    TaxMasterActions.TaxMasterActionTypes.LOAD_TAX_MASTER_LISTING,
    {
      run: (action: TaxMasterActions.LoadTaxMasterListing) => {
        return this.taxMasterService
          .getTaxMasterList(action.payload)
          .pipe(
            map((taxMasterListing: LoadTaxMasterListingSuccessPayload) =>
              new TaxMasterActions.LoadTaxMasterListingSuccess(taxMasterListing)
            )
          );
      },
      onError: (
        action: TaxMasterActions.LoadTaxMasterListing,
        error: HttpErrorResponse
      ) => {
        return new TaxMasterActions.LoadTaxMasterListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTaxMasterDetailsByTaxCode$ = this.dataPersistence.fetch(
    TaxMasterActions.TaxMasterActionTypes.LOAD_TAX_MASTER_DETAILS_BY_TAXCODE,
    {
      run: (
        action: TaxMasterActions.LoadTaxMasterDetailsByTaxCode
      ) => {
        return this.taxMasterService
          .getTaxMasterDetailsByTaxMasterCode(action.payload)
          .pipe(
            map((TaxMasterDetailsByTaxMasterCode: TaxMasterDetails) =>
              new TaxMasterActions.LoadTaxMasterDetailsByTaxCodeSuccess(
                TaxMasterDetailsByTaxMasterCode
              )
            )
          );
      },
      onError: (
        action: TaxMasterActions.LoadTaxMasterDetailsByTaxCode,
        error: HttpErrorResponse
      ) => {
        return new TaxMasterActions.LoadTaxMasterDetailsByTaxCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveTaxMasterFormDetails$ = this.dataPersistence.pessimisticUpdate(
    TaxMasterActions.TaxMasterActionTypes.SAVE_TAX_MASTER_FORM_DETAILS,
    {
      run: (action: TaxMasterActions.SaveTaxMasterFormDetails) => {
        return this.taxMasterService
          .saveTaxMasterFormDetails(action.payload)
          .pipe(
            map((saveData: TaxMasterDetails) => {
              return new TaxMasterActions.SaveTaxMasterFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: TaxMasterActions.SaveTaxMasterFormDetails,
        error: HttpErrorResponse
      ) => {
        return new TaxMasterActions.SaveTaxMasterFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editTaxMasterFormDetails$ = this.dataPersistence.pessimisticUpdate(
    TaxMasterActions.TaxMasterActionTypes.EDIT_TAX_MASTER_FORM_DETAILS,
    {
      run: (action: TaxMasterActions.EditTaxMasterFormDetails) => {
        return this.taxMasterService
          .editTaxMasterFormDetails(action.payload)
          .pipe(
            map((saveData: TaxMasterDetails) => {
              return new TaxMasterActions.EditTaxMasterFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: TaxMasterActions.EditTaxMasterFormDetails,
        error: HttpErrorResponse
      ) => {
        return new TaxMasterActions.EditTaxMasterFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchTaxMasterDetails$ = this.dataPersistence.fetch(
    TaxMasterActions.TaxMasterActionTypes.SEARCH_TAX_MASTER_DETAILS,
    {
      run: (action: TaxMasterActions.SearchTaxMasterCode) => {
        return this.taxMasterService
          .getTaxMasterDetailsByTaxMasterCode(action.payload)
          .pipe(
            map(
              (SearchResult: TaxMasterDetails) =>
                new TaxMasterActions.SearchTaxMasterCodeSuccess(
                  [SearchResult]
                )
            )
          );
      },
      onError: (
        action: TaxMasterActions.SearchTaxMasterCode,
        error: HttpErrorResponse
      ) => {
        return new TaxMasterActions.SearchTaxMasterCodeFailure(
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
