import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { CmRequestState } from './cm-request.state';
import { CmRequestService } from '../cm-request.service';
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
import { CmRequestActionTypes } from './cm-request.actions';
import * as CmRequestActions from './cm-request.actions';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { CashMemoService } from '@poss-web/poss/cash-memo/data-access-cash-memo';

@Injectable()
export class CmRequestEffects {
  constructor(
    private dataPersistence: DataPersistence<CmRequestState>,
    private cmRequestService: CmRequestService,
    private loggerService: LoggerService,
    private cashMemoService: CashMemoService
  ) {}
  @Effect()
  loadCmRequestList$: Observable<Action> = this.dataPersistence.fetch(
    CmRequestActionTypes.LOAD_CM_REQUEST_LIST,
    {
      run: (action: CmRequestActions.LoadCmRequestList) => {
        return this.cmRequestService
          .getCmRequestList(
            action.payload.approvalStatus,
            action.payload.appliedFilters,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.workflowType,
            action.payload.userType
          )
          .pipe(
            map((cmRequestList: CmRequestList[]) => {
              return new CmRequestActions.LoadCmRequestListSuccess(
                cmRequestList
              );
            })
          );
      },
      onError: (
        action: CmRequestActions.LoadCmRequestList,
        error: HttpErrorResponse
      ) => {
        return new CmRequestActions.ClearCmRequestList();
      }
    }
  );
  @Effect()
  loadCmRequestDetails$: Observable<Action> = this.dataPersistence.fetch(
    CmRequestActionTypes.LOAD_CM_REQUEST_DETAILS,
    {
      run: (action: CmRequestActions.LoadCmRequestDetails) => {
        return this.cmRequestService
          .getCmRequestDetails(
            action.payload.processId,
            action.payload.taskId,
            action.payload.taskName,
            action.payload.workFlowType,
            action.payload.userType
          )
          .pipe(
            map(
              (cmRequestDetails: CmRequestDetails) =>
                new CmRequestActions.LoadCmRequestDetailsSuccess(
                  cmRequestDetails
                )
            )
          );
      },
      onError: (
        action: CmRequestActions.LoadCmRequestDetails,
        error: HttpErrorResponse
      ) => {
        return new CmRequestActions.LoadCmRequestDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadCmProductList$: Observable<Action> = this.dataPersistence.fetch(
    CmRequestActionTypes.LOAD_CM_PRODUCT_LIST,
    {
      run: (action: CmRequestActions.LoadCmProductList) => {
        return this.cmRequestService
          .getCmProductList(
            action.payload.id,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map(
              (cmProductList: CashMemoDetailsResponse) =>
                new CmRequestActions.LoadCmProductListSuccess(cmProductList)
            )
          );
      },
      onError: (
        action: CmRequestActions.LoadCmProductList,
        error: HttpErrorResponse
      ) => {
        return new CmRequestActions.LoadCmProductListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadCmProductDetails$: Observable<Action> = this.dataPersistence.fetch(
    CmRequestActionTypes.LOAD_CM_PRODUCT_DETAILS,
    {
      run: (action: CmRequestActions.LoadCmProductDetails) => {
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
                new CmRequestActions.LoadCmProductDetailsSuccess([
                  cmProductDetails
                ])
            )
          );
      },
      onError: (
        action: CmRequestActions.LoadCmProductDetails,
        error: HttpErrorResponse
      ) => {
        return new CmRequestActions.LoadCmProductDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  cmApprovalRequest$: Observable<Action> = this.dataPersistence.fetch(
    CmRequestActionTypes.CM_APPROVAL_REQUEST,
    {
      run: (action: CmRequestActions.CmApprovalRequest) => {
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
                new CmRequestActions.CmApprovalRequestSuccess(cmApprovalRequest)
            )
          );
      },
      onError: (
        action: CmRequestActions.CmApprovalRequest,
        error: HttpErrorResponse
      ) => {
        return new CmRequestActions.CmApprovalRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() confirmManualCM$: Observable<Action> = this.dataPersistence.fetch(
    CmRequestActionTypes.CONFIRM_MANUAL_CM,
    {
      run: (action: CmRequestActions.ConfirmManualCM) => {
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
              return new CmRequestActions.ConfirmManualCMSuccess(data);
            })
          );
      },

      onError: (
        action: CmRequestActions.ConfirmManualCM,
        error: HttpErrorResponse
      ) => {
        return new CmRequestActions.ConfirmManualCMFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getFileUploadList$: Observable<Action> = this.dataPersistence.fetch(
    CmRequestActionTypes.FILE_UPLOAD_LIST,
    {
      run: (action: CmRequestActions.FileUploadList) => {
        return this.cmRequestService
          .uploadFileList(action.payload)
          .pipe(
            map(
              (data: FileUploadLists[]) =>
                new CmRequestActions.FileUploadListSuccess(data)
            )
          );
      },

      onError: (
        action: CmRequestActions.FileUploadList,
        error: HttpErrorResponse
      ) => {
        return new CmRequestActions.FileUploadListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getFileDownload$: Observable<Action> = this.dataPersistence.fetch(
    CmRequestActionTypes.FILE_DOWNLOAD_URL,
    {
      run: (action: CmRequestActions.FileDownloadUrl) => {
        return this.cmRequestService
          .downloadFile(action.payload)
          .pipe(
            map(
              (data: any) => new CmRequestActions.FileDownloadUrlSuccess(data)
            )
          );
      },

      onError: (
        action: CmRequestActions.FileDownloadUrl,
        error: HttpErrorResponse
      ) => {
        return new CmRequestActions.FileDownloadUrlFailure(
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
