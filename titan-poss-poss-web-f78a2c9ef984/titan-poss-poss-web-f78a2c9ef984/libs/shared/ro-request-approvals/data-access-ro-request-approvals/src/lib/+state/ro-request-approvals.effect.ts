import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { RoRequestApprovalService } from '../ro-request-approval.service';
import { RoRequestApprovalActionTypes } from './ro-request-approvals.actions';
import * as RoRequestApprovalAction from './ro-request-approvals.actions';
import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import {
  CustomErrors,
  RoRequestApprovalListResponse,
  BoutiqueRoRequestApprovalListResponse
} from '@poss-web/shared/models';

@Injectable()
export class RoRequestApporvalEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public roRequestApprovalService: RoRequestApprovalService,
    public loggerService: LoggerService
  ) {}
  @Effect()
  loadPendingRoRequestApprovalList$ = this.dataPersistence.fetch(
    RoRequestApprovalActionTypes.LOAD_PENDING_RO_REQUEST_APPROVAL_LIST,
    {
      run: (
        action: RoRequestApprovalAction.LoadPendingRoRequestApprovalList
      ) => {
        return this.roRequestApprovalService
          .getRoRequestApprovalList(
            action.payload.approvalStatus,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.workflowType,
            action.payload.filterOptions
          )
          .pipe(
            map(
              (
                roRequestApprovalListResponse: RoRequestApprovalListResponse[]
              ) =>
                new RoRequestApprovalAction.LoadPendingRoRequestApprovalListSuccess(
                  roRequestApprovalListResponse
                )
            )
          );
      },
      onError: (
        action: RoRequestApprovalAction.LoadPendingRoRequestApprovalList,
        error: HttpErrorResponse
      ) => {
        return new RoRequestApprovalAction.LoadPendingRoRequestApprovalListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRejectedRoRequestApprovalList$ = this.dataPersistence.fetch(
    RoRequestApprovalActionTypes.LOAD_REJECTED_RO_REQUEST_APPROVAL_LIST,
    {
      run: (
        action: RoRequestApprovalAction.LoadRejectedRoRequestApprovalList
      ) => {
        return this.roRequestApprovalService
          .getRoRequestApprovalList(
            action.payload.approvalStatus,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.workflowType,
            action.payload.filterOptions
          )
          .pipe(
            map(
              (
                roRequestApprovalListResponse: RoRequestApprovalListResponse[]
              ) =>
                new RoRequestApprovalAction.LoadRejectedRoRequestApprovalListSuccess(
                  roRequestApprovalListResponse
                )
            )
          );
      },
      onError: (
        action: RoRequestApprovalAction.LoadRejectedRoRequestApprovalList,
        error: HttpErrorResponse
      ) => {
        return new RoRequestApprovalAction.LoadRejectedRoRequestApprovalListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadApprovedRoRequestList$ = this.dataPersistence.fetch(
    RoRequestApprovalActionTypes.LOAD_APPROVED_RO_REQUEST_LIST,
    {
      run: (action: RoRequestApprovalAction.LoadApprovedRoRequestList) => {
        return this.roRequestApprovalService
          .getRoRequestApprovalList(
            action.payload.approvalStatus,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.workflowType,
            action.payload.filterOptions
          )
          .pipe(
            map(
              (
                roRequestApprovalListResponse: RoRequestApprovalListResponse[]
              ) =>
                new RoRequestApprovalAction.LoadApprovedRoRequestListSuccess(
                  roRequestApprovalListResponse
                )
            )
          );
      },
      onError: (
        action: RoRequestApprovalAction.LoadApprovedRoRequestList,
        error: HttpErrorResponse
      ) => {
        return new RoRequestApprovalAction.LoadApprovedRoRequestListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadClosedRoRequestApprovalList$ = this.dataPersistence.fetch(
    RoRequestApprovalActionTypes.LOAD_CLOSED_RO_REQUEST_APPROVAL_LIST,
    {
      run: (
        action: RoRequestApprovalAction.LoadClosedRoRequestApprovalList
      ) => {
        return this.roRequestApprovalService
          .getRoRequestApprovalList(
            action.payload.approvalStatus,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.workflowType,
            action.payload.filterOptions
          )
          .pipe(
            map(
              (
                roRequestApprovalListResponse: RoRequestApprovalListResponse[]
              ) =>
                new RoRequestApprovalAction.LoadClosedRoRequestApprovalListSuccess(
                  roRequestApprovalListResponse
                )
            )
          );
      },
      onError: (
        action: RoRequestApprovalAction.LoadClosedRoRequestApprovalList,
        error: HttpErrorResponse
      ) => {
        return new RoRequestApprovalAction.LoadClosedRoRequestApprovalListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveRoRequestApprovalStatus$ = this.dataPersistence.fetch(
    RoRequestApprovalActionTypes.SAVE_RO_REQUEST_APPROVAL_STATUS,
    {
      run: (action: RoRequestApprovalAction.SaveRoRequestApprovalStatus) => {
        return this.roRequestApprovalService
          .saveRoRequestApprovalStatus(action.payload)
          .pipe(
            map(
              (ids: any) =>
                new RoRequestApprovalAction.SaveRoRequestApprovalStatusSuccess(
                  ids
                )
            )
          );
      },
      onError: (
        action: RoRequestApprovalAction.SaveRoRequestApprovalStatus,
        error: HttpErrorResponse
      ) => {
        return new RoRequestApprovalAction.SaveRoRequestApprovalStatusFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRoRequestApprovalList$ = this.dataPersistence.fetch(
    RoRequestApprovalActionTypes.LOAD_RO_REQUEST_APPROVAL_LIST,
    {
      run: (action: RoRequestApprovalAction.LoadRoRequestApprovalList) => {
        return this.roRequestApprovalService
          .getBoutiqueRoRequestApprovalList(
            action.payload.approvalStatus,
            action.payload.filterOptions,
            action.payload.workflowType,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (
                boutiqueRoRequestApprovalListResponse: BoutiqueRoRequestApprovalListResponse
              ) =>
                new RoRequestApprovalAction.LoadRoRequestApprovalListSuccess(
                  boutiqueRoRequestApprovalListResponse
                )
            )
          );
      },
      onError: (
        action: RoRequestApprovalAction.LoadRoRequestApprovalList,
        error: HttpErrorResponse
      ) => {
        return new RoRequestApprovalAction.LoadRoRequestApprovalListFailure(
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
