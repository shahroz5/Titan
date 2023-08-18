import {
  BillCancellationRequests,
  CashMemoDetailsResponse,
  CashMemoItemDetails,
  CustomErrors
} from '@poss-web/shared/models';

import {
  BillCancellationRequestsActionsTypes
} from './bill-cancellation-requests.actions';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import * as actions from './bill-cancellation-requests.actions';
import { BillCancellationRequestsService } from '../bill-cancellation-requests.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { BillCancellationRequestsState } from './bill-cancellation-requests.state';
import { LocationDataService } from '@poss-web/shared/masters/data-access-masters';
@Injectable()
export class BillCancellationRequestsEffects {
  constructor(
    private dataPersistence: DataPersistence<BillCancellationRequestsState>,
    private service: BillCancellationRequestsService,
    private loggerService: LoggerService,
    private locationService: LocationDataService
  ) {}
  @Effect() billCancelList$: Observable<Action> = this.dataPersistence.fetch(
    BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS,
    {
      run: (action: actions.LoadBillCancellationRequests) => {
        return this.service
          .getloadBillRequest(action.payload)
          .pipe(
            map(
              (data: BillCancellationRequests) =>
                new actions.LoadBillCancellationRequestsSuccess(data)
            )
          );
      },

      onError: (
        action: actions.LoadBillCancellationRequests,
        error: HttpErrorResponse
      ) => {
        return new actions.LoadBillCancellationRequestsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  location$ = this.dataPersistence.fetch(
    BillCancellationRequestsActionsTypes.LOAD_LOCATION,
    {
      run: (action: actions.LoadLocation) => {
        return this.locationService
          .getLocationSummaryList(null, false, null, null, null)
          .pipe(map((items: any) => new actions.LoadLocationSuccess(items)));
      },
      onError: (action: actions.LoadLocation, error: HttpErrorResponse) => {
        return new actions.LoadLocationFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  selected$ = this.dataPersistence.fetch(
    BillCancellationRequestsActionsTypes.LOAD_SELECTED_DATA,
    {
      run: (action: actions.LoadSeltedData) => {
        return this.service
          .selectedData(action.payload)
          .pipe(map((items: any) => new actions.LoadSelectedDataSucess(items)));
      },
      onError: (action: actions.LoadSeltedData, error: HttpErrorResponse) => {
        return new actions.LoadSelectedDataFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() billCancelCount$: Observable<Action> = this.dataPersistence.fetch(
    BillCancellationRequestsActionsTypes.COUNT_BILL_CANCELLATION_REQUESTS,
    {
      run: (action: actions.LoadCountBillCancellation) => {
        return this.service
          .getloadBillRequestCount(action.payload)
          .pipe(
            map(
              (data: any) => new actions.LoadCountBillCancellationSuccess(data)
            )
          );
      },

      onError: (
        action: actions.LoadCountBillCancellation,
        error: HttpErrorResponse
      ) => {
        return new actions.LoadCountBillCancellationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() approveCancel$: Observable<Action> = this.dataPersistence.fetch(
    BillCancellationRequestsActionsTypes.APPROVE_BILL_CANCELLATION_REQUESTS,
    {
      run: (action: actions.ApproveBillCancellationRequests) => {
        return this.service
          .putBillCancellation(action.payload)
          .pipe(
            map(
              (data: any) =>
                new actions.ApproveBillCancellationRequestsSuccess(data)
            )
          );
      },

      onError: (
        action: actions.ApproveBillCancellationRequests,
        error: HttpErrorResponse
      ) => {
        return new actions.ApproveBillCancellationRequestsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() billCancelStatusList$: Observable<
    Action
  > = this.dataPersistence.fetch(
    BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS_STATUS,
    {
      run: (action: actions.LoadBillCancellationRequestsStatus) => {
        return this.service
          .getloadBillRequestStatus(action.payload)
          .pipe(
            map(
              (data: any) =>
                new actions.LoadBillCancellationRequestsStatusSuccess(data)
            )
          );
      },

      onError: (
        action: actions.LoadBillCancellationRequestsStatus,
        error: HttpErrorResponse
      ) => {
        return new actions.LoadBillCancellationRequestsStatusFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() delete$: Observable<Action> = this.dataPersistence.fetch(
    BillCancellationRequestsActionsTypes.DELETE,
    {
      run: (action: actions.DeleteRequest) => {
        return this.service
          .delete(action.payload)
          .pipe(
            map((data: any) => new actions.DeleteRequestSuccess(action.payload))
          );
      },

      onError: (action: actions.DeleteRequest, error: HttpErrorResponse) => {
        return new actions.DeleteRequestFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() confirm$: Observable<Action> = this.dataPersistence.fetch(
    BillCancellationRequestsActionsTypes.CONFIRM,
    {
      run: (action: actions.CONFIRMRequest) => {
        return this.service
          .confirm(action.payload)
          .pipe(map((data: any) => new actions.CONFIRMRequestSuccess(data)));
      },

      onError: (action: actions.CONFIRMRequest, error: HttpErrorResponse) => {
        return new actions.CONFIRMRequestFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() cancel$: Observable<Action> = this.dataPersistence.fetch(
    BillCancellationRequestsActionsTypes.CANCEL,
    {
      run: (action: actions.CANCELRequest) => {
        return this.service
          .cancel(action.payload)
          .pipe(map((data: any) => new actions.CANCELRequestSuccess(data)));
      },

      onError: (action: actions.CANCELRequest, error: HttpErrorResponse) => {
        return new actions.CANCELRequestFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() viewCashMemo$: Observable<Action> = this.dataPersistence.fetch(
    BillCancellationRequestsActionsTypes.VIEW_CASH_MEMO,
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

  @Effect() cancelType$: Observable<Action> = this.dataPersistence.fetch(
    BillCancellationRequestsActionsTypes.CANCEL_TYPE,
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

  @Effect() getItemToCashMemo$: Observable<Action> = this.dataPersistence.fetch(
    BillCancellationRequestsActionsTypes.GET_ITEM_FROM_CASH_MEMO,
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

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
