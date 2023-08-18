import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { PrinterService } from '@poss-web/shared/util-common';
import { map } from 'rxjs/operators';
import { TEPRequestState } from './tep.state';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { TEPRequestActionTypes } from './tep.actions';
import * as TEPRequestActions from './tep.actions';
import { TEPService } from '../tep.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CustomErrors,

  AdvanceBookingDetailsResponse,

  GetTepItemConfiguratonResponse,

  TEPSearchResponse,

} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';

@Injectable()
export class TEPRequestEffects {
  constructor(
    private loggerService: LoggerService,
    private dataPersistence: DataPersistence<TEPRequestState>,
    private tepService: TEPService,
    private printerService: PrinterService
  ) {}

  @Effect() loadWorkflowDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(TEPRequestActionTypes.LOAD_WORKFLOW_DETAILS, {
    run: (action: TEPRequestActions.LoadWorkflowDeatils) => {
      return this.tepService.loadWorkflowDeatils(action.payload).pipe(
        map((data: AdvanceBookingDetailsResponse) => {
          return new TEPRequestActions.LoadWorkflowDeatilsSuccess(data);
        })
      );
    },

    onError: (
      action: TEPRequestActions.LoadWorkflowDeatils,
      error: HttpErrorResponse
    ) => {
      return new TEPRequestActions.LoadWorkflowDeatilsFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() searchTEP$: Observable<Action> = this.dataPersistence.fetch(
    TEPRequestActionTypes.SEARCH_TEP,
    {
      run: (action: TEPRequestActions.SearchTEP) => {
        return this.tepService
          .searchTep(action.payload, action.notConfirmedpayload)
          .pipe(
            map((data: TEPSearchResponse) => {
              return new TEPRequestActions.SearchTEPSuccess(data);
            })
          );
      },

      onError: (
        action: TEPRequestActions.SearchTEP,
        error: HttpErrorResponse
      ) => {
        return new TEPRequestActions.SearchTEPFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() tepHistory$: Observable<Action> = this.dataPersistence.fetch(
    TEPRequestActionTypes.LOAD_TEP_HISTORY,
    {
      run: (action: TEPRequestActions.LoadTEPHistory) => {
        return this.tepService
          .getHistoryItems(
            action.payload,
            action.searchField,
            action.searchType,
            action.status,
            action.page,
            action.size,
            action.txnType,
            action.subTxnType,
            action.sort
          )
          .pipe(
            map(
              (data: TEPSearchResponse) =>
                new TEPRequestActions.LoadTEPHistorySuccess(data)
            )
          );
      },
      onError: (
        action: TEPRequestActions.LoadTEPHistory,
        error: HttpErrorResponse
      ) => {
        return new TEPRequestActions.LoadTEPHistoryFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getTepItemConfiguration$: Observable<
    Action
  > = this.dataPersistence.fetch(TEPRequestActionTypes.GET_ITEM_CONFIGURATION, {
    run: (action: TEPRequestActions.GetTepItemConfiguration) => {
      return this.tepService
        .getTepItemConfiguration(
          action.itemCode,
          action.tepType,
          action.customerMobileNo
        )
        .pipe(
          map(
            (data: GetTepItemConfiguratonResponse) =>
              new TEPRequestActions.GetTepItemConfigurationSuccess(data)
          )
        );
    },
    onError: (
      action: TEPRequestActions.GetTepItemConfiguration,
      error: HttpErrorResponse
    ) => {
      return new TEPRequestActions.GetTepItemConfigurationFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() requestList$: Observable<Action> = this.dataPersistence.fetch(
    TEPRequestActionTypes.LOAD_REQUESTS,
    {
      run: (action: TEPRequestActions.LoadRequests) => {
        return this.tepService
          .getloadRequest(action.payload)
          .pipe(
            map((data: any) => new TEPRequestActions.LoadRequestsSuccess(data))
          );
      },

      onError: (
        action: TEPRequestActions.LoadRequests,
        error: HttpErrorResponse
      ) => {
        return new TEPRequestActions.LoadRequestsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() refundRequestList$: Observable<Action> = this.dataPersistence.fetch(
    TEPRequestActionTypes.LOAD_REFUND_REQUESTS,
    {
      run: (action: TEPRequestActions.LoadRefundRequests) => {
        return this.tepService
          .getRefundRequest(action.payload)
          .pipe(
            map(
              (data: any) =>
                new TEPRequestActions.LoadRefundRequestsSuccess(data)
            )
          );
      },

      onError: (
        action: TEPRequestActions.LoadRefundRequests,
        error: HttpErrorResponse
      ) => {
        return new TEPRequestActions.LoadRefundRequestsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() refundDeatilsList$: Observable<Action> = this.dataPersistence.fetch(
    TEPRequestActionTypes.LOAD_REFUND_ORDER_DETAILS,
    {
      run: (action: TEPRequestActions.LoadRefundOrderDeatils) => {
        return this.tepService
          .getRefundRequestDetails(action.payload)
          .pipe(
            map(
              (data: any) =>
                new TEPRequestActions.LoadRefundOrderDeatilsSuccess(data)
            )
          );
      },

      onError: (
        action: TEPRequestActions.LoadRefundOrderDeatils,
        error: HttpErrorResponse
      ) => {
        return new TEPRequestActions.LoadRefundOrderDeatilsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() approveRefundDeatils$: Observable<
    Action
  > = this.dataPersistence.fetch(
    TEPRequestActionTypes.APPROVE_REFUND_ORDER_DETAILS,
    {
      run: (action: TEPRequestActions.ApproveRefundOrderDeatils) => {
        return this.tepService
          .ApproveRefundRequestDetails(action.payload)
          .pipe(
            map(
              (data: any) =>
                new TEPRequestActions.ApproveRefundOrderDeatilsSuccess(data)
            )
          );
      },

      onError: (
        action: TEPRequestActions.ApproveRefundOrderDeatils,
        error: HttpErrorResponse
      ) => {
        return new TEPRequestActions.ApproveRefundOrderDeatilsFailure(
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
