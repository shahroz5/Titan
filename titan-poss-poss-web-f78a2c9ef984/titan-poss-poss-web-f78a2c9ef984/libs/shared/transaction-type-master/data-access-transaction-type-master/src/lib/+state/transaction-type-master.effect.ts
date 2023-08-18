import { DataPersistence } from '@nrwl/angular';

import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as TransactionTypeMasterActions from './transaction-type-master.actions';
import {
  CustomErrors,
  LoadTransactionTypeMasterListingSuccessPayload,
  TransactionTypeMasterDetails
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { TransactionTypeMasterService } from '../transaction-type-master.service';

@Injectable()
export class TransactionTypeMasterEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private transactionTypeMasterService: TransactionTypeMasterService
  ) { }

  @Effect()
  loadTransactionTypeMasterListing$ = this.dataPersistence.fetch(
    TransactionTypeMasterActions.TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_LISTING,
    {
      run: (action: TransactionTypeMasterActions.LoadTransactionTypeMasterListing) => {
        return this.transactionTypeMasterService
          .getTransactionTypeMasterList()
          .pipe(
            map((listing: LoadTransactionTypeMasterListingSuccessPayload) =>
              new TransactionTypeMasterActions.LoadTransactionTypeMasterListingSuccess(listing)
            )
          );
      },
      onError: (
        action: TransactionTypeMasterActions.LoadTransactionTypeMasterListing,
        error: HttpErrorResponse
      ) => {
        return new TransactionTypeMasterActions.LoadTransactionTypeMasterListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTaxClassDetailsByTaxClassCode$ = this.dataPersistence.fetch(
    TransactionTypeMasterActions.TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_DETAILS_BY_CODE,
    {
      run: (
        action: TransactionTypeMasterActions.LoadTransactionTypeMasterByCode
      ) => {
        return this.transactionTypeMasterService
          .getTransactionTypeMasterByCode(action.payload)
          .pipe(
            map((transactionTypeMasterByCode: TransactionTypeMasterDetails) =>
              new TransactionTypeMasterActions.LoadTransactionTypeMasterByCodeSuccess(
                transactionTypeMasterByCode
              )
            )
          );
      },
      onError: (
        action: TransactionTypeMasterActions.LoadTransactionTypeMasterByCode,
        error: HttpErrorResponse
      ) => {
        return new TransactionTypeMasterActions.LoadTransactionTypeMasterByCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

 /*  @Effect()
  saveFormDetails$ = this.dataPersistence.pessimisticUpdate(
    TransactionTypeMasterActions.TransactionTypeMasterActionTypes.SAVE_TRANSACTION_TYPE_MASTER_FORM_DETAILS,
    {
      run: (action: TransactionTypeMasterActions.SaveTransactionTypeMasterFormDetails) => {
        return this.transactionTypeMasterService
          .saveTransactionTypeMasterFormDetails(action.payload)
          .pipe(
            map((saveData: TransactionTypeMasterDetails) => {
              return new TransactionTypeMasterActions.SaveTransactionTypeMasterFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: TransactionTypeMasterActions.SaveTransactionTypeMasterFormDetails,
        error: HttpErrorResponse
      ) => {
        return new TransactionTypeMasterActions.SaveTransactionTypeMasterFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editFormDetails$ = this.dataPersistence.pessimisticUpdate(
    TransactionTypeMasterActions.TransactionTypeMasterActionTypes.EDIT_TRANSACTION_TYPE_MASTER_FORM_DETAILS,
    {
      run: (action: TransactionTypeMasterActions.EditTransactionTypeMasterFormDetails) => {
        return this.transactionTypeMasterService
          .editTransactionTypeMasterFormDetails(action.payload)
          .pipe(
            map((saveData: TransactionTypeMasterDetails) => {
              return new TransactionTypeMasterActions.EditTransactionTypeMasterFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: TransactionTypeMasterActions.EditTransactionTypeMasterFormDetails,
        error: HttpErrorResponse
      ) => {
        return new TransactionTypeMasterActions.EditTransactionTypeMasterFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
 */
  @Effect()
  searchDetails$ = this.dataPersistence.fetch(
    TransactionTypeMasterActions.TransactionTypeMasterActionTypes.SEARCH_TRANSACTION_TYPE_MASTER_DETAILS,
    {
      run: (action: TransactionTypeMasterActions.SearchTransactionTypeMasterCode) => {
        return this.transactionTypeMasterService
          .getTransactionTypeMasterSearch(action.payload)
          .pipe(
            map((listing: LoadTransactionTypeMasterListingSuccessPayload) =>
              new TransactionTypeMasterActions.SearchTransactionTypeMasterCodeSuccess(listing)
            )
          );
      },
      onError: (
        action: TransactionTypeMasterActions.SearchTransactionTypeMasterCode,
        error: HttpErrorResponse
      ) => {
        return new TransactionTypeMasterActions.SearchTransactionTypeMasterCodeFailure(
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
