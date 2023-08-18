import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { CmRequestState } from './grf-request.state';
import { grfRequestService } from '../grf-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CashMemoDetailsResponse,
  ApprovalRequest,
  CmRequestDetails,
  CmRequestList,
  CustomErrors,
  CashMemoItemDetails,
  FileUploadLists
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { GrfRequestActionTypes } from './grf-request.actions';
import * as GrfRequestActions from './grf-request.actions';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { CashMemoService } from '@poss-web/poss/cash-memo/data-access-cash-memo';

@Injectable()
export class GrfRequestEffects {
  constructor(
    private dataPersistence: DataPersistence<CmRequestState>,
    private cmRequestService: grfRequestService,
    private loggerService: LoggerService,
    private cashMemoService: CashMemoService
  ) {}
  @Effect()
  loadGrfRequestList$: Observable<Action> = this.dataPersistence.fetch(
    GrfRequestActionTypes.LOAD_GRF_REQUEST_LIST,
    {
      run: (action: GrfRequestActions.LoadGrfRequestList) => {
        return this.cmRequestService
          .getCmRequestList(
            action.payload.approvalStatus,
            action.payload.appliedFilters,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.workflowType,
          )
          .pipe(
            map((cmRequestList: CmRequestList[]) => {
              return new GrfRequestActions.LoadGrfRequestListSuccess(
                cmRequestList
              );
            })
          );
      },
      onError: (
        action: GrfRequestActions.LoadGrfRequestList,
        error: HttpErrorResponse
      ) => {
        return new GrfRequestActions.ClearGrfRequestList();
      }
    }
  );
  @Effect()
  loadGrfRequestDetails$: Observable<Action> = this.dataPersistence.fetch(
    GrfRequestActionTypes.LOAD_GRF_REQUEST_DETAILS,
    {
      run: (action: GrfRequestActions.LoadGrfRequestDetails) => {
        return this.cmRequestService
          .getCmRequestDetails(
            action.payload.processId,
            action.payload.taskId,
            action.payload.taskName,
            action.payload.workFlowType,
          )
          .pipe(
            map(
              (cmRequestDetails: CmRequestDetails) =>
                new GrfRequestActions.LoadGrfRequestDetailsSuccess(
                  cmRequestDetails
                )
            )
          );
      },
      onError: (
        action: GrfRequestActions.LoadGrfRequestDetails,
        error: HttpErrorResponse
      ) => {
        return new GrfRequestActions.LoadGrfRequestDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadGrfProductList$: Observable<Action> = this.dataPersistence.fetch(
    GrfRequestActionTypes.LOAD_GRF_PRODUCT_LIST,
    {
      run: (action: GrfRequestActions.LoadGrfProductList) => {
        return this.cmRequestService
          .getCmProductList(
            action.payload.id,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map(
              (cmProductList: CashMemoDetailsResponse) =>
                new GrfRequestActions.LoadGrfProductListSuccess(cmProductList)
            )
          );
      },
      onError: (
        action: GrfRequestActions.LoadGrfProductList,
        error: HttpErrorResponse
      ) => {
        return new GrfRequestActions.LoadGrfProductListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadGrfProductDetails$: Observable<Action> = this.dataPersistence.fetch(
    GrfRequestActionTypes.LOAD_GRF_PRODUCT_DETAILS,
    {
      run: (action: GrfRequestActions.LoadGrfProductDetails) => {
        return this.cmRequestService
          .getCmProductDetails(
            action.payload.id,
            action.payload.itemId,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map(
              (cmProductDetails: CashMemoItemDetails) =>
                new GrfRequestActions.LoadGrfProductDetailsSuccess([
                  cmProductDetails
                ])
            )
          );
      },
      onError: (
        action: GrfRequestActions.LoadGrfProductDetails,
        error: HttpErrorResponse
      ) => {
        return new GrfRequestActions.LoadGrfProductDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  cmApprovalRequest$: Observable<Action> = this.dataPersistence.fetch(
    GrfRequestActionTypes.GRF_APPROVAL_REQUEST,
    {
      run: (action: GrfRequestActions.GrfApprovalRequest) => {
        return this.cmRequestService
          .getCmApprovalRequest(
            action.payload.isApprove,
            action.payload.requestBody,
            action.payload.processId,
            action.payload.taskId,
            action.payload.taskName
          )
          .pipe(
            map(
              (cmApprovalRequest: ApprovalRequest) =>
                new GrfRequestActions.GrfApprovalRequestSuccess(cmApprovalRequest)
            )
          );
      },
      onError: (
        action: GrfRequestActions.GrfApprovalRequest,
        error: HttpErrorResponse
      ) => {
        return new GrfRequestActions.GrfApprovalRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() confirmManualGRF$: Observable<Action> = this.dataPersistence.fetch(
    GrfRequestActionTypes.CONFIRM_MANUAL_GRF,
    {
      run: (action: GrfRequestActions.ConfirmManualGRF) => {
        return this.cashMemoService
          .updateCashMemo(
            action.payload.requestDetails,
            action.payload.id,
            action.payload.status,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map((data: CashMemoDetailsResponse) => {
              return new GrfRequestActions.ConfirmManualGRFSuccess(data);
            })
          );
      },

      onError: (
        action: GrfRequestActions.ConfirmManualGRF,
        error: HttpErrorResponse
      ) => {
        return new GrfRequestActions.ConfirmManualGRFFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getFileUploadList$: Observable<Action> = this.dataPersistence.fetch(
    GrfRequestActionTypes.FILE_UPLOAD_LIST,
    {
      run: (action: GrfRequestActions.FileUploadList) => {
        return this.cmRequestService
          .uploadFileList(action.payload)
          .pipe(
            map(
              (data: FileUploadLists[]) =>
                new GrfRequestActions.FileUploadListSuccess(data)
            )
          );
      },

      onError: (
        action: GrfRequestActions.FileUploadList,
        error: HttpErrorResponse
      ) => {
        return new GrfRequestActions.FileUploadListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getFileDownload$: Observable<Action> = this.dataPersistence.fetch(
    GrfRequestActionTypes.FILE_DOWNLOAD_URL,
    {
      run: (action: GrfRequestActions.FileDownloadUrl) => {
        return this.cmRequestService
          .downloadFile(action.payload)
          .pipe(
            map(
              (data: any) => new GrfRequestActions.FileDownloadUrlSuccess(data)
            )
          );
      },

      onError: (
        action: GrfRequestActions.FileDownloadUrl,
        error: HttpErrorResponse
      ) => {
        return new GrfRequestActions.FileDownloadUrlFailure(
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
