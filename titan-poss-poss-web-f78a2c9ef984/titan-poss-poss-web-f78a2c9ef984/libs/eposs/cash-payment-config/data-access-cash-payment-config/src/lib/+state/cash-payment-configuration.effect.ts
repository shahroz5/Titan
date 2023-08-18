import { DataPersistence } from '@nrwl/angular';

import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as CashPaymentConfigurationActions from './cash-payment-configuration.actions';
import {
  CustomErrors,
  CashPaymentConfiguration
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CashPaymentConfigurationService } from '../cash-payment-configuration.service';

@Injectable()
export class CashPaymentConfigurationEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private cashPaymentConfigurationService: CashPaymentConfigurationService
  ) { }

  @Effect()
  loadCashPaymentConfiguration$ = this.dataPersistence.fetch(
    CashPaymentConfigurationActions.CashPaymentConfigurationActionTypes.LOAD_CASH_PAYMENT_CONFIGURATION,
    {
      run: (action: CashPaymentConfigurationActions.LoadCashPaymentConfiguration) => {
        return this.cashPaymentConfigurationService
          .getCashPaymentConfigurationDetails(action.payload)
          .pipe(
            map((cashPaymentConfigurationDetails: CashPaymentConfiguration) =>
              new CashPaymentConfigurationActions.LoadCashPaymentConfigurationSuccess(cashPaymentConfigurationDetails)
            )
          );
      },
      onError: (
        action: CashPaymentConfigurationActions.LoadCashPaymentConfiguration,
        error: HttpErrorResponse
      ) => {
        return new CashPaymentConfigurationActions.LoadCashPaymentConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addNewCashPaymentConfiguration$ = this.dataPersistence.fetch(
    CashPaymentConfigurationActions.CashPaymentConfigurationActionTypes.ADDNEW_CASH_PAYMENT_CONFIGURATION,
    {
      run: (action: CashPaymentConfigurationActions.AddNewCashPaymentConfiguration) => {
        return this.cashPaymentConfigurationService
          .addNewCashPaymentConfigurationDetails(action.payload)
          .pipe(
            map((cashPaymentConfigurationDetails: CashPaymentConfiguration) =>
              new CashPaymentConfigurationActions.AddNewCashPaymentConfigurationSuccess(cashPaymentConfigurationDetails)
            )
          );
      },
      onError: (
        action: CashPaymentConfigurationActions.AddNewCashPaymentConfiguration,
        error: HttpErrorResponse
      ) => {
        return new CashPaymentConfigurationActions.AddNewCashPaymentConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editCashPaymentConfiguration$ = this.dataPersistence.fetch(
    CashPaymentConfigurationActions.CashPaymentConfigurationActionTypes.EDIT_CASH_PAYMENT_CONFIGURATION,
    {
      run: (action: CashPaymentConfigurationActions.EditCashPaymentConfiguration) => {
        console.log('here');
        return this.cashPaymentConfigurationService
          .editCashPaymentConfigurationDetails(action.payload.ruleId, action.payload.cashPaymentConfigurationForm)
          .pipe(
            map((cashPaymentConfigurationDetails: CashPaymentConfiguration) =>
              new CashPaymentConfigurationActions.EditCashPaymentConfigurationSuccess(cashPaymentConfigurationDetails)
            )
          );
      },
      onError: (
        action: CashPaymentConfigurationActions.EditCashPaymentConfiguration,
        error: HttpErrorResponse
      ) => {
        return new CashPaymentConfigurationActions.EditCashPaymentConfigurationFailure(
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
