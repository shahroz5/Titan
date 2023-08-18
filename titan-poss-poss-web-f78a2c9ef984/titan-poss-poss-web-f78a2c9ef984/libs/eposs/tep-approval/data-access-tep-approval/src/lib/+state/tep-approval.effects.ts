import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  FullValueTepRequestsResponse,
  RefundList,
  RefundListItem,
  tepApprovalListResponse
} from '@poss-web/shared/models';
import { TepApprovalService } from '../tep-approval.service';
import { TepApprovalActionTypes } from './tep-approval.actions';
import * as TepApprovalActions from './tep-approval.actions';

@Injectable()
export class TepApprovalEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public tepApprovalService: TepApprovalService,
    public loggerService: LoggerService
  ) {}

  @Effect()
  GetApprovalList$: Observable<Action> = this.dataPersistence.fetch(
    TepApprovalActionTypes.GET_TEP_APPROVAL_LIST,
    {
      run: (action: TepApprovalActions.GetTepApprovalList) => {
        return this.tepApprovalService
          .loadtepApprovalList(action.payload)
          .pipe(
            map(data => new TepApprovalActions.GetTepApprovalListSuccess(data))
          );
      },
      onError: (
        action: TepApprovalActions.GetTepApprovalList,
        error: HttpErrorResponse
      ) => {
        return new TepApprovalActions.GetTepApprovalListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  GetFullValueTepApprovalList$: Observable<Action> = this.dataPersistence.fetch(
    TepApprovalActionTypes.GET_FULL_VALUE_TEP_APPROVAL_LIST,
    {
      run: (action: TepApprovalActions.GetFullValueTepApprovalList) => {
        return this.tepApprovalService
          .loadFullValueTepApprovalList(action.payload)
          .pipe(
            map(
              (data: FullValueTepRequestsResponse) =>
                new TepApprovalActions.GetFullValueTepApprovalListSuccess(data)
            )
          );
      },
      onError: (
        action: TepApprovalActions.GetFullValueTepApprovalList,
        error: HttpErrorResponse
      ) => {
        return new TepApprovalActions.GetFullValueTepApprovalListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  sendApprovalForRequest$: Observable<Action> = this.dataPersistence.fetch(
    TepApprovalActionTypes.SEND_APPROVAL_FOR_REQUEST,
    {
      run: (action: TepApprovalActions.SendApprovalForRequest) => {
        return this.tepApprovalService
          .sendFvtApprovalRequest(
            action.isApprove,
            action.payload,
            action.processId,
            action.taskId,
            action.taskName
          )
          .pipe(
            map(
              (data: any) =>
                new TepApprovalActions.SendApprovalForRequestSuccess(data)
            )
          );
      },
      onError: (
        action: TepApprovalActions.SendApprovalForRequest,
        error: HttpErrorResponse
      ) => {
        return new TepApprovalActions.SendApprovalForRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadWorkflowDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(TepApprovalActionTypes.LOAD_WORKFLOW_DETAILS, {
    run: (action: TepApprovalActions.LoadWorkflowDeatils) => {
      return this.tepApprovalService.loadWorkflowDeatils(action.payload).pipe(
        map((data: tepApprovalListResponse) => {
          return new TepApprovalActions.LoadWorkflowDeatilsSuccess(data);
        })
      );
    },

    onError: (
      action: TepApprovalActions.LoadWorkflowDeatils,
      error: HttpErrorResponse
    ) => {
      return new TepApprovalActions.LoadWorkflowDeatilsFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect()
  saveTepApprovals$ = this.dataPersistence.fetch(
    TepApprovalActionTypes.SAVE_TEP_APPROVAL_STATUS,
    {
      run: (action: TepApprovalActions.SaveTepApprovalStatus) => {
        return this.tepApprovalService
          .savetepApprovalStatus(action.payload)
          .pipe(
            map(
              (approvedIds: string[]) =>
                new TepApprovalActions.SaveTepApprovalStatusSuccess(approvedIds)
            )
          );
      },
      onError: (
        action: TepApprovalActions.SaveTepApprovalStatus,
        error: HttpErrorResponse
      ) => {
        return new TepApprovalActions.SaveTepApprovalStatusFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  tepRefundList$ = this.dataPersistence.fetch(
    TepApprovalActionTypes.LOAD_TEP_REFUND_LIST,
    {
      run: (action: TepApprovalActions.LoadTepRefundList) => {
        return this.tepApprovalService
          .loadTepRefundList(action.payload, action.page, action.size)
          .pipe(
            map(
              (refundList: RefundList) =>
                new TepApprovalActions.LoadTepRefundListSuccess(refundList)
            )
          );
      },
      onError: (
        action: TepApprovalActions.LoadTepRefundList,
        error: HttpErrorResponse
      ) => {
        return new TepApprovalActions.LoadTepRefundListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editTepRefundListItem$ = this.dataPersistence.fetch(
    TepApprovalActionTypes.EDIT_TEP_REFUND_ITEM,
    {
      run: (action: TepApprovalActions.EditTepRefundItem) => {
        return this.tepApprovalService
          .editTepRefundItemData(action.payload, action.status, action.id)
          .pipe(
            map(
              (refundItem: RefundListItem) =>
                new TepApprovalActions.EditTepRefundItemSuccess(refundItem)
            )
          );
      },
      onError: (
        action: TepApprovalActions.EditTepRefundItem,
        error: HttpErrorResponse
      ) => {
        return new TepApprovalActions.EditTepRefundItemFailure(
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
