import { BillCancelActionsTypes } from './bill-cancel.actions';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import * as actions from './bill-cancel.actions';
import { BillCancelService } from '../bill-cancel.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CustomErrors,
  CashMemoDetailsResponse,
  CashMemoItemDetails,
  Lov,
  StoreUser,
  CmBillList,
  ConfirmResponse,
  CancelResponse,

  bcHistoryResponse,
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { BillCancelState } from './bill-cancel.state';
import {
  LovDataService,
  StoreUserDataService
} from '@poss-web/shared/masters/data-access-masters';

@Injectable()
export class BillCancelEffects {
  constructor(
    private dataPersistence: DataPersistence<BillCancelState>,
    private service: BillCancelService,
    private loggerService: LoggerService,
    private lovDataService: LovDataService,
    private storeUserDataService: StoreUserDataService
  ) {}

  @Effect() loadBCHistory$: Observable<Action> = this.dataPersistence.fetch(
    BillCancelActionsTypes.LOAD_BC_HISTORY,
    {
      run: (action: actions.LoadBCHistory) => {
        return this.service
          .getHistoryItems(
            action.payload,
            action.searchField,
            action.searchType,
            action.page,
            action.size,
            action.txnType,
            action.subTxnType,
          )
          .pipe(
            map((data : bcHistoryResponse) =>
              new actions.LoadBCHistorySuccess(data)
            )
          );

      },

      onError: (action: actions.LoadBCHistory, error: HttpErrorResponse) => {
        return new actions.LoadBCHistoryFailure(this.errorHandler(error));
      }
    }
  );



  @Effect() confirm$: Observable<Action> = this.dataPersistence.fetch(
    BillCancelActionsTypes.CONFIRM,
    {
      run: (action: actions.ConfirmRequest) => {
        return this.service
          .confirm(action.payload)
          .pipe(
            map(
              (data: ConfirmResponse) => new actions.ConfirmRequestSuccess(data)
            )
          );
      },

      onError: (action: actions.ConfirmRequest, error: HttpErrorResponse) => {
        return new actions.ConfirmRequestFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() cancel$: Observable<Action> = this.dataPersistence.fetch(
    BillCancelActionsTypes.CANCEL,
    {
      run: (action: actions.CancelRequest) => {
        return this.service
          .cancel(action.payload)
          .pipe(
            map(
              (data: CancelResponse) => new actions.CancelRequestSuccess(data)
            )
          );
      },

      onError: (action: actions.CancelRequest, error: HttpErrorResponse) => {
        return new actions.CancelRequestFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() viewCashMemo$: Observable<Action> = this.dataPersistence.fetch(
    BillCancelActionsTypes.VIEW_CASH_MEMO,
    {
      run: (action: actions.ViewCashMemo) => {
        return this.service
          .viewCashMemo(
            action.payload.id,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map((data: CashMemoDetailsResponse) => {
              return new actions.ViewCashMemoSuccess(data);
            })
          );
      },

      onError: (action: actions.ViewCashMemo, error: HttpErrorResponse) => {
        return new actions.ViewCashMemoFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() getItemToCashMemo$: Observable<Action> = this.dataPersistence.fetch(
    BillCancelActionsTypes.GET_ITEM_FROM_CASH_MEMO,
    {
      run: (action: actions.GetItemfromCashMemo) => {
        return this.service
          .getItemFromCashMemo(
            action.payload.id,
            action.payload.itemId,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map((data: CashMemoItemDetails) => {
              return new actions.GetItemfromCashMemoSuccess(data);
            })
          );
      },

      onError: (
        action: actions.GetItemfromCashMemo,
        error: HttpErrorResponse
      ) => {
        return new actions.GetItemfromCashMemoFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() cmBillList$: Observable<Action> = this.dataPersistence.fetch(
    BillCancelActionsTypes.LOAD_CM_BILL_LIST,
    {
      run: (action: actions.LoadCmBillList) => {
        return this.service
          .getCmBillList(action.payload)
          .pipe(
            map((data: CmBillList[]) => new actions.LoadCmBillListSuccess(data))
          );
      },

      onError: (action: actions.LoadCmBillList, error: HttpErrorResponse) => {
        return new actions.LoadCmBillListFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() reasonForCancel$: Observable<Action> = this.dataPersistence.fetch(
    BillCancelActionsTypes.LOAD_REASON_FOR_CANCEL,
    {
      run: (action: actions.LoadReasonForCancel) => {
        return this.lovDataService
          .getSalesLovs(action.payload)
          .pipe(
            map((data: Lov[]) => new actions.LoadReasonForCancelSuccess(data))
          );
      },

      onError: (
        action: actions.LoadReasonForCancel,
        error: HttpErrorResponse
      ) => {
        return new actions.LoadReasonForCancelFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() loadRSODetails$: Observable<Action> = this.dataPersistence.fetch(
    BillCancelActionsTypes.LOAD_RSO_DETAILS,
    {
      run: (action: actions.LoadRSODetails) => {
        return this.storeUserDataService
          .getStoreUsers(null, null, null, null, [action.payload])
          .pipe(
            map((data: StoreUser[]) => {
              const empNames: string[] = [];
              for (const employee of data) {
                empNames.push(employee.employeeCode);
              }
              return new actions.LoadRSODetailsSuccess(empNames);
            })
          );
      },

      onError: (action: actions.LoadRSODetails, error: HttpErrorResponse) => {
        return new actions.LoadRSODetailsFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() cancelType$: Observable<Action> = this.dataPersistence.fetch(
    BillCancelActionsTypes.CANCEL_TYPE,
    {
      run: (action: actions.CancelType) => {
        return this.service
          .CancelType(
            action.payload.refTxnId,
            action.payload.subTxnType,
            action.payload.txnType
          )
          .pipe(
            map((data: any) => {
              return new actions.CancelTypeSuccess(data);
            })
          );
      },

      onError: (action: actions.CancelType, error: HttpErrorResponse) => {
        return new actions.CancelTypeFailure(this.errorHandler(error));
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
