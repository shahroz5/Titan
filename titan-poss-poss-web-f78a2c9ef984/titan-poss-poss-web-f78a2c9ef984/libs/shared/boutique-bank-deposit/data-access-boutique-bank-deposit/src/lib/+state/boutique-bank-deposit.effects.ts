import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { BoutiqueBankDepositService } from '../boutique-bank-deposit.service';
import { BoutiqueBankDepositActionTypes } from './boutique-bank-deposit.actions';
import { map } from 'rxjs/operators';
import * as BoutiqueBankDepositActions from './boutique-bank-deposit.actions';
import { BankDepositDetails, BoutiqueBankDepositResponse, CustomErrors, PendingDatesResponse, PifNoResponse } from '@poss-web/shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class BoutiqueBankDepostEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private boutiqueBankDepositService: BoutiqueBankDepositService
  ) {}
  @Effect()
  loadBankDepostDetails$ = this.dataPersistence.fetch(
    BoutiqueBankDepositActionTypes.LOAD_BANK_DEPOSIT_DETAILS,
    {
      run: (action: BoutiqueBankDepositActions.LoadBankDepositDetails) => {
        return this.boutiqueBankDepositService
          .loadBankDepositDetails(action.payload)
          .pipe(
            map(
              (bankDepositDetails: BoutiqueBankDepositResponse) =>
                new BoutiqueBankDepositActions.LoadBankDepositDetailsSuccess(bankDepositDetails)
            )
          );
      },
      onError: (
        action: BoutiqueBankDepositActions.LoadBankDepositDetails,
        error: HttpErrorResponse
      ) => {
        return new BoutiqueBankDepositActions.LoadBankDepositDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  saveBankDepositDetails$ = this.dataPersistence.fetch(
    BoutiqueBankDepositActionTypes.SAVE_BANK_DEPOSIT_DETAILS,
    {
      run: (action: BoutiqueBankDepositActions.SaveBankDepositDetails) => {
        return this.boutiqueBankDepositService
          .saveBankDepostDetails(action.payload)
          .pipe(
            map(
              (saveResponse: {
                data: BankDepositDetails[];
                totalDepositAmount: number;
              }) =>
                new BoutiqueBankDepositActions.SaveBankDepositDetailsSuccess(
                  saveResponse
                )
            )
          );
      },
      onError: (
        action: BoutiqueBankDepositActions.SaveBankDepositDetails,
        error: HttpErrorResponse
      ) => {
        return new BoutiqueBankDepositActions.SaveBankDepositDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveCashDenomition$ = this.dataPersistence.fetch(
    BoutiqueBankDepositActionTypes.SAVE_CASH_DENOMITION,
    {
      run: (action: BoutiqueBankDepositActions.SaveCashDenomition) => {
        return this.boutiqueBankDepositService
          .saveCashDenomiton(action.payload)
          .pipe(
            map(
              () => new BoutiqueBankDepositActions.SaveCashDenomitionSuccess()
            )
          );
      },
      onError: (
        action: BoutiqueBankDepositActions.SaveCashDenomition,
        error: HttpErrorResponse
      ) => {
        return new BoutiqueBankDepositActions.SaveCashDenomitionFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadPendingDates$ = this.dataPersistence.fetch(
    BoutiqueBankDepositActionTypes.LOAD_PENDING_DATES,
    {
      run: (action: BoutiqueBankDepositActions.LoadPendingDates) => {
        return this.boutiqueBankDepositService
          .loadPendingGHSDates(action.payload)
          .pipe(
            map(
              (pendingDates: PendingDatesResponse) =>
                new BoutiqueBankDepositActions.LoadPendingDatesSuccess(
                  pendingDates
                )
            )
          );
      },
      onError: (
        action: BoutiqueBankDepositActions.LoadPendingDates,
        error: HttpErrorResponse
      ) => {
        return new BoutiqueBankDepositActions.LoadPendingDatesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadDepositAmountByPifNo$ = this.dataPersistence.fetch(
    BoutiqueBankDepositActionTypes.LOAD_DEPOSIT_AMOUNT_BY_PIFNO,
    {
      run: (action: BoutiqueBankDepositActions.LoadDepositAmountByPifNo) => {
        return this.boutiqueBankDepositService
          .loadDepositAmountByPifNo(action.payload)
          .pipe(
            map(
              (pifNoResponse: PifNoResponse) =>
                new BoutiqueBankDepositActions.LoadDepositAmountByPifNoSuccess(
                  pifNoResponse
                )
            )
          );
      },
      onError: (
        action: BoutiqueBankDepositActions.LoadDepositAmountByPifNo,
        error: HttpErrorResponse
      ) => {
        return new BoutiqueBankDepositActions.LoadDepositAmountByPifNoFailure(
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
