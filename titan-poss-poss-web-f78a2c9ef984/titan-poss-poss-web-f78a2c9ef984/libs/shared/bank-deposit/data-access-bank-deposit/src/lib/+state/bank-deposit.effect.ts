import { BankDepositActionTypes } from './bank-deposit.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';

import * as BankDepositActions from './bank-deposit.actions';
import { BankDepositResponse, CustomErrors, DepositDateResponse } from '@poss-web/shared/models';
import { BankDepositService } from '../bank-deposit.service';
import { BankDepositState } from './bank-deposit.state';

@Injectable()
export class BankDepositEffect {
  constructor(
    private service: BankDepositService,
    private loggerService: LoggerService,
    private dataPersistence: DataPersistence<BankDepositState>
  ) {}

  @Effect() loadBankDepositList$ = this.dataPersistence.fetch(
    BankDepositActionTypes.LOAD_BANK_DEPOSIT_LIST,
    {
      run: (action: BankDepositActions.LoadBankDepositList) => {
        return this.service
          .loadBankDeposit(action.paginatePayload, action.payload)
          .pipe(
            map(
              (data: BankDepositResponse) =>
                new BankDepositActions.LoadBankDepositListSuccess(data)
            )
          );
      },

      onError: (
        action: BankDepositActions.LoadBankDepositList,
        error: HttpErrorResponse
      ) => {
        return new BankDepositActions.LoadBankDepositListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  
  @Effect()
    getTransactionDetails$ = this.dataPersistence.fetch(
      BankDepositActionTypes.GET_TRANSACTION_DETAILS,
      {
        run: (action: BankDepositActions.GetTransactionDetails) => {
          return this.service
            .getTransactionDetails(action.payload)
            .pipe(
              map(
                (transacionIdDetails: any) =>
                  new BankDepositActions.GetTransactionDetailsSuccess({
                    transacionIdDetails: transacionIdDetails,
                    paymentCode: action.payload.paymentCode
                  })
              )
            );
        },
        onError: (
          action: BankDepositActions.GetTransactionDetails,
          error: HttpErrorResponse
        ) => {
          return new BankDepositActions.GetTransactionDetailsFailure(
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
