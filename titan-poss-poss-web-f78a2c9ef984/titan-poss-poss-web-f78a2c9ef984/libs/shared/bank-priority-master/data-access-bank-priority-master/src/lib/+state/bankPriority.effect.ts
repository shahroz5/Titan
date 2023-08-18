import { DataPersistence } from '@nrwl/angular';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { map } from 'rxjs/operators';
import * as BankPriorityAcitons from './bankPriority.action';
import { BankPriorityService } from '../bankPriority.service';
import {
  CustomErrors,
  LoadBankPriorityListingSuccessPayload,

} from '@poss-web/shared/models';

@Injectable()
export class BankPriorityEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private bankPriorityService: BankPriorityService
  ) { }
  @Effect()
  loadBankPiority$ = this.dataPersistence.fetch(
    BankPriorityAcitons.BankPriorityActionTypes.LOAD_BANK_PRIORITY_LISTING,
    {
      run: (action: BankPriorityAcitons.LoadBankPriority) => {

        return this.bankPriorityService
          .getBankPriority()
          .pipe(
            map(
              (bankPriority: LoadBankPriorityListingSuccessPayload) =>
                new BankPriorityAcitons.LoadBankPrioritySuccess(bankPriority)
            )
          );
      },
      onError: (
        action: BankPriorityAcitons.LoadBankPriority,
        error: HttpErrorResponse
      ) => {
        return new BankPriorityAcitons.LoadBankPriorityFailure(
          this.errorHandler(error)
        );
      }
    }
  );



  @Effect()
  saveBankPriorityFormDetails$ = this.dataPersistence.fetch(
    BankPriorityAcitons.BankPriorityActionTypes.SAVE_BANK_PRIORITY,
    {
      run: (action: BankPriorityAcitons.SaveBankPriority) => {
        return this.bankPriorityService
          .saveBankPriorityFormDetails(action.payload)
          .pipe(
            map(() => {
              return new BankPriorityAcitons.SaveBankPrioritySuccess(

              );
            })
          );
      },
      onError: (
        action: BankPriorityAcitons.SaveBankPriority,
        error: HttpErrorResponse
      ) => {
        return new BankPriorityAcitons.SaveBankPriorityFailure(
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
