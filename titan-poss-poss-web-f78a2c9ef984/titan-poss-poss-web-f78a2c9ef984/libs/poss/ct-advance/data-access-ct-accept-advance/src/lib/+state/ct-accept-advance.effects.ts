import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { CtAcceptAdvanceActionTypes } from './ct-accept-advance.actions';
import * as CtAcceptAdvanceActions from './ct-accept-advance.actions';
import { CtAcceptAdvanceService } from '../ct-accept-advance.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CustomErrors,
  InitiateAdvanceResponse,
  UpdateAdvanceTransactionResponse,
  StoreUser,
  AdvanceHistoryResponse,
  RsoNameObject
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { StoreUserDataService } from '@poss-web/shared/masters/data-access-masters';

@Injectable()
export class CtAcceptAdvanceEffects {
  constructor(
    private dataPersistence: DataPersistence<CtAcceptAdvanceEffects>,
    private ctAcceptAdvanceService: CtAcceptAdvanceService,
    private loggerService: LoggerService,
    private storeUserDataService: StoreUserDataService
  ) {}

  @Effect() loadRSODetails$: Observable<Action> = this.dataPersistence.fetch(
    CtAcceptAdvanceActionTypes.LOAD_RSO_DETAILS,
    {
      run: (action: CtAcceptAdvanceActions.LoadRSODetails) => {
        return this.storeUserDataService
          .getStoreUsers(null, null, null, null, [action.payload])
          .pipe(
            map((data: StoreUser[]) => {
              const employeeCodes: RsoNameObject[] = [];
              for (const employee of data) {
                const empObj: RsoNameObject = {
                  value: employee.employeeCode,
                  description: employee.empName
                };
                employeeCodes.push(empObj);
              }
              return new CtAcceptAdvanceActions.LoadRSODetailsSuccess(
                employeeCodes
              );
            })
          );
      },

      onError: (
        action: CtAcceptAdvanceActions.LoadRSODetails,
        error: HttpErrorResponse
      ) => {
        return new CtAcceptAdvanceActions.LoadRSODetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() initiateAdvance$: Observable<Action> = this.dataPersistence.fetch(
    CtAcceptAdvanceActionTypes.INITIATE_ADVANCE,
    {
      run: (action: CtAcceptAdvanceActions.InitiateAdvance) => {
        return this.ctAcceptAdvanceService
          .initiateAdvanceTransaction()
          .pipe(
            map(
              (data: InitiateAdvanceResponse) =>
                new CtAcceptAdvanceActions.InitiateAdvancesSuccess(data)
            )
          );
      },
      onError: (
        action: CtAcceptAdvanceActions.InitiateAdvance,
        error: HttpErrorResponse
      ) => {
        return new CtAcceptAdvanceActions.InitiateAdvancesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() updateAdvance$: Observable<Action> = this.dataPersistence.fetch(
    CtAcceptAdvanceActionTypes.UPDATE_ADVANCE,
    {
      run: (action: CtAcceptAdvanceActions.UpdateAdvance) => {
        return this.ctAcceptAdvanceService
          .updateAdvanceTransaction(action.id, action.requestPayload)
          .pipe(
            map(
              (data: UpdateAdvanceTransactionResponse) =>
                new CtAcceptAdvanceActions.UpdateAdvanceSuccess(data)
            )
          );
      },
      onError: (
        action: CtAcceptAdvanceActions.UpdateAdvance,
        error: HttpErrorResponse
      ) => {
        return new CtAcceptAdvanceActions.UpdateAdvanceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() partiallyUpdateAdvance$: Observable<
    Action
  > = this.dataPersistence.fetch(
    CtAcceptAdvanceActionTypes.PARTIALLY_UPDATE_ADVANCE,
    {
      run: (action: CtAcceptAdvanceActions.PartiallyUpdateAdvance) => {
        return this.ctAcceptAdvanceService
          .partiallyUpdateAdvanceTransaction(action.id, action.requestPayload)
          .pipe(
            map(
              (data: any) =>
                new CtAcceptAdvanceActions.PartiallyUpdateAdvanceSuccess(
                  new Date().toLocaleTimeString()
                )
            )
          );
      },
      onError: (
        action: CtAcceptAdvanceActions.PartiallyUpdateAdvance,
        error: HttpErrorResponse
      ) => {
        return new CtAcceptAdvanceActions.PartiallyUpdateAdvanceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() viewAdvance$: Observable<Action> = this.dataPersistence.fetch(
    CtAcceptAdvanceActionTypes.VIEW_ADVANCE,
    {
      run: (action: CtAcceptAdvanceActions.ViewAdvance) => {
        return this.ctAcceptAdvanceService
          .getAdvanceTransactionDetails(action.payload)
          .pipe(
            map(
              (data: any) => new CtAcceptAdvanceActions.ViewAdvanceSuccess(data)
            )
          );
      },
      onError: (
        action: CtAcceptAdvanceActions.ViewAdvance,
        error: HttpErrorResponse
      ) => {
        return new CtAcceptAdvanceActions.ViewAdvanceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() advanceHistory$: Observable<Action> = this.dataPersistence.fetch(
    CtAcceptAdvanceActionTypes.LOAD_ADVANCE_HISTORY,
    {
      run: (action: CtAcceptAdvanceActions.LoadAdvanceHistory) => {
        return this.ctAcceptAdvanceService
          .getAdvanceHistoryItems(
            action.payload,
            action.searchField,
            action.searchType,
            action.status,
            action.page,
            action.size
          )
          .pipe(
            map(
              (data: AdvanceHistoryResponse) =>
                new CtAcceptAdvanceActions.LoadAdvanceHistorySuccess(data)
            )
          );
      },
      onError: (
        action: CtAcceptAdvanceActions.LoadAdvanceHistory,
        error: HttpErrorResponse
      ) => {
        return new CtAcceptAdvanceActions.LoadAdvanceHistoryFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() deleteAcceptAdvanceTransactionDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    CtAcceptAdvanceActionTypes.DELETE_ADVANCE_TRANSACTION_DETAILS,
    {
      run: (action: CtAcceptAdvanceActions.DeleteAdvanceTransactionDetails) => {
        return this.ctAcceptAdvanceService
          .deleteAdvanceTransactionDetails(action.id)
          .pipe(
            map(
              (data: any) =>
                new CtAcceptAdvanceActions.DeleteAdvanceTransactionDetailsSuccess(
                  'Success'
                )
            )
          );
      },
      onError: (
        action: CtAcceptAdvanceActions.DeleteAdvanceTransactionDetails,
        error: HttpErrorResponse
      ) => {
        return new CtAcceptAdvanceActions.DeleteAdvanceTransactionDetailsFailure(
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
